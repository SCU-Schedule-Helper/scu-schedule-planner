import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourseSchema } from '@/lib/types';
import { validatePlan } from '@/lib/validation/engine';
import type { Course } from '@/lib/types';
import { CSMajorRequirements, UniversityCoreRequirements } from '@/data/requirements';
import type { UserPlan, Quarter as QuarterType, PlannedCourse as PlannedCourseType } from '@/lib/types';

const AddPlannedCourseSchema = z.object({
    courseCode: z.string(),
    quarter: z.string(),
});

type AddPlannedCourse = z.infer<typeof AddPlannedCourseSchema>;

type PlanCourse = { courseCode: string; quarter: string;[key: string]: unknown };

// ------------------------------------------------------------------
// Helper functions to fetch detailed course info (prereqs/cross-listed)
// ------------------------------------------------------------------

async function fetchAllCoursesAsMap(supabase: Awaited<ReturnType<typeof createSupabaseServer>>): Promise<Record<string, Course>> {
    // Fetch base course rows
    const { data: courses, error } = await supabase.from('courses').select('*');
    if (error || !courses) {
        console.error('Error fetching courses for validation:', error);
        return {};
    }

    // Helpers
    const fetchPrerequisites = async (courseId: string) => {
        const { data: prereqGroups } = await supabase
            .from('prerequisites')
            .select('*')
            .eq('course_id', courseId);

        const prerequisites: {
            courses: string[];
            type: string;
            grade?: string | null;
        }[] = [];

        if (!prereqGroups || prereqGroups.length === 0) return prerequisites;

        for (const group of prereqGroups) {
            const { data: prereqCourses } = await supabase
                .from('prerequisite_courses')
                .select('prerequisite_course_id(code)')
                .eq('prerequisite_id', group.id);

            type Row = { prerequisite_course_id: { code: string } };
            const codes = (prereqCourses as Row[] ?? []).map((row) => row.prerequisite_course_id.code);

            prerequisites.push({
                courses: codes,
                type: group.prerequisite_type,
                grade: group.min_grade ?? undefined,
            });
        }

        return prerequisites;
    };

    const fetchCrossListed = async (courseId: string, selfCode: string): Promise<string[]> => {
        const { data: rowsForward } = await supabase
            .from('cross_listed_courses')
            .select('cross_listed_course_id')
            .eq('course_id', courseId);

        const { data: rowsBackward } = await supabase
            .from('cross_listed_courses')
            .select('course_id')
            .eq('cross_listed_course_id', courseId);

        const otherIds = [
            ...(rowsForward?.map((r) => r.cross_listed_course_id) ?? []),
            ...(rowsBackward?.map((r) => r.course_id) ?? []),
        ];

        if (otherIds.length === 0) return [];

        const { data: others } = await supabase
            .from('courses')
            .select('code')
            .in('id', otherIds);

        return (others ?? [])
            .map((c) => c.code)
            .filter((c): c is string => !!c && c !== selfCode);
    };

    // Build map with prerequisite/cross-listed info
    const result: Record<string, Course> = {};

    await Promise.all(
        courses.map(async (row) => {
            const [prerequisites, crossListedAs] = await Promise.all([
                fetchPrerequisites(row.id),
                fetchCrossListed(row.id, row.code),
            ]);

            result[row.code] = {
                id: row.id,
                code: row.code,
                title: row.title,
                units: row.units,
                description: row.description ?? undefined,
                department: row.department,
                isUpperDivision: row.is_upper_division,
                prerequisites,
                crossListedAs,
            } as Course;
        }),
    );

    return result;
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const planId = params.id;

    try {
        const body = await request.json();
        const payload = AddPlannedCourseSchema.parse(body) as AddPlannedCourse;

        const supabase = await createSupabaseServer();

        // Fetch current plan
        const { data: plan, error: fetchError } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (fetchError || !plan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        const metadata = ((plan.metadata as Json) || {}) as Record<string, unknown>;
        const quarters = (metadata.quarters as Array<{ id: string; courses: PlanCourse[] }>) ?? [];

        // Find the target quarter
        const quarterIndex = quarters.findIndex((q) => q.id === payload.quarter);
        if (quarterIndex === -1) {
            return NextResponse.json(
                { error: 'Quarter not found in plan' },
                { status: 404 }
            );
        }

        // Prevent duplicate course in the same quarter
        const already = quarters[quarterIndex].courses.find(
            (c) => c.courseCode === payload.courseCode
        );
        if (already) {
            return NextResponse.json({ error: 'Course already in quarter' }, { status: 409 });
        }

        const newPlannedCourse = {
            courseCode: payload.courseCode,
            quarter: payload.quarter,
            status: 'planned',
        };

        // Validate structure (ignore errors)
        try {
            PlannedCourseSchema.parse(newPlannedCourse);
        } catch {
            // ignore validation errors to allow partial data; can log if needed
        }

        quarters[quarterIndex].courses.push(newPlannedCourse as PlanCourse);

        // ------------------------------------------------------------------
        // Validation check (reject if the resulting plan has fatal errors)
        // ------------------------------------------------------------------

        const allRequirements = [
            ...CSMajorRequirements,
            ...UniversityCoreRequirements,
        ];

        const syntheticPlan: UserPlan = {
            id: planId,
            name: plan.name,
            majorId: "", // unknown in current schema
            quarters: quarters as unknown as QuarterType[],
            completedCourses: (metadata.completedCourses as PlannedCourseType[]) ?? [],
            maxUnitsPerQuarter: (metadata.maxUnitsPerQuarter as number) ?? 20,
            includeSummer: (metadata.includeSummer as boolean) ?? true,
        };

        const courseMap = await fetchAllCoursesAsMap(supabase);

        const validation = validatePlan({
            courses: courseMap,
            requirements: allRequirements,
            plan: syntheticPlan,
            settings: {
                maxUnitsPerQuarter: syntheticPlan.maxUnitsPerQuarter,
                includeSummer: syntheticPlan.includeSummer,
            },
        });

        const fatalErrors = [
            ...validation.messages.filter((m) => m.level === "error"),
            ...Object.values(validation.courseReports).flatMap((cr) =>
                cr.messages.filter((m) => m.level === "error")
            ),
        ];

        if (fatalErrors.length > 0) {
            return NextResponse.json(
                { error: "Validation failed", report: validation },
                { status: 422 }
            );
        }

        const newMetadata: Json = {
            ...metadata,
            quarters,
        } as Json;

        const { error: updateError } = await supabase
            .from('plans')
            .update({ metadata: newMetadata })
            .eq('id', planId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating plan metadata', updateError);
            return NextResponse.json({ error: 'Failed to add planned course' }, { status: 500 });
        }

        return NextResponse.json(newPlannedCourse);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid payload', details: err.issues }, { status: 400 });
        }
        console.error('Unexpected error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
} 
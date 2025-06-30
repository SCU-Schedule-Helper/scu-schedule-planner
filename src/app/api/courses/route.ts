import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoursesResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';
import { Course } from '@/lib/types';

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Fetch all courses
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*');

        if (error) {
            console.error('Error fetching courses:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Helper: fetch prerequisite data for a course
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
                const codes = (prereqCourses as Row[] ?? []).map(
                    (row) => row.prerequisite_course_id.code,
                );

                prerequisites.push({
                    courses: codes,
                    type: group.prerequisite_type,
                    grade: (group.min_grade ?? undefined) as string | null,
                });
            }

            return prerequisites;
        };

        // Helper: fetch cross-listed data for a course
        const fetchCrossListed = async (courseId: string, selfCode: string): Promise<string[]> => {
            // get rows where this course is either side of relationship
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

        // Build the detailed course list (including prerequisites and cross-listed data)
        const formattedCourses: Course[] = [];

        for (const course of courses) {
            const [prerequisites, crossListedAs] = await Promise.all([
                fetchPrerequisites(course.id),
                fetchCrossListed(course.id, course.code),
            ]);

            formattedCourses.push({
                id: course.id,
                code: course.code,
                title: course.title,
                units: course.units,
                description: course.description ?? undefined,
                department: course.department,
                isUpperDivision: course.is_upper_division,
                prerequisites,
                crossListedAs,
            });
        }

        // Validate with Zod schema before returning
        const validatedCourses = CoursesResponseSchema.parse(formattedCourses);
        return NextResponse.json(validatedCourses);
    } catch (error) {
        console.error('Error in courses API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid course data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch courses' }),
            { status: 500 }
        );
    }
} 
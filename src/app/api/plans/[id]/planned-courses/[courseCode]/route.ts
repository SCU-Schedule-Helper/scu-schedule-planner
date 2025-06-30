import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';

const MoveCourseSchema = z.object({
    fromQuarter: z.string(),
    toQuarter: z.string(),
});

type MoveCourse = z.infer<typeof MoveCourseSchema>;

type PlanCourse = { courseCode: string; quarter: string;[key: string]: unknown };

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; courseCode: string } }
) {
    const { id: planId, courseCode } = params;

    try {
        const body = await request.json();
        const payload = MoveCourseSchema.parse(body) as MoveCourse;

        const supabase = await createSupabaseServer();

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

        const fromIndex = quarters.findIndex((q) => q.id === payload.fromQuarter);
        const toIndex = quarters.findIndex((q) => q.id === payload.toQuarter);

        if (fromIndex === -1 || toIndex === -1) {
            return NextResponse.json({ error: 'Quarter not found' }, { status: 404 });
        }

        // Find the course in from quarter
        const courseIdx = quarters[fromIndex].courses.findIndex(
            (c: PlanCourse) => c.courseCode === courseCode
        );
        if (courseIdx === -1) {
            return NextResponse.json({ error: 'Course not found in source quarter' }, { status: 404 });
        }

        const [course] = quarters[fromIndex].courses.splice(courseIdx, 1);
        (course as PlanCourse).quarter = payload.toQuarter;
        quarters[toIndex].courses.push(course);

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
            console.error('Error updating plan for move', updateError);
            return NextResponse.json({ error: 'Failed to move course' }, { status: 500 });
        }

        return NextResponse.json(course);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid payload', details: err.issues }, { status: 400 });
        }
        console.error('Unexpected error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
} 
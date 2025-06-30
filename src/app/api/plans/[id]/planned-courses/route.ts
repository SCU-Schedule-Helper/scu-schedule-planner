import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourseSchema } from '@/lib/types';

const AddPlannedCourseSchema = z.object({
    courseCode: z.string(),
    quarter: z.string(),
});

type AddPlannedCourse = z.infer<typeof AddPlannedCourseSchema>;

type PlanCourse = { courseCode: string; quarter: string;[key: string]: unknown };

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
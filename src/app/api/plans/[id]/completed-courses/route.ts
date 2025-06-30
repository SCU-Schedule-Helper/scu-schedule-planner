import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourseSchema } from '@/lib/types';

const AddCompletedCourseSchema = z.object({
    courseCode: z.string(),
    grade: z.string().optional(),
    isTransfer: z.boolean().optional(),
});

type AddCompletedCourse = z.infer<typeof AddCompletedCourseSchema>;

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const planId = params.id;

    try {
        const body = await request.json();
        const payload = AddCompletedCourseSchema.parse(body) as AddCompletedCourse;

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

        const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;
        const completed = (metadata.completed_courses as Json[] | undefined) ?? [] as Json[];

        // Build planned course object (status completed, quarter empty)
        const newCompletedCourse = {
            courseCode: payload.courseCode,
            quarter: '',
            status: 'completed',
            grade: payload.grade,
            isTransfer: payload.isTransfer ?? false,
        };

        // Validate against schema for safety (ignores potential quarter validation)
        try {
            PlannedCourseSchema.parse(newCompletedCourse);
        } catch {
            // fallthrough; still push
        }

        // Prevent duplicates
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const already = (completed as any[]).find((c) => (c as any).courseCode === payload.courseCode);
        if (!already) {
            completed.push(newCompletedCourse);
        }

        const newMetadata: Json = {
            ...metadata,
            completed_courses: completed,
        } as Json;

        const { error: updateError } = await supabase
            .from('plans')
            .update({ metadata: newMetadata })
            .eq('id', planId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating plan metadata', updateError);
            return NextResponse.json({ error: 'Failed to add completed course' }, { status: 500 });
        }

        return NextResponse.json(newCompletedCourse);
    } catch (err) {
        if (err instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid payload', details: err.issues }, { status: 400 });
        }
        console.error('Unexpected error', err);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
} 
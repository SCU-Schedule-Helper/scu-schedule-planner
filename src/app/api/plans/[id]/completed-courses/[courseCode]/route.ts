import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import {
    validateRequiredField,
    validateCourseCode,
    withErrorHandling,
    ApiError
} from '@/lib/errors';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; courseCode: string } }
) {
    return withErrorHandling(async () => {
        const { id: planId, courseCode } = params;
        validateRequiredField(planId, 'planId');
        validateRequiredField(courseCode, 'courseCode');
        validateCourseCode(courseCode);

        const supabase = await createSupabaseServer();

        // Check if plan exists
        const { error: planError } = await supabase
            .from('plans')
            .select('id')
            .eq('id', planId)
            .single();

        if (planError) {
            if (planError.code === 'PGRST116') {
                throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
            }
            throw ApiError.databaseError(`Database error: ${planError.message}`);
        }

        // Get full plan to update metadata
        const { data: plan, error } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error || !plan) {
            throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
        }

        const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;
        const completed = (metadata.completed_courses as Record<string, unknown>[] | undefined) ?? [];

        const updatedCompleted = completed.filter((c) =>
            typeof c === 'object' && c !== null && 'courseCode' in c && c.courseCode !== courseCode
        );

        const newMetadata: Json = {
            ...metadata,
            completed_courses: updatedCompleted,
        } as Json;

        const { error: updateError } = await supabase
            .from('plans')
            .update({ metadata: newMetadata })
            .eq('id', planId);

        if (updateError) {
            throw ApiError.databaseError(`Failed to update plan: ${updateError.message}`);
        }

        return NextResponse.json({ success: true });
    });
} 
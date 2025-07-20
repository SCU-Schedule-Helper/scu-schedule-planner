import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateRequiredField,
    validateCourseCode,
    validateUnits,
    withErrorHandling
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

            logApiError(ApiError.databaseError('Error checking plan existence'), {
                error: planError,
                planId
            });
            throw ApiError.databaseError('Failed to check plan existence');
        }

        // Check if planned course exists
        const { error: courseError } = await supabase
            .from('planned_courses')
            .select('id')
            .eq('plan_id', planId)
            .eq('course_code', courseCode)
            .single();

        if (courseError) {
            if (courseError.code === 'PGRST116') {
                throw ApiError.notFound(
                    `Course ${courseCode} is not planned in this plan`,
                    'COURSE_NOT_FOUND'
                );
            }

            logApiError(ApiError.databaseError('Error checking planned course existence'), {
                error: courseError,
                planId,
                courseCode
            });
            throw ApiError.databaseError('Failed to check planned course existence');
        }

        // Delete the planned course
        const { error: deleteError } = await supabase
            .from('planned_courses')
            .delete()
            .eq('plan_id', planId)
            .eq('course_code', courseCode);

        if (deleteError) {
            logApiError(ApiError.databaseError('Error deleting planned course'), {
                error: deleteError,
                planId,
                courseCode
            });
            throw ApiError.databaseError('Failed to remove course from plan');
        }

        return NextResponse.json({
            success: true,
            message: `Course ${courseCode} removed from plan`
        });
    })().catch(error => handleApiError(error, request));
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; courseCode: string } }
) {
    return withErrorHandling(async () => {
        const { id: planId, courseCode } = params;
        validateRequiredField(planId, 'planId');
        validateRequiredField(courseCode, 'courseCode');
        validateCourseCode(courseCode);

        const body = await request.json();
        const { quarter, year, status, units } = body;

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

            logApiError(ApiError.databaseError('Error checking plan existence'), {
                error: planError,
                planId
            });
            throw ApiError.databaseError('Failed to check plan existence');
        }

        // Check if planned course exists
        const { error: courseError } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('plan_id', planId)
            .eq('course_code', courseCode)
            .single();

        if (courseError) {
            if (courseError.code === 'PGRST116') {
                throw ApiError.notFound(
                    `Course ${courseCode} is not planned in this plan`,
                    'COURSE_NOT_FOUND'
                );
            }

            logApiError(ApiError.databaseError('Error checking planned course existence'), {
                error: courseError,
                planId,
                courseCode
            });
            throw ApiError.databaseError('Failed to check planned course existence');
        }

        // Validate update fields
        const updateData: Record<string, unknown> = {};

        if (quarter !== undefined) {
            const validQuarters = ['fall', 'winter', 'spring', 'summer'];
            if (!validQuarters.includes(quarter.toLowerCase())) {
                throw ApiError.badRequest(
                    'Invalid quarter value',
                    'INVALID_INPUT',
                    { quarter, validQuarters }
                );
            }
            updateData.quarter = quarter;
        }

        if (year !== undefined) {
            if (year < 2020 || year > 2050) {
                throw ApiError.badRequest(
                    'Year must be between 2020 and 2050',
                    'INVALID_INPUT',
                    { year, minYear: 2020, maxYear: 2050 }
                );
            }
            updateData.year = year;
        }

        if (status !== undefined) {
            const validStatuses = ['planned', 'completed', 'in-progress', 'not_started'];
            if (!validStatuses.includes(status)) {
                throw ApiError.badRequest(
                    'Invalid status value',
                    'INVALID_INPUT',
                    { status, validStatuses }
                );
            }
            updateData.status = status;
        }

        if (units !== undefined) {
            validateUnits(units);
            updateData.units = units;
        }

        // Update the planned course
        const { data: updatedCourse, error: updateError } = await supabase
            .from('planned_courses')
            .update(updateData)
            .eq('plan_id', planId)
            .eq('course_code', courseCode)
            .select()
            .single();

        if (updateError) {
            logApiError(ApiError.databaseError('Error updating planned course'), {
                error: updateError,
                planId,
                courseCode
            });
            throw ApiError.databaseError('Failed to update planned course');
        }

        return NextResponse.json(updatedCourse);
    })().catch(error => handleApiError(error, request));
} 
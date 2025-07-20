import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateRequiredField,
    validateCourseCode,
    withErrorHandling
} from '@/lib/errors';

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    return withErrorHandling(async () => {
        const planId = params.id;
        validateRequiredField(planId, 'planId');

        const body = await request.json();
        const { courseCode, quarter, year, status = 'planned', units } = body;

        // Validate required fields
        validateRequiredField(courseCode, 'courseCode');
        validateRequiredField(quarter, 'quarter');
        validateRequiredField(year, 'year');

        // Validate course code format
        validateCourseCode(courseCode);

        // Validate quarter format
        const validQuarters = ['Fall', 'Winter', 'Spring', 'Summer'];
        if (!validQuarters.includes(quarter)) {
            throw ApiError.badRequest(
                'Invalid quarter value',
                'INVALID_INPUT',
                { quarter, validQuarters }
            );
        }

        // Validate year range
        if (year < 2020 || year > 2050) {
            throw ApiError.badRequest(
                'Year must be between 2020 and 2050',
                'INVALID_INPUT',
                { year, minYear: 2020, maxYear: 2050 }
            );
        }

        // Validate status
        const validStatuses = ['planned', 'completed', 'in-progress', 'not_started'];
        if (!validStatuses.includes(status)) {
            throw ApiError.badRequest(
                'Invalid status value',
                'INVALID_INPUT',
                { status, validStatuses }
            );
        }

        const supabase = await createSupabaseServer();

        // Check if plan exists
        const { data: plan, error: planError } = await supabase
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

        // Check if course exists
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('code')
            .eq('code', courseCode)
            .single();

        if (courseError) {
            if (courseError.code === 'PGRST116') {
                throw ApiError.notFound(`Course ${courseCode} not found`, 'COURSE_NOT_FOUND');
            }

            logApiError(ApiError.databaseError('Error checking course existence'), {
                error: courseError,
                courseCode
            });
            throw ApiError.databaseError('Failed to check course existence');
        }

        // Check if course is already planned for this plan
        const { data: existingCourse, error: existingError } = await supabase
            .from('planned_courses')
            .select('id')
            .eq('plan_id', planId)
            .eq('course_code', courseCode)
            .single();

        if (existingCourse) {
            throw ApiError.badRequest(
                `Course ${courseCode} is already planned in this plan`,
                'DUPLICATE_RECORD',
                { courseCode, planId }
            );
        }

        // Insert the planned course
        const { data: plannedCourse, error: insertError } = await supabase
            .from('planned_courses')
            .insert({
                plan_id: planId,
                course_code: courseCode,
                quarter,
                year,
                status,
            })
            .select()
            .single();

        if (insertError) {
            logApiError(ApiError.databaseError('Error inserting planned course'), {
                error: insertError,
                planId,
                courseCode
            });
            throw ApiError.databaseError('Failed to add course to plan');
        }

        return NextResponse.json(plannedCourse);
    })().catch(error => handleApiError(error, request));
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    return withErrorHandling(async () => {
        const planId = params.id;
        validateRequiredField(planId, 'planId');

        const supabase = await createSupabaseServer();

        // Check if plan exists
        const { data: plan, error: planError } = await supabase
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

        // Fetch all planned courses for this plan
        const { data: plannedCourses, error: fetchError } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('plan_id', planId)
            .order('year')
            .order('quarter');

        if (fetchError) {
            logApiError(ApiError.databaseError('Error fetching planned courses'), {
                error: fetchError,
                planId
            });
            throw ApiError.databaseError('Failed to fetch planned courses');
        }

        return NextResponse.json(plannedCourses);
    })().catch(error => handleApiError(error, request));
} 
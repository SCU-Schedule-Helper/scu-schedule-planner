import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateCourseCode,
    withErrorHandling
} from '@/lib/errors';

export async function GET(
    request: Request,
    { params }: { params: { code: string } }
) {
    return withErrorHandling(async () => {
        const { code } = params;

        // Validate course code format
        validateCourseCode(code);

        const supabase = await createSupabaseServer();

        const { data: course, error } = await supabase
            .from('courses')
            .select('*')
            .eq('code', code)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows returned
                throw ApiError.notFound(`Course ${code} not found`, 'COURSE_NOT_FOUND');
            }

            logApiError(ApiError.databaseError('Error fetching course'), { error, courseCode: code });
            throw ApiError.databaseError('Failed to fetch course');
        }

        if (!course) {
            throw ApiError.notFound(`Course ${code} not found`, 'COURSE_NOT_FOUND');
        }

        // Validate the course data
        try {
            const validatedCourse = CourseSchema.parse(course);
            return NextResponse.json(validatedCourse);
        } catch (validationError) {
            logApiError(ApiError.validationFailed('Course data validation failed'), {
                courseCode: code,
                validationError
            });
            throw ApiError.validationFailed('Course data is invalid');
        }
    })().catch(error => handleApiError(error, request));
} 
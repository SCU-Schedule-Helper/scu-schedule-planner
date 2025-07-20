import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseSchema, CoursesResponseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateRequiredField,
    logValidationError,
    withErrorHandling
} from '@/lib/errors';

export async function GET(request: Request) {
    return withErrorHandling(async () => {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        // Validate search query
        validateRequiredField(query, 'query');

        if (!query || query.length < 2) {
            throw ApiError.badRequest(
                'Search query must be at least 2 characters long',
                'INVALID_INPUT',
                { query, minLength: 2 }
            );
        }

        if (query.length > 100) {
            throw ApiError.badRequest(
                'Search query too long (max 100 characters)',
                'INVALID_INPUT',
                { query, maxLength: 100 }
            );
        }

        const supabase = await createSupabaseServer();

        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .or(`code.ilike.%${query}%,title.ilike.%${query}%,description.ilike.%${query}%`)
            .order('code')
            .limit(50);

        if (error) {
            logApiError(ApiError.databaseError('Error searching courses'), { error, query });
            throw ApiError.databaseError('Failed to search courses');
        }

        // Transform and validate the response
        const validatedCourses = (courses || []).filter(course => {
            // Basic null/undefined checks
            if (!course || !course.code || !course.id) {
                logValidationError('course', course, 'Course must have code and id');
                return false;
            }

            try {
                CourseSchema.parse(course);
                return true;
            } catch (error) {
                logValidationError('course', course, 'Course validation failed');
                console.warn(`Skipping invalid course in search API:`, {
                    courseCode: course.code,
                    courseId: course.id,
                    courseTitle: course.title,
                    error: error instanceof Error ? error.message : String(error)
                });
                return false;
            }
        });

        // Validate the final response
        const validatedResponse = CoursesResponseSchema.parse(validatedCourses);

        return NextResponse.json(validatedResponse);
    })().catch(error => handleApiError(error, request));
} 
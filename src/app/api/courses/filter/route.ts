import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseSchema, CoursesResponseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    logValidationError,
    withErrorHandling
} from '@/lib/errors';

export async function GET(request: Request) {
    return withErrorHandling(async () => {
        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const quarter = searchParams.get('quarter');
        const units = searchParams.get('units');
        const level = searchParams.get('level');

        const supabase = await createSupabaseServer();

        // Build the query
        let query = supabase
            .from('courses')
            .select('*')
            .order('code');

        // Apply filters
        if (department) {
            // Validate department parameter
            if (!/^[A-Z]{2,5}$/.test(department)) {
                throw ApiError.badRequest(
                    'Invalid department code format',
                    'INVALID_INPUT',
                    { department, expectedFormat: 'e.g., CSCI, MATH' }
                );
            }
            query = query.ilike('code', `${department}%`);
        }

        if (quarter) {
            // Validate quarter parameter
            const validQuarters = ['Fall', 'Winter', 'Spring', 'Summer'];
            if (!validQuarters.includes(quarter)) {
                throw ApiError.badRequest(
                    'Invalid quarter parameter',
                    'INVALID_INPUT',
                    { quarter, validQuarters }
                );
            }
            query = query.ilike('quarters_offered', `%${quarter}%`);
        }

        if (units) {
            // Validate units parameter
            if (!/^\d+(\.\d+)?$/.test(units)) {
                throw ApiError.badRequest(
                    'Invalid units format',
                    'INVALID_INPUT',
                    { units, expectedFormat: 'e.g., 3, 3.5' }
                );
            }
            query = query.eq('units', units);
        }

        if (level) {
            // Validate level parameter
            const validLevels = ['lower', 'upper'];
            if (!validLevels.includes(level)) {
                throw ApiError.badRequest(
                    'Invalid level parameter',
                    'INVALID_INPUT',
                    { level, validLevels }
                );
            }

            // Filter by course level based on course number
            if (level === 'lower') {
                query = query.lt('code', '100');
            } else if (level === 'upper') {
                query = query.gte('code', '100');
            }
        }

        const { data: courses, error } = await query;

        if (error) {
            logApiError(ApiError.databaseError('Error filtering courses'), {
                error,
                filters: { department, quarter, units, level }
            });
            throw ApiError.databaseError('Failed to filter courses');
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
                console.warn(`Skipping invalid course in filter API:`, {
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
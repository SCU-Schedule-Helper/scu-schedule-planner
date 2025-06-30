import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoursesResponseSchema, ApiErrorSchema, CourseFilterSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const department = searchParams.get('department');
        const isUpperDivision = searchParams.get('isUpperDivision') === 'true';
        const quarter = searchParams.get('quarter');

        // Validate filter params
        const filters = CourseFilterSchema.parse({
            department: department || undefined,
            isUpperDivision: department !== null ? isUpperDivision : undefined,
            quarter: quarter || undefined
        });

        const supabase = await createSupabaseServer();
        let query = supabase.from('courses').select('*');

        // Apply filters
        if (filters.department) {
            query = query.eq('department', filters.department);
        }

        if (filters.isUpperDivision !== undefined) {
            query = query.eq('is_upper_division', filters.isUpperDivision);
        }

        if (filters.quarter) {
            // This would require a join with course_quarters table
            // For now, we'll skip this filter in this simplified implementation
        }

        const { data: courses, error } = await query;

        if (error) {
            console.error('Error filtering courses:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Format the response
        const formattedCourses = courses.map(course => ({
            id: course.id,
            code: course.code,
            title: course.title,
            units: course.units,
            description: course.description || '',
            department: course.department,
            isUpperDivision: course.is_upper_division
        }));

        // Validate with Zod schema before returning
        const validatedCourses = CoursesResponseSchema.parse(formattedCourses);
        return NextResponse.json(validatedCourses);
    } catch (error) {
        console.error('Error in courses filter API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid filter parameters' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to filter courses' }),
            { status: 500 }
        );
    }
} 
import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoursesResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Fetch all courses
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*');

        if (error) {
            console.error('Error fetching courses:', error);
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
            description: course.description,
            department: course.department,
            isUpperDivision: course.is_upper_division
        }));

        // Validate with Zod schema before returning
        const validatedCourses = CoursesResponseSchema.parse(formattedCourses);
        return NextResponse.json(validatedCourses);
    } catch (error) {
        console.error('Error in courses API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid course data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch courses' }),
            { status: 500 }
        );
    }
} 
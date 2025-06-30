import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoursesResponseSchema, ApiErrorSchema, CourseSearchSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const searchTerm = searchParams.get('q');

        // Validate search params
        const searchParams_ = CourseSearchSchema.safeParse({
            q: searchTerm || ''
        });

        if (!searchParams_.success) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Search term is required' }),
                { status: 400 }
            );
        }

        const supabase = await createSupabaseServer();

        // Search courses by code or title
        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .or(`code.ilike.%${searchTerm}%,title.ilike.%${searchTerm}%`);

        if (error) {
            console.error('Error searching courses:', error);
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
        console.error('Error in courses search API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid search parameters' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to search courses' }),
            { status: 500 }
        );
    }
} 
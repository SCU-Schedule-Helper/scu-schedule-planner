import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;
        const supabase = await createSupabaseServer();

        // Get course details
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('code', code)
            .single();

        if (courseError) {
            console.error(`Error fetching course ${code}:`, courseError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Course not found' }),
                { status: 404 }
            );
        }

        // For now, we'll return a simplified course object without relationships
        // In a real application, you would handle the relationships properly
        const formattedCourse = {
            id: course.id,
            code: course.code,
            title: course.title,
            units: course.units,
            description: course.description || '',
            department: course.department,
            isUpperDivision: course.is_upper_division,
            prerequisites: [],
            corequisites: [],
            offeredQuarters: [],
            crossListedAs: []
        };

        // Validate with Zod schema before returning
        const validatedCourse = CourseResponseSchema.parse(formattedCourse);
        return NextResponse.json(validatedCourse);
    } catch (error) {
        console.error(`Error in course detail API:`, error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid course data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch course' }),
            { status: 500 }
        );
    }
} 
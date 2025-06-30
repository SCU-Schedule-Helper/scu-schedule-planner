import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { RequirementGroupsResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Include both "major" and "core" groups so that shared core requirements
        // such as Mathematics Core appear alongside explicit major groups.
        const { data: requirements, error } = await supabase
            .from('requirements')
            .select('*')
            .in('type', ['major', 'core']);

        if (error) {
            console.error('Error fetching major requirements:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Format the response
        const formattedRequirements = await Promise.all(requirements.map(async (req) => {
            // Get required courses
            const { data: requiredCourses } = await supabase
                .from('requirement_courses')
                .select('course_id(code)')
                .eq('requirement_id', req.id);

            // Get choose from options if they exist
            const { data: chooseFrom } = await supabase
                .from('requirement_choose_from')
                .select('id, count')
                .eq('requirement_id', req.id)
                .maybeSingle();

            let chooseFromOptions = null;
            if (chooseFrom) {
                const { data: options } = await supabase
                    .from('requirement_choose_options')
                    .select('course_id(code)')
                    .eq('requirement_choose_from_id', chooseFrom.id);

                chooseFromOptions = {
                    count: chooseFrom.count,
                    options: options?.map(o => o.course_id.code) || []
                };
            }

            return {
                id: req.id,
                name: req.name,
                type: req.type,
                coursesRequired: requiredCourses?.map(c => c.course_id.code) || [],
                chooseFrom: chooseFromOptions || undefined,
                minUnits: req.min_units || undefined,
                notes: req.notes || undefined
            };
        }));

        // Validate with Zod schema before returning
        const validatedRequirements = RequirementGroupsResponseSchema.parse(formattedRequirements);
        return NextResponse.json(validatedRequirements);
    } catch (error) {
        console.error('Error in major requirements API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid requirements data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch major requirements' }),
            { status: 500 }
        );
    }
} 
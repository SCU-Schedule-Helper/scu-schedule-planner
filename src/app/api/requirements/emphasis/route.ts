import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { RequirementGroupsResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const emphasisId = searchParams.get('emphasisId');

        if (!emphasisId) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'emphasisId is required' }),
                { status: 400 }
            );
        }

        const supabase = await createSupabaseServer();

        // Get requirements for this emphasis area
        const { data: emphasisRequirements, error: requirementsError } = await supabase
            .from('emphasis_requirements')
            .select('requirement_id')
            .eq('emphasis_id', emphasisId);

        if (requirementsError) {
            console.error('Error fetching emphasis requirements:', requirementsError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: requirementsError.message }),
                { status: 500 }
            );
        }

        if (!emphasisRequirements || emphasisRequirements.length === 0) {
            return NextResponse.json([]);
        }

        // Get the requirement details
        const requirementIds = emphasisRequirements.map(r => r.requirement_id);
        const { data: requirements, error: reqDetailsError } = await supabase
            .from('requirements')
            .select('*')
            .in('id', requirementIds);

        if (reqDetailsError) {
            console.error('Error fetching requirement details:', reqDetailsError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: reqDetailsError.message }),
                { status: 500 }
            );
        }

        // Format the requirements with their courses and options
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
        console.error('Error in emphasis requirements API:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid requirements data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch emphasis requirements' }),
            { status: 500 }
        );
    }
} 
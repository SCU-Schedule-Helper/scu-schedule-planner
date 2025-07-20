import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { ApiErrorSchema } from '@/lib/types';

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Fetch all majors with the new schema
        const { data: majors, error } = await supabase
            .from('majors')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching enhanced majors:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Format response for the enhanced majors
        const enhancedMajors = majors.map(major => ({
            id: major.id,
            name: major.name,
            description: major.description,
            deptCode: major.department_code,
            courseRequirementsExpression: major.course_requirements_expression,
            otherRequirements: major.other_requirements,
            otherNotes: major.other_notes,
            requiresEmphasis: major.requires_emphasis,
            src: major.src,
        }));

        return NextResponse.json(enhancedMajors);

    } catch (error) {
        console.error('Unexpected error in enhanced majors API:', error);
        return NextResponse.json(
            ApiErrorSchema.parse({
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }),
            { status: 500 }
        );
    }
} 
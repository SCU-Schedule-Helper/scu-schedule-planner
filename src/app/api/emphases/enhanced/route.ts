import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { ApiErrorSchema } from '@/lib/types';

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Fetch all emphasis areas with the new schema
        const { data: emphases, error } = await supabase
            .from('emphasis_areas_enhanced')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching enhanced emphases:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Format response for the enhanced emphases
        const enhancedEmphases = emphases.map(emphasis => ({
            id: emphasis.id,
            name: emphasis.name,
            description: emphasis.description,
            deptCode: emphasis.department_code,
            appliesTo: emphasis.applies_to,
            courseRequirementsExpression: emphasis.course_requirements_expression,
            otherRequirements: emphasis.other_requirements,
            otherNotes: emphasis.other_notes,
            src: emphasis.src,
        }));

        return NextResponse.json(enhancedEmphases);

    } catch (error) {
        console.error('Unexpected error in enhanced emphases API:', error);
        return NextResponse.json(
            ApiErrorSchema.parse({
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }),
            { status: 500 }
        );
    }
} 
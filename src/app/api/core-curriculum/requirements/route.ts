import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoreCurriculumRequirementsResponseSchema, ApiErrorSchema } from '@/lib/types';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const appliesTo = searchParams.get('appliesTo');

        const supabase = await createSupabaseServer();

        let query = supabase
            .from('core_curriculum_requirements')
            .select('*')
            .order('name');

        // Filter by school/program if specified
        if (appliesTo) {
            query = query.eq('applies_to', appliesTo);
        }

        const { data: requirements, error } = await query;

        if (error) {
            console.error('Error fetching core curriculum requirements:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Transform database response to match our schema
        const formattedRequirements = requirements.map(req => ({
            id: req.id,
            name: req.name,
            description: req.description,
            appliesTo: req.applies_to,
            fulfilledBy: req.fulfilled_by || [],
            src: req.src,
            createdAt: req.created_at,
            updatedAt: req.updated_at,
        }));

        return NextResponse.json(
            CoreCurriculumRequirementsResponseSchema.parse(formattedRequirements)
        );
    } catch (error) {
        console.error('Unexpected error in core curriculum requirements API:', error);
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Internal server error' }),
            { status: 500 }
        );
    }
} 
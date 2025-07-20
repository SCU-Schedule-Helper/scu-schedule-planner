import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CoreCurriculumRequirementsResponseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    withErrorHandling
} from '@/lib/errors';

/**
 * Core Curriculum Requirements API
 * 
 * Fetches core curriculum requirements with optional filtering by school/program.
 * Uses standardized error handling pattern for consistency across all API routes.
 */
export async function GET(request: Request) {
    return withErrorHandling(async () => {
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
            logApiError(ApiError.databaseError('Error fetching core curriculum requirements'), { error, appliesTo });
            throw ApiError.databaseError('Failed to fetch core curriculum requirements');
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
    })().catch(error => handleApiError(error, request));
} 
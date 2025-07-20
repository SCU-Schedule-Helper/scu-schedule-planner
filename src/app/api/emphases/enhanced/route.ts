import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
    ApiError,
    handleApiError,
    logApiError,
    withErrorHandling
} from '@/lib/errors';

/**
 * Enhanced Emphasis Areas API
 * 
 * Fetches all emphasis areas with enhanced schema including detailed requirements and metadata.
 * Uses standardized error handling pattern for consistency across all API routes.
 */
export async function GET() {
    return withErrorHandling(async () => {
        const supabase = await createSupabaseServer();

        // Fetch all emphasis areas with the new schema
        const { data: emphases, error } = await supabase
            .from('emphasis_areas_enhanced')
            .select('*')
            .order('name');

        if (error) {
            logApiError(ApiError.databaseError('Error fetching enhanced emphases'), { error });
            throw ApiError.databaseError('Failed to fetch enhanced emphases');
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
    })().catch(error => handleApiError(error));
} 
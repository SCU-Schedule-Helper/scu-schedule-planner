import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
    ApiError,
    handleApiError,
    logApiError,
    withErrorHandling
} from '@/lib/errors';

/**
 * Enhanced Majors API
 * 
 * Fetches all majors with enhanced schema including detailed requirements and metadata.
 * Uses standardized error handling pattern for consistency across all API routes.
 */
export async function GET() {
    return withErrorHandling(async () => {
        const supabase = await createSupabaseServer();

        // Fetch all majors with the new schema
        const { data: majors, error } = await supabase
            .from('majors')
            .select('*')
            .order('name');

        if (error) {
            logApiError(ApiError.databaseError('Error fetching enhanced majors'), { error });
            throw ApiError.databaseError('Failed to fetch enhanced majors');
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
    })().catch(error => handleApiError(error));
} 
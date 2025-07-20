import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import {
    ApiError,
    handleApiError,
    logApiError,
    withErrorHandling
} from '@/lib/errors';

export async function GET(request: Request) {
    return withErrorHandling(async () => {
        const { searchParams } = new URL(request.url);
        const majorId = searchParams.get('majorId');

        const supabase = await createSupabaseServer();

        let query = supabase
            .from('emphasis_areas_enhanced')
            .select('id, name, description, applies_to, department_code')
            .order('name');

        // Filter by major if majorId is provided
        if (majorId) {
            query = query.eq('applies_to', majorId);
        }

        const { data: emphasisAreas, error } = await query;

        if (error) {
            logApiError(ApiError.databaseError('Error fetching emphasis areas'), { error, majorId });
            throw ApiError.databaseError('Failed to fetch emphasis areas');
        }

        // Transform the data to match frontend expectations
        const transformedEmphasisAreas = (emphasisAreas || []).map(emphasis => ({
            id: emphasis.id,
            name: emphasis.name,
            description: emphasis.description,
            appliesTo: emphasis.applies_to,
            departmentCode: emphasis.department_code,
        }));

        return NextResponse.json(transformedEmphasisAreas);
    })().catch(error => handleApiError(error, request));
} 
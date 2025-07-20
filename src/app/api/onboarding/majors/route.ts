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
        const supabase = await createSupabaseServer();

        const { data: majors, error } = await supabase
            .from('majors')
            .select('id, name, description, department_code, requires_emphasis')
            .order('name');

        if (error) {
            logApiError(ApiError.databaseError('Error fetching majors'), { error });
            throw ApiError.databaseError('Failed to fetch majors');
        }

        // Transform the data to match frontend expectations
        const transformedMajors = (majors || []).map(major => ({
            id: major.id,
            name: major.name,
            description: major.description,
            departmentCode: major.department_code,
            requiresEmphasis: Boolean(major.requires_emphasis),
        }));

        return NextResponse.json(transformedMajors);
    })().catch(error => handleApiError(error, request));
} 
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

        const { data: schools, error } = await supabase
            .from('schools')
            .select('id, name, description')
            .order('name');

        if (error) {
            logApiError(ApiError.databaseError('Error fetching schools'), { error });
            throw ApiError.databaseError('Failed to fetch schools');
        }

        return NextResponse.json(schools || []);
    })().catch(error => handleApiError(error, request));
} 
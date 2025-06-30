import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for emphasis area
const EmphasisAreaSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    majorId: z.string()
});

type EmphasisArea = z.infer<typeof EmphasisAreaSchema>;

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const majorId = searchParams.get('majorId');

        if (!majorId) {
            return NextResponse.json(
                { error: 'majorId is required' },
                { status: 400 }
            );
        }

        const supabase = await (await import('@/lib/supabase/server')).createSupabaseServer();

        // Pull all emphasis areas for now (schema currently has no major relationship)
        const { data, error } = await supabase
            .from('emphasis_areas')
            .select('id, name, description');

        if (error) {
            console.error('Error fetching emphasis areas:', error);
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        // Map DB rows to expected shape, adding majorId from query so the UI keeps context
        const emphasisAreas: EmphasisArea[] = (data || []).map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description ?? undefined,
            majorId
        }));

        const validatedEmphasisAreas = z.array(EmphasisAreaSchema).parse(emphasisAreas);
        return NextResponse.json(validatedEmphasisAreas);
    } catch (error) {
        console.error('Error in emphasis areas API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emphasis areas' },
            { status: 500 }
        );
    }
} 
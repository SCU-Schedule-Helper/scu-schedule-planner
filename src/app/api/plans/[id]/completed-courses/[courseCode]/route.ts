import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; courseCode: string } }
) {
    const { id: planId, courseCode } = params;
    try {
        const supabase = await createSupabaseServer();

        const { data: plan, error } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error || !plan) {
            return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
        }

        const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;
        const completed = (metadata.completed_courses as Record<string, unknown>[] | undefined) ?? [];

        const updatedCompleted = completed.filter((c) =>
            typeof c === 'object' && c !== null && 'courseCode' in c && c.courseCode !== courseCode
        );

        const newMetadata: Json = {
            ...metadata,
            completed_courses: updatedCompleted,
        } as Json;

        const { error: updateError } = await supabase
            .from('plans')
            .update({ metadata: newMetadata })
            .eq('id', planId);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
} 
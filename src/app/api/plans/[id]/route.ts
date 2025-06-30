import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourse, Quarter } from '@/lib/types';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const planId = params.id;
        const supabase = await createSupabaseServer();

        // Find the plan by ID
        const { data: plan, error } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error) {
            console.error('Error fetching plan from Supabase:', error);
            return NextResponse.json(
                { error: 'Plan not found' },
                { status: 404 }
            );
        }

        // Get the metadata (or default to empty object)
        const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;

        // Format the plan to match our schema
        const formattedPlan = {
            id: plan.id,
            name: plan.name,
            userId: plan.user_id,
            majorId: metadata.major_id as string || '',
            emphasisId: plan.emphasis_id || undefined,
            catalogYearId: metadata.catalog_year_id as string || 'current',
            maxUnitsPerQuarter: metadata.max_units_per_quarter as number || 20,
            includeSummer: metadata.include_summer as boolean || false,
            quarters: (metadata.quarters as Quarter[]) || [],
            completedCourses: (metadata.completed_courses as PlannedCourse[]) || []
        };

        return NextResponse.json(formattedPlan);
    } catch (error) {
        console.error('Error fetching plan:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plan' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const planId = params.id;
        const body = await request.json();
        const supabase = await createSupabaseServer();

        // First, get the current plan
        const { data: currentPlan, error: fetchError } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (fetchError) {
            console.error('Error fetching plan from Supabase:', fetchError);
            return NextResponse.json(
                { error: 'Plan not found' },
                { status: 404 }
            );
        }

        // Get the current metadata or default to empty object
        const currentMetadata = (currentPlan.metadata as Json || {}) as Record<string, unknown>;

        // Create updated metadata
        const updatedMetadata = {
            ...currentMetadata,
            ...(body.majorId !== undefined && { major_id: body.majorId }),
            ...(body.catalogYearId !== undefined && { catalog_year_id: body.catalogYearId }),
            ...(body.maxUnitsPerQuarter !== undefined && { max_units_per_quarter: body.maxUnitsPerQuarter }),
            ...(body.includeSummer !== undefined && { include_summer: body.includeSummer }),
            ...(body.quarters !== undefined && { quarters: body.quarters }),
            ...(body.completedCourses !== undefined && { completed_courses: body.completedCourses })
        };

        // Update the plan
        const { data: updatedPlan, error: updateError } = await supabase
            .from('plans')
            .update({
                name: body.name !== undefined ? body.name : currentPlan.name,
                emphasis_id: body.emphasisId !== undefined ? body.emphasisId : currentPlan.emphasis_id,
                metadata: updatedMetadata as Json
            })
            .eq('id', planId)
            .select()
            .single();

        if (updateError) {
            console.error('Error updating plan in Supabase:', updateError);
            return NextResponse.json(
                { error: 'Failed to update plan' },
                { status: 500 }
            );
        }

        // Format the response
        const formattedPlan = {
            id: updatedPlan.id,
            name: updatedPlan.name,
            userId: updatedPlan.user_id,
            majorId: updatedMetadata.major_id as string || '',
            emphasisId: updatedPlan.emphasis_id || undefined,
            catalogYearId: updatedMetadata.catalog_year_id as string || 'current',
            maxUnitsPerQuarter: updatedMetadata.max_units_per_quarter as number || 20,
            includeSummer: updatedMetadata.include_summer as boolean || false,
            quarters: (updatedMetadata.quarters as Quarter[]) || [],
            completedCourses: (updatedMetadata.completed_courses as PlannedCourse[]) || []
        };

        return NextResponse.json(formattedPlan);
    } catch (error) {
        console.error('Error updating plan:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid plan data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update plan' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const planId = params.id;
        const supabase = await createSupabaseServer();

        // Delete the plan from Supabase
        const { error } = await supabase
            .from('plans')
            .delete()
            .eq('id', planId);

        if (error) {
            console.error('Error deleting plan from Supabase:', error);
            return NextResponse.json(
                { error: 'Failed to delete plan' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting plan:', error);
        return NextResponse.json(
            { error: 'Failed to delete plan' },
            { status: 500 }
        );
    }
} 
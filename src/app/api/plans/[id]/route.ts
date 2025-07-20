import { NextResponse } from 'next/server';

import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourse, Quarter } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateRequiredField,
    withErrorHandling
} from '@/lib/errors';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    return withErrorHandling(async () => {
        const planId = params.id;
        validateRequiredField(planId, 'planId');

        const supabase = await createSupabaseServer();

        // Find the plan by ID
        const { data: plan, error } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
            }

            logApiError(ApiError.databaseError('Error fetching plan'), { error, planId });
            throw ApiError.databaseError('Failed to fetch plan');
        }

        if (!plan) {
            throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
        }

        // Get the metadata (or default to empty object)
        const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;

        // Fetch planned courses from the planned_courses table
        const { data: plannedCourses, error: plannedError } = await supabase
            .from('planned_courses')
            .select('*')
            .eq('plan_id', planId);

        if (plannedError) {
            logApiError(ApiError.databaseError('Error fetching planned courses'), {
                error: plannedError,
                planId
            });
            throw ApiError.databaseError('Failed to fetch planned courses');
        }

        // Build quarters structure by grouping planned courses
        const quarterMap = new Map<string, PlannedCourse[]>();
        const baseQuarters = (metadata.quarters as Quarter[]) || [];

        // Initialize quarters with the correct key format
        baseQuarters.forEach(quarter => {
            const key = `${quarter.year}-${quarter.season}`;
            quarterMap.set(key, []);
        });

        // Separate planned courses by status
        const completedFromTable: PlannedCourse[] = [];

        plannedCourses.forEach(course => {
            const formattedCourse: PlannedCourse = {
                courseCode: course.course_code,
                quarter: course.quarter,
                status: course.status as 'planned' | 'completed' | 'in-progress' || 'planned',
            };

            if (course.status === 'completed') {
                // Add to completed courses list
                completedFromTable.push(formattedCourse);
            } else {
                // Find the matching quarter by season and year
                const matchingQuarter = baseQuarters.find(q => {
                    const matches = q.season === course.quarter && q.year === course.year;
                    return matches;
                });

                if (matchingQuarter) {
                    const key = `${matchingQuarter.year}-${matchingQuarter.season}`;
                    quarterMap.get(key)!.push(formattedCourse);
                }
            }
        });

        // Build final quarters array and ensure all properties are correctly formatted
        const quarters: Quarter[] = baseQuarters.map(baseQuarter => {
            const newId = `${baseQuarter.season}-${baseQuarter.year}`;
            const newName = `${baseQuarter.season} ${baseQuarter.year}`;
            const oldId = `${baseQuarter.year}-${baseQuarter.season}`;

            const courses = (quarterMap.get(oldId) || []).map(course => ({
                ...course,
                quarter: newId, // Overwrite the old quarter ID
            }));

            return {
                ...baseQuarter,
                id: newId,
                name: newName,
                courses: courses,
            };
        });

        // Combine completed courses from metadata and planned_courses table
        const metadataCompleted = (metadata.completed_courses as PlannedCourse[]) || [];
        const allCompletedCourses = [...metadataCompleted, ...completedFromTable];

        // Format the plan to match our schema
        const formattedPlan = {
            id: plan.id,
            name: plan.name,
            userId: plan.user_id,
            majorId: plan.major || metadata.major_id as string || '', // Use major name from plan.major
            emphasisId: plan.emphasis_id || undefined,
            catalogYearId: metadata.catalog_year_id as string || 'current',
            maxUnitsPerQuarter: metadata.max_units_per_quarter as number || 20,
            includeSummer: metadata.include_summer as boolean || false,
            quarters: quarters,
            completedCourses: allCompletedCourses
        };

        return NextResponse.json(formattedPlan
        );
    })().catch(error => handleApiError(error, request));
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    return withErrorHandling(async () => {
        const planId = params.id;
        validateRequiredField(planId, 'planId');

        const body = await request.json();
        const supabase = await createSupabaseServer();

        // First, get the current plan
        const { data: currentPlan, error: fetchError } = await supabase
            .from('plans')
            .select('*')
            .eq('id', planId)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
            }

            logApiError(ApiError.databaseError('Error fetching plan'), { error: fetchError, planId });
            throw ApiError.databaseError('Failed to fetch plan');
        }

        if (!currentPlan) {
            throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
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
            logApiError(ApiError.databaseError('Error updating plan'), { error: updateError, planId });
            throw ApiError.databaseError('Failed to update plan');
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
    })().catch(error => handleApiError(error, request));
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    return withErrorHandling(async () => {
        const planId = params.id;
        validateRequiredField(planId, 'planId');

        const supabase = await createSupabaseServer();

        // Check if plan exists
        const { error: fetchError } = await supabase
            .from('plans')
            .select('id')
            .eq('id', planId)
            .single();

        if (fetchError) {
            if (fetchError.code === 'PGRST116') {
                throw ApiError.notFound('Plan not found', 'PLAN_NOT_FOUND');
            }

            logApiError(ApiError.databaseError('Error checking plan existence'), { error: fetchError, planId });
            throw ApiError.databaseError('Failed to check plan existence');
        }

        // Delete the plan (cascade will handle planned_courses)
        const { error: deleteError } = await supabase
            .from('plans')
            .delete()
            .eq('id', planId);

        if (deleteError) {
            logApiError(ApiError.databaseError('Error deleting plan'), { error: deleteError, planId });
            throw ApiError.databaseError('Failed to delete plan');
        }

        return NextResponse.json({ success: true, message: 'Plan deleted successfully' });
    })().catch(error => handleApiError(error, request));
} 
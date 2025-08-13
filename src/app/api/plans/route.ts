import { NextResponse } from 'next/server';
import { z } from 'zod';
import { ApiUserPlanSchema } from '@/lib/types';
import { createSupabaseServer } from '@/lib/supabase/server';
import { Json } from '@/lib/database.types';
import { PlannedCourse, Quarter } from '@/lib/types';
import { buildQuarter, getQuarterForDate } from '@/lib/quarter';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        const supabase = await createSupabaseServer();

        // Get plans from Supabase
        const { data: plans, error } = await supabase
            .from('plans')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('Error fetching plans from Supabase:', error);
            return NextResponse.json(
                { error: 'Failed to fetch plans' },
                { status: 500 }
            );
        }

        // Format the plans to match our schema
        const formattedPlans = await Promise.all(plans.map(async (plan) => {
            // Get the metadata from RLS
            const metadata = (plan.metadata as Json || {}) as Record<string, unknown>;
            const baseQuarters = (metadata.quarters as Quarter[]) || [];
            const quarterMap = new Map<string, PlannedCourse[]>();

            // Initialize quarters with the correct key format
            baseQuarters.forEach(quarter => {
                const key = `${quarter.year}-${quarter.season}`;
                quarterMap.set(key, []);
            });

            // Fetch planned courses for this plan
            const { data: plannedCourses } = await supabase
                .from('planned_courses')
                .select('*')
                .eq('plan_id', plan.id);

            // Separate planned courses by status
            const completedFromTable: PlannedCourse[] = [];

            (plannedCourses || []).forEach(course => {
                const formattedCourse: PlannedCourse = {
                    courseCode: course.course_code,
                    quarter: course.quarter,
                    status: course.status as 'planned' | 'completed' | 'in-progress' || 'planned',
                };

                if (course.status === 'completed') {
                    completedFromTable.push(formattedCourse);
                } else {
                    const matchingQuarter = baseQuarters.find(q =>
                        q.season === course.quarter && q.year === course.year
                    );

                    if (matchingQuarter) {
                        const key = `${matchingQuarter.year}-${matchingQuarter.season}`;
                        quarterMap.get(key)?.push(formattedCourse);
                    }
                }
            });

            // Format the quarters array with the courses
            const quarters = baseQuarters.map(baseQuarter => {
                const key = `${baseQuarter.year}-${baseQuarter.season}`;
                return {
                    ...baseQuarter,
                    id: key,
                    name: `${baseQuarter.season} ${baseQuarter.year}`,
                    courses: quarterMap.get(key) || []
                };
            });

            // Combine completed courses from metadata and planned_courses table
            const metadataCompleted = (metadata.completed_courses as PlannedCourse[]) || [];
            const allCompletedCourses = [...metadataCompleted, ...completedFromTable];

            return {
                id: plan.id,
                name: plan.name,
                userId: plan.user_id,
                majorId: plan.major || metadata.major_id as string || '',
                emphasisId: plan.emphasis_id || undefined,
                catalogYearId: metadata.catalog_year_id as string || 'current',
                maxUnitsPerQuarter: metadata.max_units_per_quarter as number || 20,
                includeSummer: metadata.include_summer as boolean || false,
                quarters: quarters,
                completedCourses: allCompletedCourses
            };
        }));

        return NextResponse.json(formattedPlans);
    } catch (error) {
        console.error('Error fetching plans:', error);
        return NextResponse.json(
            { error: 'Failed to fetch plans' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate the request body
        const plan = ApiUserPlanSchema.parse(body);

        const supabase = await createSupabaseServer();

        // Default quarter is the current one based on server date
        const defaultQuarter = buildQuarter(getQuarterForDate());

        // Fetch major name from majorId
        let majorName = '';
        if (plan.majorId) {
            const { data: major, error: majorError } = await supabase
                .from('majors')
                .select('name')
                .eq('id', plan.majorId)
                .single();

            if (!majorError && major) {
                majorName = major.name;
            }
        }

        // Create metadata object for additional fields
        const metadata = {
            major_id: plan.majorId,
            catalog_year_id: plan.catalogYearId,
            max_units_per_quarter: plan.maxUnitsPerQuarter,
            include_summer: plan.includeSummer,
            quarters: plan.quarters && plan.quarters.length > 0 ? plan.quarters : [defaultQuarter],
            completed_courses: plan.completedCourses || []
        };

        // Build insert object, omit emphasis_id if not a valid uuid
        const insertPayload: Record<string, unknown> = {
            name: plan.name,
            user_id: plan.userId,
            major: majorName, // Store the major name
            metadata: metadata as Json,
        };

        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (plan.emphasisId && uuidRegex.test(plan.emphasisId)) {
            insertPayload["emphasis_id"] = plan.emphasisId;
        }

        const { data, error } = await supabase
            .from('plans')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .insert(insertPayload as any)
            .select()
            .single();

        if (error) {
            console.error('Error creating plan in Supabase:', error);
            return NextResponse.json(
                { error: 'Failed to create plan in database' },
                { status: 500 }
            );
        }

        // Format the response
        const newPlan = {
            id: data.id,
            name: data.name,
            userId: data.user_id,
            majorId: majorName, // Use the major name we fetched
            emphasisId: data.emphasis_id || undefined,
            catalogYearId: metadata.catalog_year_id,
            maxUnitsPerQuarter: metadata.max_units_per_quarter,
            includeSummer: metadata.include_summer,
            quarters: metadata.quarters,
            completedCourses: metadata.completed_courses
        };

        return NextResponse.json(newPlan);
    } catch (error) {
        console.error('Error creating plan:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: 'Invalid plan data', details: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to create plan' },
            { status: 500 }
        );
    }
} 
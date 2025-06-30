import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseResponseSchema, ApiErrorSchema } from '@/lib/types';
import { z } from 'zod';

export async function GET(
    request: Request,
    { params }: { params: { code: string } }
) {
    try {
        const { code } = params;
        const supabase = await createSupabaseServer();

        // Get course details
        const { data: course, error: courseError } = await supabase
            .from('courses')
            .select('*')
            .eq('code', code)
            .single();

        if (courseError) {
            console.error(`Error fetching course ${code}:`, courseError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Course not found' }),
                { status: 404 }
            );
        }

        // ------------------------------------------------------------------
        // Fetch prerequisite groups and their constituent courses
        // ------------------------------------------------------------------

        const { data: prereqGroups, error: prereqError } = await supabase
            .from('prerequisites')
            .select('*')
            .eq('course_id', course.id);

        if (prereqError) {
            console.error(`Error fetching prerequisites for ${code}:`, prereqError);
        }

        const prerequisites = [] as {
            courses: string[];
            type: string;
            grade?: string | null;
        }[];

        if (prereqGroups && prereqGroups.length > 0) {
            // For each prerequisite group, get the list of course codes that satisfy it
            for (const group of prereqGroups) {
                const { data: prereqCourses, error: prereqCoursesError } = await supabase
                    .from('prerequisite_courses')
                    .select('prerequisite_course_id(code)') // nested select to get course code
                    .eq('prerequisite_id', group.id);

                if (prereqCoursesError) {
                    console.error('Error fetching prerequisite courses:', prereqCoursesError);
                    continue;
                }

                type PrereqCourseRow = { prerequisite_course_id: { code: string } };
                const courseCodes = (prereqCourses as PrereqCourseRow[] ?? []).map((row) => row.prerequisite_course_id.code);

                prerequisites.push({
                    courses: courseCodes,
                    type: group.prerequisite_type,
                    grade: group.min_grade ?? undefined,
                });
            }
        }

        // ------------------------------------------------------------------
        // Cross-listed courses
        // ------------------------------------------------------------------

        // Fetch cross-listed course IDs in both directions
        const { data: rowsForward } = await supabase
            .from('cross_listed_courses')
            .select('cross_listed_course_id')
            .eq('course_id', course.id);

        const { data: rowsBackward } = await supabase
            .from('cross_listed_courses')
            .select('course_id')
            .eq('cross_listed_course_id', course.id);

        const otherIds = [
            ...(rowsForward?.map((r) => r.cross_listed_course_id) ?? []),
            ...(rowsBackward?.map((r) => r.course_id) ?? []),
        ];

        let crossListedAs: string[] = [];
        if (otherIds.length) {
            const { data: otherCourses } = await supabase
                .from('courses')
                .select('code')
                .in('id', otherIds);

            crossListedAs = (otherCourses ?? [])
                .map((c) => c.code)
                .filter((c): c is string => !!c && c !== course.code);
        }

        const formattedCourse = {
            id: course.id,
            code: course.code,
            title: course.title,
            units: course.units,
            description: course.description || '',
            department: course.department,
            isUpperDivision: course.is_upper_division,
            prerequisites,
            corequisites: [],
            offeredQuarters: [],
            crossListedAs
        };

        // Validate with Zod schema before returning
        const validatedCourse = CourseResponseSchema.parse(formattedCourse);
        return NextResponse.json(validatedCourse);
    } catch (error) {
        console.error(`Error in course detail API:`, error);
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                ApiErrorSchema.parse({ error: 'Invalid course data structure' }),
                { status: 422 }
            );
        }
        return NextResponse.json(
            ApiErrorSchema.parse({ error: 'Failed to fetch course' }),
            { status: 500 }
        );
    }
} 
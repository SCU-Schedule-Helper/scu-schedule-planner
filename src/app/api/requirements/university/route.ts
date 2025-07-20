import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { ApiErrorSchema, CourseSchema } from '@/lib/types';

// Helper to parse course expressions that are JSON arrays of strings
function parseCourseExpression(expression: string): string[] {
    if (!expression) return [];
    try {
        const courseCodes = JSON.parse(expression);
        if (Array.isArray(courseCodes)) {
            return courseCodes.filter(code => typeof code === 'string');
        }
    } catch {
        // Fallback for non-JSON expressions, though the data seems to be JSON
        const courseCodes = expression.match(/[A-Z]{2,5}\s\d{1,3}[A-Z]?/g);
        return courseCodes || [];
    }
    return [];
}

export async function GET() {
    try {
        const supabase = await createSupabaseServer();

        // Fetch all courses to use for matching
        const { data: allCourses, error: coursesError } = await supabase
            .from('courses')
            .select('*');

        if (coursesError) {
            console.error('Error fetching courses:', coursesError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: coursesError.message }),
                { status: 500 }
            );
        }

        // Fetch core curriculum requirements from the new schema
        const { data: coreRequirements, error } = await supabase
            .from('core_curriculum_requirements')
            .select('*')
            .order('name');

        if (error) {
            console.error('Error fetching core curriculum requirements:', error);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: error.message }),
                { status: 500 }
            );
        }

        // Fetch core curriculum pathways
        const { data: corePathways, error: pathwaysError } = await supabase
            .from('core_curriculum_pathways')
            .select('*')
            .order('name');

        if (pathwaysError) {
            console.error('Error fetching core curriculum pathways:', pathwaysError);
            return NextResponse.json(
                ApiErrorSchema.parse({ error: pathwaysError.message }),
                { status: 500 }
            );
        }

        // console.log('Core requirements:', coreRequirements);

        const formattedCoreRequirements = coreRequirements.map(req => {
            const courseCodes = parseCourseExpression(req.fulfilled_by || '');
            const courses = allCourses.filter(c => courseCodes.includes(c.code));

            // Log details about courses for debugging
            // console.log(`Processing requirement "${req.name}" with ${courses.length} courses:`,
            // courses.map(c => ({ code: c.code, id: c.id, title: c.title?.slice(0, 50) }))
            // );

            // Validate each course individually with detailed error reporting
            const validatedCourses = [];
            for (const course of courses) {
                try {
                    const validCourse = CourseSchema.parse(course);
                    validatedCourses.push(validCourse);
                } catch (error) {
                    console.error(`❌ Course validation failed for ${course.code}:`, {
                        courseId: course.id,
                        courseCode: course.code,
                        courseTitle: course.title,
                        courseData: course,
                        validationError: error
                    });
                    // Don't include this course, but continue processing others
                }
            }

            return {
                id: req.id,
                name: req.name,
                type: 'core',
                description: req.description || '',
                courses: validatedCourses,
                coursesRequired: [],
                chooseOptions: [],
                expression: req.fulfilled_by || '',
                minUnits: undefined,
                notes: req.applies_to || undefined
            };
        });

        const formattedCorePathways = corePathways.map(pathway => {
            const courseCodes = parseCourseExpression(pathway.associated_courses || '');
            const courses = allCourses.filter(c => courseCodes.includes(c.code));

            // Add validation and error handling for each course
            const validatedCourses = courses.filter(course => {
                try {
                    CourseSchema.parse(course);
                    return true;
                } catch (error) {
                    console.warn(`Skipping invalid course in core pathways:`, {
                        courseCode: course.code,
                        courseId: course.id,
                        error: error instanceof Error ? error.message : String(error)
                    });
                    return false;
                }
            });

            return {
                id: pathway.id,
                name: pathway.name,
                type: 'pathway',
                description: pathway.description || '',
                courses: validatedCourses, // Use pre-validated courses
                coursesRequired: [],
                chooseOptions: [],
                expression: pathway.associated_courses || '',
                minUnits: undefined,
                notes: 'Core Curriculum Pathway'
            };
        });

        const responseData = {
            coreRequirements: formattedCoreRequirements,
            corePathways: formattedCorePathways
        };

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Unexpected error in university requirements API:', error);
        return NextResponse.json(
            ApiErrorSchema.parse({
                error: error instanceof Error ? error.message : 'Unknown error occurred'
            }),
            { status: 500 }
        );
    }
}

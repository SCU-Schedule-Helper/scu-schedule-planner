import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { CourseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    withErrorHandling
} from '@/lib/errors';

/**
 * University Requirements API
 * 
 * Fetches university core curriculum requirements and pathways with course validation.
 * Uses standardized error handling pattern for consistency across all API routes.
 */

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
    return withErrorHandling(async () => {
        const supabase = await createSupabaseServer();

        // Fetch all courses to use for matching
        const { data: allCourses, error: coursesError } = await supabase
            .from('courses')
            .select('*');

        if (coursesError) {
            logApiError(ApiError.databaseError('Error fetching courses'), { error: coursesError });
            throw ApiError.databaseError('Failed to fetch courses');
        }

        // Fetch core curriculum requirements from the new schema
        const { data: coreRequirements, error } = await supabase
            .from('core_curriculum_requirements')
            .select('*')
            .order('name');

        if (error) {
            logApiError(ApiError.databaseError('Error fetching core curriculum requirements'), { error });
            throw ApiError.databaseError('Failed to fetch core curriculum requirements');
        }

        // Fetch core curriculum pathways
        const { data: corePathways, error: pathwaysError } = await supabase
            .from('core_curriculum_pathways')
            .select('*')
            .order('name');

        if (pathwaysError) {
            logApiError(ApiError.databaseError('Error fetching core curriculum pathways'), { error: pathwaysError });
            throw ApiError.databaseError('Failed to fetch core curriculum pathways');
        }

        const formattedCoreRequirements = coreRequirements.map(req => {
            const courseCodes = parseCourseExpression(req.fulfilled_by || '');
            const courses = allCourses.filter(c => courseCodes.includes(c.code));

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
    })().catch(error => handleApiError(error));
}

import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { RequirementsResponseSchema } from '@/lib/types';
import {
    ApiError,
    handleApiError,
    logApiError,
    validateRequiredField,
    withErrorHandling
} from '@/lib/errors';

/**
 * Emphasis Requirements API
 * 
 * Fetches requirements for a specific emphasis area with course expression parsing.
 * Uses standardized error handling pattern for consistency across all API routes.
 */
export async function GET(request: Request) {
    return withErrorHandling(async () => {
        const { searchParams } = new URL(request.url);
        const emphasisParam = searchParams.get('emphasis');
        const emphasisId = searchParams.get('emphasisId');

        if (!emphasisParam && !emphasisId) {
            throw ApiError.badRequest(
                'Emphasis name or emphasisId parameter is required',
                'MISSING_REQUIRED_FIELD',
                { providedParams: { emphasisParam, emphasisId } }
            );
        }

        const supabase = await createSupabaseServer();

        // Fetch the emphasis with requirements stored as text
        // Try to match by ID first (if provided), then by name
        let query = supabase.from('emphasis_areas_enhanced').select('*');

        if (emphasisId) {
            validateRequiredField(emphasisId, 'emphasisId');
            query = query.eq('id', emphasisId);
        } else if (emphasisParam) {
            validateRequiredField(emphasisParam, 'emphasis');
            query = query.eq('name', emphasisParam);
        }

        const { data: emphasis, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw ApiError.notFound('Emphasis not found', 'REQUIREMENT_NOT_FOUND');
            }
            logApiError(ApiError.databaseError('Error fetching emphasis requirements'), { error, emphasisParam, emphasisId });
            throw ApiError.databaseError('Failed to fetch emphasis requirements');
        }

        if (!emphasis) {
            throw ApiError.notFound('Emphasis not found', 'REQUIREMENT_NOT_FOUND');
        }

        // Convert the simplified requirements to the expected format
        const requirements = [];

        if (emphasis.course_requirements_expression) {
            const expression = emphasis.course_requirements_expression;

            const expandRange = (range: string): string[] => {
                const parts = range.split('-');
                if (parts.length !== 2) return [range];

                const prefix = parts[0].replace(/\d+$/, '');
                const start = parseInt(parts[0].match(/\d+$/)?.[0] || '0', 10);
                const end = parseInt(parts[1], 10);

                if (isNaN(start) || isNaN(end)) return [range];

                const courses: string[] = [];
                for (let i = start; i <= end; i++) {
                    courses.push(`${prefix}${i}`);
                }
                return courses;
            };

            const parseExpression = (exp: string) => {
                const coursesRequired: string[] = [];
                const chooseFrom: { count: number; options: string[] }[] = [];

                const chooseRegex = /(\d+)\((.*?)\)/g;
                const remainingExp = exp.replace(chooseRegex, (match, count, optionsStr) => {
                    const options = optionsStr.split('|').flatMap((o: string) => expandRange(o.trim()));
                    chooseFrom.push({
                        count: parseInt(count, 10),
                        options,
                    });
                    return '';
                });

                remainingExp.split('&').forEach(course => {
                    const trimmed = course.trim();
                    if (trimmed) {
                        coursesRequired.push(trimmed);
                    }
                });

                return { coursesRequired, chooseFrom };
            };

            const { coursesRequired, chooseFrom } = parseExpression(expression);

            requirements.push({
                id: `${emphasis.id}-courses`,
                name: 'Course Requirements',
                type: 'course_expression',
                description: 'Required courses for this emphasis',
                coursesRequired,
                chooseFrom: chooseFrom.length > 0 ? chooseFrom[0] : undefined,
                expression: emphasis.course_requirements_expression,
                minUnits: undefined,
                notes: undefined
            });
        }

        if (emphasis.other_requirements) {
            try {
                const otherReqs = Array.isArray(emphasis.other_requirements)
                    ? emphasis.other_requirements
                    : [emphasis.other_requirements];

                otherReqs.forEach((req, index) => {
                    if (typeof req === 'object' && req !== null && !Array.isArray(req)) {
                        const reqObj = req as Record<string, unknown>;
                        requirements.push({
                            id: `${emphasis.id}-other-${index}`,
                            name: reqObj.requirementName || 'Other Requirement',
                            type: reqObj.requirementType || 'other',
                            description: reqObj.requirementDescription || '',
                            coursesRequired: [],
                            chooseOptions: [],
                            minUnits: reqObj.numRequired || undefined,
                            notes: reqObj.requirementDescription || undefined
                        });
                    }
                });
            } catch (e) {
                console.warn('Error parsing other requirements:', e);
            }
        }

        return NextResponse.json(RequirementsResponseSchema.parse(requirements));
    })().catch(error => handleApiError(error, request));
}

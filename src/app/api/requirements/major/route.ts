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

// Helper function to check if a string is a valid UUID
function isUuid(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
}

export async function GET(request: Request) {
    return withErrorHandling(async () => {
        const { searchParams } = new URL(request.url);
        const majorParam = searchParams.get('major');
        const majorId = searchParams.get('majorId');

        if (!majorParam && !majorId) {
            throw ApiError.badRequest(
                'Major name or majorId parameter is required',
                'MISSING_REQUIRED_FIELD',
                { providedParams: { majorParam, majorId } }
            );
        }

        const supabase = await createSupabaseServer();
        let query = supabase.from('majors').select('*');

        if (majorId) {
            validateRequiredField(majorId, 'majorId');
            
            // Check if it's a valid UUID, if not try to find by name
            if (!isUuid(majorId)) {
                const { data: majorByName, error: nameLookupError } = await supabase
                    .from('majors')
                    .select('id')
                    .eq('name', majorId)
                    .single();

                if (nameLookupError || !majorByName) {
                    throw ApiError.notFound('Major not found', 'REQUIREMENT_NOT_FOUND');
                }
                
                query = query.eq('id', majorByName.id);
            } else {
                query = query.eq('id', majorId);
            }
        } else if (majorParam) {
            validateRequiredField(majorParam, 'major');
            
            const { data: majorByName, error: nameLookupError } = await supabase
                .from('majors')
                .select('id')
                .eq('name', majorParam)
                .single();

            if (nameLookupError || !majorByName) {
                throw ApiError.notFound('Major not found', 'REQUIREMENT_NOT_FOUND');
            }
            
            query = query.eq('id', majorByName.id);
        }

        const { data: major, error } = await query.single();

        if (error) {
            if (error.code === 'PGRST116') {
                throw ApiError.notFound('Major not found', 'REQUIREMENT_NOT_FOUND');
            }

            logApiError(
                ApiError.databaseError('Error fetching major requirements'),
                { error, majorParam, majorId }
            );
            
            throw ApiError.databaseError('Failed to fetch major requirements');
        }

        if (!major) {
            throw ApiError.notFound('Major not found', 'REQUIREMENT_NOT_FOUND');
        }

        // Helper: parse simplified course expression (e.g. "CSCI10 & (PHYS31 | CHEM11)")
        // into a list of required courses and optional choose-from groups.
        const parseCourseExpression = (expr: string) => {
            // Trim and collapse whitespace for easier parsing
            const input = expr.replace(/\s+/g, "");

            const requiredCourses: string[] = [];
            const chooseGroups: string[][] = [];

            let depth = 0;
            let current = "";

            const flushCurrent = () => {
                const currentValue = current; // Capture current value to avoid race conditions
                if (!currentValue) return;

                // If it contains a "|" treat as an OR group to choose one
                if (currentValue.includes("|")) {
                    const opts = currentValue.replace(/^\(|\)$/g, "").split("|");
                    chooseGroups.push(opts);
                } else {
                    requiredCourses.push(currentValue.replace(/^\(|\)$/g, ""));
                }
                current = "";
            };

            for (const ch of input) {
                if (ch === "(") {
                    depth += 1;
                    if (depth === 1) {
                        // Start of a new group – include character to keep parentheses for later stripping
                        current += ch;
                        continue;
                    }
                }
                if (ch === ")") {
                    depth -= 1;
                }
                if (ch === "&" && depth === 0) {
                    flushCurrent();
                    continue;
                }
                current += ch;
            }
            flushCurrent();

            return { requiredCourses, chooseGroups } as const;
        };

        // Convert the simplified requirements to the expected format
        const requirements = [];

        if (major.course_requirements_expression) {
            const { requiredCourses, chooseGroups } = parseCourseExpression(
                major.course_requirements_expression
            );

            requirements.push({
                id: `${major.id}-courses`,
                name: 'Course Requirements',
                type: 'course_expression',
                description: 'Required courses for this major',
                coursesRequired: requiredCourses,
                chooseFrom:
                    chooseGroups.length > 0
                        ? { count: chooseGroups.length, options: chooseGroups.flat() }
                        : undefined,
                minUnits: undefined,
                notes: undefined,
            });
        }

        if (major.other_requirements) {
            try {
                const otherReqs = Array.isArray(major.other_requirements)
                    ? major.other_requirements
                    : [major.other_requirements];

                otherReqs.forEach((req, index) => {
                    if (typeof req === 'object' && req !== null && !Array.isArray(req)) {
                        const reqObj = req as Record<string, unknown>;
                        requirements.push({
                            id: `${major.id}-other-${index}`,
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
                logApiError(ApiError.validationFailed('Error parsing other requirements'), {
                    error: e,
                    majorId: major.id
                });
                // Don't throw here, just log the error and continue
            }
        }

        // Validate the final response
        const validatedResponse = RequirementsResponseSchema.parse(requirements);

        return NextResponse.json(validatedResponse);
    })().catch(error => handleApiError(error, request));
} 
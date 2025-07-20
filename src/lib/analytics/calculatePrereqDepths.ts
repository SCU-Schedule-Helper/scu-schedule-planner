import type { Course } from '@/lib/types';

export interface PrereqDepthResult {
    courseCode: string;
    depth: number;
}

/**
 * Calculate prerequisite depths for courses in the catalog.
 * Since prerequisites are now stored as text expressions, we'll parse them
 * to extract course codes and calculate depths.
 */
export function calculatePrereqDepths(
    catalog: Course[],
    targetCodes?: string[]
): PrereqDepthResult[] {
    // Build a lookup map by course code
    const courseMap = new Map<string, Course>();
    catalog.forEach((course) => {
        if (course.code) {
            courseMap.set(course.code, course);
        }
    });

    /**
     * Extract course codes from prerequisites (handles JSONB format)
     */
    function extractCourseCodes(prerequisites: string | unknown[] | null | undefined): string[] {
        if (!prerequisites) return [];

        try {
            // Handle JSONB array format
            if (Array.isArray(prerequisites)) {
                return prerequisites.flatMap((prereq: unknown) => {
                    if (typeof prereq === 'string') {
                        // Extract course codes from string
                        const match = prereq.match(/\b[A-Z]{2,5}\s*\d+[A-Z]{0,2}\b/g);
                        return match || [];
                    } else if (prereq && typeof prereq === 'object' && 'courses' in prereq) {
                        const courses = (prereq as { courses?: string[] }).courses;
                        return courses || [];
                    }
                    return [];
                });
            }

            return [];
        } catch (error) {
            console.warn('Error extracting course codes from prerequisites:', error);
            return [];
        }
    }

    // Canonicalize course codes (handle any variations)
    const canonicalise = (code: string): string => {
        return code.replace(/\s+/g, '').toUpperCase();
    };

    // Memoization for DFS
    const memo: Record<string, number> = {};
    const visiting = new Set<string>();

    const dfs = (code: string): number => {
        code = canonicalise(code);
        if (memo[code] !== undefined) return memo[code];
        if (visiting.has(code)) return 0; // cycle fallback
        visiting.add(code);

        const course = courseMap.get(code);
        let max = 0;

        // Skip if no prerequisites
        if (!course || !course.prerequisites || (Array.isArray(course.prerequisites) && course.prerequisites.length === 0)) {
            visiting.delete(code);
            memo[code] = 0;
            return 0;
        }

        const prereqCodes = extractCourseCodes(course.prerequisites);
        prereqCodes.forEach((prereqCode) => {
            const d = dfs(canonicalise(prereqCode));
            if (d + 1 > max) max = d + 1;
        });

        visiting.delete(code);
        memo[code] = max;
        return max;
    };

    const codesToProcess = targetCodes?.length ? targetCodes : catalog.map((c) => c.code!).filter(Boolean);

    return codesToProcess.map((code) => ({
        courseCode: code,
        depth: dfs(code),
    }));
} 
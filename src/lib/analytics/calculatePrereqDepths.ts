import type { Course } from "@/lib/types";

export interface CourseDepth {
    code: string;
    title?: string;
    depth: number;
}

/**
 * Calculates prerequisite-chain depths for the given courses.
 * Depth = length of the longest prereq chain ending at the course.
 */
export function calculatePrereqDepths(catalog: Course[], targetCodes?: string[]): CourseDepth[] {
    const courseMap = new Map<string, Course>();
    catalog.forEach((c) => {
        if (c.code) courseMap.set(c.code, c);
    });

    // Build alias → canonical map using crossListedAs (choose first alias as canonical)
    const aliasToCanonical: Record<string, string> = {};
    catalog.forEach((c) => {
        if (c.crossListedAs && c.crossListedAs.length > 0 && c.code) {
            const canonical = c.code; // pick primary code as canonical
            [c.code, ...c.crossListedAs].forEach((alias) => {
                aliasToCanonical[alias] = canonical;
            });
        }
    });

    const memo: Record<string, number> = {};
    const visiting = new Set<string>(); // cycle guard

    const canonicalise = (code: string): string => aliasToCanonical[code] ?? code;

    const dfs = (code: string): number => {
        code = canonicalise(code);
        if (memo[code] !== undefined) return memo[code];
        if (visiting.has(code)) return 0; // cycle fallback
        visiting.add(code);
        const course = courseMap.get(code);
        let max = 0;
        if (course?.prerequisites) {
            course.prerequisites.forEach((group) => {
                group.courses.forEach((alias: string) => {
                    const d = dfs(canonicalise(alias));
                    if (d + 1 > max) max = d + 1;
                });
            });
        }
        visiting.delete(code);
        memo[code] = max;
        return max;
    };

    const codesToProcess = targetCodes?.length ? targetCodes : catalog.map((c) => c.code!).filter(Boolean);

    const result: CourseDepth[] = codesToProcess.map((code) => {
        const canonical = canonicalise(code);
        const depth = dfs(canonical);
        const title = courseMap.get(canonical)?.title;
        return { code: canonical, title, depth };
    });

    return result.sort((a, b) => b.depth - a.depth);
} 
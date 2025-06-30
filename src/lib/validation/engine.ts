import type {
    Course,
    RequirementGroup,
    UserPlan,
    PlannedCourse,
} from "../types";

import {
    ValidationReport,
    ValidationMessage,
    CourseReport,
    ValidationSettings,
    RequirementStatus,
} from "./types";

// ---------------------------------------------------------------------------
// Helpers for quarter ordering & parsing
// ---------------------------------------------------------------------------

type Season = "Winter" | "Spring" | "Summer" | "Fall";

const SEASON_ORDER: Record<Season, number> = {
    Winter: 0,
    Spring: 1,
    Summer: 2,
    Fall: 3,
};

interface QuarterMeta {
    season: Season;
    year: number;
}

function parseQuarterName(quarterName: string): QuarterMeta {
    // Expected format: "Fall 2025" (season followed by year)
    const [season, yearStr] = quarterName.split(" ");
    if (!season || !yearStr) {
        throw new Error(`Invalid quarter name: ${quarterName}`);
    }
    if (!(season in SEASON_ORDER)) {
        throw new Error(`Invalid season in quarter name: ${quarterName}`);
    }
    return { season: season as Season, year: Number(yearStr) };
}

function isQuarterBefore(a: string, b: string): boolean {
    const qa = parseQuarterName(a);
    const qb = parseQuarterName(b);
    if (qa.year !== qb.year) return qa.year < qb.year;
    return SEASON_ORDER[qa.season] < SEASON_ORDER[qb.season];
}

function sortQuartersAsc(quarters: string[]): string[] {
    return [...quarters].sort((a, b) => (isQuarterBefore(a, b) ? -1 : 1));
}

// ---------------------------------------------------------------------------
// Validation implementation
// ---------------------------------------------------------------------------

const ENGINE_VERSION = "0.1.0";

export interface ValidatePlanArgs {
    courses?: Record<string, Course>; // If omitted, fall back to CatalogCourses
    requirements: RequirementGroup[];
    plan: UserPlan;
    settings: ValidationSettings;
}

export function validatePlan({
    courses = {} as Record<string, Course>,
    requirements,
    plan,
    settings,
}: ValidatePlanArgs): ValidationReport {
    const messages: ValidationMessage[] = [];
    const courseReports: Record<string, CourseReport> = {};

    // Build lookup structures
    const completedSet = new Set<string>(
        plan.completedCourses.map((c) => c.courseCode ?? c.code ?? "")
    );

    // map quarter -> PlannedCourse[]
    const quarterMap = new Map<string, PlannedCourse[]>(
        plan.quarters.map((q) => [q.name, q.courses])
    );

    const sortedQuarterNames = sortQuartersAsc(Array.from(quarterMap.keys()));

    const seenCourseCodes = new Set<string>();
    const takenBeforeSet = new Set<string>(completedSet);

    // Iterate quarters chronologically
    for (const qName of sortedQuarterNames) {
        const coursesInQuarter = quarterMap.get(qName) ?? [];

        let totalUnits = 0;
        const codesInThisQuarter = new Set<string>();

        // First pass: duplicate detection within quarter and accumulate units
        for (const pc of coursesInQuarter) {
            const code = pc.courseCode ?? pc.code ?? "";
            if (!code) continue;
            const courseInfo = courses[code];
            totalUnits += courseInfo?.units ?? pc.units ?? 0;

            if (codesInThisQuarter.has(code)) {
                addError(messages, {
                    code: "DUPLICATE_COURSE_IN_QUARTER",
                    message: `${code} appears more than once in ${qName}`,
                    context: { quarter: qName, course: code },
                });
            }
            codesInThisQuarter.add(code);

            // New: warn if the student already completed this course earlier
            if (completedSet.has(code)) {
                // Plan-level warning so it shows up in aggregate list
                addWarning(messages, {
                    code: "COURSE_ALREADY_COMPLETED",
                    message: `${code} was already completed and is being scheduled again`,
                    context: { quarter: qName, course: code },
                });

                // Course-specific warning so the card can highlight the issue
                const cr = getOrCreateCourseReport(courseReports, code);
                cr.messages.push({
                    code: "ALREADY_COMPLETED",
                    level: "warning",
                    message: `${code} already completed`,
                    context: { quarter: qName },
                });
            }

            if (seenCourseCodes.has(code)) {
                addError(messages, {
                    code: "DUPLICATE_COURSE",
                    message: `${code} is scheduled multiple times`,
                    context: { quarter: qName, course: code },
                });
            }
            seenCourseCodes.add(code);
        }

        // Check unit load
        if (totalUnits > settings.maxUnitsPerQuarter) {
            addWarning(messages, {
                code: "OVER_UNIT_LOAD",
                message: `${qName} has ${totalUnits} units (max ${settings.maxUnitsPerQuarter})`,
                context: { quarter: qName, units: totalUnits },
            });
        }

        // Second pass: prerequisite & coreq evaluation for each course
        for (const pc of coursesInQuarter) {
            const code = pc.courseCode ?? pc.code ?? "";
            if (!code) continue;
            const courseInfo = courses[code];
            if (!courseInfo) continue;

            const cr = getOrCreateCourseReport(courseReports, code);

            // Quarter offering
            if (
                courseInfo.offeredQuarters &&
                courseInfo.offeredQuarters.length > 0
            ) {
                const { season } = parseQuarterName(qName);
                if (!courseInfo.offeredQuarters.includes(season)) {
                    cr.messages.push({
                        code: "NOT_OFFERED",
                        level: "warning",
                        message: `${code} is not usually offered in ${season}`,
                        context: { quarter: qName },
                    });
                }
            }

            // Prerequisite check
            if (courseInfo.prerequisites && courseInfo.prerequisites.length > 0) {
                const unmet = courseInfo.prerequisites.filter((pr) => {
                    const prereqCourses = pr.courses;
                    if (pr.type === "or") {
                        return !prereqCourses.some((c: string) => takenBeforeSet.has(c));
                    }
                    // required or recommended -> all must be satisfied
                    return !prereqCourses.every((c: string) => takenBeforeSet.has(c));
                });
                if (unmet.length > 0) {
                    cr.messages.push({
                        code: "PREREQ_UNMET",
                        level: "error",
                        message: `Prerequisites not met for ${code}`,
                        context: { quarter: qName, unmet },
                    });
                }
            }

            // Corequisite check
            if (courseInfo.corequisites && courseInfo.corequisites.length > 0) {
                const unmetCoreqs = courseInfo.corequisites.filter(
                    (c: string) => !codesInThisQuarter.has(c) && !takenBeforeSet.has(c)
                );
                if (unmetCoreqs.length > 0) {
                    cr.messages.push({
                        code: "COREQ_UNMET",
                        level: "error",
                        message: `Corequisites not satisfied for ${code}: ${unmetCoreqs.join(", ")}`,
                        context: { quarter: qName, unmetCoreqs },
                    });
                }
            }
        }

        // After validations for the quarter, mark these courses as taken for next iterations
        for (const pc of coursesInQuarter) {
            const code = pc.courseCode ?? pc.code ?? "";
            if (code) takenBeforeSet.add(code);
        }
    }

    // ---------------------------------------------------------------
    // Requirement evaluation  (basic – no double-counting yet)
    // ---------------------------------------------------------------

    const requirementStatus: Record<string, RequirementStatus> = {};

    // Helper – how many of the given codes are present in the taken set
    const countTaken = (codes: string[]): number =>
        codes.reduce((acc, c) => (takenBeforeSet.has(c) ? acc + 1 : acc), 0);

    for (const req of requirements) {
        const requiredCodes =
            (req.coursesRequired ?? req.courses ?? []) as string[];

        // Base counts
        let totalNeeded = requiredCodes.length;
        let completed = countTaken(requiredCodes);

        // Handle choose-from groups (e.g. "choose 2 of these 4")
        if (req.chooseFrom && req.chooseFrom.options) {
            totalNeeded += req.chooseFrom.count;
            const satisfiedInChoose = countTaken(req.chooseFrom.options);
            completed += Math.min(satisfiedInChoose, req.chooseFrom.count);
        }

        // Minimum-unit rule – defer detailed unit calc for later; treat as satisfied if courses met
        const satisfied = totalNeeded === 0 ? true : completed >= totalNeeded;

        const progressPct = totalNeeded === 0 ? 100 : Math.round((completed / totalNeeded) * 100);

        requirementStatus[req.name] = {
            id: req.id,
            name: req.name,
            satisfied,
            progress: progressPct,
        };
    }

    return {
        messages,
        courseReports,
        requirementStatus,
        meta: {
            generatedAt: new Date().toISOString(),
            engineVersion: ENGINE_VERSION,
        },
    };
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function addError(target: ValidationMessage[], msg: Omit<ValidationMessage, "level">) {
    target.push({ ...msg, level: "error" });
}

function addWarning(target: ValidationMessage[], msg: Omit<ValidationMessage, "level">) {
    target.push({ ...msg, level: "warning" });
}

function getOrCreateCourseReport(
    map: Record<string, CourseReport>,
    code: string
): CourseReport {
    if (!map[code]) {
        map[code] = { code, messages: [] };
    }
    return map[code];
} 
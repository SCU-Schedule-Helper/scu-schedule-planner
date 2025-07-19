import type { Course, RequirementGroup, Substitution, UserPlan } from "@/lib/types";
import type { ValidationReport } from "@/lib/validation/types";

export interface RequirementProgress {
    id: string;
    name: string;
    progress: number; // 0-100
    satisfied: boolean;
}

export interface UnitsByQuarter {
    quarter: string;
    units: number;
}

export interface DashboardMetrics {
    unitsCompleted: number;
    upperDivisionCompleted: number;
    unitsPlanned: number;
    unitsByQuarter: UnitsByQuarter[];
    requirementProgress: RequirementProgress[];
    estimatedGradQuarter: string | null;
    atRiskCourses: string[]; // course codes
    upperDivUnitsCompleted: number;
    upperDivUnitsPlanned: number;
    upperDivUnitsNeeded: number; // constant 60
    emphasisCompleted: number;
    emphasisNeeded: number;
}

/**
 * Compute derived analytics used by the dashboard.
 * Everything is synchronous & pure so we can unit-test easily.
 */
export function computeDashboardMetrics(params: {
    plan: UserPlan;
    courses: Record<string, Course>;
    requirements?: RequirementGroup[];
    validationReport: ValidationReport | null;
}): DashboardMetrics {
    const { plan, courses, validationReport } = params;
    // requirements currently unused but kept for future use

    // Completed metrics --------------------------------------------------
    let unitsCompleted = 0;
    let upperDivisionCompleted = 0;

    for (const c of plan.completedCourses) {
        const courseInfo = courses[c.courseCode] ?? { units: 0, isUpperDivision: false } as Partial<Course>;
        unitsCompleted += courseInfo.units ?? 0;
        if (courseInfo.isUpperDivision) upperDivisionCompleted += courseInfo.units ?? 0;
    }

    // Upper-division unit metrics ----------------------------------------
    let upperDivUnitsCompleted = 0;
    let upperDivUnitsPlanned = 0;

    // Build map for substitution overrides keyed by course code
    const substitutionOverrides: Record<string, { isUD?: boolean | null; units?: number | null }> = {};

    const planSubs: Substitution[] = (plan as unknown as { substitutions: Substitution[] }).substitutions ?? [];
    planSubs.forEach((s) => {
        substitutionOverrides[s.substituteCourseCode] = {
            isUD: s.isUpperDivOverride,
            units: s.unitsOverride,
        };
    });

    const isUpperDivisionCourse = (code: string): boolean => {
        const info = courses[code];
        if (info && info.isUpperDivision !== undefined) {
            return Boolean(info.isUpperDivision);
        }
        // Fallback: numeric part >= 100
        const parts = code.split(" ");
        const num = +parts[1];
        return !isNaN(num) && num >= 100;
    };

    plan.completedCourses.forEach((c) => {
        const override = substitutionOverrides[c.courseCode];
        const ud = override?.isUD ?? isUpperDivisionCourse(c.courseCode);
        if (ud) {
            const info = courses[c.courseCode] ?? { units: 0 } as Partial<Course>;
            const units = override?.units ?? info.units ?? 0;
            upperDivUnitsCompleted += units;
        }
    });

    plan.quarters.forEach((q) => {
        q.courses.forEach((pc) => {
            const override = substitutionOverrides[pc.courseCode];
            const ud = override?.isUD ?? isUpperDivisionCourse(pc.courseCode);
            if (ud) {
                const info = courses[pc.courseCode] ?? { units: 0 } as Partial<Course>;
                const units = override?.units ?? info.units ?? 0;
                upperDivUnitsPlanned += units;
            }
        });
    });

    const UPPER_DIV_UNITS_REQUIREMENT = 60;

    // Emphasis requirement metrics --------------------------------------
    let emphasisCompleted = 0;
    let emphasisNeeded = 0;

    if (params.requirements && params.requirements.length > 0) {
        const emphasisGroups = params.requirements.filter((g) => g.type === "emphasis");

        // build taken/planned set
        const takenPlanned = new Set<string>();
        plan.completedCourses.forEach((c) => takenPlanned.add(c.courseCode));
        plan.quarters.forEach((q) => q.courses.forEach((pc) => takenPlanned.add(pc.courseCode)));

        for (const g of emphasisGroups) {
            const reqCodes = g.coursesRequired ?? [];
            emphasisNeeded += reqCodes.length;
            reqCodes.forEach((c) => {
                if (takenPlanned.has(c)) emphasisCompleted += 1;
            });

            if (g.chooseFrom) {
                emphasisNeeded += g.chooseFrom.count;
                const satisfied = g.chooseFrom.options.filter((c) => takenPlanned.has(c)).length;
                emphasisCompleted += Math.min(satisfied, g.chooseFrom.count);
            }
        }
    }

    // Planned units & units per quarter ---------------------------------
    let unitsPlanned = 0;
    const unitsByQuarterArr: UnitsByQuarter[] = [];

    plan.quarters.forEach((q) => {
        let total = 0;
        q.courses.forEach((pc) => {
            const info = courses[pc.courseCode] ?? { units: 0 } as Partial<Course>;
            total += info.units ?? 0;
        });
        unitsPlanned += total;
        unitsByQuarterArr.push({ quarter: q.name, units: total });
    });

    // Sort quarters chronologically by year/season order for chart lines
    const seasonOrder: Record<string, number> = { Winter: 0, Spring: 1, Summer: 2, Fall: 3 };
    unitsByQuarterArr.sort((a, b) => {
        const [aSeason, aYear] = a.quarter.split(" ");
        const [bSeason, bYear] = b.quarter.split(" ");
        if (+aYear !== +bYear) return +aYear - +bYear;
        return seasonOrder[aSeason] - seasonOrder[bSeason];
    });

    // Requirement progress ----------------------------------------------
    const requirementProgress: RequirementProgress[] = (validationReport
        ? Object.values(validationReport.requirementStatus)
        : []).map((r) => ({
            id: r.id ?? r.name,
            name: r.name,
            progress: r.progress,
            satisfied: r.satisfied,
        }));

    // Estimated grad quarter – last quarter in plan OR null
    const estimatedGradQuarter = unitsByQuarterArr.length
        ? unitsByQuarterArr[unitsByQuarterArr.length - 1].quarter
        : null;

    // At-risk courses – from report messages of level error or warnings specific codes
    const atRiskCourses = validationReport
        ? Object.entries(validationReport.courseReports)
            .filter(([, cr]) =>
                cr.messages.some((m) => ["PREREQ_UNMET", "COREQ_UNMET", "NOT_OFFERED"].includes(m.code))
            )
            .map(([code]) => code)
        : [];

    return {
        unitsCompleted,
        upperDivisionCompleted,
        unitsPlanned,
        unitsByQuarter: unitsByQuarterArr,
        requirementProgress,
        estimatedGradQuarter,
        atRiskCourses,
        upperDivUnitsCompleted,
        upperDivUnitsPlanned,
        upperDivUnitsNeeded: UPPER_DIV_UNITS_REQUIREMENT,
        emphasisCompleted,
        emphasisNeeded,
    };
} 
import type { Course, RequirementGroup, UserPlan } from "@/lib/types";
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
    };
} 
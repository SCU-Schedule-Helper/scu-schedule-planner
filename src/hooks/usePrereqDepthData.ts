import { useMemo } from "react";
import { calculatePrereqDepths, PrereqDepthResult } from "@/lib/analytics/calculatePrereqDepths";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { useShallow } from "zustand/shallow";
import { useUniversityRequirementsQuery, useMajorRequirementsQuery, useEmphasisRequirementsQuery } from "@/hooks/api/useRequirementsQuery";

/**
 * Returns prerequisite-chain depths for all courses in the active plan (planned + remaining).
 */
export function usePrereqDepthData(): PrereqDepthResult[] {
    const { currentPlanId, plans } = usePlannerStore(useShallow((s) => ({ currentPlanId: s.currentPlanId, plans: s.plans })));
    const plan = plans.find((p) => p.id === currentPlanId);

    const { data: catalog = [] } = useCoursesQuery();

    // Requirement groups – we need all course codes listed there
    const { data: uniReqs } = useUniversityRequirementsQuery();
    const { data: majorReqs = [] } = useMajorRequirementsQuery();
    const { data: empReqs = [] } = useEmphasisRequirementsQuery(plan?.emphasisId ?? "");

    const targetCodes: string[] = [];
    if (plan) {
        // completed + planned + remaining required? for now use planned + completed.
        plan.completedCourses.forEach((c) => targetCodes.push(c.courseCode));
        plan.quarters.forEach((q) => q.courses.forEach((pc) => targetCodes.push(pc.courseCode)));
    }

    // Add requirement-listed courses (includes ones not yet planned/completed)
    const allReqGroups = [
        ...(uniReqs?.coreRequirements || []),
        ...(uniReqs?.corePathways || []),
        ...majorReqs,
        ...empReqs
    ];
    
    allReqGroups.forEach((req) => {
        const required = (req.coursesRequired ?? req.courses ?? []) as string[];
        targetCodes.push(...required);
        if (req.chooseFrom) targetCodes.push(...req.chooseFrom.options);
    });

    return useMemo(() => {
        if (catalog.length === 0) return [];
        const codesUnique = Array.from(new Set(targetCodes));
        return calculatePrereqDepths(catalog, codesUnique);
    }, [catalog, targetCodes.join(","), uniReqs, majorReqs, empReqs]);
}

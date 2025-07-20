import { useMemo } from "react";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { useUniversityRequirementsQuery, useMajorRequirementsQuery, useEmphasisRequirementsQuery } from "@/hooks/api/useRequirementsQuery";
import { usePlanValidation } from "@/hooks/usePlanValidation";
import { computeDashboardMetrics, DashboardMetrics } from "@/lib/metrics/computeDashboardMetrics";
import { useShallow } from "zustand/shallow";

export function useDashboardMetrics(): DashboardMetrics | null {
    const { currentPlanId, plans, selectedEmphasisId } = usePlannerStore(
        useShallow((s) => ({ currentPlanId: s.currentPlanId, plans: s.plans, selectedEmphasisId: s.selectedEmphasisId }))
    );

    const plan = plans.find((p) => p.id === currentPlanId);

    const { data: catalogCourses = [] } = useCoursesQuery();
    const { data: uniReqs } = useUniversityRequirementsQuery();
    const { data: majorReqs = [] } = useMajorRequirementsQuery();
    const { data: empReqs = [] } = useEmphasisRequirementsQuery(selectedEmphasisId ?? "");

    const allRequirements = [
        ...(uniReqs?.coreRequirements || []),
        ...(uniReqs?.corePathways || []),
        ...majorReqs,
        ...empReqs
    ];

    const validationReport = usePlanValidation(plan);

    const metrics = useMemo(() => {
        if (!plan) return null;
        // Build quick course map for O(1) lookup
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const courseMap = catalogCourses.reduce<Record<string, any>>((acc: Record<string, any>, c: any) => {
            if (c.code) acc[c.code] = c;
            return acc;
        }, {});

        return computeDashboardMetrics({
            plan,
            courses: courseMap,
            requirements: allRequirements,
            validationReport,
        });
    }, [plan, catalogCourses, allRequirements, validationReport]);

    return metrics;
}

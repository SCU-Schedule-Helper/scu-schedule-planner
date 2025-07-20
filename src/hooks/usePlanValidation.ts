import { useMemo, useRef } from "react";
import { validatePlan } from "@lib/validation/engine";
import type {
    ValidationReport,
    ValidationSettings,
} from "@lib/validation/types";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import {
    CSMajorRequirements,
    UniversityCoreRequirements,
} from "@/data/requirements";
import { useShallow } from "zustand/shallow";
import type { Course } from "@/lib/types";

// Aggregate all requirements until dynamic selection is implemented
const ALL_REQUIREMENTS = [...CSMajorRequirements, ...UniversityCoreRequirements];

export function usePlanValidation(planOverride?: import("@/lib/types").UserPlan | null, settingsOverride?: Partial<ValidationSettings>) {
    const { plans, currentPlanId } = usePlannerStore(useShallow((s) => ({ plans: s.plans, currentPlanId: s.currentPlanId })));
    // Fetch catalog courses from Supabase via React Query
    const { data: catalogCourses = [] } = useCoursesQuery();
    const storePlan = plans.find((p) => p.id === currentPlanId);
    const plan = planOverride ?? storePlan;

    const settings = {
        maxUnitsPerQuarter: plan?.maxUnitsPerQuarter ?? 20,
        includeSummer: plan?.includeSummer ?? true,
        ...settingsOverride,
    } as ValidationSettings;

    const lastPlanKey = useRef<string | null>(null);

    // Memoized validation so it recalculates only when meaningful data changes
    const report = useMemo<ValidationReport | null>(() => {
        if (!plan) return null;
        const planKey = JSON.stringify({ q: plan.quarters, c: plan.completedCourses, max: settings.maxUnitsPerQuarter, summer: settings.includeSummer });
        // Store last planKey to avoid JSON.stringify cost if needed
        lastPlanKey.current = planKey;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const courseMap = catalogCourses.reduce<Record<string, Course>>((acc: Record<string, Course>, c: any) => {
                if (c.code) acc[c.code] = c;
                return acc;
            }, {});
            return validatePlan({
                courses: courseMap,
                requirements: ALL_REQUIREMENTS,
                plan,
                settings,
            });
        } catch (err) {
            console.error("Validation engine error", err);
            return null;
        }
    }, [plan ? plan.quarters : null, plan ? plan.completedCourses : null, settings.maxUnitsPerQuarter, settings.includeSummer, catalogCourses]);

    return report;
}

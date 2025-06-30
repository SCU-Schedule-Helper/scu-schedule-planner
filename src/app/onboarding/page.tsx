"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { OnboardingWizard } from "@/components/onboarding-wizard";
import { useRouter } from "next/navigation";
import { useCreatePlanMutation } from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";

export default function OnboardingPage() {
  const router = useRouter();
  const { userId, setUserId, addPlan, setCurrentPlan } = usePlannerStore();
  const createPlanMutation = useCreatePlanMutation();

  const handleComplete = (data: any) => {
    // Ensure we have a uuid userId. In a real app, this would come from Supabase auth session.
    let uid = userId;
    if (!uid) {
      uid = crypto.randomUUID();
      setUserId(uid);
    }

    // Persist selected major/emphasis in store for requirements page
    if (data.major?.id) {
      usePlannerStore.getState().setMajor(data.major.id);
    }
    if (data.emphasisAreas?.[0]?.id) {
      usePlannerStore.getState().setEmphasis(data.emphasisAreas[0].id);
    }

    const newPlan = {
      userId: uid,
      name: `Plan for ${data.major?.name ?? "My Major"}`,
      majorId: data.major?.id ?? "",
      emphasisId: data.emphasisAreas[0]?.id ?? undefined,
      catalogYearId: "current",
      maxUnitsPerQuarter: 20,
      includeSummer: false,
      quarters: [],
      completedCourses: data.completedCourses.map((c: any) => ({
        courseCode: c.code,
        quarter: "",
        status: "completed",
      })),
    };

    createPlanMutation.mutate(newPlan as any, {
      onSuccess: (plan) => {
        // Hydrate client store immediately
        addPlan(plan as any);
        if (plan.id) setCurrentPlan(plan.id);

        router.push(`/plans/${plan.id}`);
      },
    });
  };

  return <OnboardingWizard onComplete={handleComplete} />;
}

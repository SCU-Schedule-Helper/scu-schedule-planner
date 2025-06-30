"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePlansQuery } from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OnboardingWizard } from "@/components/onboarding-wizard";
import {
  useCreatePlanMutation,
  ApiUserPlanSchema,
} from "@/hooks/api/usePlanQuery";
import { z } from "zod";
import type { Course, UserPlan } from "@/lib/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Types for onboarding data
type OnboardingData = {
  major: { id: string; name: string; code: string } | null;
  emphasisAreas: {
    id: string;
    name: string;
    majorId: string;
    description?: string;
  }[];
  completedCourses: Course[];
};

export default function PlansIndexPage() {
  const { userId, setUserId, addPlan, setCurrentPlan } = usePlannerStore();
  const { data: plans = [], isLoading } = usePlansQuery(userId ?? "");
  const createPlanMutation = useCreatePlanMutation();

  const [showWizard, setShowWizard] = useState(false);

  const handleComplete = (data: OnboardingData) => {
    // Ensure user id
    let uid = userId;
    if (!uid) {
      uid = crypto.randomUUID();
      setUserId(uid);
    }

    // Store selections
    if (data.major?.id) {
      usePlannerStore.getState().setMajor(data.major.id);
    }
    if (data.emphasisAreas?.[0]?.id) {
      usePlannerStore.getState().setEmphasis(data.emphasisAreas[0].id);
    }

    type ApiUserPlan = z.infer<typeof ApiUserPlanSchema>;
    const completedCoursesForPlan = data.completedCourses
      .filter((c): c is Course & { code: string } => typeof c.code === "string")
      .map((c) => ({
        courseCode: c.code,
        quarter: "",
        status: "completed" as const,
      }));

    const newPlan: Omit<ApiUserPlan, "id"> = {
      userId: uid,
      name: `Plan for ${data.major?.name ?? "My Major"}`,
      majorId: data.major?.id ?? "",
      emphasisId: data.emphasisAreas[0]?.id ?? undefined,
      catalogYearId: "current",
      maxUnitsPerQuarter: 20,
      includeSummer: false,
      quarters: [],
      completedCourses: completedCoursesForPlan,
    };

    createPlanMutation.mutate(newPlan, {
      onSuccess: (plan) => {
        const planForStore: UserPlan = {
          id: plan.id,
          name: plan.name,
          majorId: plan.majorId,
          emphasisId: plan.emphasisId,
          catalogYearId: plan.catalogYearId,
          quarters: plan.quarters,
          completedCourses: plan.completedCourses,
          maxUnitsPerQuarter: plan.maxUnitsPerQuarter,
          includeSummer: plan.includeSummer,
        };

        addPlan(planForStore);
        if (plan.id) setCurrentPlan(plan.id);
        setShowWizard(false);
      },
    });
  };

  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1">
        <HeaderBar title="My Plans" />

        <main className="p-6 space-y-6">
          <div className="flex justify-end">
            <Dialog open={showWizard} onOpenChange={setShowWizard}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> New Plan
                </Button>
              </DialogTrigger>
              <VisuallyHidden>
                <DialogTitle />
              </VisuallyHidden>

              <DialogContent
                className="p-0 bg-transparent border-none max-w-4xl w-full"
                aria-describedby="onboarding-wizard-description"
              >
                {/* Wizard card already has its own card + background, so transparent dialog content */}
                <OnboardingWizard onComplete={handleComplete} />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground">You have no plans yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <Link href={`/plans/${plan.id}`} className="block h-full">
                    <CardHeader>
                      <CardTitle className="text-scu-cardinal">
                        {plan.name}
                      </CardTitle>
                      <CardDescription>
                        {plan.quarters.length} quarters •{" "}
                        {plan.completedCourses.length} completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Major: {plan.majorId}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

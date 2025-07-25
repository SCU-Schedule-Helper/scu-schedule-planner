"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import RequirementChecklist from "@/components/RequirementChecklist";
import { ProgressRing } from "@/components/progress-ring";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useMemo } from "react";
import {
  useUniversityRequirementsQuery,
  useMajorRequirementsQuery,
  useEmphasisRequirementsQuery,
} from "@/hooks/api/useRequirementsQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import type { RequirementGroup, UserPlan } from "@/lib/types";
import { usePlansQuery } from "@/hooks/api/usePlanQuery";

export default function RequirementsPage() {
  const { currentPlanId, plans, setCurrentPlan, addPlan, userId } =
    usePlannerStore();

  // Fetch plans from backend to hydrate store if necessary
  const { data: remotePlans = [] } = usePlansQuery(userId ?? "");

  useEffect(() => {
    if (plans.length === 0 && remotePlans.length) {
      remotePlans.forEach((p) => addPlan(p as UserPlan));
    }
  }, [plans.length, remotePlans, addPlan]);

  // ------------------------------------------------------------------
  // Helper – derive completed & planned course codes from current plan
  // ------------------------------------------------------------------
  const currentPlan = plans.find((p) => p.id === currentPlanId);

  const { data: universityData, isLoading: uniLoading } =
    useUniversityRequirementsQuery();
  const universityCore = universityData?.coreRequirements ?? [];
  const corePathways = universityData?.corePathways ?? [];
  const { data: majorRequirements = [], isLoading: majorLoading } =
    useMajorRequirementsQuery(currentPlan?.majorId);
  const { data: emphasisRequirements = [], isLoading: empLoading } =
    useEmphasisRequirementsQuery(currentPlan?.emphasisId || "");

  const completedCourseCodes: string[] =
    currentPlan?.completedCourses.map((c) => c.courseCode) ?? [];

  const _plannedCourseCodes: string[] = [];
  currentPlan?.quarters.forEach((q) => {
    q.courses.forEach((c) => _plannedCourseCodes.push(c.courseCode));
  });

  // Calculate percentage progress for a single requirement group
  const calcProgress = (req: RequirementGroup): number => {
    const required = (req.coursesRequired ?? req.courses ?? []) as (
      | string
      | { code: string }
    )[];
    const totalRequired = required.length + (req.chooseFrom?.count ?? 0);

    let completed = 0;

    // Required courses
    completed += required.filter((c) =>
      completedCourseCodes.includes(typeof c === "string" ? c : c.code)
    ).length;

    // choose-from options
    if (req.chooseFrom) {
      const chooseCompleted = (
        req.chooseFrom.options as (string | { code: string })[]
      ).filter((c) =>
        completedCourseCodes.includes(typeof c === "string" ? c : c.code)
      ).length;
      completed += Math.min(chooseCompleted, req.chooseFrom.count);
    }

    if (totalRequired === 0) return 100;
    return Math.round((completed / totalRequired) * 100);
  };

  // Enrich incoming requirement lists with progress once when they arrive
  const addProgress = (list: RequirementGroup[]): RequirementGroup[] =>
    list.map((r) => ({ ...r, progress: calcProgress(r) }));

  // Recompute requirement lists with progress each render; avoid state loops
  const uniReqs: RequirementGroup[] = useMemo(
    () => addProgress(universityCore),
    [universityCore, completedCourseCodes]
  );

  const pathwayReqs: RequirementGroup[] = useMemo(
    () => addProgress(corePathways),
    [corePathways, completedCourseCodes]
  );

  const majorReqs: RequirementGroup[] = useMemo(
    () => addProgress(majorRequirements),
    [majorRequirements, completedCourseCodes]
  );

  const emphasisReqs: RequirementGroup[] = useMemo(
    () => addProgress(emphasisRequirements),
    [emphasisRequirements, completedCourseCodes]
  );

  const calculateOverallProgress = (requirements: RequirementGroup[]) => {
    if (requirements.length === 0) return 0;
    return (
      requirements.reduce((sum, req) => sum + (req.progress ?? 0), 0) /
      requirements.length
    );
  };

  // Ensure a current plan is selected so RequirementChecklist can persist
  // completed-course changes. Pick the first available plan if none selected.
  useEffect(() => {
    if (!currentPlanId && plans.length && plans[0].id) {
      setCurrentPlan(plans[0].id);
    }
  }, [currentPlanId, plans, setCurrentPlan]);

  return (
    <div>
      <HeaderBar
        title="Requirements"
        actions={
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Plan:</span>
              <Select
                value={currentPlanId || ""}
                onValueChange={(value) => setCurrentPlan(value)}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id || ""}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        }
      />

      <main className="p-6">
        <Tabs defaultValue="university" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="university">University Core</TabsTrigger>
            <TabsTrigger value="major">Major</TabsTrigger>
            <TabsTrigger value="emphasis">Emphasis</TabsTrigger>
          </TabsList>

          <TabsContent value="university" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-scu-cardinal">
                      University Core Requirements
                    </CardTitle>
                    <CardDescription>
                      General education requirements for all students
                    </CardDescription>
                  </div>
                  <ProgressRing
                    progress={calculateOverallProgress(uniReqs)}
                    size={80}
                    strokeWidth={6}
                  >
                    <span className="text-sm font-bold text-scu-cardinal">
                      {Math.round(calculateOverallProgress(uniReqs))}%
                    </span>
                  </ProgressRing>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {uniLoading ? (
                  <p>Loading...</p>
                ) : (
                  <RequirementChecklist requirements={uniReqs} />
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-scu-cardinal">
                      Core Curriculum Pathways
                    </CardTitle>
                    <CardDescription>
                      Explore interdisciplinary pathways
                    </CardDescription>
                  </div>
                  <ProgressRing
                    progress={calculateOverallProgress(pathwayReqs)}
                    size={80}
                    strokeWidth={6}
                  >
                    <span className="text-sm font-bold text-scu-cardinal">
                      {Math.round(calculateOverallProgress(pathwayReqs))}%
                    </span>
                  </ProgressRing>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {uniLoading ? (
                  <p>Loading...</p>
                ) : (
                  <RequirementChecklist requirements={pathwayReqs} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="major" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-scu-cardinal">
                      Major Requirements
                    </CardTitle>
                    <CardDescription>
                      Major-specific requirements
                    </CardDescription>
                  </div>
                  <ProgressRing
                    progress={calculateOverallProgress(majorReqs)}
                    size={80}
                    strokeWidth={6}
                  >
                    <span className="text-sm font-bold text-scu-cardinal">
                      {Math.round(calculateOverallProgress(majorReqs))}%
                    </span>
                  </ProgressRing>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {majorLoading ? (
                  <p>Loading...</p>
                ) : (
                  <RequirementChecklist requirements={majorReqs} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emphasis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-scu-cardinal">
                      Emphasis Area Requirements
                    </CardTitle>
                    <CardDescription>
                      Requirements for your selected emphasis areas
                    </CardDescription>
                  </div>
                  <ProgressRing
                    progress={calculateOverallProgress(emphasisReqs)}
                    size={80}
                    strokeWidth={6}
                  >
                    <span className="text-sm font-bold text-scu-cardinal">
                      {Math.round(calculateOverallProgress(emphasisReqs))}%
                    </span>
                  </ProgressRing>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {empLoading ? (
                  <p>Loading...</p>
                ) : (
                  <RequirementChecklist requirements={emphasisReqs} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeaderBar } from "@/components/header-bar";
import { QuarterColumn } from "@/components/quarter-column";
import { ProgressRing } from "@/components/progress-ring";
import {
  useAddPlannedCourseMutation,
  useMovePlannedCourseMutation,
  usePlansQuery,
} from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import {
  GraduationCap,
  BookOpen,
  Target,
  LineChart as LineChartIcon,
} from "lucide-react";
import { AddCourseDialog } from "@/components/add-course-dialog";
import type { Quarter } from "@/lib/types";
import { useState, useEffect } from "react";
import { usePlanValidation } from "@/hooks/usePlanValidation";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboardMetrics } from "@/hooks/useDashboardMetrics";
import { UnitsLineChart } from "@/components/dashboard/UnitsLineChart";
import { RequirementBarChart } from "@/components/dashboard/RequirementBarChart";
import { AtRiskList } from "@/components/dashboard/AtRiskList";
import { PrereqDepthBarChart } from "@/components/dashboard/PrereqDepthBarChart";
import { usePrereqDepthData } from "@/hooks/usePrereqDepthData";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const {
    userId,
    addPlannedCourse,
    movePlannedCourse,
    removePlannedCourse,
    currentPlanId,
    plans: localPlans,
  } = usePlannerStore();
  const { data: serverPlans } = usePlansQuery(userId ?? "");

  // Effect to synchronize server state with local Zustand store
  useEffect(() => {
    if (serverPlans) {
      usePlannerStore.getState().setPlans(serverPlans);
    }
  }, [serverPlans]);

  // Prefer local (optimistically updated) plans from Zustand; fallback to server data
  const storePlan = currentPlanId
    ? localPlans.find((p) => p.id === currentPlanId)
    : localPlans[0];

  const serverPlan = serverPlans?.[0];

  const plan = storePlan ?? serverPlan;
  const quarters = plan?.quarters ?? [];

  const addPlannedCourseMutation = useAddPlannedCourseMutation();
  const movePlannedCourseMutation = useMovePlannedCourseMutation();

  // dialog state for adding course
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetQuarterId, setTargetQuarterId] = useState<string | null>(null);

  // Validation report for current plan (using store-backed plan for accurate optimistic updates)
  const validationReport = usePlanValidation();

  // ---- Dashboard metrics
  const metrics = useDashboardMetrics();

  const depthData = usePrereqDepthData();
  const router = useRouter();

  const handleAddCourse = async (quarterId: string) => {
    if (!plan?.id) return;

    setTargetQuarterId(quarterId);
    setDialogOpen(true);
  };

  const handleDropCourse = async (
    course: Parameters<typeof QuarterColumn>[0]["quarter"]["courses"][number],
    toQuarterId: string
  ) => {
    if (!plan?.id) return;

    const fromQuarterId = course.quarter;
    if (fromQuarterId === toQuarterId) return;

    movePlannedCourse(course.courseCode, fromQuarterId, toQuarterId); // optimistic local update

    try {
      // NOTE: quarterId is in the format 'fall-2025', etc.
      const [fromQuarter, fromYearString] = fromQuarterId.split("-");
      const fromYear = parseInt(fromYearString);
      const [toQuarter, toYearString] = toQuarterId.split("-");
      const toYear = parseInt(toYearString);

      const payload = {
        planId: plan.id,
        courseCode: course.courseCode,
        fromQuarter,
        fromYear,
        toQuarter,
        toYear,
      };
      await movePlannedCourseMutation.mutateAsync(payload);
    } catch {
      // Revert the optimistic update on failure
      movePlannedCourse(course.courseCode, toQuarterId, fromQuarterId);
    }
  };

  return (
    <div>
      <HeaderBar title="Dashboard" />

      <main className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Units Planned"
            value={metrics?.unitsPlanned ?? 0}
            icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
            valueClassName="text-scu-cardinal"
          />

          <StatCard
            title="Units Completed"
            value={metrics?.unitsCompleted ?? 0}
            icon={<GraduationCap className="h-4 w-4 text-muted-foreground" />}
            valueClassName="text-green-600"
            subtitle={`${metrics ? Math.round((metrics.unitsCompleted / (metrics.unitsCompleted + metrics.unitsPlanned || 1)) * 100) : 0}% of degree (units)`}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Requirements Progress
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-6">
              <ProgressRing
                progress={
                  metrics
                    ? Math.round(
                        metrics.requirementProgress.reduce(
                          (s, r) => s + r.progress,
                          0
                        ) / (metrics.requirementProgress.length || 1)
                      )
                    : 0
                }
                size={80}
                strokeWidth={6}
              >
                <span className="text-lg font-bold text-scu-cardinal">
                  {metrics
                    ? Math.round(
                        metrics.requirementProgress.reduce(
                          (s, r) => s + r.progress,
                          0
                        ) / (metrics.requirementProgress.length || 1)
                      )
                    : 0}
                  %
                </span>
              </ProgressRing>

              {/* Upper-division progress ring */}
              {metrics && (
                <ProgressRing
                  progress={Math.round(
                    (((metrics?.upperDivUnitsCompleted ?? 0) +
                      (metrics?.upperDivUnitsPlanned ?? 0)) /
                      (metrics?.upperDivUnitsNeeded || 60)) *
                      100
                  )}
                  size={60}
                  strokeWidth={6}
                >
                  <span className="text-sm font-semibold text-blue-600">
                    {metrics.upperDivUnitsCompleted +
                      metrics.upperDivUnitsPlanned}
                    /{metrics.upperDivUnitsNeeded}
                  </span>
                </ProgressRing>
              )}

              {/* Emphasis progress ring */}
              {metrics && metrics.emphasisNeeded > 0 && (
                <ProgressRing
                  progress={Math.round(
                    (metrics.emphasisCompleted / metrics.emphasisNeeded) * 100
                  )}
                  size={60}
                  strokeWidth={6}
                  className="ml-2"
                >
                  <span className="text-sm font-semibold text-purple-600">
                    {metrics.emphasisCompleted}/{metrics.emphasisNeeded}
                  </span>
                </ProgressRing>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Units per quarter chart */}
        {metrics && metrics.unitsByQuarter.length > 0 && (
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LineChartIcon className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-sm font-medium">
                  Unit Load by Quarter
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <UnitsLineChart data={metrics.unitsByQuarter} />
            </CardContent>
          </Card>
        )}

        {/* Requirement progress bar chart & risk list side-by-side */}
        {metrics && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-scu-cardinal">
                    Requirement Progress Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RequirementBarChart data={metrics.requirementProgress} />
                </CardContent>
              </Card>
            </div>
            <AtRiskList courseCodes={metrics.atRiskCourses} />
          </div>
        )}

        {/* Prerequisite Chain Depth Chart */}
        {metrics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-scu-cardinal">
                Prerequisite Chain Depth (Top 15)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PrereqDepthBarChart
                data={depthData}
                onSelectCourse={(code) =>
                  router.push(`/catalog?course=${encodeURIComponent(code)}`)
                }
              />
            </CardContent>
          </Card>
        )}

        {/* Quarterly Plan Board */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-scu-cardinal">
              Academic Plan
            </CardTitle>
            <CardDescription>
              Drag and drop courses between quarters to plan your schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {quarters.map((quarter: Quarter) => (
                <QuarterColumn
                  key={quarter.id}
                  quarter={quarter}
                  report={validationReport}
                  onDropCourse={handleDropCourse}
                  onAddCourse={handleAddCourse}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course search dialog */}
        <AddCourseDialog
          open={dialogOpen}
          onOpenChange={(open) => setDialogOpen(open)}
          onSelectCourse={async (courseCode) => {
            if (!plan?.id || !targetQuarterId) return;

            addPlannedCourse(courseCode, targetQuarterId);

            try {
              // Extract year from quarter ID (assuming format like "Fall-2023")
              const [quarterName, yearStr] = targetQuarterId.split("-");
              const year = parseInt(yearStr);

              await addPlannedCourseMutation.mutateAsync({
                planId: plan.id,
                courseCode,
                quarter: quarterName,
                year,
              });
            } catch {
              // Roll back optimistic update if request failed
              removePlannedCourse(courseCode, targetQuarterId);
            }
          }}
        />
      </main>
    </div>
  );
}

"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import { QuarterColumn } from "@/components/quarter-column";
import { ProgressRing } from "@/components/progress-ring";
import {
  useAddPlannedCourseMutation,
  useMovePlannedCourseMutation,
  usePlansQuery,
} from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { GraduationCap, BookOpen, Target } from "lucide-react";
import { AddCourseDialog } from "@/components/add-course-dialog";
import type { Quarter } from "@/lib/types";
import { useState } from "react";
import { usePlanValidation } from "@/hooks/usePlanValidation";

export default function DashboardPage() {
  const {
    userId,
    addPlannedCourse,
    movePlannedCourse,
    removePlannedCourse,
    currentPlanId,
    plans: localPlans,
  } = usePlannerStore();
  const { data: plans } = usePlansQuery(userId ?? "");

  // Prefer local (optimistically updated) plans from Zustand; fallback to server data
  const storePlan = currentPlanId
    ? localPlans.find((p) => p.id === currentPlanId)
    : localPlans[0];

  const serverPlan = plans?.[0];

  const plan = storePlan ?? serverPlan;
  const quarters = plan?.quarters ?? [];

  const addPlannedCourseMutation = useAddPlannedCourseMutation();
  const movePlannedCourseMutation = useMovePlannedCourseMutation();

  // dialog state for adding course
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetQuarterId, setTargetQuarterId] = useState<string | null>(null);

  // Validation report for current plan (using store-backed plan for accurate optimistic updates)
  const validationReport = usePlanValidation();

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

    await movePlannedCourseMutation.mutateAsync({
      planId: plan.id,
      courseCode: course.courseCode,
      fromQuarter: fromQuarterId,
      toQuarter: toQuarterId,
    });
  };

  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1">
        <HeaderBar title="Dashboard" />

        <main className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Units Planned
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-scu-cardinal">{0}</div>
                <p className="text-xs text-muted-foreground">
                  +4 from last quarter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Units Completed
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {/* TODO: fetch from plan */}
                </div>
                <p className="text-xs text-muted-foreground">0% of degree</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Requirements Progress
                </CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <ProgressRing progress={0} size={80} strokeWidth={6}>
                  <span className="text-lg font-bold text-scu-cardinal">
                    0%
                  </span>
                </ProgressRing>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Overall</div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                </div>
              </CardContent>
            </Card>
          </div>

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
                await addPlannedCourseMutation.mutateAsync({
                  planId: plan.id,
                  courseCode,
                  quarter: targetQuarterId,
                });
                setDialogOpen(false);
              } catch {
                // Roll back optimistic update if request failed

                removePlannedCourse(courseCode, targetQuarterId);
              }
            }}
          />
        </main>
      </div>
    </div>
  );
}

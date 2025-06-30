"use client";

import { useState, useEffect } from "react";
import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import { QuarterColumn } from "@/components/quarter-column";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePlanQuery } from "@/hooks/api/usePlanQuery";
import {
  useAddPlannedCourseMutation,
  useMovePlannedCourseMutation,
  useUpdatePlanMutation,
} from "@/hooks/api/usePlanQuery";
import { useParams } from "next/navigation";
import type { Quarter } from "@/lib/types";
import { Plus, Share, Settings } from "lucide-react";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { AddCourseDialog } from "@/components/add-course-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildQuarter, shiftQuarter, Season } from "@/lib/quarter";
import { PlanSettingsDialog } from "@/components/PlanSettingsDialog";

export default function PlanDetailPage() {
  const params = useParams();
  const planId =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const { data: plan, isLoading } = usePlanQuery(planId);

  // Zustand store actions for optimistic updates
  const { addPlannedCourse, movePlannedCourse } = usePlannerStore();

  const [quarters, setQuarters] = useState<Quarter[]>(plan?.quarters ?? []);
  const [planName] = useState(plan?.name ?? "Plan");

  const addPlannedCourseMutation = useAddPlannedCourseMutation();
  const movePlannedCourseMutation = useMovePlannedCourseMutation();
  const updatePlanMutation = useUpdatePlanMutation();

  // dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetQuarterId, setTargetQuarterId] = useState<string | null>(null);

  // settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Sync local quarters state when plan data arrives or updates
  useEffect(() => {
    if (plan?.quarters) {
      setQuarters(plan.quarters);
    }
  }, [plan?.quarters]);

  const addQuarter = async () => {
    if (!planId) return;

    const newQuarter: Quarter = {
      id: `quarter-${Date.now()}`,
      name: `New Quarter ${quarters.length + 1}`,
      year: 2025,
      season: "Fall",
      courses: [],
    };

    const updatedQuarters = [...quarters, newQuarter];
    // Optimistically update UI
    setQuarters(updatedQuarters);

    await updatePlanMutation.mutateAsync({
      planId,
      updates: { quarters: updatedQuarters },
    });
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm">
        <Share className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
        <Settings className="h-4 w-4 mr-2" />
        Settings
      </Button>
    </div>
  );

  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1">
        <HeaderBar title={planName} actions={headerActions} />

        <main className="p-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-scu-cardinal">
                Academic Plan Editor
              </CardTitle>
              <CardDescription>
                Drag and drop courses between quarters to organize your academic
                plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  quarters.map((quarter: Quarter) => (
                    <QuarterColumn
                      key={quarter.id}
                      quarter={quarter}
                      onDropCourse={async (course, toQuarterId) => {
                        if (!planId) return;

                        const fromQuarterId = course.quarter;
                        if (fromQuarterId === toQuarterId) return;

                        // optimistic local update
                        movePlannedCourse(
                          course.courseCode,
                          fromQuarterId,
                          toQuarterId
                        );

                        await movePlannedCourseMutation.mutateAsync({
                          planId,
                          courseCode: course.courseCode,
                          fromQuarter: fromQuarterId,
                          toQuarter: toQuarterId,
                        });
                      }}
                      onAddCourse={async (quarterId) => {
                        if (!planId) return;

                        setTargetQuarterId(quarterId);
                        setDialogOpen(true);
                      }}
                    />
                  ))
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <Button onClick={addQuarter} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quarter
                </Button>
              </div>

              {/* Course search dialog */}
              <AddCourseDialog
                open={dialogOpen}
                onOpenChange={(open) => setDialogOpen(open)}
                onSelectCourse={async (courseCode) => {
                  if (!planId || !targetQuarterId) return;

                  addPlannedCourse(courseCode, targetQuarterId); // optimistic

                  await addPlannedCourseMutation.mutateAsync({
                    planId,
                    courseCode,
                    quarter: targetQuarterId,
                  });

                  setDialogOpen(false);
                }}
              />

              {/* Plan settings dialog */}
              <PlanSettingsDialog
                open={settingsOpen}
                onOpenChange={setSettingsOpen}
                includeSummer={plan?.includeSummer ?? false}
                onChangeIncludeSummer={async (value) => {
                  if (!planId) return;

                  // optimistic? we can update plan state maybe later reload
                  await updatePlanMutation.mutateAsync({
                    planId,
                    updates: { includeSummer: value },
                  });
                }}
              />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}

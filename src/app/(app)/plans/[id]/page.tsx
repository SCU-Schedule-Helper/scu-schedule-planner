"use client";

import { useState, useEffect } from "react";
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
import type { Quarter, UserPlan } from "@/lib/types";
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
import { usePlanValidation } from "@/hooks/usePlanValidation";

/**
 * PlanDetailPage Component
 *
 * Main plan editor page with drag-and-drop course management and optimistic updates.
 * Handles quarter management, course movement, and real-time validation.
 *
 * Key Features:
 * - Optimistic UI updates for immediate feedback
 * - Server synchronization with rollback on errors
 * - Dynamic quarter addition (previous/next)
 * - Real-time validation integration
 * - Settings management for plan configuration
 */
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
  // These provide immediate UI feedback while server requests are in flight
  const {
    addPlannedCourse,
    movePlannedCourse,
    updatePlan: updatePlanStore,
    addPlan: addPlanToStore,
  } = usePlannerStore();

  // Local state for quarters to enable optimistic updates
  // This allows immediate UI changes while server sync happens in background
  const [quarters, setQuarters] = useState<Quarter[]>(plan?.quarters ?? []);
  const [planName] = useState(plan?.name ?? "Plan");

  // API mutation hooks for server operations
  const addPlannedCourseMutation = useAddPlannedCourseMutation();
  const movePlannedCourseMutation = useMovePlannedCourseMutation();
  const updatePlanMutation = useUpdatePlanMutation();

  // Dialog state management
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetQuarterId, setTargetQuarterId] = useState<string | null>(null);

  // Settings dialog state
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Validation report using the store-backed version of the plan so that
  // optimistic updates (e.g. marking a course completed) are reflected
  // immediately in prerequisite checks.
  const validationReport = usePlanValidation();

  // Sync local quarters state when plan data arrives or updates
  // This ensures UI stays in sync with server data and handles plan hydration
  useEffect(() => {
    if (plan?.quarters) {
      // Ensure quarter IDs are in the correct format (Season-Year)
      // This is important for drag-and-drop functionality and quarter identification
      const formattedQuarters = plan.quarters.map((quarter) => ({
        ...quarter,
        id: `${quarter.season}-${quarter.year}`,
        name: `${quarter.season} ${quarter.year}`,
      }));

      setQuarters(formattedQuarters);

      // Ensure global store stays in sync with latest server data
      // This prevents stale data issues and maintains consistency across components
      const existingPlans = usePlannerStore.getState().plans;
      const exists = existingPlans.some((p) => p.id === plan!.id);
      if (!exists) {
        addPlanToStore(plan as UserPlan); // cast since function expects UserPlan
      } else {
        updatePlanStore(plan!.id ?? "", {
          name: plan!.name,
          quarters: formattedQuarters,
          includeSummer: plan!.includeSummer,
        });
      }
    }
  }, [plan]);

  /**
   * Adds a new quarter to the plan (previous or next)
   * Uses optimistic updates for immediate UI feedback with server rollback on failure
   */
  const addQuarter = async (direction: "prev" | "next") => {
    if (!planId) return;

    // Reference quarter: first for prev, last for next
    // This determines where to insert the new quarter
    const reference =
      direction === "prev" ? quarters[0] : quarters[quarters.length - 1];

    if (!reference) return;

    // Calculate the new quarter metadata using the quarter utility functions
    const meta = shiftQuarter(
      {
        season: (reference.season as Season) ?? "Fall",
        year: reference.year ?? new Date().getFullYear(),
      },
      direction === "next" ? 1 : -1,
      plan?.includeSummer ?? true
    );

    const newQuarter = buildQuarter(meta);

    // Create updated quarters array with new quarter inserted
    const updatedQuarters =
      direction === "prev"
        ? [newQuarter, ...quarters]
        : [...quarters, newQuarter];

    // Optimistic UI update (local state + global store)
    // This provides immediate feedback while server request is in flight
    setQuarters(updatedQuarters);
    updatePlanStore(planId, { quarters: updatedQuarters });

    try {
      // Persist changes to server
      await updatePlanMutation.mutateAsync({
        planId,
        updates: { quarters: updatedQuarters },
      });
    } catch {
      // Revert optimistic updates on failure
      // This ensures UI stays consistent with server state
      setQuarters(quarters);
      updatePlanStore(planId, { quarters });
    }
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
    <div>
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
                    report={validationReport}
                    onDropCourse={async (course, toQuarterId) => {
                      if (!planId) return;

                      const fromQuarterId = course.quarter;
                      if (fromQuarterId === toQuarterId) return;

                      // Optimistic local update for immediate UI feedback
                      movePlannedCourse(
                        course.courseCode,
                        fromQuarterId,
                        toQuarterId
                      );

                      try {
                        // Parse source quarter (format: 'Summer-2025')
                        const [fromQuarter, fromYearString] =
                          fromQuarterId.split("-");
                        const fromYear = parseInt(fromYearString);

                        // Parse target quarter (format: 'Fall-2025')
                        const [toQuarter, toYearString] =
                          toQuarterId.split("-");
                        const toYear = parseInt(toYearString);

                        const payload = {
                          planId,
                          courseCode: course.courseCode,
                          fromQuarter,
                          fromYear,
                          toQuarter,
                          toYear,
                        };

                        // Persist changes to server
                        await movePlannedCourseMutation.mutateAsync(payload);
                      } catch {
                        // Revert optimistic update on failure
                        // This ensures UI stays consistent with server state
                        movePlannedCourse(
                          course.courseCode,
                          toQuarterId,
                          fromQuarterId
                        );
                      }
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Quarter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {quarters.length > 0 && (
                    <>
                      {/* Previous quarter option */}
                      <DropdownMenuItem onSelect={() => addQuarter("prev")}>
                        Previous (
                        {(() => {
                          const first = quarters[0];
                          const meta = shiftQuarter(
                            {
                              season: (first.season as Season) ?? "Fall",
                              year: first.year ?? new Date().getFullYear(),
                            },
                            -1,
                            plan?.includeSummer ?? true
                          );
                          return `${meta.season} ${meta.year}`;
                        })()}
                        )
                      </DropdownMenuItem>
                      {/* Next quarter option */}
                      <DropdownMenuItem onSelect={() => addQuarter("next")}>
                        Next (
                        {(() => {
                          const last = quarters[quarters.length - 1];
                          const meta = shiftQuarter(
                            {
                              season: (last.season as Season) ?? "Fall",
                              year: last.year ?? new Date().getFullYear(),
                            },
                            1,
                            plan?.includeSummer ?? true
                          );
                          return `${meta.season} ${meta.year}`;
                        })()}
                        )
                      </DropdownMenuItem>
                    </>
                  )}
                  {quarters.length === 0 && (
                    <DropdownMenuItem onSelect={() => addQuarter("next")}>
                      Add Initial Quarter
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Course search dialog */}
            <AddCourseDialog
              open={dialogOpen}
              onOpenChange={(open) => setDialogOpen(open)}
              onSelectCourse={async (courseCode) => {
                if (!planId || !targetQuarterId) return;

                addPlannedCourse(courseCode, targetQuarterId); // optimistic

                try {
                  // Extract year from targetQuarterId (format: '2025-spring', '2026-fall', etc.)
                  const year = parseInt(targetQuarterId.split("-")[0]);
                  const quarter = targetQuarterId.split("-")[1];

                  await addPlannedCourseMutation.mutateAsync({
                    planId,
                    courseCode,
                    quarter,
                    year,
                  });
                } catch {
                  // Roll back on failure
                  const { removePlannedCourse } = usePlannerStore.getState();
                  removePlannedCourse(courseCode, targetQuarterId);
                }
              }}
            />

            {/* Plan settings dialog */}
            <PlanSettingsDialog
              open={settingsOpen}
              onOpenChange={setSettingsOpen}
              includeSummer={plan?.includeSummer ?? false}
              onChangeIncludeSummer={async (value) => {
                if (!planId) return;

                // Update both server and local store so dashboards stay in sync
                await updatePlanMutation.mutateAsync({
                  planId,
                  updates: { includeSummer: value },
                });

                updatePlanStore(planId, { includeSummer: value });
              }}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

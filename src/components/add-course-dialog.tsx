"use client";

import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { useDebounce } from "use-debounce";
import type { Course } from "@/lib/types";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { useShallow } from "zustand/shallow";
import {
  CSMajorRequirements,
  UniversityCoreRequirements,
} from "@/data/requirements";

interface AddCourseDialogProps {
  /** Controls dialog visibility */
  open: boolean;
  /** Called whenever visibility should change */
  onOpenChange: (open: boolean) => void;
  /** Invoked when user picks a course */
  onSelectCourse: (courseCode: string) => void;
}

export function AddCourseDialog({
  open,
  onOpenChange,
  onSelectCourse,
}: AddCourseDialogProps) {
  const [search, setSearch] = useState("");
  // Debounce user input to avoid firing queries on every keystroke
  const [debouncedSearch] = useDebounce(search, 200);

  // ------------------------------------------------------------
  // Catalog search (remote) – only when at least 2 characters
  // ------------------------------------------------------------

  const { data: rawResults = [], isLoading: isSearching } = useCoursesQuery(
    debouncedSearch.length >= 2 ? debouncedSearch : undefined
  );

  // Full catalog (cached) for default list when search box is empty / <2 chars
  const { data: catalogCourses = [], isLoading: isCatalogLoading } =
    useCoursesQuery();

  // ------------------------------------------------------------
  // Planner state – identify planned & completed courses
  // ------------------------------------------------------------

  const { plans, currentPlanId } = usePlannerStore(
    useShallow((s) => ({ plans: s.plans, currentPlanId: s.currentPlanId }))
  );

  const activePlan = currentPlanId
    ? plans.find((p) => p.id === currentPlanId)
    : plans[0];

  const takenOrPlanned = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activePlan) return set;

    activePlan.completedCourses.forEach((c) => set.add(c.courseCode));
    activePlan.quarters.forEach((q) =>
      q.courses.forEach((c) => set.add(c.courseCode))
    );
    return set;
  }, [activePlan]);

  // ------------------------------------------------------------
  // Requirement-driven filtering – include only courses required
  // by non-emphasis requirement groups that are not yet satisfied.
  // ------------------------------------------------------------

  const requirementCourseSet = useMemo<Set<string>>(() => {
    const groups = [...CSMajorRequirements, ...UniversityCoreRequirements];
    const set = new Set<string>();
    groups.forEach((g) => {
      g.coursesRequired?.forEach((c) => set.add(c));
      g.chooseFrom?.options?.forEach((c) => set.add(c));
    });
    return set;
  }, []);

  const sourceCourses: Course[] =
    debouncedSearch.length >= 2 ? rawResults : catalogCourses;

  const results = useMemo(() => {
    return (
      sourceCourses
        // Remove courses already taken or planned
        .filter((course: Course) => {
          const code = course.code ?? "";
          if (!code) return false;
          return !takenOrPlanned.has(code);
        })
        // Sort: required courses first, then optional; within each group sort by code
        .sort((a: Course, b: Course) => {
          const aReq = requirementCourseSet.has(a.code ?? "");
          const bReq = requirementCourseSet.has(b.code ?? "");
          if (aReq === bReq) {
            return (a.code ?? "").localeCompare(b.code ?? "");
          }
          return aReq ? -1 : 1; // required first
        })
    );
  }, [sourceCourses, takenOrPlanned, requirementCourseSet]);

  const handleSelect = (code: string) => {
    onSelectCourse(code);
    // Reset search input so the user can quickly add another course without closing the dialog
    setSearch("");
  };

  // combine empty state for zero results once user typed (after debounce)
  const isLoading =
    debouncedSearch.length >= 2 ? isSearching : isCatalogLoading;

  const showEmpty =
    !isLoading && debouncedSearch.length >= 2 && results.length === 0;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      /* portal container auto-handled */
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Course</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Type course code or title..."
            value={search}
            onValueChange={setSearch}
            autoFocus
          />
          <CommandList className="max-h-60 overflow-y-auto">
            {isLoading && (
              <div className="py-2 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}
            {showEmpty && <CommandEmpty>No courses found.</CommandEmpty>}
            {results.map((course: Course) => (
              <CommandItem
                key={course.code}
                value={course.code ?? ""}
                onSelect={() => handleSelect(course.code ?? "")}
              >
                <span className="font-medium text-scu-cardinal">
                  {course.code}
                </span>{" "}
                <span className="text-muted-foreground ml-2 truncate">
                  {course.title}
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

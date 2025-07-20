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

/**
 * AddCourseDialog Component
 *
 * A searchable dialog for adding courses to academic plans with intelligent filtering
 * and requirement-driven prioritization.
 *
 * Key Features:
 * - Debounced search to avoid excessive API calls
 * - Filters out already planned/completed courses
 * - Prioritizes courses that fulfill requirements
 * - Shows full catalog when search is empty
 * - Resets search after selection for quick multiple additions
 */
export function AddCourseDialog({
  open,
  onOpenChange,
  onSelectCourse,
}: AddCourseDialogProps) {
  const [search, setSearch] = useState("");
  // Debounce user input to avoid firing queries on every keystroke
  // This improves performance and reduces API load
  const [debouncedSearch] = useDebounce(search, 200);

  // ------------------------------------------------------------
  // Catalog search (remote) – only when at least 2 characters
  // ------------------------------------------------------------

  // Search API call - only triggered when user types 2+ characters
  // This prevents unnecessary API calls for single character inputs
  const { data: rawResults = [], isLoading: isSearching } = useCoursesQuery(
    debouncedSearch.length >= 2 ? debouncedSearch : undefined
  );

  // Full catalog (cached) for default list when search box is empty / <2 chars
  // This provides a good starting point and shows all available courses
  const { data: catalogCourses = [], isLoading: isCatalogLoading } =
    useCoursesQuery();

  // ------------------------------------------------------------
  // Planner state – identify planned & completed courses
  // ------------------------------------------------------------

  // Get current plan to identify courses that shouldn't be shown again
  const { plans, currentPlanId } = usePlannerStore(
    useShallow((s) => ({ plans: s.plans, currentPlanId: s.currentPlanId }))
  );

  const activePlan = currentPlanId
    ? plans.find((p) => p.id === currentPlanId)
    : plans[0];

  // Create a set of all course codes that are already taken or planned
  // This prevents duplicate course additions and provides better UX
  const takenOrPlanned = useMemo<Set<string>>(() => {
    const set = new Set<string>();
    if (!activePlan) return set;

    // Include completed courses
    activePlan.completedCourses.forEach((c) => set.add(c.courseCode));
    // Include planned courses across all quarters
    activePlan.quarters.forEach((q) =>
      q.courses.forEach((c) => set.add(c.courseCode))
    );
    return set;
  }, [activePlan]);

  // ------------------------------------------------------------
  // Requirement-driven filtering – include only courses required
  // by non-emphasis requirement groups that are not yet satisfied.
  // ------------------------------------------------------------

  // Build a set of course codes that fulfill major or university requirements
  // This helps prioritize courses that are actually needed for graduation
  const requirementCourseSet = useMemo<Set<string>>(() => {
    const groups = [...CSMajorRequirements, ...UniversityCoreRequirements];
    const set = new Set<string>();
    groups.forEach((g) => {
      // Include directly required courses
      g.coursesRequired?.forEach((c) => set.add(c));
      // Include courses from "choose from" options
      g.chooseFrom?.options?.forEach((c) => set.add(c));
    });
    return set;
  }, []);

  // Choose data source based on search state
  // Use search results when user is actively searching, otherwise show full catalog
  const sourceCourses: Course[] =
    debouncedSearch.length >= 2 ? rawResults : catalogCourses;

  // Apply filtering and sorting to create the final course list
  const results = useMemo(() => {
    return (
      sourceCourses
        // Remove courses already taken or planned to avoid duplicates
        .filter((course: Course) => {
          const code = course.code ?? "";
          if (!code) return false;
          return !takenOrPlanned.has(code);
        })
        // Sort: required courses first, then optional; within each group sort by code
        // This helps users find courses they actually need for their degree
        .sort((a: Course, b: Course) => {
          const aReq = requirementCourseSet.has(a.code ?? "");
          const bReq = requirementCourseSet.has(b.code ?? "");
          if (aReq === bReq) {
            return (a.code ?? "").localeCompare(b.code ?? "");
          }
          return aReq ? -1 : 1; // required courses first
        })
    );
  }, [sourceCourses, takenOrPlanned, requirementCourseSet]);

  // Handle course selection and reset search for quick multiple additions
  const handleSelect = (code: string) => {
    onSelectCourse(code);
    // Reset search input so the user can quickly add another course without closing the dialog
    setSearch("");
  };

  // Determine loading state based on search activity
  const isLoading =
    debouncedSearch.length >= 2 ? isSearching : isCatalogLoading;

  // Show empty state only when user has searched and no results found
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

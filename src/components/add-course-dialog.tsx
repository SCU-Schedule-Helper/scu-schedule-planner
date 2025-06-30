"use client";

import { useState } from "react";
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
import { useSearchCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { useDebounce } from "use-debounce";
import type { Course } from "@/lib/types";

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

  // Only fire FTS when at least 2 chars
  const { data: results = [], isLoading } = useSearchCoursesQuery(
    debouncedSearch.length >= 2 ? debouncedSearch : null
  );

  const handleSelect = (code: string) => {
    onSelectCourse(code);
    // reset input & close
    setSearch("");
    onOpenChange(false);
  };

  // combine empty state for zero results once user typed (after debounce)
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
        <Command className="overflow-visible">
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

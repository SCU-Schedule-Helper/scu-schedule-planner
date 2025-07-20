"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "./course-card";
import type { Quarter, PlannedCourse, Course } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { useMemo } from "react";
import type { ValidationReport } from "@/lib/validation/types";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { calculateTotalUnits, formatUnits } from "@/lib/types";

interface QuarterColumnProps {
  quarter: Quarter;
  report?: ValidationReport | null;
  onDropCourse?: (course: PlannedCourse, quarterId: string) => void;
  onAddCourse?: (quarterId: string) => void;
  className?: string;
}

export function QuarterColumn({
  quarter,
  report,
  onDropCourse,
  onAddCourse,
  className,
}: QuarterColumnProps) {
  const { data: allCourses = [] } = useCoursesQuery();

  // Map course code to full course details for quick lookup
  const courseMap = useMemo(() => {
    const map: Record<string, Partial<Course>> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    allCourses.forEach((c: any) => {
      if (c.code) {
        map[c.code] = c;
      }
    });
    return map;
  }, [allCourses]);

  // Enrich the quarter courses with catalog details (title, units, etc.)
  const enrichedCourses = useMemo(() => {
    return quarter.courses.map((course) => {
      const catalog = courseMap[course.courseCode] || {};
      return {
        ...course,
        code: course.code ?? catalog.code ?? course.courseCode,
        title: course.title ?? catalog.title,
        units: catalog.units ?? undefined, // Always use catalog units
      };
    });
  }, [quarter.courses, courseMap]);

  // Calculate total units using the new utility function
  const totalUnits = useMemo(() => {
    return calculateTotalUnits(enrichedCourses);
  }, [enrichedCourses]);

  // Format units for display
  const totalUnitsDisplay = useMemo(() => {
    const units = totalUnits.toString();
    return formatUnits(units);
  }, [totalUnits]);

  // determine if over-unit warning exists from validation report
  const overUnit = report?.messages.some(
    (m) => m.code === "OVER_UNIT_LOAD" && m.context?.quarter === quarter.name
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const courseData = e.dataTransfer.getData("text/plain");
    if (courseData && onDropCourse) {
      const course = JSON.parse(courseData) as PlannedCourse;
      const quarterId = `${quarter.season}-${quarter.year}`;
      onDropCourse(course, quarterId);
    }
  };

  return (
    <Card className={cn("h-fit min-h-[400px]", className)}>
      <CardHeader className="pb-3">
        <CardTitle
          className={cn(
            "text-lg font-semibold flex items-center justify-between",
            overUnit ? "text-red-600" : "text-scu-cardinal"
          )}
        >
          <span>{quarter.name}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className={cn(
                    "text-sm font-normal flex items-center gap-1",
                    overUnit ? "text-red-600" : "text-muted-foreground"
                  )}
                >
                  {overUnit && <AlertCircle className="w-4 h-4" />}
                  {totalUnitsDisplay}
                </span>
              </TooltipTrigger>
              {overUnit && (
                <TooltipContent side="bottom">
                  Quarter exceeds maximum allowed unit load.
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-2 min-h-[300px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {enrichedCourses.map((course, index) => {
          const key = `${course.courseCode ?? course.code ?? "unknown"}-${index}`;
          return (
            <CourseCard
              key={key}
              course={course}
              quarter={quarter}
              report={report}
            />
          );
        })}
        {enrichedCourses.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-sm">Drop courses here</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground hover:text-scu-cardinal"
          onClick={() => {
            const quarterId = `${quarter.season}-${quarter.year}`;
            onAddCourse?.(quarterId);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </CardContent>
    </Card>
  );
}

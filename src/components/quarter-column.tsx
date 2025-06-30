"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CourseCard } from "./course-card";
import type { Quarter, PlannedCourse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuarterColumnProps {
  quarter: Quarter;
  onDropCourse?: (course: PlannedCourse, quarterId: string) => void;
  onAddCourse?: (quarterId: string) => void;
  className?: string;
}

export function QuarterColumn({
  quarter,
  onDropCourse,
  onAddCourse,
  className,
}: QuarterColumnProps) {
  const totalUnits = quarter.courses.reduce(
    (sum, course) => sum + (course.units ?? 0),
    0
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const courseData = e.dataTransfer.getData("text/plain");
    if (courseData && onDropCourse) {
      const course = JSON.parse(courseData) as PlannedCourse;
      onDropCourse(course, quarter.id);
    }
  };

  return (
    <Card className={cn("h-fit min-h-[400px]", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-scu-cardinal flex items-center justify-between">
          <span>{quarter.name}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {totalUnits} units
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent
        className="space-y-2 min-h-[300px]"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {quarter.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
        {quarter.courses.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <p className="text-muted-foreground text-sm">Drop courses here</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2 text-muted-foreground hover:text-scu-cardinal"
          onClick={() => onAddCourse?.(quarter.id)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </Button>
      </CardContent>
    </Card>
  );
}

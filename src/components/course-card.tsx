"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlannedCourse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle, Clock, BookOpen } from "lucide-react";

interface CourseCardProps {
  course: PlannedCourse;
  isDragging?: boolean;
  className?: string;
}

export function CourseCard({ course, isDragging, className }: CourseCardProps) {
  const statusIcons = {
    completed: CheckCircle,
    "in-progress": Clock,
    planned: BookOpen,
    not_started: BookOpen,
  } as const;

  const statusColors = {
    completed: "bg-green-100 text-green-800 border-green-200",
    "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
    planned: "bg-gray-100 text-gray-800 border-gray-200",
    not_started: "bg-gray-100 text-gray-800 border-gray-200",
  } as const;

  // Fallback to "planned" if planStatus is undefined
  const planStatus = course.planStatus ?? "planned";
  const StatusIcon = statusIcons[planStatus];

  return (
    <Card
      className={cn(
        "cursor-move transition-all duration-200 hover:shadow-md",
        isDragging && "opacity-50 rotate-2",
        course.planStatus === "completed" && "bg-green-50",
        className
      )}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", JSON.stringify(course));
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-scu-cardinal">
              {course.code ?? course.courseCode}
            </h4>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {course.title}
            </p>
          </div>
          <Badge variant="secondary" className="ml-2 text-xs">
            {course.units !== undefined ? `${course.units}u` : "—"}
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={cn("text-xs", statusColors[planStatus])}
          >
            <StatusIcon className="w-3 h-3 mr-1" />
            {planStatus.replace("-", " ")}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

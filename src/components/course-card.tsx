"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlannedCourse } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  BookOpen,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import type { ValidationReport } from "@/lib/validation/types";
import { formatUnits } from "@/lib/types";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import type { Quarter } from "@/lib/types";

interface CourseCardProps {
  course: PlannedCourse;
  quarter: Quarter;
  report?: ValidationReport | null;
  isDragging?: boolean;
  className?: string;
}

function getValidationSeverity(
  report: ValidationReport | null | undefined,
  code?: string
): "error" | "warning" | undefined {
  if (!report || !code) return undefined;
  const cr = report.courseReports[code];
  if (!cr) return undefined;
  const hasError = cr.messages.some((m) => m.level === "error");
  if (hasError) return "error";
  const hasWarn = cr.messages.some((m) => m.level === "warning");
  return hasWarn ? "warning" : undefined;
}

export function CourseCard({
  course,
  quarter,
  report,
  isDragging,
  className,
}: CourseCardProps) {
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

  const severity = getValidationSeverity(
    report,
    course.courseCode ?? course.code
  );

  const validationMessages =
    (course &&
      report?.courseReports[course.courseCode ?? course.code ?? ""]
        ?.messages) ??
    [];

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "relative cursor-move transition-all duration-200 hover:shadow-md",
              isDragging && "opacity-50 rotate-2",
              course.planStatus === "completed" && "bg-green-50",
              severity === "error" && "border-2 border-red-500",
              severity === "warning" && "border-2 border-yellow-400",
              className
            )}
            draggable
            onDragStart={(e) => {
              // Ensure the quarter format is correct for the drag operation.
              const courseData = {
                ...course,
                quarter: `${quarter.season}-${quarter.year}`,
              };
              e.dataTransfer.setData("text/plain", JSON.stringify(courseData));
            }}
          >
            {/* Icon overlay */}
            {severity && (
              <div className="absolute top-1 right-1">
                {severity === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
              </div>
            )}
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
                  <div className="text-sm text-muted-foreground">
                    {course.units ? formatUnits(course.units) : "—"}
                  </div>
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
        </TooltipTrigger>
        {validationMessages.length > 0 && (
          <TooltipContent side="bottom" className="max-w-xs">
            <ul className="list-disc pl-4 space-y-1">
              {validationMessages.map((m, idx) => (
                <li
                  key={idx}
                  className={cn(
                    m.level === "error" ? "text-red-600" : "text-yellow-700"
                  )}
                >
                  {m.message}
                </li>
              ))}
            </ul>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

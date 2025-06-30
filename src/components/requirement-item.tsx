"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import type { Requirement } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen } from "lucide-react";

interface RequirementItemProps {
  requirement: Requirement;
  onToggle?: (requirementId: string) => void;
  className?: string;
}

export function RequirementItem({
  requirement,
  onToggle,
  className,
}: RequirementItemProps) {
  return (
    <div className={cn("space-y-2 p-3 border rounded-lg", className)}>
      <div className="flex items-start space-x-3">
        <Checkbox
          checked={requirement.completed}
          onCheckedChange={() => onToggle?.(requirement.id ?? "")}
          className="mt-1"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4
              className={cn(
                "font-medium",
                requirement.completed && "line-through text-muted-foreground"
              )}
            >
              {requirement.name}
            </h4>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Courses
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h5 className="font-medium">Required Courses</h5>
                  <div className="space-y-1">
                    {(
                      requirement.courses ??
                      requirement.coursesRequired ??
                      []
                    ).map((course, idx) => (
                      <Badge
                        key={String(idx)}
                        variant="outline"
                        className="mr-2"
                      >
                        {course}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {requirement.description}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {requirement.progress ?? 0}% (
                {requirement.unitsRequired ?? requirement.minUnits ?? 0} units
                required)
              </span>
            </div>
            <Progress value={requirement.progress} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

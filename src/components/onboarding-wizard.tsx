"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  useMajorsQuery,
  useEmphasisAreasQuery,
} from "@/hooks/api/useOnboardingQuery";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import type { Course } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OnboardingWizardProps {
  onComplete: (data: {
    major: SimpleMajor | null;
    emphasisAreas: SimpleEmphasisArea[];
    completedCourses: Course[];
  }) => void;
}

// Simplified DTOs from onboarding endpoints
type SimpleMajor = { id: string; name: string; code: string };
type SimpleEmphasisArea = {
  id: string;
  name: string;
  majorId: string;
  description?: string;
};

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedMajor, setSelectedMajor] = useState<SimpleMajor | null>(null);
  const [selectedEmphasisAreas, setSelectedEmphasisAreas] = useState<
    SimpleEmphasisArea[]
  >([]);
  const [completedCourses, setCompletedCourses] = useState<Course[]>([]);

  const { data: majors = [] } = useMajorsQuery();
  const { data: emphasisAreas = [] } = useEmphasisAreasQuery(selectedMajor?.id);
  const { data: courses = [] } = useCoursesQuery();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete({
        major: selectedMajor,
        emphasisAreas: selectedEmphasisAreas,
        completedCourses,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleEmphasisArea = (area: SimpleEmphasisArea) => {
    setSelectedEmphasisAreas((prev) =>
      prev.find((a) => a.id === area.id)
        ? prev.filter((a) => a.id !== area.id)
        : [...prev, area]
    );
  };

  const toggleCompletedCourse = (course: Course) => {
    setCompletedCourses((prev) =>
      prev.find((c) => c.id === course.id)
        ? prev.filter((c) => c.id !== course.id)
        : [...prev, course]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedMajor !== null;
      case 2:
        return true; // Emphasis areas are optional
      case 3:
        return true; // Completed courses are optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-scu-light-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <CardTitle className="text-xl text-scu-cardinal">
                  Select Your Major
                </CardTitle>
                <CardDescription>
                  Choose your primary area of study
                </CardDescription>
              </div>
              <Select
                onValueChange={(value) => {
                  const major = majors.find((m) => m.id === value);
                  // Convert Major to SimpleMajor by extracting only the required fields
                  setSelectedMajor(major ? { 
                    id: major.id, 
                    name: major.name, 
                    code: '' // Using empty string as fallback since we don't have deptCode in Major type
                  } : null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a major" />
                </SelectTrigger>
                <SelectContent>
                  {majors.map((major) => (
                    <SelectItem key={major.id} value={major.id}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <CardTitle className="text-xl text-scu-cardinal">
                  Choose Emphasis Areas
                </CardTitle>
                <CardDescription>
                  Select any areas of specialization (optional)
                </CardDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emphasisAreas
                  .filter((area) => area.appliesTo === selectedMajor?.id)
                  .map((area) => {
                    // Convert Emphasis to SimpleEmphasisArea
                    const simpleArea = {
                      id: area.id,
                      name: area.name,
                      majorId: area.appliesTo || '',
                      description: area.description
                    };
                    
                    return (
                      <div
                        key={area.id}
                        className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => toggleEmphasisArea(simpleArea)}
                      >
                        <Checkbox
                          checked={selectedEmphasisAreas.some(
                            (a) => a.id === area.id
                          )}
                          onChange={() => toggleEmphasisArea(simpleArea)}
                        />
                        <div>
                          <h4 className="font-medium">{area.name}</h4>
                          {area.description && (
                            <p className="text-sm text-muted-foreground">
                              {area.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
              {selectedEmphasisAreas.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">Selected:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmphasisAreas.map((area) => (
                      <Badge key={area.id} variant="secondary">
                        {area.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <CardTitle className="text-xl text-scu-cardinal">
                  Import Completed Courses
                </CardTitle>
                <CardDescription>
                  Select courses you have already completed (optional)
                </CardDescription>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {courses.map((course: any) => (
                  <div
                    key={course.id}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleCompletedCourse(course)}
                  >
                    <Checkbox
                      checked={completedCourses.some((c) => c.id === course.id)}
                      onChange={() => toggleCompletedCourse(course)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{course.code}</h4>
                        <Badge variant="outline">{course.units}u</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {course.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {completedCourses.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium">
                    Selected ({completedCourses.length} courses):
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {completedCourses.map((course) => (
                      <Badge key={course.id} variant="secondary">
                        {course.code}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="scu-gradient text-white"
            >
              {currentStep === totalSteps ? "Complete Setup" : "Next"}
              {currentStep < totalSteps && (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

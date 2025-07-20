import { useCourseQuery } from "@/hooks/api/useCoursesQuery";
import { useAddPlannedCourseMutation } from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatUnits } from "@/lib/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CourseDetailProps {
  courseCode: string;
  onClose: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseCode, onClose }) => {
  const { currentPlanId, plans } = usePlannerStore();
  const { data: course, isLoading, error } = useCourseQuery(courseCode);

  const addPlannedMutation = useAddPlannedCourseMutation();

  const currentPlan = currentPlanId
    ? plans.find((p) => p.id === currentPlanId)
    : null;

  const handleAddToPlan = async (quarter: string) => {
    if (!currentPlanId) return;

    try {
      await addPlannedMutation.mutateAsync({
        planId: currentPlanId,
        courseCode,
        quarter,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error("Error adding course to plan:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Failed to load course details"}
          </AlertDescription>
        </Alert>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Back to list
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-4 border rounded-lg">
        <p className="text-red-500">Course not found</p>
        <Button onClick={onClose} variant="outline" className="mt-4">
          Back to list
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{course.code}</h3>
          <h4 className="text-lg">{course.title}</h4>
          <div className="text-sm text-gray-600">
            {course.units ? formatUnits(course.units) : "Variable units"}
          </div>
        </div>

        <Button onClick={onClose} variant="outline" className="mt-4">
          Back to list
        </Button>
      </div>

      {course.description && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Description</h4>
          <p className="text-gray-700">{course.description}</p>
        </div>
      )}

      {course.prerequisites && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Prerequisites</h4>
          <div className="flex flex-wrap gap-2">
            {(() => {
              try {
                // Prerequisites are now JSONB arrays
                const prereqs = Array.isArray(course.prerequisites)
                  ? course.prerequisites
                  : JSON.parse(course.prerequisites);

                return prereqs.map((prereq: unknown, index: number) => {
                  // Handle different prereq formats
                  let displayText = "";
                  if (typeof prereq === "string") {
                    displayText = prereq;
                  } else if (
                    prereq &&
                    typeof prereq === "object" &&
                    "courses" in prereq
                  ) {
                    const courses = (prereq as { courses?: string[] }).courses;
                    displayText =
                      courses?.join(" & ") || JSON.stringify(prereq);
                  } else {
                    displayText = JSON.stringify(prereq);
                  }

                  return (
                    <Badge key={index} variant="secondary">
                      {displayText}
                    </Badge>
                  );
                });
              } catch (error) {
                console.warn("Error parsing prerequisites:", error);
                return [];
              }
            })()}
          </div>
        </div>
      )}

      {course.corequisites && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Corequisites</h4>
          <div className="flex flex-wrap gap-2">
            {(() => {
              try {
                // Corequisites are now JSONB arrays
                const coreqs = Array.isArray(course.corequisites)
                  ? course.corequisites
                  : JSON.parse(course.corequisites);

                return coreqs.map((coreq: unknown, index: number) => {
                  let displayText = "";
                  if (typeof coreq === "string") {
                    displayText = coreq;
                  } else if (
                    coreq &&
                    typeof coreq === "object" &&
                    "courses" in coreq
                  ) {
                    const courses = (coreq as { courses?: string[] }).courses;
                    displayText = courses?.join(" & ") || JSON.stringify(coreq);
                  } else {
                    displayText = JSON.stringify(coreq);
                  }

                  return (
                    <Badge key={index} variant="secondary">
                      {displayText}
                    </Badge>
                  );
                });
              } catch (error) {
                console.warn("Error parsing corequisites:", error);
                return [];
              }
            })()}
          </div>
        </div>
      )}

      {course.professor && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Professors</h4>
          <p className="text-gray-700">{course.professor}</p>
        </div>
      )}

      {course.quarters_offered && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">When Offered</h4>
          <div className="text-gray-700">
            {(() => {
              try {
                // Quarters offered are now JSONB arrays
                const schedule = Array.isArray(course.quarters_offered)
                  ? course.quarters_offered
                  : JSON.parse(course.quarters_offered);

                if (Array.isArray(schedule)) {
                  return schedule.join(", ");
                }
                return String(course.quarters_offered);
              } catch {
                return String(course.quarters_offered);
              }
            })()}
          </div>
        </div>
      )}

      {currentPlan && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Add to Plan</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {["Fall", "Winter", "Spring", "Summer"].map((quarter) => (
              <Button
                key={quarter}
                onClick={() => handleAddToPlan(quarter)}
                variant="outline"
                size="sm"
                disabled={addPlannedMutation.isPending}
              >
                {quarter}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

import { useState } from "react";
import { RequirementGroup } from "@/lib/types";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import {
  useAddCompletedCourseMutation,
  useRemoveCompletedCourseMutation,
} from "@/hooks/api/usePlanQuery";
import { Checkbox } from "@/components/ui/checkbox";

interface RequirementChecklistProps {
  requirements: RequirementGroup[];
}

const RequirementChecklist: React.FC<RequirementChecklistProps> = ({
  requirements,
}) => {
  const { addCompletedCourse, removeCompletedCourse, currentPlanId, plans } =
    usePlannerStore();

  const addCompletedCourseMutation = useAddCompletedCourseMutation();
  const removeCompletedCourseMutation = useRemoveCompletedCourseMutation();

  const currentPlan = plans.find((p) => p.id === currentPlanId);
  const completedCourses =
    currentPlan?.completedCourses.map((c) => c.courseCode) || [];

  const plannedCourses: string[] = [];
  currentPlan?.quarters.forEach((q) => {
    q.courses.forEach((c) => {
      if (c.status === "planned") plannedCourses.push(c.courseCode);
    });
  });

  const [expandedCourses, setExpandedCourses] = useState<
    Record<string, boolean>
  >({});

  // Toggle expanded state for a course
  const toggleCourse = (courseCode: string) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseCode]: !prev[courseCode],
    }));
  };

  const getCourseStatus = (courseCode: string) => {
    if (completedCourses.includes(courseCode)) {
      return "completed";
    }
    if (plannedCourses.includes(courseCode)) {
      return "planned";
    }
    return "not-started";
  };

  const handleToggleCompletion = (courseCode: string) => {
    const status = getCourseStatus(courseCode);

    if (!currentPlanId) {
      return;
    }

    if (status === "completed") {
      // Optimistic update (local only; TODO: implement server removal)
      removeCompletedCourse(courseCode);
      removeCompletedCourseMutation.mutate({
        planId: currentPlanId,
        courseCode,
      });
    } else {
      // Optimistic update
      addCompletedCourse(courseCode);
      addCompletedCourseMutation.mutate({ planId: currentPlanId, courseCode });
    }
  };

  // Calculate progress for a requirement group
  const calculateProgress = (requirement: RequirementGroup) => {
    // For required courses
    const reqCourses = requirement.coursesRequired ?? [];
    const requiredTotal = reqCourses.length;
    const requiredCompleted = reqCourses.filter((course) =>
      completedCourses.includes(course)
    ).length;
    const requiredPlanned = reqCourses.filter((course) =>
      plannedCourses.includes(course)
    ).length;

    // For choose from options
    let chooseFromTotal = 0;
    let chooseFromCompleted = 0;
    let chooseFromPlanned = 0;

    if (requirement.chooseFrom) {
      chooseFromTotal = requirement.chooseFrom.count;

      const completedChooseFrom = requirement.chooseFrom.options.filter(
        (course) => completedCourses.includes(course)
      );
      chooseFromCompleted = Math.min(
        chooseFromTotal,
        completedChooseFrom.length
      );

      const plannedChooseFrom = requirement.chooseFrom.options.filter(
        (course) => plannedCourses.includes(course)
      );
      chooseFromPlanned = Math.min(
        chooseFromTotal - chooseFromCompleted,
        plannedChooseFrom.length
      );
    }

    const totalRequired = requiredTotal + chooseFromTotal;
    const totalCompleted = requiredCompleted + chooseFromCompleted;
    const totalPlanned = requiredPlanned + chooseFromPlanned;

    return {
      completed: totalCompleted,
      planned: totalPlanned,
      total: totalRequired,
      percentageCompleted:
        totalRequired > 0
          ? Math.round((totalCompleted / totalRequired) * 100)
          : 100,
      percentagePlanned:
        totalRequired > 0
          ? Math.round((totalPlanned / totalRequired) * 100)
          : 0,
    };
  };

  const renderCourseItem = (courseCode: string) => {
    const status = getCourseStatus(courseCode);
    const isExpanded = !!expandedCourses[courseCode];

    return (
      <div
        key={courseCode}
        className={`
          mb-2 rounded-md border transition-all
          ${
            status === "completed"
              ? "border-green-500 bg-green-50"
              : status === "planned"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200"
          }
        `}
      >
        <div
          className="p-3 flex items-center justify-between cursor-pointer"
          onClick={() => toggleCourse(courseCode)}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={status === "completed"}
              onCheckedChange={() => handleToggleCompletion(courseCode)}
              className="h-4 w-4"
            />
            <span
              className={`font-medium ${
                status === "completed" ? "line-through text-gray-500" : ""
              }`}
            >
              {courseCode}
            </span>
            {status === "planned" && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                Planned
              </span>
            )}
          </div>

          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isExpanded ? "transform rotate-180" : ""
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {isExpanded && (
          <div className="px-3 pb-3 pt-0 border-t border-gray-100 mt-1">
            <p className="text-sm text-gray-600">
              Course details will appear here when connected to the course
              catalog.
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {requirements.map((requirement) => {
        const progress = calculateProgress(requirement);

        return (
          <div
            key={requirement.id || requirement.name}
            className="border rounded-lg shadow-sm bg-white overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold">{requirement.name}</h3>
                <div className="text-sm font-medium">
                  {progress.completed} of {progress.total} completed
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${progress.percentageCompleted}%` }}
                ></div>
              </div>

              {/* Required Courses */}
              {(requirement.coursesRequired?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">
                    Required Courses:
                  </h4>
                  <div className="space-y-2">
                    {(requirement.coursesRequired ?? []).map(renderCourseItem)}
                  </div>
                </div>
              )}

              {/* Choose From Options */}
              {requirement.chooseFrom && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-500 mb-2">
                    Choose {requirement.chooseFrom.count} from:
                  </h4>
                  <div className="space-y-2">
                    {requirement.chooseFrom.options.length > 0 ? (
                      requirement.chooseFrom.options.map(renderCourseItem)
                    ) : (
                      <p className="text-sm italic text-gray-500 p-3 bg-gray-50 rounded-md">
                        Courses must be approved by an advisor
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Notes */}
              {requirement.notes && (
                <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p className="italic">{requirement.notes}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequirementChecklist;

import { useCourseQuery, useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { useAddPlannedCourseMutation } from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import PrerequisiteGraph from "@/components/CourseCatalog/PrerequisiteGraph";
import { Button } from "@/components/ui/button";

interface CourseDetailProps {
  courseCode: string;
  onClose: () => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ courseCode, onClose }) => {
  const { currentPlanId, plans } = usePlannerStore();
  const { data: course, isLoading } = useCourseQuery(courseCode);
  const { data: catalog = [] } = useCoursesQuery();
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
            {course.units} {course.units === 1 ? "unit" : "units"} •{" "}
            {course.department}
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

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Prerequisites</h4>
          <ul className="list-disc list-inside text-gray-700">
            {course.prerequisites.map((prereq, idx) => {
              const courseCodes = prereq.courses ?? [];

              // build alias -> group mapping using catalog crossListedAs
              const aliasToGroup: Record<string, string[]> = {};
              catalog.forEach((c) => {
                if (c.crossListedAs && c.crossListedAs.length > 0) {
                  const group = [c.code!, ...c.crossListedAs];
                  group.forEach((alias) => (aliasToGroup[alias] = group));
                }
              });

              // helper to choose canonical alias (prefer CSCI)
              const chooseCanonical = (aliases: string[]): string => {
                const csci = aliases.find((a) => a.startsWith("CSCI"));
                return csci ?? aliases[0];
              };

              const seen = new Set<string>();
              const parts: string[] = [];
              courseCodes.forEach((code: string) => {
                const group = aliasToGroup[code] ?? [code];
                const canonical = chooseCanonical(group);
                if (!seen.has(canonical)) {
                  parts.push(group.join("/"));
                  seen.add(canonical);
                }
              });

              return (
                <li key={idx}>
                  {prereq.type === "or" ? "One of: " : "Required: "}
                  {parts.join(", ")}
                  {prereq.grade && ` (minimum grade: ${prereq.grade})`}
                </li>
              );
            })}
          </ul>

          <div className="mt-4">
            <PrerequisiteGraph courseCode={courseCode} />
          </div>
        </div>
      )}

      {course.corequisites && course.corequisites.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Corequisites</h4>
          <ul className="list-disc list-inside text-gray-700">
            {course.corequisites.map((coreq, idx) => (
              <li key={idx}>{coreq}</li>
            ))}
          </ul>
        </div>
      )}

      {course.offeredQuarters && course.offeredQuarters.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-1">Offered In</h4>
          <div className="text-gray-700">
            {course.offeredQuarters.join(", ")}
          </div>
        </div>
      )}

      {currentPlan && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">Add to Plan</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {currentPlan.quarters.slice(0, 8).map((quarter) => (
              <Button
                key={quarter.id}
                onClick={() => handleAddToPlan(quarter.id)}
                disabled={addPlannedMutation.isPending}
                variant="outline"
                size="sm"
                className="px-2 py-1 text-sm"
              >
                {quarter.name}
              </Button>
            ))}
          </div>
          {currentPlan.quarters.length > 8 && (
            <div className="mt-2 text-sm text-gray-500">
              + {currentPlan.quarters.length - 8} more quarters
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;

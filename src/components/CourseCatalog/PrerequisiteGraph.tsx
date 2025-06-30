import { useCourseQuery } from "@/hooks/api/useCoursesQuery";

interface PrerequisiteGraphProps {
  courseCode: string;
}

const PrerequisiteGraph: React.FC<PrerequisiteGraphProps> = ({
  courseCode,
}) => {
  const { data: course } = useCourseQuery(courseCode);

  if (!course || !course.prerequisites || course.prerequisites.length === 0) {
    return null;
  }

  return (
    <div className="border rounded p-4 bg-gray-50">
      <h4 className="text-sm font-medium mb-2">Prerequisite Visualization</h4>
      <p className="text-sm text-gray-600">
        This course has prerequisites. In a future version, this will show a
        visual graph of the prerequisite chain.
      </p>
      <div className="mt-2">
        {course.prerequisites.map((prereq, idx) => (
          <div key={idx} className="text-sm mb-1">
            <span className="font-medium">
              {prereq.type === "required" ? "Required" : "One of"}:{" "}
            </span>
            {prereq.courses.join(", ")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrerequisiteGraph;

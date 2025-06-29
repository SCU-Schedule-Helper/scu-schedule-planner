import { RequirementGroup } from "@/data/requirements";
import { Courses, hasPrerequisitesSatisfied } from "@/data/courses";

interface RequirementChecklistProps {
  requirements: RequirementGroup[];
  completedCourses?: string[];
  plannedCourses?: string[];
}

const RequirementChecklist: React.FC<RequirementChecklistProps> = ({
  requirements,
  completedCourses = [],
  plannedCourses = [],
}) => {
  const getRequirementStatus = (requirement: RequirementGroup) => {
    const allCourses = [...completedCourses, ...plannedCourses];

    // For required courses
    const requiredCoursesComplete = requirement.coursesRequired.every(
      (course) => allCourses.includes(course)
    );

    // For choose from options
    const chooseFromComplete = requirement.chooseFrom
      ? requirement.chooseFrom.options.length === 0 || // Handle empty options array (Open Emphasis)
        allCourses.filter((course) =>
          requirement.chooseFrom!.options.includes(course)
        ).length >= requirement.chooseFrom.count
      : true;

    return requiredCoursesComplete && chooseFromComplete;
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

  const getPrerequisiteStatus = (courseCode: string) => {
    return hasPrerequisitesSatisfied(courseCode, completedCourses);
  };

  const toggleCourseStatus = (
    courseCode: string,
    newStatus: "completed" | "planned" | "not-started"
  ) => {
    // Get the course row element
    const courseRow = document.getElementById(`course-row-${courseCode}`);
    if (!courseRow) return;

    // Reset all status classes
    courseRow.classList.remove("text-green-500", "text-blue-500");

    // Add new status class
    if (newStatus === "completed") {
      courseRow.classList.add("text-green-500");
    } else if (newStatus === "planned") {
      courseRow.classList.add("text-blue-500");
    }

    // Update status indicator
    const statusIndicator = document.getElementById(
      `status-indicator-${courseCode}`
    );
    if (statusIndicator) {
      statusIndicator.classList.remove(
        "bg-green-500",
        "bg-blue-500",
        "bg-gray-300"
      );
      if (newStatus === "completed") {
        statusIndicator.classList.add("bg-green-500");
      } else if (newStatus === "planned") {
        statusIndicator.classList.add("bg-blue-500");
      } else {
        statusIndicator.classList.add("bg-gray-300");
      }
    }

    // Update buttons
    const completedBtn = document.getElementById(`completed-${courseCode}`);
    const plannedBtn = document.getElementById(`planned-${courseCode}`);

    if (completedBtn) {
      completedBtn.classList.remove("bg-green-500", "text-white");
      completedBtn.classList.add("bg-gray-200", "text-gray-700");
      if (newStatus === "completed") {
        completedBtn.classList.remove("bg-gray-200", "text-gray-700");
        completedBtn.classList.add("bg-green-500", "text-white");
      }
    }

    if (plannedBtn) {
      plannedBtn.classList.remove("bg-blue-500", "text-white");
      plannedBtn.classList.add("bg-gray-200", "text-gray-700");
      if (newStatus === "planned") {
        plannedBtn.classList.remove("bg-gray-200", "text-gray-700");
        plannedBtn.classList.add("bg-blue-500", "text-white");
      }
    }
  };

  const renderCourseWithPrereqs = (courseCode: string) => {
    const course = Courses[courseCode];
    const status = getCourseStatus(courseCode);
    const prereqsSatisfied = getPrerequisiteStatus(courseCode);

    return (
      <div
        key={courseCode}
        id={`course-row-${courseCode}`}
        className={`
          mb-2 p-2 rounded
          ${
            status === "completed"
              ? "text-green-500"
              : status === "planned"
              ? "text-blue-500"
              : ""
          }
          ${!prereqsSatisfied && status !== "completed" ? "bg-red-100/10" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          <div
            id={`status-indicator-${courseCode}`}
            className={`w-2 h-2 rounded-full ${
              status === "completed"
                ? "bg-green-500"
                : status === "planned"
                ? "bg-blue-500"
                : "bg-gray-300"
            }`}
          />
          <span>{courseCode}</span>
          {course?.title && (
            <span className="text-sm text-gray-500">- {course.title}</span>
          )}

          <div className="ml-auto flex items-center gap-2">
            <button
              className={`px-2 py-1 text-xs rounded ${
                status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() =>
                toggleCourseStatus(
                  courseCode,
                  status === "completed" ? "not-started" : "completed"
                )
              }
              id={`completed-${courseCode}`}
            >
              Completed
            </button>
            <button
              className={`px-2 py-1 text-xs rounded ${
                status === "planned"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              onClick={() =>
                toggleCourseStatus(
                  courseCode,
                  status === "planned" ? "not-started" : "planned"
                )
              }
              id={`planned-${courseCode}`}
            >
              Planned
            </button>
          </div>
        </div>

        {course?.prerequisites && course.prerequisites.length > 0 && (
          <div className="ml-4 mt-1 text-sm text-gray-500">
            {course.prerequisites.map((prereq, idx) => (
              <div key={idx}>
                Prerequisites ({prereq.type}): {prereq.courses.join(", ")}
                {prereq.grade && ` (min grade: ${prereq.grade})`}
              </div>
            ))}
          </div>
        )}

        {!prereqsSatisfied && status !== "completed" && (
          <div className="ml-4 mt-1 text-sm text-red-500">
            ⚠️ Prerequisites not met
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Requirements Checklist</h2>

      {requirements.map((requirement, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-4 h-4 rounded-full ${
                getRequirementStatus(requirement)
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            />
            <h3 className="text-lg font-semibold">{requirement.name}</h3>
          </div>

          {/* Required Courses */}
          {requirement.coursesRequired.length > 0 && (
            <div className="ml-6 mb-2">
              <p className="font-medium mb-1">Required Courses:</p>
              <div className="space-y-2">
                {requirement.coursesRequired.map((course) =>
                  renderCourseWithPrereqs(course)
                )}
              </div>
            </div>
          )}

          {/* Choose From Options */}
          {requirement.chooseFrom && (
            <div className="ml-6 mb-2">
              <p className="font-medium mb-1">
                Choose {requirement.chooseFrom.count} from:
              </p>
              <div className="space-y-2">
                {requirement.chooseFrom.options.length > 0 ? (
                  requirement.chooseFrom.options.map((course) =>
                    renderCourseWithPrereqs(course)
                  )
                ) : (
                  <p className="text-sm italic">
                    Courses must be approved by an advisor
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {requirement.notes && (
            <div className="ml-6 mt-2 text-sm text-gray-600">
              <p className="italic">{requirement.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RequirementChecklist;

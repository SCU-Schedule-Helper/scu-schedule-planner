import { Course } from "@/lib/types";

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  onSelectCourse: (courseCode: string) => void;
}

const CourseList: React.FC<CourseListProps> = ({
  courses,
  isLoading,
  onSelectCourse,
}) => {
  if (isLoading) {
    return (
      <div className="p-4 border rounded-lg">
        <div className="animate-pulse space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="p-4 border rounded-lg text-center">
        <p className="text-gray-500">No courses found</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[auto,1fr,auto] bg-gray-100 p-3 font-medium text-sm">
        <div className="px-2">Code</div>
        <div className="px-2">Title</div>
        <div className="px-2">Units</div>
      </div>

      <div className="divide-y">
        {courses.map((course) => (
          <div
            key={course.code ?? String(Math.random())}
            onClick={() => onSelectCourse(course.code ?? "")}
            className="grid grid-cols-[auto,1fr,auto] p-3 hover:bg-gray-50 cursor-pointer"
          >
            <div className="px-2 font-medium">{course.code}</div>
            <div className="px-2">{course.title}</div>
            <div className="px-2 text-right">{course.units}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;

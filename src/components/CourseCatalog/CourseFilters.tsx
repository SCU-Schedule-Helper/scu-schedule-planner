import { useMemo } from "react";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { CourseFilter } from "@/lib/types";

interface CourseFiltersProps {
  filters: CourseFilter;
  onFilterChange: (filters: CourseFilter) => void;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const { data: courses } = useCoursesQuery();

  // Extract unique departments from courses
  const departments = useMemo(() => {
    if (!courses) return [];

    const deptSet = new Set<string>();
    courses.forEach((course) => {
      if (course.department) {
        deptSet.add(course.department);
      }
    });

    return Array.from(deptSet).sort();
  }, [courses]);

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      department: value || undefined,
    });
  };

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      isUpperDivision: value === "" ? undefined : value === "true",
    });
  };

  const handleQuarterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      quarter: value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      department: undefined,
      isUpperDivision: undefined,
      quarter: undefined,
    });
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="font-semibold mb-3">Filters</h3>

      <div className="mb-3">
        <label className="block text-sm mb-1">Department</label>
        <select
          value={filters.department || ""}
          onChange={handleDepartmentChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Course Level</label>
        <select
          value={
            filters.isUpperDivision === undefined
              ? ""
              : String(filters.isUpperDivision)
          }
          onChange={handleDivisionChange}
          className="w-full p-2 border rounded"
        >
          <option value="">All Levels</option>
          <option value="false">Lower Division</option>
          <option value="true">Upper Division</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Quarter Offered</label>
        <select
          value={filters.quarter || ""}
          onChange={handleQuarterChange}
          className="w-full p-2 border rounded"
        >
          <option value="">Any Quarter</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
        </select>
      </div>

      {Object.values(filters).some((val) => val !== undefined) && (
        <button
          onClick={handleClearFilters}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default CourseFilters;

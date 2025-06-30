import { useMemo } from "react";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import { CourseFilter } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      department: value || undefined,
    });
  };

  const handleDivisionChange = (value: string) => {
    onFilterChange({
      ...filters,
      isUpperDivision: value === "" ? undefined : value === "true",
    });
  };

  const handleQuarterChange = (value: string) => {
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
        <Select
          value={filters.department || ""}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Course Level</label>
        <Select
          value={
            filters.isUpperDivision === undefined
              ? ""
              : String(filters.isUpperDivision)
          }
          onValueChange={handleDivisionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="false">Lower Division</SelectItem>
            <SelectItem value="true">Upper Division</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Quarter Offered</label>
        <Select
          value={filters.quarter || ""}
          onValueChange={handleQuarterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Quarter</SelectItem>
            <SelectItem value="Fall">Fall</SelectItem>
            <SelectItem value="Winter">Winter</SelectItem>
            <SelectItem value="Spring">Spring</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.values(filters).some((val) => val !== undefined) && (
        <Button
          onClick={handleClearFilters}
          variant="link"
          className="text-blue-500 hover:text-blue-700 p-0 h-auto text-sm"
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
};

export default CourseFilters;

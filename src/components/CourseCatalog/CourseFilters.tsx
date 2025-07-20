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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    courses.forEach((course: any) => {
      // Extract department from course code (first letters before numbers)
      const deptMatch = course.code.match(/^([A-Z]+)/);
      if (deptMatch) {
        deptSet.add(deptMatch[1]);
      }
    });

    return Array.from(deptSet).sort();
  }, [courses]);

  const handleDepartmentChange = (value: string) => {
    onFilterChange({
      ...filters,
      department: value === "all" ? undefined : value,
    });
  };

  const handleDivisionChange = (value: string) => {
    onFilterChange({
      ...filters,
      isUpperDivision: value === "all" ? undefined : value === "true",
    });
  };

  const handleQuarterChange = (value: string) => {
    onFilterChange({
      ...filters,
      quarter: (value === "any" ? undefined : value) as
        | "Fall"
        | "Winter"
        | "Spring"
        | "Summer"
        | undefined,
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
          value={filters.department || "all"}
          onValueChange={handleDepartmentChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-depts" value="all">All Departments</SelectItem>
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
              ? "all"
              : String(filters.isUpperDivision)
          }
          onValueChange={handleDivisionChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all-levels" value="all">All Levels</SelectItem>
            <SelectItem key="lower" value="false">Lower Division</SelectItem>
            <SelectItem key="upper" value="true">Upper Division</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1">Quarter Offered</label>
        <Select
          value={filters.quarter || "any"}
          onValueChange={handleQuarterChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Any Quarter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="any-quarter" value="any">Any Quarter</SelectItem>
            <SelectItem key="fall" value="Fall">Fall</SelectItem>
            <SelectItem key="winter" value="Winter">Winter</SelectItem>
            <SelectItem key="spring" value="Spring">Spring</SelectItem>
            <SelectItem key="summer" value="Summer">Summer</SelectItem>
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

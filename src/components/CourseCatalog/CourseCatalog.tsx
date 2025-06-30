"use client";

import { useState } from "react";
import {
  useCoursesQuery,
  useFilteredCoursesQuery,
  useSearchCoursesQuery,
} from "@/hooks/api/useCoursesQuery";
import CourseList from "@/components/CourseCatalog/CourseList";
import CourseDetail from "@/components/CourseCatalog/CourseDetail";
import CourseFilters from "@/components/CourseCatalog/CourseFilters";
import { CourseFilter } from "@/lib/types";

const CourseCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [filters, setFilters] = useState<CourseFilter>({
    department: undefined,
    isUpperDivision: undefined,
    quarter: undefined,
  });

  const { data: allCourses, isLoading: isLoadingAll } = useCoursesQuery();
  const { data: filteredCourses, isLoading: isLoadingFiltered } =
    useFilteredCoursesQuery(
      Object.values(filters).some((val) => val !== undefined) ? filters : null
    );
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchCoursesQuery(searchTerm.length >= 3 ? searchTerm : null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (newFilters: CourseFilter) => {
    setFilters(newFilters);
  };

  const handleSelectCourse = (courseCode: string) => {
    setSelectedCourse(courseCode);
  };

  const handleCloseDetail = () => {
    setSelectedCourse(null);
  };

  // Determine which courses to display
  const coursesToDisplay =
    searchTerm.length >= 3
      ? searchResults
      : Object.values(filters).some((val) => val !== undefined)
      ? filteredCourses
      : allCourses;

  const isLoading = isLoadingSearch || isLoadingFiltered || isLoadingAll;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Course Catalog</h2>

          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search courses..."
              className="w-full p-2 border rounded"
            />
          </div>

          <CourseFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <div className="md:col-span-2">
        {selectedCourse ? (
          <CourseDetail
            courseCode={selectedCourse}
            onClose={handleCloseDetail}
          />
        ) : (
          <CourseList
            courses={coursesToDisplay || []}
            isLoading={isLoading}
            onSelectCourse={handleSelectCourse}
          />
        )}
      </div>
    </div>
  );
};

export default CourseCatalog;

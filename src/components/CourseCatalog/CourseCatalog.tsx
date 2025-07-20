"use client";

import React, { useState, useMemo } from "react";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";
import CourseList from "./CourseList";
import CourseFilters from "./CourseFilters";
import CourseDetail from "./CourseDetail";
import { CourseFilter } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CourseCatalogProps {
  initialSearch?: string;
  initialDepartment?: string;
  initialQuarters?: string;
}

export function CourseCatalog({
  initialSearch = "",
  initialDepartment = "",
  initialQuarters = "",
}: CourseCatalogProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string | null>(
    null
  );
  const [filters, setFilters] = useState<CourseFilter>({
    department: initialDepartment || undefined,
    quarter: initialQuarters as
      | "Fall"
      | "Winter"
      | "Spring"
      | "Summer"
      | undefined,
    isUpperDivision: undefined,
  });

  // Use the courses query with filters
  const {
    data: courses = [],
    isLoading,
    error,
  } = useCoursesQuery(
    searchQuery.length >= 2 ? searchQuery : undefined,
    filters.department,
    filters.quarter
  );

  // Memoize filtered courses to avoid unnecessary re-renders
  const filteredCourses = useMemo(() => {
    if (!courses) return [];

    return courses.filter((course) => {
      // Filter by search query if present
      if (searchQuery && searchQuery.length >= 2) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          course.code.toLowerCase().includes(searchLower) ||
          course.title.toLowerCase().includes(searchLower) ||
          (course.description &&
            course.description.toLowerCase().includes(searchLower));

        if (!matchesSearch) return false;
      }

      // Filter by upper division if selected
      if (filters.isUpperDivision !== undefined) {
        const courseNumber = parseInt(course.code?.match(/\d+/)?.[0] || "0");
        const isUpperDivision = courseNumber >= 100;

        if (filters.isUpperDivision !== isUpperDivision) {
          return false;
        }
      }

      return true;
    });
  }, [courses, searchQuery, filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCourseCode(null); // Clear selected course when searching
  };

  const handleFilterChange = (newFilters: CourseFilter) => {
    setFilters(newFilters);
    setSelectedCourseCode(null);
  };

  const handleCourseSelect = (courseCode: string) => {
    setSelectedCourseCode(courseCode);
  };

  const handleCourseDeselect = () => {
    setSelectedCourseCode(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm mb-1">Search Courses</label>
              <Input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search courses..."
              />
            </div>
            <CourseFilters
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Course List */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>
              Courses {courses.length > 0 && `(${filteredCourses.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error instanceof Error
                    ? error.message
                    : "Failed to load courses"}
                </AlertDescription>
              </Alert>
            ) : (
              <CourseList
                courses={filteredCourses}
                isLoading={isLoading}
                onSelectCourse={handleCourseSelect}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Course Detail */}
      <div className="lg:col-span-1">
        {selectedCourseCode ? (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <CourseDetail
                courseCode={selectedCourseCode}
                onClose={handleCourseDeselect}
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Select a course to view details
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import { Course, CoursesResponse } from '@/lib/types';

// =============================================
// COURSES QUERY
// =============================================

export function useCoursesQuery(search?: string, department?: string, quarters?: string) {
    return useQuery({
        queryKey: ['courses', { search, department, quarters }],
        queryFn: async (): Promise<CoursesResponse> => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (department) params.append('department', department);
            if (quarters) params.append('quarters', quarters);

            const response = await fetch(`/api/courses?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// =============================================
// COURSE SEARCH QUERY
// =============================================

export function useCourseSearchQuery(query: string) {
    return useQuery({
        queryKey: ['courseSearch', query],
        queryFn: async (): Promise<CoursesResponse> => {
            if (!query || query.length < 2) {
                return [];
            }

            const response = await fetch(`/api/courses/search?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: query.length >= 2,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// =============================================
// COURSE FILTER QUERY
// =============================================

export function useCourseFilterQuery(filters: {
    department?: string;
    quarter?: string;
    units?: string;
    level?: string;
}) {
    return useQuery({
        queryKey: ['courseFilter', filters],
        queryFn: async (): Promise<CoursesResponse> => {
            const params = new URLSearchParams();
            if (filters.department) params.append('department', filters.department);
            if (filters.quarter) params.append('quarter', filters.quarter);
            if (filters.units) params.append('units', filters.units);
            if (filters.level) params.append('level', filters.level);

            const response = await fetch(`/api/courses/filter?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
    });
}

// =============================================
// INDIVIDUAL COURSE QUERY
// =============================================

export function useCourseQuery(courseCode: string) {
    return useQuery({
        queryKey: ['course', courseCode],
        queryFn: async (): Promise<Course> => {
            const response = await fetch(`/api/courses/${encodeURIComponent(courseCode)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!courseCode,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

// Helper function to find a course by code from a list of courses
export function findCourseByCode(allCourses: Course[] | undefined, courseCode: string): Course | undefined {
    if (!allCourses) return undefined;
    const cached = allCourses?.find((c: Course) => c.code === courseCode);
    return cached;
}

// Helper function to get course details from cache or fetch if needed
export function useCourseDetails(courseCode: string, allCourses?: Course[]) {
    return useQuery({
        queryKey: ['course-details', courseCode],
        queryFn: async (): Promise<Course | undefined> => {
            // First try to find in cached courses
            if (allCourses) {
                return allCourses?.find((c: Course) => c.code === courseCode);
            }

            // If not found, fetch from API
            const response = await fetch(`/api/courses/${courseCode}`);
            if (!response.ok) {
                throw new Error('Failed to fetch course details');
            }
            return response.json();
        },
        enabled: !!courseCode,
    });
} 
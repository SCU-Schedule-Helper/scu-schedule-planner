import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    type CourseFilter,
    type CourseResponse,
    type CoursesResponse,
    CourseFilterSchema,
    CourseSearchSchema
} from '@/lib/types';

// API client
const api = axios.create({
    baseURL: '/api',
});

// Fetch all courses
export const useCoursesQuery = () => {
    return useQuery<CoursesResponse>({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data } = await api.get<CoursesResponse>('/courses');
            return data;
        }
    });
};

// Fetch a single course by code
export const useCourseQuery = (courseCode: string) => {
    const queryClient = useQueryClient();

    return useQuery<CourseResponse>({
        queryKey: ['courses', courseCode],
        // Primary source: look up course in already-fetched catalog
        queryFn: async () => {
            // Attempt cache lookup first
            const allCourses = queryClient.getQueryData<CoursesResponse>(['courses']);
            const cached = allCourses?.find((c) => c.code === courseCode);
            if (cached) {
                return cached;
            }
            // Fallback: fetch just this one course
            const { data } = await api.get<CourseResponse>(`/courses/${courseCode}`);
            return data;
        },
        enabled: !!courseCode,
        // Provide immediate data from catalog if available to avoid request
        initialData: () => {
            const allCourses = queryClient.getQueryData<CoursesResponse>(['courses']);
            return allCourses?.find((c) => c.code === courseCode);
        },
        // Align updatedAt with catalog cache so the data stays in sync
        initialDataUpdatedAt: () => {
            const state = queryClient.getQueryState(['courses']);
            return state?.dataUpdatedAt;
        }
    });
};

// Filter courses by department, level, etc.
export const useFilteredCoursesQuery = (filters: CourseFilter | null) => {
    // Validate filters with Zod
    const validatedFilters = filters ? CourseFilterSchema.parse(filters) : null;

    return useQuery<CoursesResponse>({
        queryKey: ['courses', 'filtered', validatedFilters],
        queryFn: async () => {
            const { data } = await api.get<CoursesResponse>('/courses/filter', {
                params: validatedFilters
            });
            return data;
        },
        enabled: !!validatedFilters
    });
};

// Search courses by keyword
export const useSearchCoursesQuery = (searchTerm: string | null) => {
    // Validate search term
    const isValidSearch = searchTerm ?
        CourseSearchSchema.safeParse({ q: searchTerm }).success :
        false;

    return useQuery<CoursesResponse>({
        queryKey: ['courses', 'search', searchTerm],
        queryFn: async () => {
            const { data } = await api.get<CoursesResponse>('/courses/search', {
                params: { q: searchTerm }
            });
            return data;
        },
        enabled: isValidSearch
    });
}; 
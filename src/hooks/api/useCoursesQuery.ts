import { useQuery } from '@tanstack/react-query';
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
    return useQuery<CourseResponse>({
        queryKey: ['courses', courseCode],
        queryFn: async () => {
            const { data } = await api.get<CourseResponse>(`/courses/${courseCode}`);
            return data;
        },
        enabled: !!courseCode
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
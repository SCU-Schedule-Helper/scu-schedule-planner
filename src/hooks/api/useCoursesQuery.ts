import { useQuery } from '@tanstack/react-query';
import { CoursesResponse } from '@/lib/types';

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

// Note: Individual course search, filter, and detail functions have been removed
// as they were not being used. If needed in the future, they can be re-implemented.  
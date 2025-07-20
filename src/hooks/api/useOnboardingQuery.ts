import { useQuery } from '@tanstack/react-query';

// =============================================
// MAJORS QUERY
// =============================================

export interface Major {
    id: string;
    name: string;
    description?: string;
    departmentCode?: string;
    requiresEmphasis: boolean;
}

export function useMajorsQuery() {
    return useQuery({
        queryKey: ['majors'],
        queryFn: async (): Promise<Major[]> => {
            const response = await fetch('/api/onboarding/majors');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
    });
}

// =============================================
// EMPHASIS AREAS QUERY
// =============================================

export interface EmphasisArea {
    id: string;
    name: string;
    description?: string;
    appliesTo?: string;
    departmentCode?: string;
}

export function useEmphasisAreasQuery(majorId?: string) {
    return useQuery({
        queryKey: ['emphasisAreas', majorId],
        queryFn: async (): Promise<EmphasisArea[]> => {
            const params = new URLSearchParams();
            if (majorId) {
                params.append('majorId', majorId);
            }

            const response = await fetch(`/api/onboarding/emphasis-areas?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!majorId,
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
    });
}

// =============================================
// SCHOOLS QUERY
// =============================================

export interface School {
    id: string;
    name: string;
    description?: string;
}

export function useSchoolsQuery() {
    return useQuery({
        queryKey: ['schools'],
        queryFn: async (): Promise<School[]> => {
            const response = await fetch('/api/schools');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 2 * 60 * 60 * 1000, // 2 hours
    });
} 
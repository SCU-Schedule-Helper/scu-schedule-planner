import { useQuery } from '@tanstack/react-query';
import { RequirementsResponse, UniversityRequirementsResponse } from '@/lib/types';

// =============================================
// MAJOR REQUIREMENTS QUERY
// =============================================

export function useMajorRequirementsQuery(majorId?: string, majorName?: string) {
    return useQuery({
        queryKey: ['majorRequirements', { majorId, majorName }],
        queryFn: async (): Promise<RequirementsResponse> => {
            const params = new URLSearchParams();
            if (majorId) {
                params.append('majorId', majorId);
            } else if (majorName) {
                params.append('major', majorName);
            } else {
                throw new Error('Either majorId or majorName must be provided');
            }

            const response = await fetch(`/api/requirements/major?${params.toString()}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!(majorId || majorName),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

// =============================================
// UNIVERSITY REQUIREMENTS QUERY
// =============================================

export function useUniversityRequirementsQuery() {
    return useQuery({
        queryKey: ['universityRequirements'],
        queryFn: async (): Promise<UniversityRequirementsResponse> => {
            const response = await fetch('/api/requirements/university');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
    });
}

// =============================================
// EMPHASIS REQUIREMENTS QUERY
// =============================================

export function useEmphasisRequirementsQuery(emphasisId: string) {
    return useQuery({
        queryKey: ['emphasisRequirements', emphasisId],
        queryFn: async (): Promise<RequirementsResponse> => {
            const response = await fetch(`/api/requirements/emphasis?emphasisId=${encodeURIComponent(emphasisId)}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!emphasisId,
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
}

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type RequirementGroupsResponse } from '@/lib/types';

// API client
const api = axios.create({
    baseURL: '/api',
});

// Fetch major requirements
export const useMajorRequirementsQuery = () => {
    return useQuery<RequirementGroupsResponse>({
        queryKey: ['requirements', 'major'],
        queryFn: async () => {
            const { data } = await api.get<RequirementGroupsResponse>('/requirements/major');
            return data;
        }
    });
};

// Fetch emphasis requirements
export const useEmphasisRequirementsQuery = (emphasisId: string) => {
    return useQuery<RequirementGroupsResponse>({
        queryKey: ['requirements', 'emphasis', emphasisId],
        queryFn: async () => {
            const { data } = await api.get<RequirementGroupsResponse>(`/requirements/emphasis`, {
                params: { emphasisId }
            });
            return data;
        },
        enabled: !!emphasisId
    });
};

// Fetch university core requirements
export const useUniversityRequirementsQuery = () => {
    return useQuery<RequirementGroupsResponse>({
        queryKey: ['requirements', 'university'],
        queryFn: async () => {
            const { data } = await api.get<RequirementGroupsResponse>('/requirements/university');
            return data;
        }
    });
}; 
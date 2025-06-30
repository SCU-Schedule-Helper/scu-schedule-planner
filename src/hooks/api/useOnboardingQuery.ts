import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { z } from 'zod';

// API client
const api = axios.create({
    baseURL: '/api',
});

// Define schemas for onboarding data
export const MajorSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string()
});

export const EmphasisAreaSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    majorId: z.string()
});

// Define types from schemas
type Major = z.infer<typeof MajorSchema>;
type EmphasisArea = z.infer<typeof EmphasisAreaSchema>;

// Fetch majors
export const useMajorsQuery = () => {
    return useQuery<Major[]>({
        queryKey: ['onboarding', 'majors'],
        queryFn: async () => {
            const { data } = await api.get<Major[]>('/onboarding/majors');
            return data;
        }
    });
};

// Fetch emphasis areas for a major
export const useEmphasisAreasQuery = (majorId?: string) => {
    return useQuery<EmphasisArea[]>({
        queryKey: ['onboarding', 'emphasis', majorId],
        queryFn: async () => {
            const { data } = await api.get<EmphasisArea[]>('/onboarding/emphasis-areas', {
                params: { majorId }
            });
            return data;
        },
        enabled: !!majorId
    });
}; 
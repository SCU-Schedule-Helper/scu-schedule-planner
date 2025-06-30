import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { UserPlanSchema, PlannedCourseSchema, SubstitutionSchema } from '@/lib/types';
import { z } from 'zod';

// Define API response types with userId
export const ApiUserPlanSchema = UserPlanSchema.extend({
    id: z.string().optional(),
    userId: z.string()
});

type ApiUserPlan = z.infer<typeof ApiUserPlanSchema>;
type PlannedCourse = z.infer<typeof PlannedCourseSchema>;
type Substitution = z.infer<typeof SubstitutionSchema>;

// API client
const api = axios.create({
    baseURL: '/api',
});

// Helper function to validate API responses
const validateApiUserPlan = (data: unknown): ApiUserPlan => {
    return ApiUserPlanSchema.parse(data);
};

const validateApiUserPlans = (data: unknown[]): ApiUserPlan[] => {
    return data.map(item => ApiUserPlanSchema.parse(item));
};

// Fetch user plans
export const usePlansQuery = (userId: string) => {
    return useQuery<ApiUserPlan[]>({
        queryKey: ['plans', userId],
        queryFn: async () => {
            const { data } = await api.get<unknown[]>('/plans', {
                params: { userId }
            });
            return validateApiUserPlans(data);
        },
        enabled: !!userId
    });
};

// Fetch a single plan
export const usePlanQuery = (planId: string) => {
    return useQuery<ApiUserPlan>({
        queryKey: ['plans', 'detail', planId],
        queryFn: async () => {
            const { data } = await api.get<unknown>(`/plans/${planId}`);
            return validateApiUserPlan(data);
        },
        enabled: !!planId
    });
};

// Create a new plan
export const useCreatePlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiUserPlan, Error, Omit<ApiUserPlan, 'id'>>({
        mutationFn: async (plan) => {
            const { data } = await api.post<unknown>('/plans', plan);
            return validateApiUserPlan(data);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', variables.userId] });
        }
    });
};

// Update an existing plan
export const useUpdatePlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<ApiUserPlan, Error, { planId: string; updates: Partial<ApiUserPlan> }>({
        mutationFn: async ({ planId, updates }) => {
            const { data } = await api.patch<unknown>(`/plans/${planId}`, updates);
            return validateApiUserPlan(data);
        },
        onSuccess: (data) => {
            if (data.id) {
                queryClient.invalidateQueries({ queryKey: ['plans', 'detail', data.id] });
            }
            queryClient.invalidateQueries({ queryKey: ['plans', data.userId] });
        }
    });
};

// Delete a plan
export const useDeletePlanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { planId: string; userId: string }>({
        mutationFn: async ({ planId }) => {
            await api.delete(`/plans/${planId}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', variables.userId] });
            queryClient.removeQueries({ queryKey: ['plans', 'detail', variables.planId] });
        }
    });
};

// Add a completed course
export const useAddCompletedCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<PlannedCourse, Error, {
        planId: string;
        courseCode: string;
        grade?: string;
        isTransfer?: boolean;
    }>({
        mutationFn: async ({
            planId,
            courseCode,
            grade,
            isTransfer
        }) => {
            const { data } = await api.post<PlannedCourse>(`/plans/${planId}/completed-courses`, {
                courseCode,
                grade,
                isTransfer
            });
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', variables.planId] });
        }
    });
};

// Remove a completed course
export const useRemoveCompletedCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { planId: string; courseCode: string }>({
        mutationFn: async ({ planId, courseCode }) => {
            await api.delete(`/plans/${planId}/completed-courses/${courseCode}`);
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', variables.planId] });
        }
    });
};

// Add a planned course
export const useAddPlannedCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<PlannedCourse, Error, {
        planId: string;
        courseCode: string;
        quarter: string;
    }>({
        mutationFn: async ({
            planId,
            courseCode,
            quarter
        }) => {
            const { data } = await api.post<PlannedCourse>(`/plans/${planId}/planned-courses`, {
                courseCode,
                quarter
            });
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', variables.planId] });
            if (data && 'userId' in data && data.userId) {
                queryClient.invalidateQueries({ queryKey: ['plans', data.userId] });
            }
        }
    });
};

// Move a planned course
export const useMovePlannedCourseMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<PlannedCourse, Error, {
        planId: string;
        courseCode: string;
        fromQuarter: string;
        toQuarter: string;
    }>({
        mutationFn: async ({
            planId,
            courseCode,
            fromQuarter,
            toQuarter
        }) => {
            const { data } = await api.patch<PlannedCourse>(
                `/plans/${planId}/planned-courses/${courseCode}`,
                { fromQuarter, toQuarter }
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', variables.planId] });
            if (data && 'userId' in data && data.userId) {
                queryClient.invalidateQueries({ queryKey: ['plans', data.userId] });
            }
        }
    });
};

// Add a substitution
export const useAddSubstitutionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<Substitution, Error, {
        planId: string;
        substitution: Substitution
    }>({
        mutationFn: async ({
            planId,
            substitution
        }) => {
            const { data } = await api.post<Substitution>(
                `/plans/${planId}/substitutions`,
                substitution
            );
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', variables.planId] });
            if (data && 'userId' in data && data.userId) {
                queryClient.invalidateQueries({ queryKey: ['plans', data.userId] });
            }
        }
    });
};

// Remove a substitution
export const useRemoveSubstitutionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<{
        planId: string;
        requirementGroupId: string;
        originalCourseCode: string;
    }, Error, {
        planId: string;
        requirementGroupId: string;
        originalCourseCode: string;
    }>({
        mutationFn: async ({
            planId,
            requirementGroupId,
            originalCourseCode
        }) => {
            await api.delete(
                `/plans/${planId}/substitutions/${requirementGroupId}/${originalCourseCode}`
            );
            return { planId, requirementGroupId, originalCourseCode };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['plans', 'detail', data.planId] });
        }
    });
}; 
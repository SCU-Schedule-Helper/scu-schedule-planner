import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlan, PlannedCourse, MovePlannedCoursePayload } from '@/lib/types';
import { usePlannerStore } from '../usePlannerStore';

// =============================================
// PLAN QUERY
// =============================================

export function usePlanQuery(planId: string) {
    return useQuery({
        queryKey: ['plan', planId],
        queryFn: async (): Promise<UserPlan> => {
            const response = await fetch(`/api/plans/${planId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!planId,
        staleTime: 1 * 60 * 1000, // 1 minute for user-specific data
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

// =============================================
// PLAN UPDATE MUTATION
// =============================================

export function useUpdatePlanMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, updates }: { planId: string; updates: Partial<UserPlan> }): Promise<UserPlan> => {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: (data, { planId }) => {
            // Update the plan in the cache
            queryClient.setQueryData(['plan', planId], data);

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['plan', planId] });
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

// =============================================
// PLAN DELETE MUTATION
// =============================================

export function useDeletePlanMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planId: string): Promise<{ success: boolean; message: string }> => {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: (data, planId) => {
            // Remove the plan from the cache
            queryClient.removeQueries({ queryKey: ['plan', planId] });

            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}

// =============================================
// PLANNED COURSES QUERY
// =============================================

export function usePlannedCoursesQuery(planId: string) {
    return useQuery({
        queryKey: ['plannedCourses', planId],
        queryFn: async (): Promise<PlannedCourse[]> => {
            const response = await fetch(`/api/plans/${planId}/planned-courses`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!planId,
        staleTime: 1 * 60 * 1000, // 1 minute for user-specific data
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

// =============================================
// ADD PLANNED COURSE MUTATION
// =============================================

export function useAddPlannedCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            planId,
            courseCode,
            quarter,
            year,
            status = 'planned',
            units
        }: {
            planId: string;
            courseCode: string;
            quarter: string;
            year: number;
            status?: 'planned' | 'completed' | 'in-progress' | 'not_started';
            units?: string;
        }): Promise<PlannedCourse> => {
            const response = await fetch(`/api/plans/${planId}/planned-courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    courseCode,
                    quarter,
                    year,
                    status,
                    units,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: (data, { planId }) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['plan', planId] });
            queryClient.invalidateQueries({ queryKey: ['plannedCourses', planId] });
        },
    });
}

// =============================================
// UPDATE PLANNED COURSE MUTATION
// =============================================

export function useUpdatePlannedCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            planId,
            courseCode,
            updates
        }: {
            planId: string;
            courseCode: string;
            updates: Partial<PlannedCourse>;
        }): Promise<PlannedCourse> => {
            const response = await fetch(`/api/plans/${planId}/planned-courses/${courseCode}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: (data, { planId }) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['plan', planId] });
            queryClient.invalidateQueries({ queryKey: ['plannedCourses', planId] });
        },
    });
}

// =============================================
// DELETE PLANNED COURSE MUTATION
// =============================================

export function useDeletePlannedCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ planId, courseCode }: { planId: string; courseCode: string }): Promise<{ success: boolean; message: string }> => {
            const response = await fetch(`/api/plans/${planId}/planned-courses/${courseCode}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: (data, { planId }) => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['plan', planId] });
            queryClient.invalidateQueries({ queryKey: ['plannedCourses', planId] });
        },
    });
}

// =============================================
// PLANS QUERY (All plans for a user)
// =============================================

export function usePlansQuery(userId: string) {
    return useQuery({
        queryKey: ['plans', userId],
        queryFn: async (): Promise<UserPlan[]> => {
            if (!userId) return [];

            const response = await fetch(`/api/plans?userId=${userId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        enabled: !!userId,
        staleTime: 1 * 60 * 1000, // 1 minute for user-specific data
        gcTime: 5 * 60 * 1000, // 5 minutes
    });
}

// =============================================
// MOVE PLANNED COURSE MUTATION
// =============================================

export function useMovePlannedCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            planId,
            courseCode,
            fromQuarter,
            fromYear,
            toQuarter,
            toYear,
        }: MovePlannedCoursePayload): Promise<PlannedCourse> => {
            const response = await fetch(`/api/plans/${planId}/planned-courses/${courseCode}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    fromQuarter,
                    fromYear,
                    quarter: toQuarter, 
                    year: toYear 
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: async (data, { planId }) => {
            const { userId, updatePlan } = usePlannerStore.getState();

            // Invalidate and refetch queries to get the latest server state
            await queryClient.invalidateQueries({ queryKey: ['plan', planId] });
            await queryClient.invalidateQueries({ queryKey: ['plans', userId] });

            // After invalidation, get the fresh plan data from the cache
            const freshPlan = await queryClient.getQueryData<UserPlan>(['plan', planId]);

            // Update the Zustand store with the authoritative server state
            if (freshPlan) {
                updatePlan(planId, freshPlan);
            }
        },
    });
}

// =============================================
// CREATE PLAN MUTATION
// =============================================

export function useCreatePlanMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (planData: Omit<UserPlan, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserPlan> => {
            const response = await fetch('/api/plans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(planData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate the plans query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['plans'] });
        },
    });
}
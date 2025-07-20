import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    type Course,
    type RequirementGroup,
    type UserPlan,
    type Substitution
} from '@/lib/types';

interface PlannerState {
    // User and plan data
    userId?: string;
    userName?: string;
    currentPlanId?: string;
    plans: UserPlan[];
    substitutions: Substitution[];

    // Catalog data
    majors: { id: string; name: string; code: string }[];
    selectedMajorId?: string;
    emphasisAreas: { id: string; name: string; majorId: string }[];
    selectedEmphasisId?: string;

    // Course and requirement data
    courses: Record<string, Course>;
    majorRequirements: RequirementGroup[];
    emphasisRequirements: Record<string, RequirementGroup[]>;
    universityRequirements: RequirementGroup[];

    // UI state
    isOnboardingComplete: boolean;
    activeTab: 'catalog' | 'planner' | 'requirements' | 'dashboard';

    // Actions
    setUserId: (userId: string) => void;
    setUserName: (name: string) => void;
    setMajor: (majorId: string) => void;
    setEmphasis: (emphasisId: string) => void;
    createPlan: (plan: Omit<UserPlan, 'id'>) => void;
    setPlans: (plans: UserPlan[]) => void;
    updatePlan: (planId: string, updates: Partial<UserPlan>) => void;
    deletePlan: (planId: string) => void;
    setCurrentPlan: (planId: string) => void;
    addCompletedCourse: (courseCode: string, grade?: string, isTransfer?: boolean) => void;
    removeCompletedCourse: (courseCode: string) => void;
    addPlannedCourse: (courseCode: string, quarter: string) => void;
    movePlannedCourse: (courseCode: string, fromQuarter: string, toQuarter: string) => void;
    removePlannedCourse: (courseCode: string, quarter: string) => void;
    addPlan: (plan: UserPlan) => void;
    addSubstitution: (substitution: Substitution) => void;
    removeSubstitution: (requirementGroupId: string, originalCourseCode: string) => void;
    completeOnboarding: () => void;
    setActiveTab: (tab: 'catalog' | 'planner' | 'requirements' | 'dashboard') => void;
    resetStore: () => void;
}

const initialState = {
    plans: [],
    substitutions: [],
    majors: [],
    emphasisAreas: [],
    courses: {},
    majorRequirements: [],
    emphasisRequirements: {},
    universityRequirements: [],
    isOnboardingComplete: false,
    activeTab: 'catalog' as const
};

export const usePlannerStore = create<PlannerState>()(
    persist(
        (set, get) => ({
            ...initialState,

            setUserId: (userId) => set({ userId }),
            setUserName: (name) => set({ userName: name }),

            setMajor: (majorId) => {
                const { majors } = get();
                const major = majors.find(m => m.id === majorId);
                if (!major) return;

                // Reset emphasis when changing major
                set({
                    selectedMajorId: majorId,
                    selectedEmphasisId: undefined
                });
            },

            setEmphasis: (emphasisId) => set({ selectedEmphasisId: emphasisId }),

            createPlan: (plan) => {
                const newPlan = {
                    ...plan,
                    id: Date.now().toString() // Use a real UUID in production
                };
                set((state) => ({
                    plans: [...state.plans, newPlan],
                    currentPlanId: newPlan.id
                }));
            },

            updatePlan: (planId, updates) => {
                set((state) => ({
                    plans: state.plans.map(plan =>
                        plan.id === planId ? { ...plan, ...updates } : plan
                    )
                }));
            },

            deletePlan: (planId) => {
                set((state) => ({
                    plans: state.plans.filter(plan => plan.id !== planId),
                    currentPlanId: state.currentPlanId === planId ? undefined : state.currentPlanId
                }));
            },

            setCurrentPlan: (planId) => set({ currentPlanId: planId }),

            setPlans: (plans) => set({ plans }),

            addCompletedCourse: (courseCode, grade, isTransfer = false) => {
                const { currentPlanId } = get();
                if (!currentPlanId) return;

                set((state) => ({
                    plans: state.plans.map(plan => {
                        if (plan.id !== currentPlanId) return plan;

                        return {
                            ...plan,
                            completedCourses: [
                                ...plan.completedCourses,
                                {
                                    courseCode,
                                    quarter: '',
                                    status: 'completed',
                                    grade,
                                    isTransfer
                                }
                            ]
                        };
                    })
                }));
            },

            removeCompletedCourse: (courseCode) => {
                const { currentPlanId } = get();
                if (!currentPlanId) return;

                set((state) => ({
                    plans: state.plans.map(plan => {
                        if (plan.id !== currentPlanId) return plan;

                        return {
                            ...plan,
                            completedCourses: plan.completedCourses.filter(
                                course => course.courseCode !== courseCode
                            )
                        };
                    })
                }));
            },

            addPlannedCourse: (courseCode, quarter) => {
                const { currentPlanId } = get();
                if (!currentPlanId) return;

                set((state) => ({
                    plans: state.plans.map(plan => {
                        if (plan.id !== currentPlanId) return plan;

                        // Find the quarter
                        const quarterIndex = plan.quarters.findIndex(q => q.id === quarter);
                        if (quarterIndex === -1) return plan;

                        const updatedQuarters = [...plan.quarters];
                        updatedQuarters[quarterIndex] = {
                            ...updatedQuarters[quarterIndex],
                            courses: [
                                ...updatedQuarters[quarterIndex].courses,
                                {
                                    courseCode,
                                    quarter,
                                    status: 'planned'
                                }
                            ]
                        };

                        return {
                            ...plan,
                            quarters: updatedQuarters
                        };
                    })
                }));
            },

            movePlannedCourse: (courseCode, fromQuarter, toQuarter) => {
                const { currentPlanId } = get();
                if (!currentPlanId) return;

                set((state) => ({
                    plans: state.plans.map(plan => {
                        if (plan.id !== currentPlanId) return plan;

                        // Find the source and target quarters
                        const fromQuarterIndex = plan.quarters.findIndex(q => q.id === fromQuarter);
                        const toQuarterIndex = plan.quarters.findIndex(q => q.id === toQuarter);
                        if (fromQuarterIndex === -1 || toQuarterIndex === -1) return plan;

                        // Get the course to move
                        const courseToMove = plan.quarters[fromQuarterIndex].courses.find(
                            c => c.courseCode === courseCode
                        );
                        if (!courseToMove) return plan;

                        // Create updated quarters
                        const updatedQuarters = [...plan.quarters];

                        // Remove from source quarter
                        updatedQuarters[fromQuarterIndex] = {
                            ...updatedQuarters[fromQuarterIndex],
                            courses: updatedQuarters[fromQuarterIndex].courses.filter(
                                c => c.courseCode !== courseCode
                            )
                        };

                        // Add to target quarter
                        updatedQuarters[toQuarterIndex] = {
                            ...updatedQuarters[toQuarterIndex],
                            courses: [
                                ...updatedQuarters[toQuarterIndex].courses,
                                {
                                    ...courseToMove,
                                    quarter: toQuarter
                                }
                            ]
                        };

                        return {
                            ...plan,
                            quarters: updatedQuarters
                        };
                    })
                }));
            },

            removePlannedCourse: (courseCode, quarter) => {
                const { currentPlanId } = get();
                if (!currentPlanId) return;

                set((state) => ({
                    plans: state.plans.map(plan => {
                        if (plan.id !== currentPlanId) return plan;

                        // Find the quarter
                        const quarterIndex = plan.quarters.findIndex(q => q.id === quarter);
                        if (quarterIndex === -1) return plan;

                        const updatedQuarters = [...plan.quarters];
                        updatedQuarters[quarterIndex] = {
                            ...updatedQuarters[quarterIndex],
                            courses: updatedQuarters[quarterIndex].courses.filter(
                                c => c.courseCode !== courseCode
                            )
                        };

                        return {
                            ...plan,
                            quarters: updatedQuarters
                        };
                    })
                }));
            },

            addPlan: (plan) => {
                set((state) => ({ plans: [...state.plans, plan] }));
            },

            addSubstitution: (substitution) => {
                set((state) => ({
                    substitutions: [...state.substitutions, substitution]
                }));
            },

            removeSubstitution: (requirementGroupId, originalCourseCode) => {
                set((state) => ({
                    substitutions: state.substitutions.filter(
                        s => !(s.requirementGroupId === requirementGroupId &&
                            s.originalCourseCode === originalCourseCode)
                    )
                }));
            },

            completeOnboarding: () => set({ isOnboardingComplete: true }),

            setActiveTab: (tab) => set({ activeTab: tab }),

            resetStore: () => set(initialState)
        }),
        {
            name: 'scu-planner-storage',
            partialize: (state) => ({
                userId: state.userId,
                userName: state.userName,
                currentPlanId: state.currentPlanId,
                plans: state.plans,
                substitutions: state.substitutions,
                selectedMajorId: state.selectedMajorId,
                selectedEmphasisId: state.selectedEmphasisId,
                isOnboardingComplete: state.isOnboardingComplete
            })
        }
    )
); 
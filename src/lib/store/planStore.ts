import { z } from 'zod';
import { UserPlanSchema } from '@/lib/types';

// Extend the UserPlanSchema to include userId and id
export const ApiUserPlanSchema = UserPlanSchema.extend({
    id: z.string().optional(),
    userId: z.string()
});

export type ApiUserPlan = z.infer<typeof ApiUserPlanSchema>;

// In-memory storage for plans (replace with database in production)
export const plans: ApiUserPlan[] = []; 
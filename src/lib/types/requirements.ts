import { z } from "zod";
import { CourseCodeSchema } from "./course";

// =============================================
// REQUIREMENT TYPES
// =============================================

// Requirement type enum
export const RequirementTypeEnum = z.enum([
    "major",
    "emphasis",
    "core",
    "university",
    "pathway",
    "course_expression"
]);
export type RequirementType = z.infer<typeof RequirementTypeEnum>;

// Requirement Group with enhanced validation
export const RequirementGroupSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Requirement name is required"),
    type: RequirementTypeEnum,
    description: z.string().optional(),
    minUnits: z.number().min(0).optional(),
    maxUnits: z.number().min(0).optional(),
    courses: z.array(z.any()).optional(),
    coursesRequired: z.array(CourseCodeSchema).optional(),
    chooseFrom: z.object({
        count: z.number().min(0),
        options: z.array(CourseCodeSchema),
    }).optional(),
    notes: z.string().optional(),
    progress: z.number().min(0).max(100).optional(),
});

export type RequirementGroup = z.infer<typeof RequirementGroupSchema>;

// API Response schemas
export const RequirementsResponseSchema = z.array(RequirementGroupSchema);
export type RequirementsResponse = z.infer<typeof RequirementsResponseSchema>;

// University requirements response
export const UniversityRequirementsResponseSchema = z.object({
    coreRequirements: z.array(RequirementGroupSchema),
    corePathways: z.array(RequirementGroupSchema),
});

export type UniversityRequirementsResponse = z.infer<typeof UniversityRequirementsResponseSchema>; 
import { z } from "zod";

// =============================================
// ACADEMIC TYPES
// =============================================

// School schema
export const SchoolSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "School name is required"),
    description: z.string().optional(),
    courseRequirementsExpression: z.string().optional(),
    unitRequirements: z.array(z.any()).optional(),
    otherRequirements: z.array(z.any()).optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type School = z.infer<typeof SchoolSchema>;

// Department schema  
export const DepartmentSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Department name is required"),
    description: z.string().optional(),
    schoolName: z.string().optional(),
    majorsOffered: z.array(z.string()).optional(),
    minorsOffered: z.array(z.string()).optional(),
    emphases: z.array(z.string()).optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Department = z.infer<typeof DepartmentSchema>;

// Enhanced Major schema
export const MajorSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Major name is required"),
    description: z.string().optional(),
    deptCode: z.string().optional(),
    requiresEmphasis: z.boolean().optional(),
    courseRequirementsExpression: z.string().optional(),
    unitRequirements: z.array(z.any()).optional(),
    otherRequirements: z.array(z.any()).optional(),
    otherNotes: z.string().optional(),
    schoolId: z.string().optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Major = z.infer<typeof MajorSchema>;

// Enhanced Emphasis schema
export const EmphasisSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Emphasis name is required"),
    description: z.string().optional(),
    deptCode: z.string().optional(),
    appliesTo: z.string().optional(),
    courseRequirementsExpression: z.string().optional(),
    unitRequirements: z.array(z.any()).optional(),
    otherRequirements: z.array(z.any()).optional(),
    otherNotes: z.string().optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type Emphasis = z.infer<typeof EmphasisSchema>;

// Core Curriculum schemas
export const CoreCurriculumRequirementSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Requirement name is required"),
    description: z.string().optional(),
    appliesTo: z.string().optional(),
    fulfilledBy: z.string().optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type CoreCurriculumRequirement = z.infer<typeof CoreCurriculumRequirementSchema>;

export const CoreCurriculumPathwaySchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Pathway name is required"),
    description: z.string().optional(),
    associatedCourses: z.string().optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type CoreCurriculumPathway = z.infer<typeof CoreCurriculumPathwaySchema>;

// Special Program schema
export const SpecialProgramSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Program name is required"),
    description: z.string().optional(),
    courseRequirementsExpression: z.string().optional(),
    unitRequirements: z.array(z.any()).optional(),
    otherRequirements: z.array(z.any()).optional(),
    src: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
});

export type SpecialProgram = z.infer<typeof SpecialProgramSchema>;

// API Response schemas
export const SchoolsResponseSchema = z.array(SchoolSchema);
export const DepartmentsResponseSchema = z.array(DepartmentSchema);
export const MajorsResponseSchema = z.array(MajorSchema);
export const EmphasesResponseSchema = z.array(EmphasisSchema);
export const CoreCurriculumRequirementsResponseSchema = z.array(CoreCurriculumRequirementSchema);
export const CoreCurriculumPathwaysResponseSchema = z.array(CoreCurriculumPathwaySchema);
export const SpecialProgramsResponseSchema = z.array(SpecialProgramSchema);

export type SchoolsResponse = z.infer<typeof SchoolsResponseSchema>;
export type DepartmentsResponse = z.infer<typeof DepartmentsResponseSchema>;
export type MajorsResponse = z.infer<typeof MajorsResponseSchema>;
export type EmphasesResponse = z.infer<typeof EmphasesResponseSchema>;
export type CoreCurriculumRequirementsResponse = z.infer<typeof CoreCurriculumRequirementsResponseSchema>;
export type CoreCurriculumPathwaysResponse = z.infer<typeof CoreCurriculumPathwaysResponseSchema>;
export type SpecialProgramsResponse = z.infer<typeof SpecialProgramsResponseSchema>; 
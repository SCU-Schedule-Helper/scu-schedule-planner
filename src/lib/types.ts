import { type SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";
import { z } from "zod";

export type TypedSupabaseClient = SupabaseClient<Database>;

// Enums from database
export const CourseStatusEnum = z.enum(["planned", "completed", "in-progress", "not_started"]);
export type CourseStatus = z.infer<typeof CourseStatusEnum>;

// UI components often use kebab-case "in-progress" – expose a helper type/alias
export type CourseDisplayStatus = z.infer<typeof CourseStatusEnum>;

export const PrerequisiteTypeEnum = z.enum(["required", "or", "recommended"]);
export type PrerequisiteType = z.infer<typeof PrerequisiteTypeEnum>;

export const QuarterTypeEnum = z.enum(["Fall", "Winter", "Spring", "Summer"]);
export type QuarterType = z.infer<typeof QuarterTypeEnum>;

export const RequirementTypeEnum = z.enum(["major", "emphasis", "core", "university"]);
export type RequirementType = z.infer<typeof RequirementTypeEnum>;

// Course schemas
export const CoursePrerequisiteSchema = z.object({
  courses: z.array(z.string()),
  type: PrerequisiteTypeEnum,
  grade: z.string().optional(),
});
export type CoursePrerequisite = z.infer<typeof CoursePrerequisiteSchema>;

export const CourseSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  title: z.string().optional(),
  units: z.number().optional(),
  prerequisites: z.array(z.any()).optional(),
  corequisites: z.array(z.string()).optional(),
  offeredQuarters: z.array(QuarterTypeEnum).optional(),
  // alias for UI compatibility
  quarters: z.array(z.string()).optional(),
  geCategories: z.array(z.string()).optional(),
  department: z.string().optional(),
  subject: z.string().optional(),
  isUpperDivision: z.boolean().optional(),
  level: z.number().optional(),
  status: z.enum(["available", "closed", "waitlist"]).optional(),
  description: z.string().optional(),
  crossListedAs: z.array(z.string()).optional(),
});
export type Course = z.infer<typeof CourseSchema>;

// Requirement schemas
export const RequirementChooseFromSchema = z.object({
  count: z.number(),
  options: z.array(z.string()),
});
export type RequirementChooseFrom = z.infer<typeof RequirementChooseFromSchema>;

export const RequirementGroupSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: RequirementTypeEnum.optional(),
  coursesRequired: z.array(z.string()).optional(),
  courses: z.array(z.string()).optional(),
  chooseFrom: RequirementChooseFromSchema.optional(),
  minUnits: z.number().optional(),
  unitsRequired: z.number().optional(),
  completed: z.boolean().optional(),
  progress: z.number().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});
export type RequirementGroup = z.infer<typeof RequirementGroupSchema>;

// Planner schemas
export const PlannedCourseSchema = z.object({
  courseCode: z.string(),
  quarter: z.string(),
  planStatus: CourseStatusEnum.optional(),
  // duplicate course info for UI convenience (required for components)
  code: z.string().optional(),
  title: z.string().optional(),
  units: z.number().optional(),
  description: z.string().optional(),
  id: z.string().optional(),
  grade: z.string().optional(),
  isTransfer: z.boolean().optional(),
  notes: z.string().optional(),
  status: CourseStatusEnum.optional(),
});
export type PlannedCourse = z.infer<typeof PlannedCourseSchema>;

export const QuarterSchema = z.object({
  id: z.string(),
  name: z.string(),
  courses: z.array(PlannedCourseSchema),
  year: z.number().optional(),
  season: QuarterTypeEnum.optional(),
});
export type Quarter = z.infer<typeof QuarterSchema>;

export const UserPlanSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  majorId: z.string(),
  emphasisId: z.string().optional(),
  catalogYearId: z.string().optional(),
  quarters: z.array(QuarterSchema),
  completedCourses: z.array(PlannedCourseSchema),
  maxUnitsPerQuarter: z.number(),
  includeSummer: z.boolean(),
});
export type UserPlan = z.infer<typeof UserPlanSchema>;

export const SubstitutionSchema = z.object({
  requirementGroupId: z.string(),
  originalCourseCode: z.string(),
  substituteCourseCode: z.string(),
  advisorNote: z.string().optional(),
  approvedAt: z.date().optional(),
});
export type Substitution = z.infer<typeof SubstitutionSchema>;

// API response schemas
export const CourseResponseSchema = CourseSchema;
export type CourseResponse = z.infer<typeof CourseResponseSchema>;

export const CoursesResponseSchema = z.array(CourseSchema);
export type CoursesResponse = z.infer<typeof CoursesResponseSchema>;

export const RequirementGroupResponseSchema = RequirementGroupSchema;
export type RequirementGroupResponse = z.infer<typeof RequirementGroupResponseSchema>;

export const RequirementGroupsResponseSchema = z.array(RequirementGroupSchema);
export type RequirementGroupsResponse = z.infer<typeof RequirementGroupsResponseSchema>;

// Filter schemas
export const CourseFilterSchema = z.object({
  department: z.string().optional(),
  isUpperDivision: z.boolean().optional(),
  quarter: z.string().optional(),
});
export type CourseFilter = z.infer<typeof CourseFilterSchema>;

export const CourseSearchSchema = z.object({
  q: z.string().min(1),
});
export type CourseSearch = z.infer<typeof CourseSearchSchema>;

// API error schema
export const ApiErrorSchema = z.object({
  error: z.string(),
});
export type ApiError = z.infer<typeof ApiErrorSchema>;

// ---------------------------------------------------------------------------
// Additional UI-only helper interfaces (loosely typed, not bound to DB schemas)

export interface Major {
  id: string
  name: string
  code: string
  requirements: RequirementGroup[]
}

export interface EmphasisArea {
  id: string
  name: string
  majorId: string
  requirements: RequirementGroup[]
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  major?: Major
  emphasisAreas: EmphasisArea[]
  completedCourses: Course[]
}

// Some UI components expect a `Requirement` type which is equivalent to RequirementGroup
export type Requirement = RequirementGroup;

import { z } from "zod";

// =============================================
// COURSE TYPES
// =============================================

// Course code validation - strict format validation
export const CourseCodeSchema = z.string().regex(
    /^[A-Z]{2,5}\s*\d+[A-Z]*$/,
    "Invalid course code format"
);

// Units validation - supports text format for flexible units
const UnitsSchema = z.string().regex(
    /^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/,
    "Units must be a number (e.g., '3', '0.5') or range (e.g., '1-5', '2.5-4')"
).nullable().optional();

// Quarter validation
const QuarterTypeEnum = z.enum(["Fall", "Winter", "Spring", "Summer"]);
export type QuarterType = z.infer<typeof QuarterTypeEnum>;

// Prerequisite/Corequisite structure
const PrerequisiteSchema = z.object({
    type: z.enum(["required", "or", "recommended"]),
    courses: z.array(CourseCodeSchema),
    expression: z.string().optional(), // For complex logic like "MATH 11 OR MATH 12"
    minGrade: z.string().optional() // e.g., "C-", "B+"
});

// Enhanced Course schema with strict validation
export const CourseSchema = z.object({
    id: z.string(),
    code: CourseCodeSchema,
    title: z.string().min(1, "Course title is required"),
    description: z.string().nullable().optional(),
    units: UnitsSchema,
    prerequisites: z.array(PrerequisiteSchema).default([]),
    corequisites: z.array(PrerequisiteSchema).default([]),
    quarters_offered: z.array(QuarterTypeEnum).default([]),
    professor: z.string().nullable().optional(),
    src: z.string().nullable().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export type Course = z.infer<typeof CourseSchema>;

// Flexible course type for components that need to handle various course shapes
export interface FlexibleCourse {
    id?: string;
    code?: string;
    title?: string;
    description?: string;
    units?: string | null;
    prerequisites?: unknown;
    corequisites?: unknown;
    quarters_offered?: unknown;
    professor?: string | null;
    src?: string | null;
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown; // Allow additional properties
}

// API Response schemas
export const CourseResponseSchema = CourseSchema;
export const CoursesResponseSchema = z.array(CourseSchema);

export type CourseResponse = z.infer<typeof CourseResponseSchema>;
export type CoursesResponse = z.infer<typeof CoursesResponseSchema>;

// Course search and filter schemas
export const CourseFilterSchema = z.object({
    department: z.string().optional(),
    isUpperDivision: z.boolean().optional(),
    quarter: QuarterTypeEnum.optional(),
    units: UnitsSchema,
    level: z.enum(["lower", "upper"]).optional(),
});

export const CourseSearchSchema = z.object({
    query: z.string().min(1, "Search query is required"),
});

export type CourseFilter = z.infer<typeof CourseFilterSchema>;
export type CourseSearch = z.infer<typeof CourseSearchSchema>; 
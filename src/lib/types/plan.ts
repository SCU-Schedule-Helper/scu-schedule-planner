import { z } from "zod";
import { CourseCodeSchema } from "./course";

// =============================================
// PLAN TYPES
// =============================================

// Course status enum
export const CourseStatusEnum = z.enum(["planned", "completed", "in-progress", "not_started"]);
export type CourseStatus = z.infer<typeof CourseStatusEnum>;

// Year validation for academic planning
const AcademicYearSchema = z.number().int().min(2020).max(2050);

// Quarter validation
const QuarterSchema = z.union([
    z.enum(["Fall", "Winter", "Spring", "Summer"]),
    z.string().regex(/^\d{4}-(Fall|Winter|Spring|Summer)$/, "Quarter must be season name or YYYY-Season format")
]);

// Planned course schema with text-based units
export const PlannedCourseSchema = z.object({
    courseCode: CourseCodeSchema,
    quarter: z.union([
        QuarterSchema,
        z.string().length(0) // Allow empty string for completed courses
    ]),
    status: CourseStatusEnum.default("planned"),
    grade: z.string().optional(),
    isTransfer: z.boolean().optional(),

    // Optional fields for UI/display
    code: CourseCodeSchema.optional(),
    title: z.string().optional(),
    units: z.string().optional(),
    planStatus: CourseStatusEnum.optional(),
}).refine((data) => {
    // For completed courses, allow empty quarter
    if (data.status === "completed") {
        return true;
    }
    // For planned/in-progress courses, require valid quarter format
    return data.quarter !== "" && (
        z.enum(["Fall", "Winter", "Spring", "Summer"]).safeParse(data.quarter).success ||
        /^\d{4}-(Fall|Winter|Spring|Summer)$/.test(data.quarter as string)
    );
}, {
    message: "Planned courses must have a valid quarter (season name or YYYY-Season format)",
    path: ["quarter"]
});

export type PlannedCourse = z.infer<typeof PlannedCourseSchema>;

// Quarter schema with validation
export const QuarterSchema_v2 = z.object({
    id: z.string(),
    name: z.string().min(1, "Quarter name is required"),
    season: z.enum(["Fall", "Winter", "Spring", "Summer"]),
    year: AcademicYearSchema,
    courses: z.array(PlannedCourseSchema).default([]),
    maxUnits: z.string().optional(),
});

export type Quarter = z.infer<typeof QuarterSchema_v2>;

// User plan schema with enhanced validation
export const UserPlanSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Plan name is required"),
    majorId: z.string().min(1, "Major is required"),
    emphasisId: z.string().optional(),
    catalogYearId: z.string().default("current"),
    maxUnitsPerQuarter: z.number().min(1).max(30).default(20), // Keep as number for plan-level settings
    includeSummer: z.boolean().default(false),
    graduationYear: AcademicYearSchema.optional(),
    quarters: z.array(QuarterSchema_v2).default([]),
    completedCourses: z.array(PlannedCourseSchema).default([]),
});

export type UserPlan = z.infer<typeof UserPlanSchema>;

// API version of UserPlan with userId and optional id for server-side operations
export const ApiUserPlanSchema = UserPlanSchema.extend({
    id: z.string().optional(),
    userId: z.string()
});

export type ApiUserPlan = z.infer<typeof ApiUserPlanSchema>;

// Substitution schema with validation
export const SubstitutionSchema = z.object({
    requirementGroupId: z.string(),
    originalCourseCode: CourseCodeSchema,
    substituteCourseCode: CourseCodeSchema,
    advisorNote: z.string().optional(),
    approvedAt: z.date().optional(),
    isUpperDivOverride: z.boolean().nullable().optional(),
    unitsOverride: z.string().optional(),
});

export type Substitution = z.infer<typeof SubstitutionSchema>;

export interface MovePlannedCoursePayload {
    planId: string;
    courseCode: string;
    fromQuarter: string;
    fromYear: number;
    toQuarter: string;
    toYear: number;
} 
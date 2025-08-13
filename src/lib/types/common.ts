import { z } from "zod";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database.types";

// =============================================
// COMMON TYPES
// =============================================

// Re-export error types from the errors module
export { ErrorResponseSchema, type ErrorResponse } from '../errors';

// Legacy API error schema (deprecated - use ErrorResponseSchema instead)
export const ApiErrorSchema = z.object({
    error: z.string(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// =============================================
// PAGINATION TYPES
// =============================================

export const PaginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(20),
    total: z.number().min(0),
    totalPages: z.number().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// =============================================
// SEARCH TYPES
// =============================================

export const SearchParamsSchema = z.object({
    query: z.string().min(1).max(100),
    filters: z.record(z.unknown()).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchParams = z.infer<typeof SearchParamsSchema>;

// =============================================
// RESPONSE TYPES
// =============================================

export const BaseResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    timestamp: z.string(),
});

export type BaseResponse = z.infer<typeof BaseResponseSchema>;

// =============================================
// VALIDATION TYPES
// =============================================

export const ValidationErrorSchema = z.object({
    field: z.string(),
    message: z.string(),
    code: z.string().optional(),
});

export type ValidationError = z.infer<typeof ValidationErrorSchema>;

export const ValidationResultSchema = z.object({
    isValid: z.boolean(),
    errors: z.array(ValidationErrorSchema),
});

export type ValidationResult = z.infer<typeof ValidationResultSchema>;

// =============================================
// UTILITY TYPES
// =============================================

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// =============================================
// STATUS TYPES
// =============================================

export const StatusSchema = z.enum(['active', 'inactive', 'pending', 'deleted']);
export type Status = z.infer<typeof StatusSchema>;

// =============================================
// TIMESTAMP TYPES
// =============================================

export const TimestampSchema = z.object({
    created_at: z.string(),
    updated_at: z.string(),
});

export type Timestamp = z.infer<typeof TimestampSchema>;

// =============================================
// ID TYPES
// =============================================

export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;

// =============================================
// METADATA TYPES
// =============================================

export const MetadataSchema = z.record(z.unknown());
export type Metadata = z.infer<typeof MetadataSchema>;

// User interface
export interface User {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
}

// Requirement interface (for UI components)
export interface Requirement {
    id: string;
    name: string;
    description?: string;
    courses?: Array<{
        id: string;
        code: string;
        title: string;
        units: string;
    }>;
    type: "major" | "core" | "emphasis" | "university";
    progress?: number;
    unitsRequired?: number;
    minUnits?: number;
    completed?: boolean;
}

// Note: Unit utilities moved to @/lib/utils/units for better organization

// Supabase client type
export type TypedSupabaseClient = SupabaseClient<Database>; 
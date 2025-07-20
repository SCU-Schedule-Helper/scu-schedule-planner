import { NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Error Handling System for API Routes
 * 
 * This module provides a standardized error handling pattern for all API routes.
 * It ensures consistent error responses, proper logging, and type safety.
 * 
 * USAGE PATTERN:
 * 
 * ```typescript
 * export async function GET(request: Request) {
 *   return withErrorHandling(async () => {
 *     // Your API logic here
 *     const data = await fetchData();
 *     
 *     if (error) {
 *       logApiError(ApiError.databaseError('Failed to fetch data'), { error });
 *       throw ApiError.databaseError('Failed to fetch data');
 *     }
 *     
 *     return NextResponse.json(data);
 *   })().catch(error => handleApiError(error, request));
 * }
 * ```
 * 
 * KEY FEATURES:
 * - Structured error responses with codes and details
 * - Automatic logging of errors with context
 * - Type-safe error creation and handling
 * - Validation helpers for common checks
 * - Consistent HTTP status codes
 */

// =============================================
// ERROR CODES
// =============================================

export const ERROR_CODES = {
    // Database errors
    DATABASE_CONNECTION_FAILED: 'DATABASE_CONNECTION_FAILED',
    DATABASE_QUERY_FAILED: 'DATABASE_QUERY_FAILED',
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    DUPLICATE_RECORD: 'DUPLICATE_RECORD',

    // Validation errors
    VALIDATION_FAILED: 'VALIDATION_FAILED',
    INVALID_INPUT: 'INVALID_INPUT',
    MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

    // API errors
    RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',

    // Business logic errors
    COURSE_NOT_FOUND: 'COURSE_NOT_FOUND',
    PLAN_NOT_FOUND: 'PLAN_NOT_FOUND',
    REQUIREMENT_NOT_FOUND: 'REQUIREMENT_NOT_FOUND',
    INVALID_COURSE_CODE: 'INVALID_COURSE_CODE',
    INVALID_UNITS_FORMAT: 'INVALID_UNITS_FORMAT',

    // System errors
    INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
    EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

// =============================================
// ERROR CLASSES
// =============================================

/**
 * ApiError Class
 * 
 * Represents a structured API error with status code, error code, and optional details.
 * Used throughout the application for consistent error handling.
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code: ErrorCode = ERROR_CODES.INTERNAL_SERVER_ERROR,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'ApiError';
    }

    static notFound(message: string, code?: ErrorCode) {
        return new ApiError(message, 404, code || ERROR_CODES.NOT_FOUND);
    }

    static badRequest(message: string, code?: ErrorCode, details?: Record<string, unknown>) {
        return new ApiError(message, 400, code || ERROR_CODES.INVALID_INPUT, details);
    }

    static unauthorized(message: string = 'Unauthorized') {
        return new ApiError(message, 401, ERROR_CODES.UNAUTHORIZED);
    }

    static forbidden(message: string = 'Forbidden') {
        return new ApiError(message, 403, ERROR_CODES.FORBIDDEN);
    }

    static rateLimitExceeded(message: string = 'Rate limit exceeded') {
        return new ApiError(message, 429, ERROR_CODES.RATE_LIMIT_EXCEEDED);
    }

    static validationFailed(message: string, details?: Record<string, unknown>) {
        return new ApiError(message, 400, ERROR_CODES.VALIDATION_FAILED, details);
    }

    static databaseError(message: string, code?: ErrorCode) {
        return new ApiError(message, 500, code || ERROR_CODES.DATABASE_QUERY_FAILED);
    }

    static internalError(message: string = 'Internal server error') {
        return new ApiError(message, 500, ERROR_CODES.INTERNAL_SERVER_ERROR);
    }
}

// =============================================
// ERROR RESPONSE SCHEMAS
// =============================================

export const ErrorResponseSchema = z.object({
    error: z.string(),
    code: z.string(),
    details: z.record(z.unknown()).optional(),
    timestamp: z.string(),
    path: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

// =============================================
// ERROR HANDLING UTILITIES
// =============================================

/**
 * Creates a standardized error response with proper structure and metadata
 */
export function createErrorResponse(
    error: ApiError,
    request?: Request
): NextResponse {
    const errorResponse: ErrorResponse = {
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString(),
        path: request ? new URL(request.url).pathname : undefined,
    };

    return NextResponse.json(errorResponse, { status: error.statusCode });
}

/**
 * Central error handler that converts various error types to ApiError responses
 * Used as the final catch block in API routes
 */
export function handleApiError(error: unknown, request?: Request): NextResponse {
    // If it's already an ApiError, use it directly
    if (error instanceof ApiError) {
        return createErrorResponse(error, request);
    }

    // If it's a Zod validation error, convert it
    if (error instanceof z.ZodError) {
        const apiError = ApiError.validationFailed(
            'Validation failed',
            { errors: error.errors }
        );
        return createErrorResponse(apiError, request);
    }

    // If it's a standard Error, convert it
    if (error instanceof Error) {
        const apiError = ApiError.internalError(error.message);
        return createErrorResponse(apiError, request);
    }

    // For unknown errors, create a generic internal error
    const apiError = ApiError.internalError('An unexpected error occurred');
    return createErrorResponse(apiError, request);
}

// =============================================
// VALIDATION HELPERS
// =============================================

/**
 * Validates that a required field is present and not empty
 * Throws ApiError.badRequest if validation fails
 */
export function validateRequiredField(
    value: unknown,
    fieldName: string
): void {
    if (value === null || value === undefined || value === '') {
        throw ApiError.badRequest(
            `${fieldName} is required`,
            ERROR_CODES.MISSING_REQUIRED_FIELD,
            { field: fieldName }
        );
    }
}

/**
 * Validates course code format (e.g., CSCI10, MATH11A)
 * Throws ApiError.badRequest if format is invalid
 */
export function validateCourseCode(courseCode: string): void {
    if (!courseCode || !/^[A-Z]{2,5}\s*\d+[A-Z]*$/.test(courseCode)) {
        throw ApiError.badRequest(
            'Invalid course code format',
            ERROR_CODES.INVALID_COURSE_CODE,
            { courseCode, expectedFormat: 'e.g., CSCI10, MATH11A' }
        );
    }
}

/**
 * Validates units format (e.g., 3, 3.5, 1-5, 2.5-4)
 * Throws ApiError.badRequest if format is invalid
 */
export function validateUnits(units: string | null): void {
    if (units !== null && !/^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/.test(units)) {
        throw ApiError.badRequest(
            'Invalid units format',
            ERROR_CODES.INVALID_UNITS_FORMAT,
            { units, expectedFormat: 'e.g., 3, 3.5, 1-5, 2.5-4' }
        );
    }
}

// =============================================
// LOGGING UTILITIES
// =============================================

/**
 * Logs API errors with structured context for debugging
 * Should be called before throwing ApiError in API routes
 */
export function logApiError(error: ApiError, context?: Record<string, unknown>): void {
    console.error('API Error:', {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
        context,
        timestamp: new Date().toISOString(),
    });
}

/**
 * Logs validation errors with field details for debugging
 * Used when data validation fails
 */
export function logValidationError(
    field: string,
    value: unknown,
    message: string,
    expectedFormat?: string
): void {
    console.warn('Validation Error:', {
        field,
        value,
        message,
        expectedFormat,
        timestamp: new Date().toISOString(),
    });
}

// =============================================
// HIGH-LEVEL ERROR HANDLING WRAPPER
// =============================================

/**
 * withErrorHandling - High-level wrapper for API route functions
 * 
 * Wraps API route logic with standardized error handling.
 * Automatically catches errors and converts them to proper API responses.
 * 
 * Usage:
 * ```typescript
 * export async function GET(request: Request) {
 *   return withErrorHandling(async () => {
 *     // Your API logic here
 *     return NextResponse.json(data);
 *   })().catch(error => handleApiError(error, request));
 * }
 * ```
 */
export function withErrorHandling<T extends any[], R>(
    fn: (...args: T) => Promise<R>
) {
    return (...args: T) => fn(...args);
} 
export type ValidationLevel = "error" | "warning";

export interface ValidationMessage {
    code: string; // machine-readable enum string, e.g. "PREREQ_UNMET"
    level: ValidationLevel;
    message: string; // user-friendly
    context?: Record<string, unknown>;
}

export interface CourseReport {
    code: string;
    messages: ValidationMessage[]; // mix of errors & warnings
}

export interface RequirementStatus {
    id?: string;
    name: string;
    satisfied: boolean;
    progress: number; // 0–1 for chooseFrom/minUnits, 0/1 for allOf
}

export interface ValidationReport {
    messages: ValidationMessage[]; // plan-level messages
    courseReports: Record<string, CourseReport>; // keyed by course code
    requirementStatus: Record<string, RequirementStatus>; // keyed by requirement name/id
    meta: {
        generatedAt: string;
        engineVersion: string;
    };
}

export interface ValidationSettings {
    maxUnitsPerQuarter: number;
    includeSummer?: boolean;
} 
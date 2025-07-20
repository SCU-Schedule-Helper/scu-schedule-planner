/**
 * Units Utility Functions
 * 
 * Handles parsing and formatting of academic units which can be:
 * - Fixed values: "3", "0.5", "4"
 * - Ranges: "1-5", "2.5-4", "1-3"
 */

// Utility type for parsed units
export interface ParsedUnits {
    type: 'fixed' | 'range';
    min: number;
    max: number;
    display: string;
}

/**
 * Parse units string into structured format
 * @param units - Units string from database (e.g., "3", "1-5", "0.5")
 * @returns Parsed units object or null if invalid
 */
export const parseUnits = (units: string | null | undefined): ParsedUnits | null => {
    if (!units || units.trim() === '') return null;

    const cleanUnits = units.trim();

    // Range format (e.g., "1-5", "2.5-4")
    const rangeMatch = cleanUnits.match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)$/);
    if (rangeMatch) {
        const min = parseFloat(rangeMatch[1]);
        const max = parseFloat(rangeMatch[2]);
        return {
            type: 'range',
            min,
            max,
            display: `${min}-${max} units`
        };
    }

    // Fixed format (e.g., "3", "0.5")
    const fixedMatch = cleanUnits.match(/^(\d+(?:\.\d+)?)$/);
    if (fixedMatch) {
        const value = parseFloat(fixedMatch[1]);
        return {
            type: 'fixed',
            min: value,
            max: value,
            display: `${value} unit${value === 1 ? '' : 's'}`
        };
    }

    return null;
};

/**
 * Get minimum units for calculations
 * @param units - Units string
 * @returns Minimum units value
 */
export const getMinUnits = (units: string | null | undefined): number => {
    const parsed = parseUnits(units);
    return parsed?.min ?? 0;
};

/**
 * Get maximum units for calculations  
 * @param units - Units string
 * @returns Maximum units value
 */
export const getMaxUnits = (units: string | null | undefined): number => {
    const parsed = parseUnits(units);
    return parsed?.max ?? 0;
};

/**
 * Get average units for estimates
 * @param units - Units string
 * @returns Average units value
 */
export const getAverageUnits = (units: string | null | undefined): number => {
    const parsed = parseUnits(units);
    if (!parsed) return 0;
    return (parsed.min + parsed.max) / 2;
};

/**
 * Format units for display in UI
 * @param units - Units string
 * @returns Formatted display string
 */
export const formatUnits = (units: string | null | undefined): string => {
    const parsed = parseUnits(units);
    return parsed?.display ?? '0 units';
};

/**
 * Validate units string format
 * @param units - Units string to validate
 * @returns True if valid format
 */
export const isValidUnitsFormat = (units: string | null | undefined): boolean => {
    if (!units) return true; // null/undefined is valid
    return /^(\d+(\.\d+)?|\d+-\d+|\d+(\.\d+)?-\d+(\.\d+)?)$/.test(units.trim());
};

/**
 * Calculate total units for an array of courses
 * @param courses - Array of courses with units
 * @param useMax - Whether to use max units for ranges (default: false, uses average)
 * @returns Total units
 */
export const calculateTotalUnits = (
    courses: Array<{ units?: string | null }>,
    useMax: boolean = false
): number => {
    return courses.reduce((total, course) => {
        if (!course.units) return total;
        const parsed = parseUnits(course.units);
        if (!parsed) return total;

        if (useMax) {
            return total + parsed.max;
        } else if (parsed.type === 'range') {
            return total + getAverageUnits(course.units);
        } else {
            return total + parsed.min;
        }
    }, 0);
};

/**
 * Check if units are within a given range
 * @param units - Units string to check
 * @param minAllowed - Minimum allowed units
 * @param maxAllowed - Maximum allowed units
 * @returns True if within range
 */
export const isUnitsInRange = (
    units: string | null | undefined,
    minAllowed: number,
    maxAllowed: number
): boolean => {
    const parsed = parseUnits(units);
    if (!parsed) return false;

    return parsed.min >= minAllowed && parsed.max <= maxAllowed;
}; 
import { Courses } from "@/data/courses";
import { tool, jsonSchema } from "ai";

type ListCoursesArgs = {
    subject?: string;
    level?: number;
    quarter?: "Fall" | "Winter" | "Spring" | "Summer";
    units?: number;
    keyword?: string;
};

function filterCourses({ subject, level, quarter, units, keyword }: ListCoursesArgs) {
    const all = Object.values(Courses);
    return all
        .filter((c) => {
            const subjectOk = !subject || c.department.toLowerCase() === subject.toLowerCase();
            const levelOk = !level || (c.code.match(/\d+/)?.[0] ?? "") === String(level);
            const unitsOk = !units || c.units === units;
            const quarterOk = !quarter || (c.offeredQuarters?.includes(quarter) ?? false);
            const keyLower = keyword?.toLowerCase();
            const keywordOk =
                !keyword ||
                c.title.toLowerCase().includes(keyLower!) ||
                (c.description?.toLowerCase().includes(keyLower!) ?? false);
            return subjectOk && levelOk && unitsOk && quarterOk && keywordOk;
        })
        .slice(0, 20)
        .map((c) => ({ code: c.code, title: c.title, units: c.units }));
}

// 1. Define the function schema shared with OpenAI
export const tools = {
    list_courses: tool({
        description: "Return SCU courses filtered by optional criteria.",
        parameters: jsonSchema({
            type: "object",
            properties: {
                subject: { type: "string", description: "Department abbreviation such as CSEN, CSCI, MATH" },
                level: { type: "integer", description: "Course level number within the code, e.g. 10 or 120" },
                quarter: { type: "string", enum: ["Fall", "Winter", "Spring", "Summer"], description: "Quarter in which the course is offered" },
                units: { type: "integer", description: "Exact number of units" },
                keyword: { type: "string", description: "Keyword to search in title or description" },
            },
            required: [],
            additionalProperties: false,
        }),
        execute: async (args: unknown) => filterCourses(args as ListCoursesArgs),
    }),
} as const;

// ----- Runtime side helpers -----

export async function runFunction(
    name: string,
    args: unknown,
): Promise<unknown> {
    switch (name) {
        case "list_courses":
            return listCourses(args as ListCoursesArgs);
        default:
            throw new Error(`Unknown function: ${name}`);
    }
}

async function listCourses({ subject, level, quarter, units, keyword }: ListCoursesArgs) {
    const all = Object.values(Courses);
    const filtered = all.filter((c) => {
        const matchesSubject = !subject || c.department.toLowerCase() === subject.toLowerCase();
        const matchesLevel = !level || (c.code.match(/\d+/)?.[0] ?? "") === String(level);
        const matchesUnits = !units || c.units === units;
        const matchesQuarter = !quarter || (c.offeredQuarters?.includes(quarter) ?? false);
        const lowerKey = keyword?.toLowerCase();
        const matchesKeyword = !keyword ||
            c.title.toLowerCase().includes(lowerKey!) ||
            (c.description?.toLowerCase().includes(lowerKey!) ?? false);
        return matchesSubject && matchesLevel && matchesUnits && matchesQuarter && matchesKeyword;
    });
    // Return concise info to save tokens.
    return filtered.slice(0, 20).map((c) => ({ code: c.code, title: c.title, units: c.units }));
} 
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for major
const MajorSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string()
});

export async function GET() {
    try {
        // For now, we'll return mock data since we don't have a real database table for majors yet
        // In a real application, you would fetch this from the database
        const majors = [
            {
                id: "cs",
                name: "Computer Science",
                code: "CSCI"
            },
            {
                id: "csen",
                name: "Computer Science & Engineering",
                code: "CSEN"
            },
            {
                id: "math",
                name: "Mathematics",
                code: "MATH"
            }
        ];

        // Validate with schema
        const validatedMajors = z.array(MajorSchema).parse(majors);

        return NextResponse.json(validatedMajors);
    } catch (error) {
        console.error('Error in majors API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch majors' },
            { status: 500 }
        );
    }
} 
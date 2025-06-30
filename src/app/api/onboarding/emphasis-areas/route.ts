import { NextResponse } from 'next/server';
import { z } from 'zod';

// Define schema for emphasis area
const EmphasisAreaSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
    majorId: z.string()
});

type EmphasisArea = z.infer<typeof EmphasisAreaSchema>;

export async function GET(request: Request) {
    try {
        // Get majorId from query params
        const { searchParams } = new URL(request.url);
        const majorId = searchParams.get('majorId');

        if (!majorId) {
            return NextResponse.json(
                { error: 'majorId is required' },
                { status: 400 }
            );
        }

        // For now, we'll return mock data based on the majorId
        // In a real application, you would fetch this from the database
        let emphasisAreas: EmphasisArea[] = [];

        if (majorId === 'cs') {
            emphasisAreas = [
                {
                    id: "algorithms",
                    name: "Algorithms and Complexity",
                    description: "Focus on advanced algorithms and computational complexity",
                    majorId: "cs"
                },
                {
                    id: "data-science",
                    name: "Data Science",
                    description: "Focus on data analysis, machine learning, and AI",
                    majorId: "cs"
                },
                {
                    id: "security",
                    name: "Security",
                    description: "Focus on computer and network security",
                    majorId: "cs"
                },
                {
                    id: "software",
                    name: "Software",
                    description: "Focus on software engineering and development",
                    majorId: "cs"
                }
            ];
        } else if (majorId === 'csen') {
            emphasisAreas = [
                {
                    id: "embedded",
                    name: "Embedded Systems",
                    description: "Focus on embedded and real-time systems",
                    majorId: "csen"
                },
                {
                    id: "robotics",
                    name: "Robotics",
                    description: "Focus on robotics and automation",
                    majorId: "csen"
                }
            ];
        }

        // Validate with schema
        const validatedEmphasisAreas = z.array(EmphasisAreaSchema).parse(emphasisAreas);

        return NextResponse.json(validatedEmphasisAreas);
    } catch (error) {
        console.error('Error in emphasis areas API:', error);
        return NextResponse.json(
            { error: 'Failed to fetch emphasis areas' },
            { status: 500 }
        );
    }
} 
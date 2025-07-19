import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { type NextRequest } from "next/server";
import { tools } from "./functions";
import { assistantPrompt } from "@/lib/prompts";

export const runtime = "edge";

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
        return new Response("Invalid payload", { status: 400 });
    }
    try {

        const result = await streamText({
            model: openai("gpt-4o-mini"),
            messages: [
                {
                    role: "system",
                    content: assistantPrompt,
                },
                ...messages,
            ],
            tools,
            toolChoice: "auto",
            maxSteps: 10,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error(error);
        return new Response("Internal server error", { status: 500 });
    }
} 
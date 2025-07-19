"use client";

import type { Message as AIMessage } from "ai";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: AIMessage;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm max-w-[80%] whitespace-pre-wrap",
          isUser ? "bg-scu-cardinal text-white" : "bg-muted"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

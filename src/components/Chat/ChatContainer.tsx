"use client";

import { useChat } from "@ai-sdk/react";
import type { Message as AIMessage } from "ai";
import ChatMessage from "@/components/Chat/ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatContainer() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m: AIMessage) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {isLoading && (
          <ChatMessage
            message={{ id: "loading", role: "assistant", content: "..." }}
          />
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex gap-2 bg-background"
      >
        <Input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask me anything about your degree..."
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

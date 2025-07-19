"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import ChatContainer from "@/components/Chat/ChatContainer";

export default function AssistantPage() {
  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1">
        <HeaderBar title="AI Assistant" />
        <main className="h-[calc(100vh-4rem)]">
          {/* 4rem ≈ header height */}
          <ChatContainer />
        </main>
      </div>
    </div>
  );
}

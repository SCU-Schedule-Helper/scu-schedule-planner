"use client";

import { ReactNode } from "react";
import { SidebarNav } from "@/components/sidebar-nav";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex h-screen bg-background">
      <SidebarNav />
      <main>{children}</main>
    </div>
  );
}

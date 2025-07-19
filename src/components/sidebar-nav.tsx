"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, BookOpen, CheckSquare } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Plan",
    href: "/plans",
    icon: Calendar,
  },
  {
    name: "Catalog",
    href: "/catalog",
    icon: BookOpen,
  },
  {
    name: "Requirements",
    href: "/requirements",
    icon: CheckSquare,
  },
  {
    name: "Assistant",
    href: "/assistant",
    icon: LayoutDashboard,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background border-r min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="w-8 h-8 bg-scu-cardinal rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">SCU</span>
          </div>
          <span className="font-bold text-scu-cardinal">Schedule Planner</span>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive &&
                      "bg-scu-cardinal text-white hover:bg-scu-cardinal/90"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

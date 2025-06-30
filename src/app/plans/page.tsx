"use client";

import { SidebarNav } from "@/components/sidebar-nav";
import { HeaderBar } from "@/components/header-bar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { usePlansQuery } from "@/hooks/api/usePlanQuery";
import { usePlannerStore } from "@/hooks/usePlannerStore";
import { Plus } from "lucide-react";

export default function PlansIndexPage() {
  const { userId } = usePlannerStore();
  const { data: plans = [], isLoading } = usePlansQuery(userId ?? "");

  return (
    <div className="flex">
      <SidebarNav />
      <div className="flex-1">
        <HeaderBar title="My Plans" />

        <main className="p-6 space-y-6">
          <div className="flex justify-end">
            {/* TODO: wire to create flow */}
            <Button asChild>
              <Link href="/onboarding">
                <Plus className="h-4 w-4 mr-2" /> New Plan
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <p>Loading...</p>
          ) : plans.length === 0 ? (
            <p className="text-muted-foreground">You have no plans yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <Link href={`/plans/${plan.id}`} className="block h-full">
                    <CardHeader>
                      <CardTitle className="text-scu-cardinal">
                        {plan.name}
                      </CardTitle>
                      <CardDescription>
                        {plan.quarters.length} quarters •{" "}
                        {plan.completedCourses.length} completed
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Major: {plan.majorId}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

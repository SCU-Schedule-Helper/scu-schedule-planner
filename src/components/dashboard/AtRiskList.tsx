"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useCoursesQuery } from "@/hooks/api/useCoursesQuery";

interface Props {
  courseCodes: string[];
}

export function AtRiskList({ courseCodes }: Props) {
  const { data: catalog = [] } = useCoursesQuery();

  if (!courseCodes || courseCodes.length === 0) return null;

  const courses = courseCodes.map((code) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const info = catalog.find((c: any) => c.code === code);
    return { code, title: info?.title };
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-600" />
        <CardTitle className="text-sm font-medium">At-Risk Courses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {courses.map((c) => (
          <div key={c.code} className="text-sm flex flex-col">
            <span className="font-medium text-scu-cardinal">{c.code}</span>
            {c.title && (
              <span className="text-muted-foreground text-xs">{c.title}</span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

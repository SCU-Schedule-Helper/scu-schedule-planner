"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { RequirementProgress } from "@/lib/metrics/computeDashboardMetrics";

interface Props {
  data: RequirementProgress[];
}

export function RequirementBarChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  // Prepare chart data: { name, progress }
  const chartData = data.map((d) => ({ name: d.name, progress: d.progress }));

  const config = { req: { label: "Progress", color: "#b31b1b" } } as const;

  return (
    <ChartContainer config={config} className="w-full h-72">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 100]} hide />
        <YAxis
          type="category"
          dataKey="name"
          width={150}
          tick={{ fontSize: 12 }}
        />
        <Bar
          dataKey="progress"
          fill="var(--color-req, #b31b1b)"
          barSize={14}
          radius={[0, 6, 6, 0]}
        />
        <ChartTooltip content={<ChartTooltipContent labelKey="name" />} />
      </BarChart>
    </ChartContainer>
  );
}

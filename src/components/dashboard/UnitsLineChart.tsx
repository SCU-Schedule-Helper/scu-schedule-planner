"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { UnitsByQuarter } from "@/lib/metrics/computeDashboardMetrics";

interface Props {
  data: UnitsByQuarter[];
}

export function UnitsLineChart({ data }: Props) {
  if (!data || data.length === 0) return null;

  const config = {
    planned: { label: "Units", color: "#b31b1b" },
  } as const;

  return (
    <ChartContainer config={config} className="w-full h-64">
      <LineChart
        data={data}
        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="quarter"
          fontSize={12}
          interval={0}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis fontSize={12} />
        <Line
          type="monotone"
          dataKey="units"
          stroke="var(--color-planned, #b31b1b)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
      </LineChart>
    </ChartContainer>
  );
}

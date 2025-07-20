"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import type { PrereqDepthResult } from "@/lib/analytics/calculatePrereqDepths";

interface Props {
  data: PrereqDepthResult[];
  maxBars?: number;
  onSelectCourse?: (code: string) => void;
}

export function PrereqDepthBarChart({
  data,
  maxBars = 15,
  onSelectCourse,
}: Props) {
  if (!data || data.length === 0) return null;

  const limited = data
    .slice(0, maxBars)
    .map((d) => ({ ...d, name: d.courseCode }));

  const config = { depth: { label: "Depth", color: "#b31b1b" } } as const;

  const getFill = (depth: number) => {
    if (depth >= 5) return "#b31b1b"; // red
    if (depth >= 3) return "#eab308"; // yellow
    return "#64748b"; // slate
  };

  return (
    <ChartContainer config={config} className="w-full h-72">
      <BarChart
        data={limited}
        layout="vertical"
        margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, Math.max(...limited.map((d) => d.depth))]}
          hide
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 12 }}
        />
        <Bar
          dataKey="depth"
          isAnimationActive={false}
          barSize={14}
          radius={[0, 6, 6, 0]}
          label={{ position: "right", fontSize: 10 }}
          onClick={(data: unknown) => {
            // Recharts passes event obj where payload holds original datum
            const anyData = data as { payload?: { code?: string } };
            const code = anyData?.payload?.code;
            if (onSelectCourse && code) onSelectCourse(code);
          }}
        >
          {limited.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getFill(entry.depth)}
              cursor="pointer"
            />
          ))}
        </Bar>
        <ChartTooltip content={<ChartTooltipContent labelKey="name" />} />
      </BarChart>
    </ChartContainer>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { CHART_COLORS } from "@/constants";

interface WinRateChartProps {
  data: { name: string; winRate: number; count?: number }[];
  height?: number;
}

export default function WinRateChart({ data, height = 250 }: WinRateChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
          domain={[0, 100]}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(3, 7, 18, 0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px",
          }}
          labelStyle={{ color: "#9ca3af" }}
          formatter={(value) => [`${Number(value).toFixed(1)}%`, "Win Rate"]}
        />
        <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell
              key={idx}
              fill={entry.winRate >= 50 ? CHART_COLORS.gold : CHART_COLORS.red}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

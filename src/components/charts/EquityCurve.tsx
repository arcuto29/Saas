"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { CHART_COLORS } from "@/constants";

interface EquityCurveProps {
  data: { date: string; equity: number }[];
  height?: number;
}

export default function EquityCurve({ data, height = 300 }: EquityCurveProps) {
  const isPositive = data.length > 1 && data[data.length - 1].equity >= data[0].equity;
  const color = isPositive ? CHART_COLORS.green : CHART_COLORS.red;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#6b7280", fontSize: 11 }}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
        />
        <Tooltip
          contentStyle={{
            background: "rgba(3, 7, 18, 0.95)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            padding: "12px",
          }}
          labelStyle={{ color: "#9ca3af" }}
          itemStyle={{ color: "#fff" }}
          formatter={(value) => [`$${Number(value).toLocaleString()}`, "Equity"]}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke={color}
          strokeWidth={2}
          fill="url(#equityGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

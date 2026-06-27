"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CalendarHeatmapProps {
  data: { date: string; pnl: number; trades: number }[];
  month: number;
  year: number;
}

export default function CalendarHeatmap({ data, month, year }: CalendarHeatmapProps) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getColor = (pnl: number) => {
    if (pnl > 500) return "bg-emerald-400/80";
    if (pnl > 200) return "bg-emerald-500/60";
    if (pnl > 0) return "bg-emerald-600/40";
    if (pnl === 0) return "bg-white/5";
    if (pnl > -200) return "bg-red-600/40";
    if (pnl > -500) return "bg-red-500/60";
    return "bg-red-400/80";
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const dayData = data.find((d) => d.date === dateStr);
    days.push({ day: i, ...dayData });
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekdays.map((d) => (
          <div key={d} className="text-center text-xs text-gray-500 font-medium py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.01 }}
            className={cn(
              "aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative group cursor-pointer",
              day ? getColor(day.pnl || 0) : "bg-transparent"
            )}
          >
            {day && (
              <>
                <span className="text-[10px] text-gray-300 font-medium">{day.day}</span>
                {day.pnl !== undefined && day.pnl !== 0 && (
                  <span className={cn(
                    "text-[9px] font-medium",
                    (day.pnl ?? 0) > 0 ? "text-emerald-300" : "text-red-300"
                  )}>
                    ${Math.abs(day.pnl ?? 0).toFixed(0)}
                  </span>
                )}
                {/* Tooltip */}
                {day.trades !== undefined && day.trades > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-gray-900 border border-white/10 rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                      <p className="text-gray-300">{day.trades} trade{day.trades > 1 ? "s" : ""}</p>
                      <p className={cn(day.pnl && day.pnl > 0 ? "text-emerald-400" : "text-red-400")}>
                        ${day.pnl?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

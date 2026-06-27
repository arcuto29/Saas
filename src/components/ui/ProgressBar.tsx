"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "gold" | "green" | "red" | "blue";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function ProgressBar({ value, max = 100, variant = "gold", size = "md", showLabel = false, className }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const colors = {
    gold: "from-yellow-600 to-yellow-400",
    green: "from-emerald-600 to-emerald-400",
    red: "from-red-600 to-red-400",
    blue: "from-blue-600 to-blue-400",
  };

  const heights = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-400">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-white/5 rounded-full overflow-hidden", heights[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", colors[variant])}
        />
      </div>
    </div>
  );
}

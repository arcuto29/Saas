"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "gold" | "gradient";
  hover?: boolean;
  animate?: boolean;
}

export default function Card({ children, className, variant = "default", hover = false, animate = true }: CardProps) {
  const variants = {
    default: "bg-gray-900/50 border border-white/5",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10",
    gold: "bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20",
    gradient: "bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10",
  };

  const Component = animate ? motion.div : "div";

  return (
    <Component
      {...(animate ? { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } } : {})}
      className={cn(
        "rounded-2xl p-6",
        variants[variant],
        hover && "hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5 transition-all duration-300",
        className
      )}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex items-center justify-between mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-sm font-medium text-gray-400 uppercase tracking-wider", className)}>{children}</h3>;
}

export function CardValue({ children, className, positive }: { children: React.ReactNode; className?: string; positive?: boolean }) {
  return (
    <p className={cn(
      "text-2xl font-bold",
      positive === true && "text-emerald-400",
      positive === false && "text-red-400",
      positive === undefined && "text-white",
      className
    )}>
      {children}
    </p>
  );
}

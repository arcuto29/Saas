import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function calculateWinRate(wins: number, total: number): number {
  if (total === 0) return 0;
  return (wins / total) * 100;
}

export function calculateProfitFactor(grossProfit: number, grossLoss: number): number {
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return Math.abs(grossProfit / grossLoss);
}

export function calculateRiskReward(entry: number, exit: number, stop: number, direction: string): number {
  if (direction === "long") {
    const risk = Math.abs(entry - stop);
    const reward = Math.abs(exit - entry);
    return risk > 0 ? reward / risk : 0;
  } else {
    const risk = Math.abs(stop - entry);
    const reward = Math.abs(entry - exit);
    return risk > 0 ? reward / risk : 0;
  }
}

export function getStreaks(results: number[]): { currentWin: number; currentLoss: number; maxWin: number; maxLoss: number } {
  let currentWin = 0;
  let currentLoss = 0;
  let maxWin = 0;
  let maxLoss = 0;
  let tempWin = 0;
  let tempLoss = 0;

  for (const result of results) {
    if (result > 0) {
      tempWin++;
      tempLoss = 0;
      maxWin = Math.max(maxWin, tempWin);
    } else if (result < 0) {
      tempLoss++;
      tempWin = 0;
      maxLoss = Math.max(maxLoss, tempLoss);
    }
  }

  currentWin = tempWin;
  currentLoss = tempLoss;

  return { currentWin, currentLoss, maxWin, maxLoss };
}

export function getDayOfWeek(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

export function getSessionFromTime(date: Date): string {
  const hour = date.getUTCHours();
  if (hour >= 0 && hour < 8) return "asia";
  if (hour >= 8 && hour < 13) return "london";
  if (hour >= 13 && hour < 17) return "new_york";
  return "overlap";
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

/**
 * Priisma Edge Coach Engine
 * 
 * Rule-based intelligence system that analyzes trading patterns
 * and generates personalized coaching insights without any paid AI APIs.
 * 
 * Designed to be extensible — real AI can be plugged in later as a premium feature.
 */

import type { CoachAlert, ReadinessScore } from "@/types";

interface TradeData {
  result: number;
  direction: string;
  setup: string;
  session: string;
  entryDate: string;
  emotions: string[];
  mistakes: string[];
  riskReward: number;
}

interface JournalData {
  sleepHours: number;
  mood: number;
  stressLevel: number;
  confidence: number;
  discipline: number;
}

interface CoachContext {
  trades: TradeData[];
  todayTrades: TradeData[];
  weekTrades: TradeData[];
  journal: JournalData | null;
  dailyRiskLimit: number;
  maxTradesPerDay: number;
}

// ─── READINESS SCORE CALCULATOR ───────────────────────────────────────────────

export function calculateReadinessScore(context: CoachContext): ReadinessScore {
  const { journal, trades, todayTrades } = context;

  // Sleep score: optimal = 7-9 hours
  const sleepScore = journal
    ? Math.min(100, Math.max(0, journal.sleepHours >= 7 ? 90 + (journal.sleepHours - 7) * 5 : journal.sleepHours * 12))
    : 50;

  // Mood score: 1-10 mapped to 0-100
  const moodScore = journal ? journal.mood * 10 : 50;

  // Stress score: lower stress = higher score (inverted)
  const stressScore = journal ? (10 - journal.stressLevel) * 10 : 50;

  // Confidence score
  const confidenceScore = journal ? journal.confidence * 10 : 50;

  // Discipline score based on recent rule-following
  const recentMistakes = todayTrades.reduce((sum, t) => sum + t.mistakes.length, 0);
  const disciplineScore = journal
    ? journal.discipline * 10
    : Math.max(0, 100 - recentMistakes * 20);

  // Recent performance: based on last 10 trades
  const recentTrades = trades.slice(-10);
  const recentWins = recentTrades.filter((t) => t.result > 0).length;
  const recentPerformance = recentTrades.length > 0
    ? (recentWins / recentTrades.length) * 100
    : 50;

  // Overall: weighted average
  const overall = Math.round(
    sleepScore * 0.2 +
    moodScore * 0.15 +
    stressScore * 0.15 +
    confidenceScore * 0.15 +
    disciplineScore * 0.2 +
    recentPerformance * 0.15
  );

  return {
    overall,
    sleep: Math.round(sleepScore),
    mood: Math.round(moodScore),
    stress: Math.round(stressScore),
    confidence: Math.round(confidenceScore),
    discipline: Math.round(disciplineScore),
    recentPerformance: Math.round(recentPerformance),
  };
}

// ─── PATTERN DETECTION ────────────────────────────────────────────────────────

function detectOvertrading(context: CoachContext): CoachAlert | null {
  const { todayTrades, maxTradesPerDay } = context;
  if (todayTrades.length >= maxTradesPerDay) {
    return {
      id: `overtrading-${Date.now()}`,
      type: "warning",
      category: "discipline",
      title: "Overtrading Detected",
      message: `You've taken ${todayTrades.length} trades today — your limit is ${maxTradesPerDay}. Historical data shows your performance drops significantly after your ${maxTradesPerDay}${getOrdinalSuffix(maxTradesPerDay)} trade. Consider stopping for the day.`,
      severity: todayTrades.length > maxTradesPerDay + 1 ? "critical" : "warning",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectRevengeTrading(context: CoachContext): CoachAlert | null {
  const { todayTrades } = context;
  if (todayTrades.length < 2) return null;

  const lastTwo = todayTrades.slice(-2);
  if (lastTwo[0].result < 0 && lastTwo[1].mistakes.includes("revenge_trade")) {
    return {
      id: `revenge-${Date.now()}`,
      type: "warning",
      category: "emotion",
      title: "Revenge Trading Pattern",
      message: "You appear to be revenge trading after a loss. This pattern has historically cost you money. Take a 30-minute break and reassess.",
      severity: "critical",
      createdAt: new Date().toISOString(),
    };
  }

  // Check for quick re-entry after loss
  const consecutiveLosses = getConsecutiveLossesFromEnd(todayTrades);
  if (consecutiveLosses >= 2) {
    return {
      id: `consecutive-loss-${Date.now()}`,
      type: "warning",
      category: "risk",
      title: "Consecutive Loss Protection",
      message: `You have ${consecutiveLosses} consecutive losses today. Reduce your position size by 50% or stop trading. Your win rate after ${consecutiveLosses}+ losses is historically much lower.`,
      severity: "warning",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectWinStreakOverconfidence(context: CoachContext): CoachAlert | null {
  const { trades } = context;
  const streak = getConsecutiveWinsFromEnd(trades);

  if (streak >= 3) {
    return {
      id: `win-streak-${Date.now()}`,
      type: "achievement",
      category: "streak",
      title: `${streak}-Win Streak!`,
      message: `You're on a ${streak}-win streak. Stay disciplined — overconfidence after win streaks has historically led to oversizing or FOMO trades. Stick to your plan.`,
      severity: "success",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectDailyLossWarning(context: CoachContext): CoachAlert | null {
  const { todayTrades, dailyRiskLimit } = context;
  const todayPnL = todayTrades.reduce((sum, t) => sum + t.result, 0);
  const usedPercent = Math.abs(todayPnL) / dailyRiskLimit * 100;

  if (todayPnL < 0 && usedPercent >= 80) {
    return {
      id: `daily-loss-${Date.now()}`,
      type: "alert",
      category: "risk",
      title: "Daily Loss Limit Warning",
      message: `You've used ${usedPercent.toFixed(0)}% of your daily loss limit ($${Math.abs(todayPnL).toFixed(0)} / $${dailyRiskLimit}). ${usedPercent >= 100 ? "STOP TRADING NOW." : "One more loss and you should stop for the day."}`,
      severity: usedPercent >= 100 ? "critical" : "warning",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectBestSetup(context: CoachContext): CoachAlert | null {
  const { trades } = context;
  if (trades.length < 10) return null;

  const setupStats = getSetupStats(trades);
  const best = Object.entries(setupStats)
    .filter(([, stats]) => stats.count >= 3)
    .sort((a, b) => b[1].winRate - a[1].winRate)[0];

  if (best && best[1].winRate >= 60) {
    return {
      id: `best-setup-${Date.now()}`,
      type: "tip",
      category: "performance",
      title: "Best Setup Identified",
      message: `Your best-performing setup is "${best[0]}" with a ${best[1].winRate.toFixed(0)}% win rate across ${best[1].count} trades. Focus on this setup for maximum edge.`,
      severity: "info",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectWorstSetup(context: CoachContext): CoachAlert | null {
  const { trades } = context;
  if (trades.length < 10) return null;

  const setupStats = getSetupStats(trades);
  const worst = Object.entries(setupStats)
    .filter(([, stats]) => stats.count >= 3)
    .sort((a, b) => a[1].winRate - b[1].winRate)[0];

  if (worst && worst[1].winRate < 45) {
    return {
      id: `worst-setup-${Date.now()}`,
      type: "warning",
      category: "performance",
      title: "Underperforming Setup",
      message: `Your setup "${worst[0]}" has only a ${worst[1].winRate.toFixed(0)}% win rate across ${worst[1].count} trades. Consider removing it from your playbook or refining your criteria.`,
      severity: "warning",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectBestSession(context: CoachContext): CoachAlert | null {
  const { trades } = context;
  if (trades.length < 10) return null;

  const sessionStats = getSessionStats(trades);
  const best = Object.entries(sessionStats)
    .filter(([, stats]) => stats.count >= 5)
    .sort((a, b) => b[1].winRate - a[1].winRate)[0];

  if (best) {
    const sessionNames: Record<string, string> = {
      asia: "Asian",
      london: "London",
      new_york: "New York",
      overlap: "London/NY Overlap",
    };
    return {
      id: `best-session-${Date.now()}`,
      type: "tip",
      category: "performance",
      title: "Best Session",
      message: `Your highest win rate is during the ${sessionNames[best[0]] || best[0]} session (${best[1].winRate.toFixed(0)}%). Prioritize trading during this time window.`,
      severity: "info",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectBestWeekday(context: CoachContext): CoachAlert | null {
  const { trades } = context;
  if (trades.length < 20) return null;

  const dayStats: Record<string, { wins: number; total: number }> = {};
  trades.forEach((t) => {
    const day = new Date(t.entryDate).toLocaleDateString("en-US", { weekday: "long" });
    if (!dayStats[day]) dayStats[day] = { wins: 0, total: 0 };
    dayStats[day].total++;
    if (t.result > 0) dayStats[day].wins++;
  });

  const best = Object.entries(dayStats)
    .map(([day, stats]) => ({ day, winRate: (stats.wins / stats.total) * 100, count: stats.total }))
    .filter((d) => d.count >= 3)
    .sort((a, b) => b.winRate - a.winRate)[0];

  const worst = Object.entries(dayStats)
    .map(([day, stats]) => ({ day, winRate: (stats.wins / stats.total) * 100, count: stats.total }))
    .filter((d) => d.count >= 3)
    .sort((a, b) => a.winRate - b.winRate)[0];

  if (best && worst && best.winRate - worst.winRate > 15) {
    return {
      id: `weekday-${Date.now()}`,
      type: "tip",
      category: "pattern",
      title: "Weekly Pattern Detected",
      message: `Your trading quality is highest on ${best.day} (${best.winRate.toFixed(0)}% WR) and lowest on ${worst.day} (${worst.winRate.toFixed(0)}% WR). Consider reducing size or skipping ${worst.day}.`,
      severity: "info",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function detectSleepCorrelation(context: CoachContext): CoachAlert | null {
  const { journal } = context;
  if (!journal || journal.sleepHours >= 6.5) return null;

  return {
    id: `sleep-${Date.now()}`,
    type: "warning",
    category: "performance",
    title: "Low Sleep Alert",
    message: `You slept ${journal.sleepHours} hours last night. Your win rate drops significantly on days with less than 6 hours of sleep. Consider trading half size or skipping today.`,
    severity: "warning",
    createdAt: new Date().toISOString(),
  };
}

function detectRuleBreaking(context: CoachContext): CoachAlert | null {
  const { weekTrades } = context;
  const ruleBreaks = weekTrades.reduce(
    (sum, t) => sum + t.mistakes.filter((m) => m === "broke_rules" || m === "moved_stop").length,
    0
  );

  if (ruleBreaks >= 3) {
    return {
      id: `rules-${Date.now()}`,
      type: "warning",
      category: "discipline",
      title: "Rule-Breaking Pattern",
      message: `You broke your rules ${ruleBreaks} times this week. Focus on discipline before increasing position size. Every broken rule costs you edge.`,
      severity: "critical",
      createdAt: new Date().toISOString(),
    };
  }
  return null;
}

function generateTomorrowPlan(context: CoachContext): CoachAlert {
  const { trades, journal } = context;
  const setupStats = getSetupStats(trades);
  const topSetups = Object.entries(setupStats)
    .filter(([, s]) => s.count >= 3)
    .sort((a, b) => b[1].winRate - a[1].winRate)
    .slice(0, 2)
    .map(([name]) => name);

  const maxTrades = context.maxTradesPerDay;
  const sleepWarning = journal && journal.sleepHours < 6
    ? " If sleep is under 6 hours, reduce size by 50%."
    : "";

  const setupText = topSetups.length > 0
    ? `Trade only ${topSetups.join(" and ")} setups.`
    : "Focus on your highest-conviction setups.";

  return {
    id: `plan-${Date.now()}`,
    type: "plan",
    category: "performance",
    title: "Tomorrow's Action Plan",
    message: `${setupText} Maximum ${maxTrades} trades. Stick to your best session.${sleepWarning}`,
    severity: "info",
    createdAt: new Date().toISOString(),
  };
}

// ─── MAIN COACH FUNCTION ──────────────────────────────────────────────────────

export function generateCoachInsights(context: CoachContext): CoachAlert[] {
  const alerts: CoachAlert[] = [];

  // Run all detection functions
  const detectors = [
    detectOvertrading,
    detectRevengeTrading,
    detectWinStreakOverconfidence,
    detectDailyLossWarning,
    detectBestSetup,
    detectWorstSetup,
    detectBestSession,
    detectBestWeekday,
    detectSleepCorrelation,
    detectRuleBreaking,
  ];

  for (const detector of detectors) {
    const alert = detector(context);
    if (alert) alerts.push(alert);
  }

  // Always add tomorrow's plan
  alerts.push(generateTomorrowPlan(context));

  return alerts;
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getConsecutiveLossesFromEnd(trades: TradeData[]): number {
  let count = 0;
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].result < 0) count++;
    else break;
  }
  return count;
}

function getConsecutiveWinsFromEnd(trades: TradeData[]): number {
  let count = 0;
  for (let i = trades.length - 1; i >= 0; i--) {
    if (trades[i].result > 0) count++;
    else break;
  }
  return count;
}

function getSetupStats(trades: TradeData[]): Record<string, { winRate: number; count: number; pnl: number }> {
  const stats: Record<string, { wins: number; total: number; pnl: number }> = {};
  trades.forEach((t) => {
    if (!t.setup) return;
    if (!stats[t.setup]) stats[t.setup] = { wins: 0, total: 0, pnl: 0 };
    stats[t.setup].total++;
    stats[t.setup].pnl += t.result;
    if (t.result > 0) stats[t.setup].wins++;
  });

  const result: Record<string, { winRate: number; count: number; pnl: number }> = {};
  Object.entries(stats).forEach(([name, s]) => {
    result[name] = { winRate: (s.wins / s.total) * 100, count: s.total, pnl: s.pnl };
  });
  return result;
}

function getSessionStats(trades: TradeData[]): Record<string, { winRate: number; count: number }> {
  const stats: Record<string, { wins: number; total: number }> = {};
  trades.forEach((t) => {
    if (!t.session) return;
    if (!stats[t.session]) stats[t.session] = { wins: 0, total: 0 };
    stats[t.session].total++;
    if (t.result > 0) stats[t.session].wins++;
  });

  const result: Record<string, { winRate: number; count: number }> = {};
  Object.entries(stats).forEach(([name, s]) => {
    result[name] = { winRate: (s.wins / s.total) * 100, count: s.total };
  });
  return result;
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ─── DISCIPLINE SCORE CALCULATOR ──────────────────────────────────────────────

export function calculateDisciplineScore(trades: TradeData[], maxTrades: number): number {
  if (trades.length === 0) return 100;

  let score = 100;
  const totalMistakes = trades.reduce((sum, t) => sum + t.mistakes.length, 0);
  const overtrades = Math.max(0, trades.length - maxTrades);

  // Deduct for mistakes
  score -= totalMistakes * 10;
  // Deduct for overtrading
  score -= overtrades * 15;
  // Deduct for revenge trades
  const revengeTrades = trades.filter((t) => t.mistakes.includes("revenge_trade")).length;
  score -= revengeTrades * 20;

  return Math.max(0, Math.min(100, score));
}

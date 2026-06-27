// @ts-nocheck
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { startOfDay, startOfWeek, startOfMonth } from "date-fns";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const now = new Date();
    const dayStart = startOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);

    // Get all closed trades
    const allTrades = await prisma.trade.findMany({
      where: { userId, status: "closed" },
      orderBy: { entryDate: "desc" },
      select: {
        result: true,
        entryDate: true,
        riskReward: true,
      },
    });

    // Calculate P&L for different periods
    const dailyTrades = allTrades.filter((t) => t.entryDate >= dayStart);
    const weeklyTrades = allTrades.filter((t) => t.entryDate >= weekStart);
    const monthlyTrades = allTrades.filter((t) => t.entryDate >= monthStart);

    const dailyPnl = dailyTrades.reduce((sum, t) => sum + (t.result || 0), 0);
    const weeklyPnl = weeklyTrades.reduce((sum, t) => sum + (t.result || 0), 0);
    const monthlyPnl = monthlyTrades.reduce((sum, t) => sum + (t.result || 0), 0);

    // Win rate
    const closedTrades = allTrades.filter((t) => t.result !== null);
    const winners = closedTrades.filter((t) => (t.result || 0) > 0);
    const losers = closedTrades.filter((t) => (t.result || 0) < 0);
    const winRate = closedTrades.length > 0 ? (winners.length / closedTrades.length) * 100 : 0;

    // Profit factor
    const grossProfit = winners.reduce((sum, t) => sum + (t.result || 0), 0);
    const grossLoss = Math.abs(losers.reduce((sum, t) => sum + (t.result || 0), 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? Infinity : 0;

    // Average R:R
    const riskRewards = closedTrades.filter((t) => t.riskReward && t.riskReward > 0);
    const avgRiskReward = riskRewards.length > 0
      ? riskRewards.reduce((sum, t) => sum + (t.riskReward || 0), 0) / riskRewards.length
      : 0;

    // Average winner/loser
    const avgWinner = winners.length > 0
      ? winners.reduce((sum, t) => sum + (t.result || 0), 0) / winners.length
      : 0;
    const avgLoser = losers.length > 0
      ? losers.reduce((sum, t) => sum + (t.result || 0), 0) / losers.length
      : 0;

    // Streaks
    const results = closedTrades.map((t) => t.result || 0);
    let currentWinStreak = 0;
    let currentLossStreak = 0;
    let maxWinStreak = 0;
    let maxLossStreak = 0;
    let tempWin = 0;
    let tempLoss = 0;

    for (const result of results) {
      if (result > 0) {
        tempWin++;
        tempLoss = 0;
        maxWinStreak = Math.max(maxWinStreak, tempWin);
      } else if (result < 0) {
        tempLoss++;
        tempWin = 0;
        maxLossStreak = Math.max(maxLossStreak, tempLoss);
      }
    }
    currentWinStreak = tempWin;
    currentLossStreak = tempLoss;

    return NextResponse.json({
      dailyPnl,
      weeklyPnl,
      monthlyPnl,
      winRate,
      profitFactor: profitFactor === Infinity ? 999 : profitFactor,
      avgRiskReward,
      avgWinner,
      avgLoser,
      totalTrades: closedTrades.length,
      currentWinStreak,
      currentLossStreak,
      maxWinStreak,
      maxLossStreak,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

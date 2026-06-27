import { NextRequest, NextResponse } from "next/server";
import { generateCoachInsights, calculateReadinessScore } from "@/services/coach-engine";

export const dynamic = "force-dynamic";

/**
 * Coach API Route
 * 
 * In production this would fetch from the database using the authenticated user.
 * For the MVP demo, it accepts trade data in the request body or returns
 * insights based on demo data.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const context = {
      trades: body.trades || [],
      todayTrades: body.todayTrades || [],
      weekTrades: body.weekTrades || [],
      journal: body.journal || null,
      dailyRiskLimit: body.dailyRiskLimit || 500,
      maxTradesPerDay: body.maxTradesPerDay || 3,
    };

    const insights = generateCoachInsights(context);
    const readiness = calculateReadinessScore(context);

    return NextResponse.json({ insights, readiness });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Demo mode: generate insights from sample data
    const demoContext = {
      trades: [
        { result: 425.50, direction: "long", setup: "Breaker Block", session: "new_york", entryDate: "2025-01-15T14:30:00", emotions: ["confident"], mistakes: [], riskReward: 2.3 },
        { result: -180.50, direction: "short", setup: "Order Block", session: "new_york", entryDate: "2025-01-15T15:45:00", emotions: ["frustrated"], mistakes: ["late_entry"], riskReward: 0 },
        { result: 290.50, direction: "long", setup: "FVG", session: "london", entryDate: "2025-01-14T10:15:00", emotions: ["calm"], mistakes: [], riskReward: 2.6 },
        { result: 150.50, direction: "short", setup: "Breaker Block", session: "london", entryDate: "2025-01-14T08:30:00", emotions: ["confident"], mistakes: [], riskReward: 1.9 },
        { result: -95.50, direction: "long", setup: "Liquidity Sweep", session: "overlap", entryDate: "2025-01-13T12:00:00", emotions: ["greedy"], mistakes: ["oversize", "revenge_trade"], riskReward: 0 },
        { result: 220.50, direction: "long", setup: "BOS", session: "new_york", entryDate: "2025-01-13T14:00:00", emotions: ["calm"], mistakes: [], riskReward: 2.6 },
        { result: 297.00, direction: "short", setup: "Supply & Demand", session: "london", entryDate: "2025-01-12T09:30:00", emotions: ["confident"], mistakes: [], riskReward: 2.0 },
        { result: 355.00, direction: "long", setup: "Breaker Block", session: "new_york", entryDate: "2025-01-10T14:00:00", emotions: ["confident"], mistakes: [], riskReward: 3.2 },
        { result: 145.00, direction: "short", setup: "Order Block", session: "london", entryDate: "2025-01-10T09:00:00", emotions: ["calm"], mistakes: [], riskReward: 1.5 },
        { result: -160.00, direction: "short", setup: "Liquidity Sweep", session: "new_york", entryDate: "2025-01-08T15:00:00", emotions: ["anxious"], mistakes: ["fomo"], riskReward: 0 },
      ],
      todayTrades: [
        { result: 425.50, direction: "long", setup: "Breaker Block", session: "new_york", entryDate: "2025-01-15T14:30:00", emotions: ["confident"], mistakes: [], riskReward: 2.3 },
        { result: -180.50, direction: "short", setup: "Order Block", session: "new_york", entryDate: "2025-01-15T15:45:00", emotions: ["frustrated"], mistakes: ["late_entry"], riskReward: 0 },
      ],
      weekTrades: [
        { result: 425.50, direction: "long", setup: "Breaker Block", session: "new_york", entryDate: "2025-01-15T14:30:00", emotions: ["confident"], mistakes: [], riskReward: 2.3 },
        { result: -180.50, direction: "short", setup: "Order Block", session: "new_york", entryDate: "2025-01-15T15:45:00", emotions: ["frustrated"], mistakes: ["late_entry"], riskReward: 0 },
        { result: 290.50, direction: "long", setup: "FVG", session: "london", entryDate: "2025-01-14T10:15:00", emotions: ["calm"], mistakes: [], riskReward: 2.6 },
        { result: 150.50, direction: "short", setup: "Breaker Block", session: "london", entryDate: "2025-01-14T08:30:00", emotions: ["confident"], mistakes: [], riskReward: 1.9 },
        { result: -95.50, direction: "long", setup: "Liquidity Sweep", session: "overlap", entryDate: "2025-01-13T12:00:00", emotions: ["greedy"], mistakes: ["oversize", "revenge_trade"], riskReward: 0 },
        { result: 220.50, direction: "long", setup: "BOS", session: "new_york", entryDate: "2025-01-13T14:00:00", emotions: ["calm"], mistakes: [], riskReward: 2.6 },
        { result: 297.00, direction: "short", setup: "Supply & Demand", session: "london", entryDate: "2025-01-12T09:30:00", emotions: ["confident"], mistakes: [], riskReward: 2.0 },
      ],
      journal: {
        sleepHours: 7,
        mood: 7,
        stressLevel: 4,
        confidence: 8,
        discipline: 9,
      },
      dailyRiskLimit: 500,
      maxTradesPerDay: 3,
    };

    const insights = generateCoachInsights(demoContext);
    const readiness = calculateReadinessScore(demoContext);

    return NextResponse.json({
      insights,
      readiness,
      meta: {
        mode: "demo",
        generatedAt: new Date().toISOString(),
        totalTradesAnalyzed: demoContext.trades.length,
      },
    });
  } catch (error) {
    console.error("Coach API error:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}

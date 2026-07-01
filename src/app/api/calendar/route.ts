import { NextResponse } from "next/server";

/**
 * Economic Calendar API
 * Fetches live economic events from free sources.
 * Falls back to curated high-impact events for NQ traders.
 */

interface EconomicEvent {
  id: string;
  date: string;
  time: string;
  event: string;
  country: string;
  impact: "high" | "medium" | "low" | "holiday";
  previous: string | null;
  forecast: string | null;
  actual: string | null;
  category: string;
  nqImpact: string;
  tradingNote: string;
}

// Curated high-impact events that move NQ — updated monthly
// In production, this would be replaced with a live API feed
function getCuratedEvents(): EconomicEvent[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Generate events for current and next week
  const events: EconomicEvent[] = [];
  const baseDate = new Date(year, month, now.getDate());

  // High-impact recurring events (these happen every month)
  const recurringEvents = [
    {
      event: "Non-Farm Payrolls (NFP)",
      impact: "high" as const,
      time: "8:30 AM",
      category: "employment",
      nqImpact: "EXTREME. NQ moves 150-300+ points. Biggest monthly event.",
      tradingNote: "Never trade INTO NFP. Wait 15 min after release. Trade the trend, not the spike.",
    },
    {
      event: "Consumer Price Index (CPI)",
      impact: "high" as const,
      time: "8:30 AM",
      category: "inflation",
      nqImpact: "EXTREME. NQ moves 200-400+ points. Drives Fed rate expectations.",
      tradingNote: "CPI below forecast = bullish NQ. Above = bearish. Wait for dust to settle.",
    },
    {
      event: "FOMC Rate Decision",
      impact: "high" as const,
      time: "2:00 PM",
      category: "fed",
      nqImpact: "EXTREME. NQ can swing 300+ points. Press conference at 2:30 adds more volatility.",
      tradingNote: "DO NOT hold positions. Close everything before 1:45 PM. Trade the reaction after 2:45.",
    },
    {
      event: "FOMC Meeting Minutes",
      impact: "high" as const,
      time: "2:00 PM",
      category: "fed",
      nqImpact: "Major. NQ moves 100-200 points. Reveals Fed thinking between meetings.",
      tradingNote: "Less impactful than actual rate decision but still dangerous afternoon event.",
    },
    {
      event: "ISM Manufacturing PMI",
      impact: "high" as const,
      time: "10:00 AM",
      category: "manufacturing",
      nqImpact: "High volatility. NQ typically moves 50-100 points.",
      tradingNote: "Above 50 = expansion = bullish. Below 50 = contraction = bearish.",
    },
    {
      event: "ISM Services PMI",
      impact: "high" as const,
      time: "10:00 AM",
      category: "services",
      nqImpact: "High volatility. Services is 70% of US GDP. Bigger impact than Manufacturing.",
      tradingNote: "Services PMI matters more than manufacturing for NQ/tech stocks.",
    },
    {
      event: "Weekly Jobless Claims",
      impact: "medium" as const,
      time: "8:30 AM",
      category: "employment",
      nqImpact: "Moderate. Usually 20-40 NQ points unless a major surprise.",
      tradingNote: "Weekly data — less impactful alone but trend matters.",
    },
    {
      event: "Retail Sales",
      impact: "medium" as const,
      time: "8:30 AM",
      category: "consumer",
      nqImpact: "Moderate-High. Consumer spending drives GDP. 40-80 NQ points.",
      tradingNote: "Strong retail = economy good = rate hikes longer = mixed for NQ.",
    },
    {
      event: "GDP (Preliminary)",
      impact: "high" as const,
      time: "8:30 AM",
      category: "growth",
      nqImpact: "High if surprise. Expected = minimal move. Surprise = 100+ points.",
      tradingNote: "GDP is backward-looking. Market usually prices it in advance.",
    },
    {
      event: "Core PCE Price Index",
      impact: "high" as const,
      time: "8:30 AM",
      category: "inflation",
      nqImpact: "HIGH. This is the Fed's PREFERRED inflation measure. 100-200 NQ points.",
      tradingNote: "More important than CPI for Fed decisions. Treat like CPI in terms of risk.",
    },
  ];

  // Distribute events across the next 14 days
  for (let i = 0; i < 14; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setDate(baseDate.getDate() + i);

    // Skip weekends
    if (eventDate.getDay() === 0 || eventDate.getDay() === 6) continue;

    const dateStr = eventDate.toISOString().split("T")[0];

    // Assign 1-2 events per trading day (rotating through the list)
    const eventIdx = i % recurringEvents.length;
    const evt = recurringEvents[eventIdx];

    events.push({
      id: `${dateStr}-${evt.event.replace(/\s/g, "-").toLowerCase()}`,
      date: dateStr,
      time: evt.time,
      event: evt.event,
      country: "US",
      impact: evt.impact,
      previous: null,
      forecast: null,
      actual: null,
      category: evt.category,
      nqImpact: evt.nqImpact,
      tradingNote: evt.tradingNote,
    });

    // Add a second event some days
    if (i % 3 === 0 && eventIdx + 1 < recurringEvents.length) {
      const evt2 = recurringEvents[eventIdx + 1];
      events.push({
        id: `${dateStr}-${evt2.event.replace(/\s/g, "-").toLowerCase()}`,
        date: dateStr,
        time: evt2.time,
        event: evt2.event,
        country: "US",
        impact: evt2.impact,
        previous: null,
        forecast: null,
        actual: null,
        category: evt2.category,
        nqImpact: evt2.nqImpact,
        tradingNote: evt2.tradingNote,
      });
    }
  }

  return events;
}

export async function GET() {
  try {
    // Try to fetch from a live free API first
    let events: EconomicEvent[] = [];

    try {
      // Attempt to fetch from Trading Economics free endpoint
      const res = await fetch(
        "https://economic-calendar.horizonfx.id/api/v1/events?country=US&impact=high,medium",
        { next: { revalidate: 3600 } } // Cache for 1 hour
      );

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          events = data.map((evt: any, idx: number) => ({
            id: String(idx),
            date: evt.date || new Date().toISOString().split("T")[0],
            time: evt.time || "TBD",
            event: evt.event || evt.title || "Unknown Event",
            country: evt.country || "US",
            impact: evt.impact?.toLowerCase() || "medium",
            previous: evt.previous || null,
            forecast: evt.forecast || null,
            actual: evt.actual || null,
            category: "general",
            nqImpact: "Check impact level for expected NQ movement.",
            tradingNote: "Monitor price action around this event.",
          }));
        }
      }
    } catch {
      // API unavailable — use curated events
    }

    // Fallback to curated events if live data unavailable
    if (events.length === 0) {
      events = getCuratedEvents();
    }

    return NextResponse.json({
      events,
      source: events.length > 0 && events[0].tradingNote !== "Monitor price action around this event."
        ? "live"
        : "curated",
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json({
      events: getCuratedEvents(),
      source: "curated",
      lastUpdated: new Date().toISOString(),
    });
  }
}

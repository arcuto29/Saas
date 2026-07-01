"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertTriangle,
  Clock,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  DollarSign,
  BarChart3,
  ChevronRight,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

// Demo economic events data
const EVENTS = [
  {
    id: "1",
    date: "2026-07-01",
    time: "8:30 AM",
    event: "ISM Manufacturing PMI",
    country: "US",
    impact: "high",
    previous: "48.7",
    forecast: "49.2",
    actual: null,
    category: "manufacturing",
    nqImpact: "High volatility expected. NQ typically moves 50-100 points.",
    tradingNote: "Wait 5 minutes after release before entering. Initial spike often reverses.",
  },
  {
    id: "2",
    date: "2026-07-02",
    time: "10:00 AM",
    event: "JOLTS Job Openings",
    country: "US",
    impact: "medium",
    previous: "7.74M",
    forecast: "7.65M",
    actual: null,
    category: "employment",
    nqImpact: "Moderate move. Usually 20-40 NQ points.",
    tradingNote: "Less impactful than NFP but can set the tone for Friday's jobs report.",
  },
  {
    id: "3",
    date: "2026-07-02",
    time: "2:00 PM",
    event: "FOMC Meeting Minutes",
    country: "US",
    impact: "high",
    previous: null,
    forecast: null,
    actual: null,
    category: "fed",
    nqImpact: "Major volatility. NQ can move 100-200 points in minutes.",
    tradingNote: "DO NOT hold positions through FOMC. Trade the reaction, not the prediction.",
  },
  {
    id: "4",
    date: "2026-07-03",
    time: "8:15 AM",
    event: "ADP Non-Farm Employment",
    country: "US",
    impact: "medium",
    previous: "152K",
    forecast: "165K",
    actual: null,
    category: "employment",
    nqImpact: "Preview for NFP. Moderate 30-60 point move.",
    tradingNote: "If ADP surprises significantly, expect NFP to follow direction.",
  },
  {
    id: "5",
    date: "2026-07-03",
    time: "8:30 AM",
    event: "Weekly Jobless Claims",
    country: "US",
    impact: "low",
    previous: "218K",
    forecast: "220K",
    actual: null,
    category: "employment",
    nqImpact: "Minor unless a major surprise. Usually 10-20 points.",
    tradingNote: "Low impact alone but combined with ADP same morning = volatility window.",
  },
  {
    id: "6",
    date: "2026-07-04",
    time: "ALL DAY",
    event: "Independence Day — Markets Closed",
    country: "US",
    impact: "holiday",
    previous: null,
    forecast: null,
    actual: null,
    category: "holiday",
    nqImpact: "No trading. Markets closed.",
    tradingNote: "Plan for thin liquidity on July 3rd afternoon. Consider closing positions.",
  },
  {
    id: "7",
    date: "2026-07-07",
    time: "8:30 AM",
    event: "Non-Farm Payrolls (NFP)",
    country: "US",
    impact: "high",
    previous: "272K",
    forecast: "190K",
    actual: null,
    category: "employment",
    nqImpact: "EXTREME volatility. NQ moves 150-300+ points. Biggest event of the month.",
    tradingNote: "Never trade INTO NFP. Wait minimum 15 minutes after release. Trade the trend, not the spike.",
  },
  {
    id: "8",
    date: "2026-07-07",
    time: "8:30 AM",
    event: "Unemployment Rate",
    country: "US",
    impact: "high",
    previous: "4.0%",
    forecast: "4.0%",
    actual: null,
    category: "employment",
    nqImpact: "Released with NFP. Combined impact is massive.",
    tradingNote: "If unemployment ticks up while NFP misses = risk-off. NQ dumps.",
  },
  {
    id: "9",
    date: "2026-07-10",
    time: "8:30 AM",
    event: "Consumer Price Index (CPI)",
    country: "US",
    impact: "high",
    previous: "3.3%",
    forecast: "3.2%",
    actual: null,
    category: "inflation",
    nqImpact: "EXTREME. NQ moves 200-400+ points. Second biggest event after FOMC.",
    tradingNote: "CPI below forecast = bullish NQ (rate cuts). Above = bearish. Wait for dust to settle.",
  },
  {
    id: "10",
    date: "2026-07-10",
    time: "8:30 AM",
    event: "Core CPI (m/m)",
    country: "US",
    impact: "high",
    previous: "0.2%",
    forecast: "0.2%",
    actual: null,
    category: "inflation",
    nqImpact: "Core CPI matters more to the Fed than headline. This drives the real move.",
    tradingNote: "If core is sticky (0.3%+), expect hawkish repricing = NQ sells off hard.",
  },
];

const impactColors = {
  high: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", label: "High Impact" },
  medium: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-400", label: "Medium" },
  low: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", label: "Low" },
  holiday: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-400", label: "Holiday" },
};

const categoryIcons: Record<string, any> = {
  employment: BarChart3,
  inflation: TrendingUp,
  fed: Shield,
  manufacturing: Zap,
  holiday: Calendar,
};

export default function EconomicCalendarPage() {
  const [filter, setFilter] = useState<string>("all");
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [events, setEvents] = useState(EVENTS);
  const [source, setSource] = useState("demo");
  const [viewMode, setViewMode] = useState<"list" | "widget">("list");

  // Fetch live events on mount
  useState(() => {
    fetch("/api/calendar")
      .then((r) => r.json())
      .then((data) => {
        if (data.events && data.events.length > 0) {
          setEvents(data.events);
          setSource(data.source);
        }
      })
      .catch(() => {});
  });

  const filteredEvents = filter === "all"
    ? events
    : events.filter((e) => e.impact === filter);

  // Group events by date
  const groupedEvents: Record<string, typeof EVENTS> = {};
  filteredEvents.forEach((event) => {
    if (!groupedEvents[event.date]) groupedEvents[event.date] = [];
    groupedEvents[event.date].push(event);
  });

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Economic Calendar</h1>
          <p className="text-sm text-gray-400">
            Know when to trade and when to sit. Events that move NQ futures.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
          {[
            { value: "all", label: "All" },
            { value: "high", label: "🔴 High" },
            { value: "medium", label: "🟡 Med" },
            { value: "low", label: "🔵 Low" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                filter === f.value
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk legend */}
      <Card variant="default" className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-xs text-gray-400">
              <span className="text-red-400 font-medium">High Impact</span> — Do NOT hold positions. Wait for reaction.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">
              <span className="text-yellow-400 font-medium">Medium</span> — Trade with caution. Reduce size.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-blue-400" />
            <span className="text-xs text-gray-400">
              <span className="text-blue-400 font-medium">Low</span> — Normal trading. Minimal impact.
            </span>
          </div>
        </div>
      </Card>

      {/* Events by date */}
      {Object.entries(groupedEvents).map(([date, events]) => {
        const dateObj = new Date(date + "T12:00:00");
        const isToday = date === todayStr;
        const dayLabel = dateObj.toLocaleDateString("en-US", {
          weekday: "long",
          month: "short",
          day: "numeric",
        });

        return (
          <div key={date} className="space-y-3">
            {/* Date header */}
            <div className="flex items-center gap-3">
              <div className={`px-3 py-1 rounded-lg text-xs font-bold ${
                isToday
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10"
              }`}>
                {isToday ? "TODAY" : dayLabel}
              </div>
              {isToday && <span className="text-xs text-gray-500">{dayLabel}</span>}
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-xs text-gray-600">{events.length} event{events.length > 1 ? "s" : ""}</span>
            </div>

            {/* Events */}
            {events.map((event) => {
              const impact = impactColors[event.impact as keyof typeof impactColors];
              const CategoryIcon = categoryIcons[event.category] || Globe;
              const isExpanded = expandedEvent === event.id;

              return (
                <motion.div
                  key={event.id}
                  layout
                  onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${impact.bg} ${impact.border} hover:bg-opacity-20`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${impact.bg} border ${impact.border} flex items-center justify-center`}>
                        <CategoryIcon size={18} className={impact.text} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{event.event}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-gray-500">{event.time}</span>
                          <Badge variant={event.impact === "high" ? "danger" : event.impact === "medium" ? "warning" : "default"}>
                            {impact.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {event.previous && (
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-500">Prev</p>
                          <p className="text-sm text-gray-300">{event.previous}</p>
                        </div>
                      )}
                      {event.forecast && (
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-gray-500">Forecast</p>
                          <p className="text-sm text-white font-medium">{event.forecast}</p>
                        </div>
                      )}
                      <ChevronRight size={14} className={`text-gray-500 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 pt-4 border-t border-white/5 space-y-3"
                    >
                      <div className="p-3 rounded-lg bg-black/20">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">NQ Impact Assessment</p>
                        <p className="text-sm text-gray-300">{event.nqImpact}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/10">
                        <p className="text-xs text-yellow-400 uppercase tracking-wide mb-1">Trading Note</p>
                        <p className="text-sm text-gray-300">{event.tradingNote}</p>
                      </div>
                      {event.previous && event.forecast && (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-2 rounded-lg bg-white/[0.03] text-center">
                            <p className="text-xs text-gray-500">Previous</p>
                            <p className="text-sm font-bold text-gray-300">{event.previous}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-white/[0.03] text-center">
                            <p className="text-xs text-gray-500">Forecast</p>
                            <p className="text-sm font-bold text-white">{event.forecast}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-white/[0.03] text-center">
                            <p className="text-xs text-gray-500">Actual</p>
                            <p className="text-sm font-bold text-gray-500">{event.actual || "Pending"}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </motion.div>
  );
}

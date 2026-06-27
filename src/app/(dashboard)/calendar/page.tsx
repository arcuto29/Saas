"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import CalendarHeatmap from "@/components/charts/CalendarHeatmap";
import { formatCurrency } from "@/lib/utils";

const calendarData2025 = [
  { date: "2025-01-02", pnl: 320, trades: 3 },
  { date: "2025-01-03", pnl: -150, trades: 2 },
  { date: "2025-01-06", pnl: 480, trades: 4 },
  { date: "2025-01-07", pnl: 210, trades: 2 },
  { date: "2025-01-08", pnl: -80, trades: 1 },
  { date: "2025-01-09", pnl: 560, trades: 3 },
  { date: "2025-01-10", pnl: 120, trades: 2 },
  { date: "2025-01-13", pnl: -290, trades: 4 },
  { date: "2025-01-14", pnl: 440, trades: 3 },
  { date: "2025-01-15", pnl: 245, trades: 2 },
  { date: "2025-01-16", pnl: 380, trades: 3 },
  { date: "2025-01-17", pnl: -60, trades: 1 },
  { date: "2025-01-20", pnl: 520, trades: 4 },
  { date: "2025-01-21", pnl: 180, trades: 2 },
  { date: "2025-01-22", pnl: -340, trades: 3 },
  { date: "2025-01-23", pnl: 290, trades: 2 },
  { date: "2025-01-24", pnl: 410, trades: 3 },
  { date: "2025-01-27", pnl: 150, trades: 2 },
  { date: "2025-01-28", pnl: -120, trades: 2 },
  { date: "2025-01-29", pnl: 380, trades: 3 },
  { date: "2025-01-30", pnl: 200, trades: 2 },
  { date: "2025-01-31", pnl: -90, trades: 1 },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(0); // January
  const [currentYear, setCurrentYear] = useState(2025);

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const monthData = calendarData2025.filter((d) => {
    const date = new Date(d.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const totalPnl = monthData.reduce((s, d) => s + d.pnl, 0);
  const totalTrades = monthData.reduce((s, d) => s + d.trades, 0);
  const winDays = monthData.filter((d) => d.pnl > 0).length;
  const lossDays = monthData.filter((d) => d.pnl < 0).length;
  const winDayRate = monthData.length > 0 ? (winDays / monthData.length) * 100 : 0;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Trading Calendar</h1>
        <p className="text-sm text-gray-400">Visualize your daily trading performance</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-white">{monthName}</h2>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400">Monthly P&L</p>
          <p className={`text-xl font-bold ${totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {formatCurrency(totalPnl)}
          </p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400">Total Trades</p>
          <p className="text-xl font-bold text-white">{totalTrades}</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400">Win Days</p>
          <p className="text-xl font-bold text-emerald-400">{winDays}</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400">Loss Days</p>
          <p className="text-xl font-bold text-red-400">{lossDays}</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400">Win Day Rate</p>
          <p className="text-xl font-bold text-yellow-400">{winDayRate.toFixed(0)}%</p>
        </Card>
      </div>

      {/* Calendar */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <CalendarIcon size={14} className="inline mr-1" />
            Daily P&L Calendar
          </CardTitle>
          <Badge variant={totalPnl >= 0 ? "success" : "danger"}>
            {totalPnl >= 0 ? "+" : ""}{formatCurrency(totalPnl)}
          </Badge>
        </CardHeader>
        <CalendarHeatmap data={monthData} month={currentMonth} year={currentYear} />
      </Card>

      {/* Daily Breakdown */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Date</th>
                <th className="text-left text-xs text-gray-400 font-medium pb-3 pr-4">Day</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3 pr-4">Trades</th>
                <th className="text-right text-xs text-gray-400 font-medium pb-3">P&L</th>
              </tr>
            </thead>
            <tbody>
              {monthData.slice(0, 10).map((day) => {
                const date = new Date(day.date);
                return (
                  <tr key={day.date} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 text-sm text-white">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 pr-4 text-sm text-gray-400">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </td>
                    <td className="py-3 pr-4 text-sm text-white text-right">{day.trades}</td>
                    <td className={`py-3 text-sm font-medium text-right ${
                      day.pnl >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {day.pnl >= 0 ? "+" : ""}{formatCurrency(day.pnl)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </motion.div>
  );
}

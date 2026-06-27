"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar as CalendarIcon,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EquityCurve from "@/components/charts/EquityCurve";
import WinRateChart from "@/components/charts/WinRateChart";
import PnLChart from "@/components/charts/PnLChart";
import CalendarHeatmap from "@/components/charts/CalendarHeatmap";
import { formatCurrency } from "@/lib/utils";

const demoWinRateBySetup = [
  { name: "Breaker Block", winRate: 72, count: 18 },
  { name: "FVG", winRate: 65, count: 12 },
  { name: "Order Block", winRate: 58, count: 15 },
  { name: "Liquidity Sweep", winRate: 45, count: 8 },
  { name: "BOS", winRate: 52, count: 6 },
];

const demoWinRateByWeekday = [
  { name: "Mon", winRate: 55 },
  { name: "Tue", winRate: 68 },
  { name: "Wed", winRate: 71 },
  { name: "Thu", winRate: 60 },
  { name: "Fri", winRate: 48 },
];

const demoWinRateBySession = [
  { name: "Asia", winRate: 42 },
  { name: "London", winRate: 67 },
  { name: "New York", winRate: 72 },
  { name: "Overlap", winRate: 58 },
];

const demoWinRateByHour = [
  { name: "8am", winRate: 55 },
  { name: "9am", winRate: 62 },
  { name: "10am", winRate: 70 },
  { name: "11am", winRate: 65 },
  { name: "12pm", winRate: 50 },
  { name: "1pm", winRate: 45 },
  { name: "2pm", winRate: 68 },
  { name: "3pm", winRate: 72 },
  { name: "4pm", winRate: 40 },
];

const demoEquityData = [
  { date: "W1", equity: 10000 },
  { date: "W2", equity: 10450 },
  { date: "W3", equity: 10200 },
  { date: "W4", equity: 10800 },
  { date: "W5", equity: 11350 },
  { date: "W6", equity: 11100 },
  { date: "W7", equity: 11800 },
  { date: "W8", equity: 12400 },
  { date: "W9", equity: 12100 },
  { date: "W10", equity: 13200 },
  { date: "W11", equity: 13800 },
  { date: "W12", equity: 14350 },
];

const demoCalendarData = [
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
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400">Deep performance insights from your trading data</p>
      </div>

      {/* Top Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Total Trades</p>
          <p className="text-xl font-bold text-white">48</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Win Rate</p>
          <p className="text-xl font-bold text-emerald-400">62.5%</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Expectancy</p>
          <p className="text-xl font-bold text-yellow-400">$89.50</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
          <p className="text-xl font-bold text-red-400">-8.2%</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Profit Factor</p>
          <p className="text-xl font-bold text-white">2.1</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Discipline</p>
          <p className="text-xl font-bold text-yellow-400">82%</p>
        </Card>
      </motion.div>

      {/* Long vs Short Performance */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Long Performance</p>
              <p className="text-xs text-gray-400">28 trades</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-bold text-emerald-400">67.8%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">P&L</p>
              <p className="text-lg font-bold text-emerald-400">+$3,420</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg R:R</p>
              <p className="text-lg font-bold text-white">2.1</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <TrendingDown size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Short Performance</p>
              <p className="text-xs text-gray-400">20 trades</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Win Rate</p>
              <p className="text-lg font-bold text-yellow-400">55.0%</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">P&L</p>
              <p className="text-lg font-bold text-emerald-400">+$930</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Avg R:R</p>
              <p className="text-lg font-bold text-white">1.5</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Equity Curve */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <Badge variant="success">+43.5%</Badge>
          </CardHeader>
          <EquityCurve data={demoEquityData} height={300} />
        </Card>
      </motion.div>

      {/* Win Rate Charts */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Zap size={14} className="inline mr-1" />
              Win Rate by Setup
            </CardTitle>
          </CardHeader>
          <WinRateChart data={demoWinRateBySetup} />
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-emerald-500/60" />
              <span className="text-gray-400">Best: <span className="text-white font-medium">Breaker Block (72%)</span></span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/60" />
              <span className="text-gray-400">Worst: <span className="text-white font-medium">Liquidity Sweep (45%)</span></span>
            </div>
          </div>
        </Card>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <CalendarIcon size={14} className="inline mr-1" />
              Win Rate by Weekday
            </CardTitle>
          </CardHeader>
          <WinRateChart data={demoWinRateByWeekday} />
          <div className="mt-4 flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Best Day: <span className="text-emerald-400 font-medium">Wednesday (71%)</span></span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">Worst Day: <span className="text-red-400 font-medium">Friday (48%)</span></span>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Clock size={14} className="inline mr-1" />
              Win Rate by Hour
            </CardTitle>
          </CardHeader>
          <WinRateChart data={demoWinRateByHour} />
        </Card>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Target size={14} className="inline mr-1" />
              Win Rate by Session
            </CardTitle>
          </CardHeader>
          <WinRateChart data={demoWinRateBySession} />
          <div className="mt-4 flex items-center gap-4 text-xs">
            <span className="text-gray-400">Best: <span className="text-emerald-400 font-medium">New York (72%)</span></span>
            <span className="text-gray-400">Worst: <span className="text-red-400 font-medium">Asia (42%)</span></span>
          </div>
        </Card>
      </motion.div>

      {/* Calendar Heatmap */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <CalendarIcon size={14} className="inline mr-1" />
              Calendar Heatmap — January 2025
            </CardTitle>
            <Badge variant="gold">+{formatCurrency(4350)}</Badge>
          </CardHeader>
          <CalendarHeatmap data={demoCalendarData} month={0} year={2025} />
        </Card>
      </motion.div>

      {/* Key Insights */}
      <motion.div variants={item}>
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              <AlertTriangle size={14} className="inline mr-1" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-300 font-medium mb-1">Best Setup</p>
              <p className="text-sm text-white">Breaker Block — 72% win rate, $2,180 total P&L</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
              <p className="text-xs text-red-300 font-medium mb-1">Worst Setup</p>
              <p className="text-sm text-white">Liquidity Sweep — 45% win rate, -$340 total P&L</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-300 font-medium mb-1">Best Session</p>
              <p className="text-sm text-white">New York — 72% win rate, highest expectancy</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-300 font-medium mb-1">Pattern</p>
              <p className="text-sm text-white">Performance drops 15% after 3 consecutive losses</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

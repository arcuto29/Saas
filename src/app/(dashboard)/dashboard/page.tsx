"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Trophy,
  Flame,
  Brain,
  BarChart3,
  DollarSign,
  Percent,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import EquityCurve from "@/components/charts/EquityCurve";
import PnLChart from "@/components/charts/PnLChart";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency, formatPercent } from "@/lib/utils";

// Demo data for the dashboard
const demoStats = {
  dailyPnl: 450.25,
  weeklyPnl: 1280.50,
  monthlyPnl: 4350.00,
  winRate: 62.5,
  profitFactor: 2.1,
  avgRiskReward: 1.8,
  avgWinner: 385.20,
  avgLoser: -215.40,
  totalTrades: 48,
  currentWinStreak: 3,
  currentLossStreak: 0,
  maxWinStreak: 7,
  maxLossStreak: 4,
};

const demoEquityData = [
  { date: "Jan", equity: 10000 },
  { date: "Feb", equity: 10800 },
  { date: "Mar", equity: 10450 },
  { date: "Apr", equity: 11200 },
  { date: "May", equity: 12100 },
  { date: "Jun", equity: 11800 },
  { date: "Jul", equity: 13200 },
  { date: "Aug", equity: 14350 },
];

const demoPnlData = [
  { date: "Mon", pnl: 320 },
  { date: "Tue", pnl: -150 },
  { date: "Wed", pnl: 480 },
  { date: "Thu", pnl: 210 },
  { date: "Fri", pnl: -80 },
];

const demoRecentTrades = [
  { id: "1", instrument: "NQ", direction: "long", result: 425, setup: "Breaker Block", time: "2h ago" },
  { id: "2", instrument: "ES", direction: "short", result: -180, setup: "Order Block", time: "4h ago" },
  { id: "3", instrument: "NQ", direction: "long", result: 290, setup: "FVG", time: "6h ago" },
  { id: "4", instrument: "GC", direction: "short", result: 150, setup: "Breaker Block", time: "1d ago" },
  { id: "5", instrument: "ES", direction: "long", result: -95, setup: "Liquidity Sweep", time: "1d ago" },
];

const demoCoachAlerts = [
  { id: "1", type: "success" as const, message: "3 win streak! Stay disciplined, don't overtrade.", severity: "success" as const },
  { id: "2", type: "tip" as const, message: "Your best setup is NQ Breaker Block in NY session.", severity: "info" as const },
  { id: "3", type: "warning" as const, message: "Win rate drops 15% when trading after 3pm EST.", severity: "warning" as const },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [timeframe] = useState<"day" | "week" | "month">("week");

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome back! Here&apos;s your trading overview.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10">
          {(["day", "week", "month"] as const).map((tf) => (
            <button
              key={tf}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                timeframe === tf
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* P&L Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" hover>
          <CardHeader>
            <CardTitle>Daily P&L</CardTitle>
            <DollarSign size={16} className="text-yellow-400" />
          </CardHeader>
          <CardValue positive={demoStats.dailyPnl > 0}>
            {formatCurrency(demoStats.dailyPnl)}
          </CardValue>
          <p className="text-xs text-gray-500 mt-1">5 trades today</p>
        </Card>
        <Card variant="glass" hover>
          <CardHeader>
            <CardTitle>Weekly P&L</CardTitle>
            <TrendingUp size={16} className="text-emerald-400" />
          </CardHeader>
          <CardValue positive={demoStats.weeklyPnl > 0}>
            {formatCurrency(demoStats.weeklyPnl)}
          </CardValue>
          <p className="text-xs text-gray-500 mt-1">18 trades this week</p>
        </Card>
        <Card variant="glass" hover>
          <CardHeader>
            <CardTitle>Monthly P&L</CardTitle>
            <BarChart3 size={16} className="text-blue-400" />
          </CardHeader>
          <CardValue positive={demoStats.monthlyPnl > 0}>
            {formatCurrency(demoStats.monthlyPnl)}
          </CardValue>
          <p className="text-xs text-gray-500 mt-1">48 trades this month</p>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Win Rate</span>
          </div>
          <p className="text-xl font-bold text-white">{demoStats.winRate}%</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Profit Factor</span>
          </div>
          <p className="text-xl font-bold text-white">{demoStats.profitFactor.toFixed(1)}</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Avg R:R</span>
          </div>
          <p className="text-xl font-bold text-white">{demoStats.avgRiskReward.toFixed(1)}</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-gray-400">Win Streak</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{demoStats.currentWinStreak}</p>
        </Card>
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Equity Curve</CardTitle>
            <Badge variant="success">+{formatPercent(43.5)}</Badge>
          </CardHeader>
          <EquityCurve data={demoEquityData} height={250} />
        </Card>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Weekly P&L</CardTitle>
            <Badge variant="gold">{formatCurrency(demoStats.weeklyPnl)}</Badge>
          </CardHeader>
          <PnLChart data={demoPnlData} height={250} />
        </Card>
      </motion.div>

      {/* Bottom Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trades */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Trades</CardTitle>
            <Badge variant="default">{demoRecentTrades.length} trades</Badge>
          </CardHeader>
          <div className="space-y-3">
            {demoRecentTrades.map((trade) => (
              <div
                key={trade.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    trade.result > 0 ? "bg-emerald-500/10" : "bg-red-500/10"
                  }`}>
                    {trade.result > 0 ? (
                      <TrendingUp size={14} className="text-emerald-400" />
                    ) : (
                      <TrendingDown size={14} className="text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {trade.instrument}{" "}
                      <span className={trade.direction === "long" ? "text-emerald-400" : "text-red-400"}>
                        {trade.direction.toUpperCase()}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">{trade.setup} · {trade.time}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  trade.result > 0 ? "text-emerald-400" : "text-red-400"
                }`}>
                  {trade.result > 0 ? "+" : ""}{formatCurrency(trade.result)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Coach Alerts & Goals */}
        <div className="space-y-6">
          <Card variant="gold">
            <CardHeader>
              <CardTitle className="text-yellow-400">
                <Brain size={14} className="inline mr-1" />
                Coach Alerts
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              {demoCoachAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-xl border text-xs ${
                    alert.severity === "success"
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                      : alert.severity === "warning"
                      ? "bg-yellow-500/5 border-yellow-500/20 text-yellow-300"
                      : "bg-blue-500/5 border-blue-500/20 text-blue-300"
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <Trophy size={14} className="inline mr-1" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Monthly Profit</span>
                  <span className="text-white">$4,350 / $5,000</span>
                </div>
                <ProgressBar value={4350} max={5000} variant="gold" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Win Rate Target</span>
                  <span className="text-white">62.5% / 65%</span>
                </div>
                <ProgressBar value={62.5} max={65} variant="green" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Discipline Score</span>
                  <span className="text-white">8 / 10</span>
                </div>
                <ProgressBar value={8} max={10} variant="blue" />
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}

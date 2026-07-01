"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
  Upload,
  BookOpen,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import EquityCurve from "@/components/charts/EquityCurve";
import PnLChart from "@/components/charts/PnLChart";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import { formatCurrency, formatPercent } from "@/lib/utils";

// Empty data — users start fresh
const demoStats = {
  dailyPnl: 0,
  weeklyPnl: 0,
  monthlyPnl: 0,
  winRate: 0,
  profitFactor: 0,
  avgRiskReward: 0,
  avgWinner: 0,
  avgLoser: 0,
  totalTrades: 0,
  currentWinStreak: 0,
  currentLossStreak: 0,
  maxWinStreak: 0,
  maxLossStreak: 0,
};

const demoEquityData: { date: string; equity: number }[] = [];
const demoPnlData: { date: string; pnl: number }[] = [];
const demoRecentTrades: { id: string; instrument: string; direction: string; result: number; setup: string; time: string }[] = [];
const demoCoachAlerts: { id: string; type: string; message: string; severity: "success" | "warning" | "info" }[] = [];

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

  const hasData = demoRecentTrades.length > 0;

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

      {!hasData ? (
        <motion.div variants={item}>
          <Card variant="glass" className="p-12 text-center">
            <Upload size={40} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No trades logged yet</h3>
            <p className="text-sm text-gray-400 mb-6">Import from your broker or log your first trade to see your stats here.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/import">
                <Button size="sm">Import Trades</Button>
              </Link>
              <Link href="/journal">
                <Button variant="secondary" size="sm">Log a Trade</Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      ) : (
        <>
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
              <p className="text-xs text-gray-500 mt-1">0 trades today</p>
            </Card>
            <Card variant="glass" hover>
              <CardHeader>
                <CardTitle>Weekly P&L</CardTitle>
                <TrendingUp size={16} className="text-emerald-400" />
              </CardHeader>
              <CardValue positive={demoStats.weeklyPnl > 0}>
                {formatCurrency(demoStats.weeklyPnl)}
              </CardValue>
              <p className="text-xs text-gray-500 mt-1">0 trades this week</p>
            </Card>
            <Card variant="glass" hover>
              <CardHeader>
                <CardTitle>Monthly P&L</CardTitle>
                <BarChart3 size={16} className="text-blue-400" />
              </CardHeader>
              <CardValue positive={demoStats.monthlyPnl > 0}>
                {formatCurrency(demoStats.monthlyPnl)}
              </CardValue>
              <p className="text-xs text-gray-500 mt-1">0 trades this month</p>
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
                <Badge variant="success">+{formatPercent(0)}</Badge>
              </CardHeader>
              {demoEquityData.length === 0 ? (
                <div className="flex items-center justify-center h-[250px] text-sm text-gray-500">No data yet</div>
              ) : (
                <EquityCurve data={demoEquityData} height={250} />
              )}
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Weekly P&L</CardTitle>
                <Badge variant="gold">{formatCurrency(demoStats.weeklyPnl)}</Badge>
              </CardHeader>
              {demoPnlData.length === 0 ? (
                <div className="flex items-center justify-center h-[250px] text-sm text-gray-500">No data yet</div>
              ) : (
                <PnLChart data={demoPnlData} height={250} />
              )}
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
                  {demoCoachAlerts.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">Log trades to get personalized coaching alerts.</p>
                  ) : (
                    demoCoachAlerts.map((alert) => (
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
                    ))
                  )}
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
                      <span className="text-white">$0 / $5,000</span>
                    </div>
                    <ProgressBar value={0} max={5000} variant="gold" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Win Rate Target</span>
                      <span className="text-white">0% / 65%</span>
                    </div>
                    <ProgressBar value={0} max={65} variant="green" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Discipline Score</span>
                      <span className="text-white">0 / 10</span>
                    </div>
                    <ProgressBar value={0} max={10} variant="blue" />
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar as CalendarIcon,
  Zap,
  Target,
  AlertTriangle,
  Upload,
} from "lucide-react";
import Card, { CardHeader, CardTitle, CardValue } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EquityCurve from "@/components/charts/EquityCurve";
import WinRateChart from "@/components/charts/WinRateChart";
import PnLChart from "@/components/charts/PnLChart";
import CalendarHeatmap from "@/components/charts/CalendarHeatmap";
import { formatCurrency } from "@/lib/utils";

// Empty data — users start fresh
const demoWinRateBySetup: { name: string; winRate: number; count?: number }[] = [];
const demoWinRateByWeekday: { name: string; winRate: number }[] = [];
const demoWinRateBySession: { name: string; winRate: number }[] = [];
const demoWinRateByHour: { name: string; winRate: number }[] = [];
const demoEquityData: { date: string; equity: number }[] = [];
const demoCalendarData: { date: string; pnl: number; trades: number }[] = [];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AnalyticsPage() {
  const hasData = demoEquityData.length > 0;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-400">Deep performance insights from your trading data</p>
      </div>

      {!hasData ? (
        <motion.div variants={item}>
          <Card variant="glass" className="p-12 text-center">
            <BarChart3 size={40} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No analytics yet</h3>
            <p className="text-sm text-gray-400 mb-6">Import from your broker or log your first trade to see your performance analytics here.</p>
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
          {/* Top Stats */}
          <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Total Trades</p>
              <p className="text-xl font-bold text-white">0</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Win Rate</p>
              <p className="text-xl font-bold text-emerald-400">0%</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Expectancy</p>
              <p className="text-xl font-bold text-yellow-400">$0.00</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Max Drawdown</p>
              <p className="text-xl font-bold text-red-400">0%</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Profit Factor</p>
              <p className="text-xl font-bold text-white">0</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Discipline</p>
              <p className="text-xl font-bold text-yellow-400">0%</p>
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
                  <p className="text-xs text-gray-400">0 trades</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className="text-lg font-bold text-gray-500">0%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">P&L</p>
                  <p className="text-lg font-bold text-gray-500">$0</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg R:R</p>
                  <p className="text-lg font-bold text-gray-500">0</p>
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
                  <p className="text-xs text-gray-400">0 trades</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Win Rate</p>
                  <p className="text-lg font-bold text-gray-500">0%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">P&L</p>
                  <p className="text-lg font-bold text-gray-500">$0</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Avg R:R</p>
                  <p className="text-lg font-bold text-gray-500">0</p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Equity Curve */}
          <motion.div variants={item}>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>Equity Curve</CardTitle>
                <Badge variant="success">+0%</Badge>
              </CardHeader>
              {demoEquityData.length === 0 ? (
                <div className="flex items-center justify-center h-[300px] text-sm text-gray-500">No data yet</div>
              ) : (
                <EquityCurve data={demoEquityData} height={300} />
              )}
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
              {demoWinRateBySetup.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">No data yet</div>
              ) : (
                <WinRateChart data={demoWinRateBySetup} />
              )}
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <CalendarIcon size={14} className="inline mr-1" />
                  Win Rate by Weekday
                </CardTitle>
              </CardHeader>
              {demoWinRateByWeekday.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">No data yet</div>
              ) : (
                <WinRateChart data={demoWinRateByWeekday} />
              )}
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
              {demoWinRateByHour.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">No data yet</div>
              ) : (
                <WinRateChart data={demoWinRateByHour} />
              )}
            </Card>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <Target size={14} className="inline mr-1" />
                  Win Rate by Session
                </CardTitle>
              </CardHeader>
              {demoWinRateBySession.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">No data yet</div>
              ) : (
                <WinRateChart data={demoWinRateBySession} />
              )}
            </Card>
          </motion.div>

          {/* Calendar Heatmap */}
          <motion.div variants={item}>
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <CalendarIcon size={14} className="inline mr-1" />
                  Calendar Heatmap
                </CardTitle>
                <Badge variant="gold">{formatCurrency(0)}</Badge>
              </CardHeader>
              {demoCalendarData.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-sm text-gray-500">No data yet</div>
              ) : (
                <CalendarHeatmap data={demoCalendarData} month={0} year={2025} />
              )}
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

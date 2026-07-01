"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  Zap,
  Brain,
  Target,
  Activity,
  ThermometerSun,
  Calendar,
  BarChart3,
  Eye,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

// Pre-session risk factors (simulated — in production these would pull live data)
const riskFactors = [
  {
    id: "events",
    label: "Economic Events Today",
    status: "warning" as const,
    value: "FOMC Minutes @ 2:00 PM",
    detail: "High-impact event in afternoon. Trade morning only or reduce size after 1:30 PM.",
    icon: Calendar,
    weight: 30,
  },
  {
    id: "overnight",
    label: "Overnight Range",
    status: "safe" as const,
    value: "NQ moved 85 pts overnight (normal)",
    detail: "Overnight range within average. No unusual gaps to watch.",
    icon: TrendingUp,
    weight: 15,
  },
  {
    id: "volatility",
    label: "Expected Volatility",
    status: "warning" as const,
    value: "VIX at 18.5 (elevated)",
    detail: "VIX above 17 means wider stops needed. Consider reducing position size by 25%.",
    icon: Activity,
    weight: 20,
  },
  {
    id: "session",
    label: "Session Context",
    status: "safe" as const,
    value: "NY Regular Session Open",
    detail: "9:30 AM - 11:30 AM EST is your highest win-rate window. Focus here.",
    icon: Clock,
    weight: 10,
  },
  {
    id: "trend",
    label: "Daily Bias",
    status: "safe" as const,
    value: "NQ above prior day high — bullish",
    detail: "Price structure suggests continuation. Look for longs into pullbacks.",
    icon: TrendingUp,
    weight: 15,
  },
  {
    id: "liquidity",
    label: "Liquidity Conditions",
    status: "caution" as const,
    value: "Pre-holiday thinning (July 4th tomorrow)",
    detail: "Reduced liquidity = wider spreads, faster moves, more slippage. Size down.",
    icon: ThermometerSun,
    weight: 10,
  },
];

const statusConfig = {
  safe: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Safe" },
  warning: { color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", label: "Caution" },
  caution: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", label: "Reduced" },
  danger: { color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Avoid" },
};

// Pre-trade checklist items tied to risk advisor
const riskChecklist = [
  { id: 1, text: "Checked economic calendar — no high-impact events during my trading window", category: "context" },
  { id: 2, text: "Identified overnight range and key levels (PDH, PDL, ONH, ONL)", category: "context" },
  { id: 3, text: "Confirmed daily bias aligns with my trade direction", category: "direction" },
  { id: 4, text: "Position size adjusted for today's volatility conditions", category: "risk" },
  { id: 5, text: "Stop loss is based on structure, not arbitrary ticks", category: "risk" },
  { id: 6, text: "R:R minimum 1:3 confirmed before entry", category: "risk" },
  { id: 7, text: "Slept 7+ hours — mentally sharp", category: "readiness" },
  { id: 8, text: "No revenge mindset — previous sessions don't affect today", category: "readiness" },
  { id: 9, text: "Trading plan written BEFORE the session, not during", category: "readiness" },
  { id: 10, text: "Max 3 trades today — quality over quantity", category: "discipline" },
];

export default function RiskAdvisorPage() {
  const [checklist, setChecklist] = useState<Record<number, boolean>>({});
  const [showFullAssessment, setShowFullAssessment] = useState(false);

  const completedChecks = Object.values(checklist).filter(Boolean).length;
  const checklistPercent = (completedChecks / riskChecklist.length) * 100;

  // Calculate overall risk score
  const safeFactors = riskFactors.filter((f) => f.status === "safe").length;
  const warningFactors = riskFactors.filter((f) => f.status === "warning" || f.status === "caution").length;
  const dangerFactors = riskFactors.filter((f) => (f.status as string) === "danger").length;

  const riskScore = Math.round(
    ((safeFactors * 100 + warningFactors * 50 + dangerFactors * 0) / riskFactors.length)
  );

  const getOverallStatus = (): { label: string; color: string; variant: "danger" | "gold" | "success" } => {
    if (dangerFactors > 0) return { label: "HIGH RISK — Consider Sitting Out", color: "text-red-400", variant: "danger" as const };
    if (warningFactors >= 3) return { label: "ELEVATED — Trade with Reduced Size", color: "text-yellow-400", variant: "gold" as const };
    if (warningFactors >= 1) return { label: "MODERATE — Normal Trading with Awareness", color: "text-yellow-400", variant: "gold" as const };
    return { label: "LOW RISK — Full Size Authorized", color: "text-emerald-400", variant: "success" as const };
  };

  const overallStatus = getOverallStatus();

  // Position size recommendation
  const getSizeRecommendation = () => {
    if (dangerFactors > 0) return { contracts: 0, label: "Do Not Trade", percent: 0 };
    if (warningFactors >= 3) return { contracts: 3, label: "50% Size (3 contracts)", percent: 50 };
    if (warningFactors >= 1) return { contracts: 5, label: "75% Size (5 contracts)", percent: 75 };
    return { contracts: 7, label: "Full Size (7 contracts)", percent: 100 };
  };

  const sizeRec = getSizeRecommendation();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Advisor</h1>
        <p className="text-sm text-gray-400">
          Pre-session assessment. Know your risk BEFORE you place a trade.
        </p>
      </div>

      {/* Overall Assessment */}
      <Card variant="gold">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            <Shield size={14} className="inline mr-1" />
            Today&apos;s Risk Assessment
          </CardTitle>
          <Badge variant={overallStatus.variant}>{overallStatus.label}</Badge>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Score */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={riskScore >= 75 ? "#10B981" : riskScore >= 50 ? "#D4AF37" : "#EF4444"}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${riskScore * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${overallStatus.color}`}>{riskScore}</span>
                <span className="text-[10px] text-gray-500">/ 100</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">Session Safety Score</p>
          </div>

          {/* Size Recommendation */}
          <div className="flex flex-col justify-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recommended Position Size</p>
            <p className="text-2xl font-bold text-white mb-1">{sizeRec.label}</p>
            <ProgressBar value={sizeRec.percent} max={100} variant={sizeRec.percent === 100 ? "green" : sizeRec.percent >= 50 ? "gold" : "red"} />
            <p className="text-xs text-gray-500 mt-2">
              Based on {warningFactors} caution factor{warningFactors !== 1 ? "s" : ""} detected
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <CheckCircle2 size={16} className="text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-emerald-400">{safeFactors}</p>
              <p className="text-[10px] text-gray-500">Safe</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <AlertTriangle size={16} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-yellow-400">{warningFactors}</p>
              <p className="text-[10px] text-gray-500">Caution</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <XCircle size={16} className="text-red-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-red-400">{dangerFactors}</p>
              <p className="text-[10px] text-gray-500">Danger</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
              <Target size={16} className="text-yellow-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{sizeRec.contracts}</p>
              <p className="text-[10px] text-gray-500">Max Contracts</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Risk Factors */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <Eye size={14} className="inline mr-1" />
            Risk Factor Breakdown
          </CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {riskFactors.map((factor) => {
            const config = statusConfig[factor.status];
            return (
              <div
                key={factor.id}
                className={`p-4 rounded-xl ${config.bg} border ${config.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                    <factor.icon size={16} className={config.color} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">{factor.label}</p>
                      <Badge variant={factor.status === "safe" ? "success" : (factor.status as string) === "danger" ? "danger" : "warning"}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-1">{factor.value}</p>
                    <p className="text-xs text-gray-500">{factor.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pre-Session Checklist */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <CheckCircle2 size={14} className="inline mr-1" />
            Pre-Session Risk Checklist
          </CardTitle>
          <Badge variant={checklistPercent === 100 ? "success" : "warning"}>
            {completedChecks}/{riskChecklist.length}
          </Badge>
        </CardHeader>
        <ProgressBar
          value={checklistPercent}
          max={100}
          variant={checklistPercent === 100 ? "green" : "gold"}
          size="sm"
          className="mb-4"
        />
        <div className="space-y-2">
          {riskChecklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors group"
            >
              <button
                onClick={() => setChecklist((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                  checklist[item.id]
                    ? "bg-yellow-500 border-yellow-500"
                    : "border-white/20 group-hover:border-yellow-500/50"
                }`}
              >
                {checklist[item.id] && <CheckCircle2 size={12} className="text-black" />}
              </button>
              <span className={`text-sm ${checklist[item.id] ? "text-gray-400 line-through" : "text-white"}`}>
                {item.text}
              </span>
            </label>
          ))}
        </div>
        {checklistPercent < 100 && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-400">
              <AlertTriangle size={12} className="inline mr-1" />
              Complete all checks before placing your first trade. Preparation = Profit.
            </p>
          </div>
        )}
        {checklistPercent === 100 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs text-emerald-400">
              <CheckCircle2 size={12} className="inline mr-1" />
              All checks complete. You are cleared to trade with {sizeRec.label.toLowerCase()}.
            </p>
          </div>
        )}
      </Card>

      {/* Trading Window Recommendation */}
      <Card variant="default" className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Brain size={18} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-1">Today&apos;s Trading Window</p>
            <p className="text-sm text-gray-400 mb-3">
              Based on your risk assessment, here&apos;s the optimal plan:
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span className="text-xs text-gray-300">Trade 9:30 AM – 11:30 AM EST (NY Open — your best window)</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={12} className="text-yellow-400" />
                <span className="text-xs text-gray-300">Reduce size after 1:30 PM (FOMC Minutes @ 2:00 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={12} className="text-red-400" />
                <span className="text-xs text-gray-300">NO new positions after 1:45 PM — sit out FOMC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-emerald-400" />
                <span className="text-xs text-gray-300">Max {sizeRec.contracts} contracts on NQ, stop 5 ticks, target 30 ticks</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Moon,
  Smile,
  Activity,
  Shield,
  Target,
  CheckCircle2,
  Clock,
  Flame,
  Award,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

// Demo readiness data
const readinessScore = {
  overall: 78,
  sleep: 85,
  mood: 70,
  stress: 65,
  confidence: 80,
  discipline: 90,
  recentPerformance: 72,
};

// Demo coaching cards
const coachingCards = [
  {
    id: "1",
    type: "warning",
    title: "Overtrading Risk Detected",
    message: "You've taken 4 trades today — your optimal is 2-3. Performance drops 22% after your 3rd trade. Consider stopping for the day.",
    severity: "warning",
    icon: AlertTriangle,
  },
  {
    id: "2",
    type: "insight",
    title: "Best Setup Performance",
    message: "Your Breaker Block setup has a 72% win rate with 2.4 R:R in the New York session. This is your highest-expectancy combination.",
    severity: "success",
    icon: TrendingUp,
  },
  {
    id: "3",
    type: "pattern",
    title: "Sleep & Performance Correlation",
    message: "Your win rate drops to 45% on days with less than 6 hours of sleep (vs 68% on 7+ hours). Tonight: prioritize sleep.",
    severity: "info",
    icon: Moon,
  },
  {
    id: "4",
    type: "warning",
    title: "Rule-Breaking Pattern",
    message: "You broke your rules 3 times this week (moved SL twice, oversized once). Your discipline score dropped from 92% to 82%. Focus on execution, not outcome.",
    severity: "critical",
    icon: Shield,
  },
  {
    id: "5",
    type: "achievement",
    title: "3-Win Streak!",
    message: "You're on a 3-win streak. Stay disciplined — overconfidence after streaks has led to revenge trades 40% of the time historically.",
    severity: "success",
    icon: Flame,
  },
  {
    id: "6",
    type: "plan",
    title: "Tomorrow's Action Plan",
    message: "Trade only Breaker Block and FVG setups. Maximum 2 trades. New York session only. If sleep < 6hrs, reduce size by 50%.",
    severity: "info",
    icon: Target,
  },
];

const weeklyInsights = [
  "Your best day is Wednesday (71% WR) — plan your A-setups for midweek",
  "Performance declines after 2:30 PM EST — consider stopping early",
  "Revenge trading cost you $540 this week — that's 42% of your profits",
  "Your short trades underperform longs by 12% — focus on long setups",
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function CoachPage() {
  const [sleepHours, setSleepHours] = useState(7);
  const [moodScore, setMoodScore] = useState(7);
  const [stressScore, setStressScore] = useState(4);
  const [confidenceScore, setConfidenceScore] = useState(8);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreVariant = (score: number): "green" | "gold" | "red" => {
    if (score >= 80) return "green";
    if (score >= 60) return "gold";
    return "red";
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "critical": return "border-red-500/30 bg-red-500/5";
      case "warning": return "border-yellow-500/30 bg-yellow-500/5";
      case "success": return "border-emerald-500/30 bg-emerald-500/5";
      default: return "border-blue-500/30 bg-blue-500/5";
    }
  };

  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-400 bg-red-500/10";
      case "warning": return "text-yellow-400 bg-yellow-500/10";
      case "success": return "text-emerald-400 bg-emerald-500/10";
      default: return "text-blue-400 bg-blue-500/10";
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center">
            <Brain size={20} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Priisma Coach</h1>
            <p className="text-sm text-gray-400">Your personalized AI-powered trading coach</p>
          </div>
        </div>
      </motion.div>

      {/* Readiness Score */}
      <motion.div variants={item}>
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              <Zap size={14} className="inline mr-1" />
              Daily Readiness Score
            </CardTitle>
            <Badge variant={readinessScore.overall >= 75 ? "success" : readinessScore.overall >= 50 ? "warning" : "danger"}>
              {readinessScore.overall >= 75 ? "Ready to Trade" : readinessScore.overall >= 50 ? "Trade with Caution" : "Consider Rest Day"}
            </Badge>
          </CardHeader>

          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={readinessScore.overall >= 75 ? "#10B981" : readinessScore.overall >= 50 ? "#D4AF37" : "#EF4444"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${readinessScore.overall * 2.64} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${getScoreColor(readinessScore.overall)}`}>
                  {readinessScore.overall}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              {[
                { label: "Sleep", score: readinessScore.sleep, icon: Moon },
                { label: "Mood", score: readinessScore.mood, icon: Smile },
                { label: "Stress", score: readinessScore.stress, icon: Activity },
                { label: "Confidence", score: readinessScore.confidence, icon: Shield },
                { label: "Discipline", score: readinessScore.discipline, icon: CheckCircle2 },
              ].map(({ label, score, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={14} className="text-gray-500 w-4" />
                  <span className="text-xs text-gray-400 w-20">{label}</span>
                  <ProgressBar value={score} max={100} variant={getScoreVariant(score)} size="sm" className="flex-1" />
                  <span className={`text-xs font-medium w-8 text-right ${getScoreColor(score)}`}>{score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Input */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-yellow-500/10">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Sleep (hrs)</label>
              <input
                type="range" min="3" max="10" step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <p className="text-xs text-white text-center">{sleepHours}h</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Mood (1-10)</label>
              <input
                type="range" min="1" max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <p className="text-xs text-white text-center">{moodScore}/10</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Stress (1-10)</label>
              <input
                type="range" min="1" max="10"
                value={stressScore}
                onChange={(e) => setStressScore(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <p className="text-xs text-white text-center">{stressScore}/10</p>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Confidence (1-10)</label>
              <input
                type="range" min="1" max="10"
                value={confidenceScore}
                onChange={(e) => setConfidenceScore(parseInt(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <p className="text-xs text-white text-center">{confidenceScore}/10</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Coaching Cards */}
      <motion.div variants={item}>
        <h2 className="text-lg font-semibold text-white mb-4">Coaching Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachingCards.map((card, idx) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <div className={`p-5 rounded-2xl border ${getSeverityStyles(card.severity)}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${getSeverityIconColor(card.severity)}`}>
                    <card.icon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-1">{card.title}</h3>
                    <p className="text-xs text-gray-300 leading-relaxed">{card.message}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Performance Report */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Award size={14} className="inline mr-1" />
              Weekly Performance Report
            </CardTitle>
            <Badge variant="gold">Week 3, 2025</Badge>
          </CardHeader>
          <div className="space-y-3">
            {weeklyInsights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-5 h-5 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-yellow-400">{idx + 1}</span>
                </div>
                <p className="text-sm text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* End of Day Review */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Clock size={14} className="inline mr-1" />
              End-of-Day Review
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-emerald-400">What Went Well</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Followed trading plan on 3/5 trades</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Best setup (Breaker Block) executed perfectly</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Risk management respected on all winners</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-red-400">Areas to Improve</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span>Took 2 trades outside optimal session</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span>Moved stop loss on trade #4 (revenge trade)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <AlertTriangle size={14} className="text-red-400" />
                  <span>Overtraded after hitting daily target</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Discipline Score Breakdown */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Shield size={14} className="inline mr-1" />
              Discipline Scorecard
            </CardTitle>
            <span className="text-2xl font-bold text-yellow-400">82%</span>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Followed trading plan", score: 85 },
              { label: "Proper position sizing", score: 90 },
              { label: "Respected stop loss", score: 75 },
              { label: "Traded optimal session", score: 70 },
              { label: "Max trades per day", score: 80 },
              { label: "No emotional decisions", score: 85 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-40">{item.label}</span>
                <ProgressBar value={item.score} max={100} variant={getScoreVariant(item.score)} size="sm" className="flex-1" />
                <span className={`text-xs font-medium w-10 text-right ${getScoreColor(item.score)}`}>
                  {item.score}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
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
  Upload,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";

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

      {/* Readiness Score - Keep interactive inputs */}
      <motion.div variants={item}>
        <Card variant="gold">
          <CardHeader>
            <CardTitle className="text-yellow-400">
              <Zap size={14} className="inline mr-1" />
              Daily Readiness Check-In
            </CardTitle>
            <Badge variant="default">
              No Score Yet
            </Badge>
          </CardHeader>

          <p className="text-sm text-gray-300 mb-4">Log your daily readiness to get personalized trade recommendations.</p>

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

      {/* Coaching Insights Empty State */}
      <motion.div variants={item}>
        <Card variant="glass" className="p-12 text-center">
          <Brain size={40} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No coaching insights yet</h3>
          <p className="text-sm text-gray-400 mb-6">Start logging trades to get personalized coaching insights, pattern detection, and actionable recommendations.</p>
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

      {/* Weekly Performance Report Empty State */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Award size={14} className="inline mr-1" />
              Weekly Performance Report
            </CardTitle>
          </CardHeader>
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">Complete at least one week of trading to generate your weekly performance report.</p>
          </div>
        </Card>
      </motion.div>

      {/* Discipline Score Empty State */}
      <motion.div variants={item}>
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Shield size={14} className="inline mr-1" />
              Discipline Scorecard
            </CardTitle>
            <span className="text-2xl font-bold text-gray-500">--%</span>
          </CardHeader>
          <div className="py-8 text-center">
            <p className="text-sm text-gray-400">Log trades and follow your trading plan to build your discipline score.</p>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

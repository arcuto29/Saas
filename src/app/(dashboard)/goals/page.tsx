"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Plus,
  Trophy,
  Flame,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { GOAL_TYPES } from "@/constants";

interface Goal {
  id: string;
  title: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  isCompleted: boolean;
}

const demoGoals: Goal[] = [
  { id: "1", title: "Monthly Profit Target", type: "profit", target: 5000, current: 4350, unit: "dollars", isCompleted: false },
  { id: "2", title: "Win Rate Above 60%", type: "consistency", target: 60, current: 62.5, unit: "percent", isCompleted: true },
  { id: "3", title: "Follow Trading Plan Daily", type: "discipline", target: 20, current: 16, unit: "days", isCompleted: false },
  { id: "4", title: "Max 3 Trades Per Day", type: "daily", target: 3, current: 2, unit: "trades", isCompleted: false },
  { id: "5", title: "Journal Every Trade", type: "habit", target: 48, current: 45, unit: "trades", isCompleted: false },
  { id: "6", title: "Weekly Review Session", type: "weekly", target: 4, current: 3, unit: "sessions", isCompleted: false },
  { id: "7", title: "No Revenge Trading", type: "discipline", target: 20, current: 18, unit: "days", isCompleted: false },
  { id: "8", title: "Sleep 7+ Hours", type: "habit", target: 30, current: 22, unit: "days", isCompleted: false },
];

export default function GoalsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const filteredGoals = filter === "all"
    ? demoGoals
    : filter === "completed"
    ? demoGoals.filter((g) => g.isCompleted)
    : demoGoals.filter((g) => g.type === filter);

  const completedCount = demoGoals.filter((g) => g.isCompleted).length;
  const overallProgress = (demoGoals.reduce((s, g) => s + Math.min(g.current / g.target, 1), 0) / demoGoals.length) * 100;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "profit": return <TrendingUp size={14} />;
      case "consistency": return <Target size={14} />;
      case "discipline": return <Flame size={14} />;
      case "daily": return <Calendar size={14} />;
      case "habit": return <CheckCircle2 size={14} />;
      case "weekly": return <Calendar size={14} />;
      default: return <Trophy size={14} />;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-sm text-gray-400">Track your trading goals and build winning habits</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          New Goal
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="gold" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <Trophy size={20} className="text-yellow-400" />
            <div>
              <p className="text-sm font-medium text-white">Overall Progress</p>
              <p className="text-xs text-gray-400">{completedCount} of {demoGoals.length} goals completed</p>
            </div>
          </div>
          <ProgressBar value={overallProgress} max={100} variant="gold" size="lg" showLabel />
        </Card>
        <Card variant="default" className="p-5">
          <p className="text-xs text-gray-400 mb-1">Active Goals</p>
          <p className="text-3xl font-bold text-white">{demoGoals.length - completedCount}</p>
        </Card>
        <Card variant="default" className="p-5">
          <p className="text-xs text-gray-400 mb-1">Completed</p>
          <p className="text-3xl font-bold text-emerald-400">{completedCount}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "profit", "consistency", "discipline", "habit", "daily", "weekly", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all border ${
              filter === f
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                : "text-gray-400 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.map((goal, idx) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card variant={goal.isCompleted ? "default" : "glass"} hover className="relative overflow-hidden">
                {goal.isCompleted && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={20} className="text-emerald-400" />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    goal.isCompleted ? "bg-emerald-500/10 text-emerald-400" : "bg-yellow-500/10 text-yellow-400"
                  }`}>
                    {getTypeIcon(goal.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{goal.title}</h3>
                    <Badge variant="default" size="sm" className="mt-1">
                      {GOAL_TYPES.find((t) => t.value === goal.type)?.label || goal.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                </div>
                <ProgressBar
                  value={progress}
                  max={100}
                  variant={goal.isCompleted ? "green" : progress > 80 ? "gold" : "blue"}
                />
                <p className="text-xs text-gray-500 mt-2">{progress.toFixed(0)}% complete</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Goal" size="md">
        <form className="space-y-4">
          <Input label="Goal Title" placeholder="e.g. Monthly Profit Target" required />
          <Select label="Goal Type" options={GOAL_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Target" type="number" placeholder="5000" required />
            <Select
              label="Unit"
              options={[
                { value: "dollars", label: "Dollars" },
                { value: "percent", label: "Percent" },
                { value: "trades", label: "Trades" },
                { value: "days", label: "Days" },
                { value: "sessions", label: "Sessions" },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" />
            <Input label="End Date" type="date" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Create Goal</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

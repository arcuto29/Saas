"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Calculator,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  XCircle,
  DollarSign,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

export default function RiskPage() {
  // Position Size Calculator
  const [accountBalance, setAccountBalance] = useState("50000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [entryPrice, setEntryPrice] = useState("18250");
  const [stopPrice, setStopPrice] = useState("18220");

  const riskAmount = (parseFloat(accountBalance) || 0) * ((parseFloat(riskPercent) || 0) / 100);
  const priceDiff = Math.abs((parseFloat(entryPrice) || 0) - (parseFloat(stopPrice) || 0));
  const positionSize = priceDiff > 0 ? riskAmount / priceDiff : 0;

  // Drawdown Calculator
  const [ddBalance, setDdBalance] = useState("100000");
  const [ddPercent, setDdPercent] = useState("10");
  const maxDrawdownAmount = (parseFloat(ddBalance) || 0) * ((parseFloat(ddPercent) || 0) / 100);
  const ddFloor = (parseFloat(ddBalance) || 0) - maxDrawdownAmount;

  // Daily Loss Tracker
  const dailyLimit = 500;
  const currentDailyLoss = -320;
  const dailyRemaining = dailyLimit + currentDailyLoss;
  const dailyUsedPercent = (Math.abs(currentDailyLoss) / dailyLimit) * 100;

  // Trading Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Checked daily bias and market structure", done: true },
    { id: 2, text: "Marked key support/resistance levels", done: true },
    { id: 3, text: "Set maximum risk for the day", done: true },
    { id: 4, text: "Reviewed economic calendar", done: false },
    { id: 5, text: "Confirmed trading plan setup", done: false },
    { id: 6, text: "Slept 7+ hours last night", done: true },
    { id: 7, text: "Feeling calm and focused", done: true },
    { id: 8, text: "No revenge trading mindset", done: true },
  ]);

  const completedCount = checklist.filter((c) => c.done).length;
  const checklistPercent = (completedCount / checklist.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Risk Management</h1>
        <p className="text-sm text-gray-400">Protect your capital with smart risk tools</p>
      </div>

      {/* Risk Warning Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="default" className="p-4 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Daily Risk Used</span>
          </div>
          <p className="text-2xl font-bold text-white">{dailyUsedPercent.toFixed(0)}%</p>
          <p className="text-xs text-gray-400 mt-1">${Math.abs(currentDailyLoss)} of ${dailyLimit} limit</p>
          <ProgressBar value={dailyUsedPercent} max={100} variant={dailyUsedPercent > 80 ? "red" : "gold"} size="sm" className="mt-2" />
        </Card>
        <Card variant="default" className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">Remaining Budget</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">${dailyRemaining.toFixed(0)}</p>
          <p className="text-xs text-gray-400 mt-1">Available risk for today</p>
        </Card>
        <Card variant="default" className="p-4 border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-red-400" />
            <span className="text-sm font-medium text-red-400">Max Drawdown</span>
          </div>
          <p className="text-2xl font-bold text-white">-8.2%</p>
          <p className="text-xs text-gray-400 mt-1">Current from peak equity</p>
        </Card>
      </div>

      {/* Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Position Size Calculator */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Calculator size={14} className="inline mr-1" />
              Position Size Calculator
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Account Balance"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              icon={<DollarSign size={14} />}
            />
            <Input
              label="Risk Percentage"
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
            />
            <Input
              label="Entry Price"
              type="number"
              step="0.01"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
            />
            <Input
              label="Stop Loss Price"
              type="number"
              step="0.01"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
            />

            {/* Results */}
            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Risk Amount</span>
                <span className="text-lg font-bold text-yellow-400">${riskAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Stop Distance</span>
                <span className="text-lg font-bold text-white">{priceDiff.toFixed(2)} pts</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="text-sm font-medium text-white">Position Size</span>
                <span className="text-2xl font-bold text-gold-gradient">{positionSize.toFixed(2)} contracts</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Drawdown Calculator */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <TrendingDown size={14} className="inline mr-1" />
              Drawdown Calculator
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <Input
              label="Account Balance"
              type="number"
              value={ddBalance}
              onChange={(e) => setDdBalance(e.target.value)}
              icon={<DollarSign size={14} />}
            />
            <Input
              label="Maximum Drawdown %"
              type="number"
              step="0.1"
              value={ddPercent}
              onChange={(e) => setDdPercent(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Loss Amount</span>
                <span className="text-lg font-bold text-red-400">${maxDrawdownAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Drawdown Floor</span>
                <span className="text-lg font-bold text-white">${ddFloor.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="text-sm text-gray-400">Current Balance</span>
                <span className="text-lg font-bold text-emerald-400">${parseFloat(ddBalance).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-400">Drawdown Visualization</p>
              <div className="relative h-8 rounded-lg bg-white/5 overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500/40 to-emerald-500/20 rounded-lg"
                  style={{ width: `${100 - parseFloat(ddPercent)}%` }}
                />
                <div
                  className="absolute right-0 top-0 h-full bg-gradient-to-l from-red-500/40 to-red-500/20 rounded-lg"
                  style={{ width: `${parseFloat(ddPercent)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    Safe Zone ({(100 - parseFloat(ddPercent)).toFixed(0)}%) | Risk Zone ({ddPercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Daily Risk Planner & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Risk Planner */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <DollarSign size={14} className="inline mr-1" />
              Maximum Daily Risk Plan
            </CardTitle>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500">Daily Limit</p>
                <p className="text-lg font-bold text-white">$500</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500">Per Trade Risk</p>
                <p className="text-lg font-bold text-white">$250</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500">Max Trades/Day</p>
                <p className="text-lg font-bold text-white">3</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="text-xs text-gray-500">Consecutive Losses</p>
                <p className="text-lg font-bold text-yellow-400">2 = Stop</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
              <p className="text-xs text-yellow-400 font-medium">Rule</p>
              <p className="text-sm text-gray-300 mt-1">
                After 2 consecutive losses, reduce size by 50% or stop trading for the day.
              </p>
            </div>
          </div>
        </Card>

        {/* Trading Checklist */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <CheckCircle2 size={14} className="inline mr-1" />
              Pre-Trading Checklist
            </CardTitle>
            <Badge variant={checklistPercent === 100 ? "success" : "warning"}>
              {completedCount}/{checklist.length}
            </Badge>
          </CardHeader>
          <ProgressBar value={checklistPercent} max={100} variant={checklistPercent === 100 ? "green" : "gold"} size="sm" className="mb-4" />
          <div className="space-y-2">
            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors group"
              >
                <button
                  onClick={() => {
                    setChecklist(checklist.map((c) =>
                      c.id === item.id ? { ...c, done: !c.done } : c
                    ));
                  }}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all ${
                    item.done
                      ? "bg-yellow-500 border-yellow-500"
                      : "border-white/20 group-hover:border-yellow-500/50"
                  }`}
                >
                  {item.done && <CheckCircle2 size={12} className="text-black" />}
                </button>
                <span className={`text-sm ${item.done ? "text-gray-400 line-through" : "text-white"}`}>
                  {item.text}
                </span>
              </label>
            ))}
          </div>
        </Card>
      </div>
    </motion.div>
  );
}

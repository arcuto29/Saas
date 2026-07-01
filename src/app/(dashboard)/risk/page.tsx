"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Calculator,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
  DollarSign,
  Target,
  Zap,
  Info,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

// Futures contract specs
const CONTRACTS = {
  NQ: { name: "Nasdaq 100 (NQ)", tickSize: 0.25, tickValue: 5.0, pointValue: 20.0, symbol: "NQ" },
  MNQ: { name: "Micro Nasdaq (MNQ)", tickSize: 0.25, tickValue: 0.5, pointValue: 2.0, symbol: "MNQ" },
  ES: { name: "S&P 500 (ES)", tickSize: 0.25, tickValue: 12.5, pointValue: 50.0, symbol: "ES" },
  MES: { name: "Micro S&P (MES)", tickSize: 0.25, tickValue: 1.25, pointValue: 5.0, symbol: "MES" },
  YM: { name: "Dow Jones (YM)", tickSize: 1.0, tickValue: 5.0, pointValue: 5.0, symbol: "YM" },
  MYM: { name: "Micro Dow (MYM)", tickSize: 1.0, tickValue: 0.5, pointValue: 0.5, symbol: "MYM" },
  GC: { name: "Gold (GC)", tickSize: 0.1, tickValue: 10.0, pointValue: 100.0, symbol: "GC" },
  CL: { name: "Crude Oil (CL)", tickSize: 0.01, tickValue: 10.0, pointValue: 1000.0, symbol: "CL" },
};

const contractOptions = Object.entries(CONTRACTS).map(([key, val]) => ({
  value: key,
  label: val.name,
}));

export default function RiskPage() {
  // Position Size Calculator (tick-based)
  const [accountBalance, setAccountBalance] = useState("50000");
  const [riskPercent, setRiskPercent] = useState("1");
  const [selectedContract, setSelectedContract] = useState("NQ");
  const [stopTicks, setStopTicks] = useState("20");
  const [targetTicks, setTargetTicks] = useState("120");

  const contract = CONTRACTS[selectedContract as keyof typeof CONTRACTS];

  const riskAmount = (parseFloat(accountBalance) || 0) * ((parseFloat(riskPercent) || 0) / 100);
  const stopPoints = (parseInt(stopTicks) || 0) * contract.tickSize;
  const targetPoints = (parseInt(targetTicks) || 0) * contract.tickSize;
  const stopDollarPerContract = (parseInt(stopTicks) || 0) * contract.tickValue;
  const targetDollarPerContract = (parseInt(targetTicks) || 0) * contract.tickValue;
  const maxContracts = stopDollarPerContract > 0 ? Math.floor(riskAmount / stopDollarPerContract) : 0;
  const riskRewardRatio = stopDollarPerContract > 0 ? targetDollarPerContract / stopDollarPerContract : 0;
  const potentialProfit = maxContracts * targetDollarPerContract;
  const actualRisk = maxContracts * stopDollarPerContract;

  // Drawdown Calculator
  const [ddBalance, setDdBalance] = useState("100000");
  const [ddPercent, setDdPercent] = useState("4");
  const [trailingDrawdown, setTrailingDrawdown] = useState(true);
  const maxDrawdownAmount = (parseFloat(ddBalance) || 0) * ((parseFloat(ddPercent) || 0) / 100);
  const ddFloor = (parseFloat(ddBalance) || 0) - maxDrawdownAmount;
  const maxLossesBeforeBlow = stopDollarPerContract > 0 ? Math.floor(maxDrawdownAmount / stopDollarPerContract) : 0;

  // Daily Loss Tracker
  const dailyLimit = 1000;
  const currentDailyLoss = -320;
  const dailyRemaining = dailyLimit + currentDailyLoss;
  const dailyUsedPercent = (Math.abs(currentDailyLoss) / dailyLimit) * 100;

  // Funded Account Scenario Planner
  const [fundedSize, setFundedSize] = useState("50000");
  const [profitTarget, setProfitTarget] = useState("3000");
  const [maxDailyLoss, setMaxDailyLoss] = useState("1000");
  const [maxTotalDrawdown, setMaxTotalDrawdown] = useState("2500");
  const [contractsPerTrade, setContractsPerTrade] = useState("2");

  const fundedRiskPerTrade = (parseInt(contractsPerTrade) || 0) * stopDollarPerContract;
  const tradesToHitTarget = targetDollarPerContract > 0 ? Math.ceil((parseFloat(profitTarget) || 0) / ((parseInt(contractsPerTrade) || 0) * targetDollarPerContract)) : 0;
  const maxConsecutiveLosses = fundedRiskPerTrade > 0 ? Math.floor((parseFloat(maxDailyLoss) || 0) / fundedRiskPerTrade) : 0;
  const totalLossesBeforeFail = fundedRiskPerTrade > 0 ? Math.floor((parseFloat(maxTotalDrawdown) || 0) / fundedRiskPerTrade) : 0;

  // Trading Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, text: "Identified daily bias (bullish/bearish) on NQ/ES", done: true },
    { id: 2, text: "Marked key liquidity levels & order blocks", done: true },
    { id: 3, text: "Set maximum contracts and stop loss BEFORE entry", done: true },
    { id: 4, text: "Checked economic calendar (CPI, FOMC, NFP)", done: false },
    { id: 5, text: "Confirmed A+ setup — not forcing a trade", done: false },
    { id: 6, text: "Slept 7+ hours last night", done: true },
    { id: 7, text: "No revenge trading mindset — mentally clear", done: true },
    { id: 8, text: "Within daily loss limit — allowed to trade", done: true },
    { id: 9, text: "NY session window (9:30 AM – 12:00 PM EST)", done: false },
    { id: 10, text: "Risk:Reward minimum 1:3 confirmed", done: false },
  ]);

  const completedCount = checklist.filter((c) => c.done).length;
  const checklistPercent = (completedCount / checklist.length) * 100;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Futures Risk Management</h1>
        <p className="text-sm text-gray-400">Tick-based calculators and risk tools for NQ, ES, YM, GC, CL</p>
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
        <Card variant="default" className="p-4 border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Contract Specs</span>
          </div>
          <p className="text-2xl font-bold text-white">{contract.symbol}</p>
          <p className="text-xs text-gray-400 mt-1">${contract.tickValue}/tick · ${contract.pointValue}/point</p>
        </Card>
      </div>

      {/* Futures Position Size Calculator */}
      <Card variant="gold">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            <Calculator size={14} className="inline mr-1" />
            Futures Position Size Calculator
          </CardTitle>
          <Badge variant="gold">Tick-Based</Badge>
        </CardHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-4">
            <Select
              label="Contract"
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              options={contractOptions}
            />
            <Input
              label="Account Balance ($)"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(e.target.value)}
              icon={<DollarSign size={14} />}
            />
            <Input
              label="Risk Per Trade (%)"
              type="number"
              step="0.1"
              value={riskPercent}
              onChange={(e) => setRiskPercent(e.target.value)}
            />
            <Input
              label="Stop Loss (ticks)"
              type="number"
              value={stopTicks}
              onChange={(e) => setStopTicks(e.target.value)}
            />
            <Input
              label="Target (ticks)"
              type="number"
              value={targetTicks}
              onChange={(e) => setTargetTicks(e.target.value)}
            />
          </div>

          {/* Results */}
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-black/30 border border-yellow-500/20 space-y-4">
              <h4 className="text-sm font-medium text-yellow-400 uppercase tracking-wide">Results</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-gray-500">Max Risk ($)</p>
                  <p className="text-xl font-bold text-red-400">${riskAmount.toFixed(0)}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-gray-500">Max Contracts</p>
                  <p className="text-xl font-bold text-yellow-400">{maxContracts}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-gray-500">Stop Distance</p>
                  <p className="text-xl font-bold text-white">{stopPoints.toFixed(2)} pts</p>
                  <p className="text-[10px] text-gray-500">{stopTicks} ticks × ${contract.tickValue}/tick</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <p className="text-xs text-gray-500">Target Distance</p>
                  <p className="text-xl font-bold text-emerald-400">{targetPoints.toFixed(2)} pts</p>
                  <p className="text-[10px] text-gray-500">{targetTicks} ticks × ${contract.tickValue}/tick</p>
                </div>
              </div>

              <div className="h-px w-full bg-white/10" />

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-xs text-gray-500">Actual Risk</p>
                  <p className="text-lg font-bold text-red-400">-${actualRisk.toFixed(0)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-xs text-gray-500">Potential Profit</p>
                  <p className="text-lg font-bold text-emerald-400">+${potentialProfit.toFixed(0)}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <p className="text-xs text-gray-500">Risk:Reward</p>
                  <p className="text-lg font-bold text-yellow-400">1:{riskRewardRatio.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Quick reference */}
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-gray-400 space-y-1">
                  <p><span className="text-white font-medium">{contract.name}</span></p>
                  <p>Tick Size: {contract.tickSize} | Tick Value: ${contract.tickValue} | Point Value: ${contract.pointValue}</p>
                  <p>With {maxContracts} contract{maxContracts !== 1 ? "s" : ""}: 1 tick = ${(maxContracts * contract.tickValue).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Drawdown & Funded Account */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              label="Account Balance ($)"
              type="number"
              value={ddBalance}
              onChange={(e) => setDdBalance(e.target.value)}
              icon={<DollarSign size={14} />}
            />
            <Input
              label="Maximum Drawdown (%)"
              type="number"
              step="0.5"
              value={ddPercent}
              onChange={(e) => setDdPercent(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Loss Amount</span>
                <span className="text-lg font-bold text-red-400">-${maxDrawdownAmount.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Drawdown Floor</span>
                <span className="text-lg font-bold text-white">${ddFloor.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-white/10 pt-3">
                <span className="text-sm text-gray-400">Losses to Blow (@ current stop)</span>
                <span className="text-lg font-bold text-yellow-400">{maxLossesBeforeBlow} trades</span>
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
                    Safe ({(100 - parseFloat(ddPercent)).toFixed(0)}%) | Danger ({ddPercent}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Funded Challenge Planner */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>
              <Zap size={14} className="inline mr-1" />
              Funded Challenge Planner
            </CardTitle>
            <Badge variant="gold">{contract.symbol}</Badge>
          </CardHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Account Size ($)"
                type="number"
                value={fundedSize}
                onChange={(e) => setFundedSize(e.target.value)}
              />
              <Input
                label="Profit Target ($)"
                type="number"
                value={profitTarget}
                onChange={(e) => setProfitTarget(e.target.value)}
              />
              <Input
                label="Max Daily Loss ($)"
                type="number"
                value={maxDailyLoss}
                onChange={(e) => setMaxDailyLoss(e.target.value)}
              />
              <Input
                label="Max Total Drawdown ($)"
                type="number"
                value={maxTotalDrawdown}
                onChange={(e) => setMaxTotalDrawdown(e.target.value)}
              />
            </div>
            <Input
              label="Contracts Per Trade"
              type="number"
              value={contractsPerTrade}
              onChange={(e) => setContractsPerTrade(e.target.value)}
            />

            <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Risk Per Trade</span>
                <span className="text-sm font-bold text-red-400">-${fundedRiskPerTrade.toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Profit Per Winner</span>
                <span className="text-sm font-bold text-emerald-400">+${((parseInt(contractsPerTrade) || 0) * targetDollarPerContract).toFixed(0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Winners to Pass</span>
                <span className="text-sm font-bold text-yellow-400">{tradesToHitTarget} trades</span>
              </div>
              <div className="h-px w-full bg-white/10" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Max Consecutive Losses (daily)</span>
                <span className="text-sm font-bold text-red-400">{maxConsecutiveLosses} trades</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Total Losses Before Fail</span>
                <span className="text-sm font-bold text-red-400">{totalLossesBeforeFail} trades</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-xs text-emerald-400 font-medium mb-1">With 80% Win Rate:</p>
              <p className="text-xs text-gray-300">
                You&apos;d need ~{tradesToHitTarget} winning trades to pass. At 80% WR with {contractsPerTrade} contract{parseInt(contractsPerTrade) !== 1 ? "s" : ""} risking {stopTicks} ticks on {contract.symbol}, you have a strong probability of passing within {Math.ceil(tradesToHitTarget / 0.8)} total trades.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Trading Checklist */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <CheckCircle2 size={14} className="inline mr-1" />
            Pre-Trading Checklist (Futures)
          </CardTitle>
          <Badge variant={checklistPercent === 100 ? "success" : "warning"}>
            {completedCount}/{checklist.length}
          </Badge>
        </CardHeader>
        <ProgressBar value={checklistPercent} max={100} variant={checklistPercent === 100 ? "green" : "gold"} size="sm" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
        {checklistPercent < 100 && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-400">
              <AlertTriangle size={12} className="inline mr-1" />
              Complete all items before taking a trade. Discipline = Funded.
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

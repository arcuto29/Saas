"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  Save,
  XCircle,
  DollarSign,
  Target,
  BarChart3,
  Clock,
  Ban,
  Zap,
  Bell,
  Settings,
  TrendingDown,
  Activity,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import toast from "react-hot-toast";

// Saved risk presets
const RISK_PRESETS = [
  { label: "Conservative", risk: 1, rr: "3:1", maxTrades: 2, pdll: 300 },
  { label: "Standard", risk: 2, rr: "2:1", maxTrades: 3, pdll: 500 },
  { label: "Aggressive", risk: 5, rr: "1.5:1", maxTrades: 4, pdll: 1000 },
  { label: "Prisma (7 contracts)", risk: 2, rr: "6:1", maxTrades: 3, pdll: 700 },
];

const RR_OPTIONS = [
  { value: "1:1", label: "1:1" },
  { value: "1.5:1", label: "1.5:1" },
  { value: "2:1", label: "2:1" },
  { value: "3:1", label: "3:1" },
  { value: "4:1", label: "4:1" },
  { value: "6:1", label: "6:1" },
];

const PDLL_ACTIONS = [
  { value: "warn", label: "Warn Only" },
  { value: "block", label: "Block New Trades" },
  { value: "liquidate-block", label: "Liquidate & Block" },
];

const PDPT_ACTIONS = [
  { value: "nothing", label: "Do Nothing" },
  { value: "warn", label: "Warn & Suggest Stop" },
  { value: "block", label: "Block New Trades (Lock in Profit)" },
];

const SESSION_TIMES = [
  { value: "ny-open", label: "NY Open Only (9:30 AM – 11:30 AM)" },
  { value: "ny-full", label: "Full NY Session (9:30 AM – 4:00 PM)" },
  { value: "london-ny", label: "London + NY (3:00 AM – 4:00 PM)" },
  { value: "all", label: "All Sessions (24hr)" },
  { value: "custom", label: "Custom Window" },
];

export default function RiskSettingsPage() {
  // Risk Settings
  const [riskPercent, setRiskPercent] = useState(2);
  const [riskDollars, setRiskDollars] = useState(100);
  const [rr, setRr] = useState("6:1");
  const [pdll, setPdll] = useState(700);
  const [pdllAction, setPdllAction] = useState("block");
  const [pdpt, setPdpt] = useState(0);
  const [pdptAction, setPdptAction] = useState("nothing");
  const [maxTrades, setMaxTrades] = useState(3);
  const [blockedSymbols, setBlockedSymbols] = useState("ES, YM");
  const [sessionWindow, setSessionWindow] = useState("ny-open");
  const [maxContracts, setMaxContracts] = useState(7);

  // Session state (simulated — in production tied to real trades)
  const [isLocked, setIsLocked] = useState(false);
  const [settingsActive, setSettingsActive] = useState(true);
  const [currentPnl, setCurrentPnl] = useState(-180);
  const [tradesToday, setTradesToday] = useState(1);
  const [savedForDom, setSavedForDom] = useState(false);

  // Calculations
  const pdllUsed = Math.abs(Math.min(currentPnl, 0));
  const pdllPercent = pdll > 0 ? (pdllUsed / pdll) * 100 : 0;
  const pdptReached = pdpt > 0 && currentPnl >= pdpt;
  const maxTradesReached = tradesToday >= maxTrades;
  const isAtRisk = pdllPercent >= 75;
  const isBlown = pdllPercent >= 100;

  // Auto-lock check
  useEffect(() => {
    if (isBlown || maxTradesReached) {
      setIsLocked(true);
    }
  }, [isBlown, maxTradesReached]);

  const saveSettings = () => {
    // In production, save to database
    localStorage.setItem("riskSettings", JSON.stringify({
      riskPercent, riskDollars, rr, pdll, pdllAction, pdpt, pdptAction,
      maxTrades, blockedSymbols, sessionWindow, maxContracts,
    }));
    toast.success("Risk settings saved!");
  };

  const saveForDom = () => {
    saveSettings();
    setSavedForDom(true);
    toast.success("Saved for Trade DOM! Settings will be enforced during your session.");

    // Send Discord notification
    if (typeof window !== "undefined") {
      fetch("/api/risk-settings/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskPercent, riskDollars, rr, pdll, pdllAction, pdpt, pdptAction,
          maxTrades, blockedSymbols, sessionWindow, maxContracts,
        }),
      }).catch(() => {});
    }
  };

  const lockMeOut = () => {
    setIsLocked(true);
    toast("You are locked out of trading for this session.", { icon: "🔒" });
  };

  const unlockSession = () => {
    setIsLocked(false);
    toast("Session unlocked. Trade responsibly.", { icon: "🔓" });
  };

  const loadPreset = (preset: typeof RISK_PRESETS[0]) => {
    setRiskPercent(preset.risk);
    setRr(preset.rr);
    setMaxTrades(preset.maxTrades);
    setPdll(preset.pdll);
    toast.success(`Loaded "${preset.label}" preset`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Session Risk Settings</h1>
          <p className="text-sm text-gray-400">
            Set your rules BEFORE the session. Lock yourself in. No excuses.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {savedForDom && (
            <Badge variant="success">
              <CheckCircle2 size={10} className="mr-1" />
              Saved for DOM
            </Badge>
          )}
          {isLocked && (
            <Badge variant="danger">
              <Lock size={10} className="mr-1" />
              LOCKED OUT
            </Badge>
          )}
        </div>
      </div>

      {/* Lock-out Banner */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-red-500/10 border-2 border-red-500/30"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
              <Lock size={28} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400">SESSION LOCKED — NO MORE TRADES</h3>
              <p className="text-sm text-gray-400 mt-1">
                {isBlown
                  ? `Daily loss limit hit (-$${pdll}). You are done for today.`
                  : maxTradesReached
                  ? `Maximum trades reached (${maxTrades}/${maxTrades}). Session over.`
                  : "You manually locked yourself out. Good discipline."}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={unlockSession}>
              <Unlock size={14} className="mr-1" />
              Override
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Risk Presets */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <Zap size={14} className="inline mr-1" />
            Quick Presets
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {RISK_PRESETS.map((preset) => (
            <motion.button
              key={preset.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => loadPreset(preset)}
              className="p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-yellow-500/20 hover:bg-white/[0.04] transition-all text-left"
            >
              <p className="text-sm font-semibold text-white mb-1">{preset.label}</p>
              <p className="text-xs text-gray-500">
                {preset.risk}% risk · {preset.rr} R:R · {preset.maxTrades} trades · ${preset.pdll} PDLL
              </p>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Risk % and R:R Quick Select */}
      <Card variant="gold">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            <Target size={14} className="inline mr-1" />
            Risk & Reward Settings
          </CardTitle>
          {savedForDom && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 size={12} className="text-emerald-400" />
              <span className="text-xs text-emerald-400 font-medium">Saved for Trade DOM</span>
            </div>
          )}
        </CardHeader>

        <div className="space-y-6">
          {/* Risk % buttons */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Risk Per Trade</label>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                {[1, 2, 5, 10].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setRiskPercent(pct)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      riskPercent === pct
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <DollarSign size={14} className="text-gray-500" />
                <input
                  type="number"
                  value={riskDollars}
                  onChange={(e) => setRiskDollars(Number(e.target.value))}
                  className="w-20 bg-transparent text-white text-sm font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* R:R buttons */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Minimum Risk:Reward</label>
            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
              {["1:1", "1.5:1", "2:1", "3:1", "6:1"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setRr(ratio)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    rr === ratio
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Max Contracts */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Maximum Contracts Per Trade</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="15"
                value={maxContracts}
                onChange={(e) => setMaxContracts(Number(e.target.value))}
                className="flex-1 accent-yellow-500"
              />
              <span className="text-lg font-bold text-white w-8 text-center">{maxContracts}</span>
            </div>
          </div>

          {/* Save for DOM button */}
          <Button onClick={saveForDom} className="w-full justify-center" size="lg">
            <Save size={16} className="mr-2" />
            Save for Trade DOM
          </Button>
          {savedForDom && (
            <p className="text-xs text-center text-gray-500">
              DOM will warn on accounts over {riskPercent}% risk or below {rr} R:R
            </p>
          )}
        </div>
      </Card>

      {/* Session Risk Settings */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <Shield size={14} className="inline mr-1" />
            Session Risk Settings
          </CardTitle>
          <button
            onClick={() => setSettingsActive(!settingsActive)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              settingsActive
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/5 text-gray-500 border border-white/10"
            }`}
          >
            {settingsActive ? "Risk Settings On" : "Risk Settings Off"}
          </button>
        </CardHeader>

        {settingsActive && (
          <p className="text-xs text-gray-500 -mt-2 mb-4">
            Enforces your rules from session open to close. When a threshold is breached, you get locked out.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left column */}
          <div className="space-y-4">
            <Input
              label="Personal Daily Loss Limit (PDLL)"
              type="number"
              value={String(pdll)}
              onChange={(e) => setPdll(Number(e.target.value))}
              icon={<DollarSign size={14} />}
            />
            <Input
              label="Personal Daily Profit Target (PDPT)"
              type="number"
              value={String(pdpt)}
              onChange={(e) => setPdpt(Number(e.target.value))}
              icon={<Target size={14} />}
            />
            <p className="text-[10px] text-gray-600">0 = disabled (no profit target lock)</p>
            <Input
              label="Maximum Trades Per Session"
              type="number"
              value={String(maxTrades)}
              onChange={(e) => setMaxTrades(Number(e.target.value))}
              icon={<BarChart3 size={14} />}
            />
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Select
              label="PDLL Action (when daily loss limit hit)"
              value={pdllAction}
              onChange={(e) => setPdllAction(e.target.value)}
              options={PDLL_ACTIONS}
            />
            <Select
              label="PDPT Action (when profit target hit)"
              value={pdptAction}
              onChange={(e) => setPdptAction(e.target.value)}
              options={PDPT_ACTIONS}
            />
            <Input
              label="Blocked Symbols (comma-separated)"
              type="text"
              value={blockedSymbols}
              onChange={(e) => setBlockedSymbols(e.target.value)}
              icon={<Ban size={14} />}
            />
            <p className="text-[10px] text-gray-600">Symbols you refuse to trade (e.g. ES, YM, GC)</p>
          </div>
        </div>

        {/* Session window */}
        <div className="mt-5">
          <Select
            label="Trading Session Window"
            value={sessionWindow}
            onChange={(e) => setSessionWindow(e.target.value)}
            options={SESSION_TIMES}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/5">
          <Button onClick={saveSettings} variant="primary" size="sm">
            <Save size={14} className="mr-1" />
            Save Settings
          </Button>
          <Button onClick={lockMeOut} variant="danger" size="sm">
            <Lock size={14} className="mr-1" />
            Lock Me Out of Trading
          </Button>
          {isLocked && (
            <Button onClick={unlockSession} variant="ghost" size="sm">
              <Unlock size={14} className="mr-1" />
              Unlock Session (Override)
            </Button>
          )}
        </div>
      </Card>

      {/* Live Session Tracker */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>
            <Activity size={14} className="inline mr-1" />
            Live Session Status
          </CardTitle>
          <Badge variant={isLocked ? "danger" : isAtRisk ? "warning" : "success"}>
            {isLocked ? "LOCKED" : isAtRisk ? "AT RISK" : "ACTIVE"}
          </Badge>
        </CardHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* P&L Tracker */}
          <div className={`p-4 rounded-xl border ${
            currentPnl >= 0
              ? "bg-emerald-500/5 border-emerald-500/20"
              : isBlown
              ? "bg-red-500/10 border-red-500/30"
              : isAtRisk
              ? "bg-yellow-500/5 border-yellow-500/20"
              : "bg-white/[0.03] border-white/5"
          }`}>
            <p className="text-xs text-gray-500 mb-1">Session P&L</p>
            <p className={`text-2xl font-bold ${currentPnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {currentPnl >= 0 ? "+" : ""}${currentPnl}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDLL: ${pdllUsed.toFixed(0)} / ${pdll} used
            </p>
          </div>

          {/* Trades Tracker */}
          <div className={`p-4 rounded-xl border ${
            maxTradesReached
              ? "bg-red-500/10 border-red-500/30"
              : tradesToday >= maxTrades - 1
              ? "bg-yellow-500/5 border-yellow-500/20"
              : "bg-white/[0.03] border-white/5"
          }`}>
            <p className="text-xs text-gray-500 mb-1">Trades Today</p>
            <p className="text-2xl font-bold text-white">{tradesToday} / {maxTrades}</p>
            <p className="text-xs text-gray-500 mt-1">
              {maxTrades - tradesToday} remaining
            </p>
          </div>

          {/* Risk Used */}
          <div className={`p-4 rounded-xl border ${
            isBlown
              ? "bg-red-500/10 border-red-500/30"
              : isAtRisk
              ? "bg-yellow-500/5 border-yellow-500/20"
              : "bg-white/[0.03] border-white/5"
          }`}>
            <p className="text-xs text-gray-500 mb-1">Daily Risk Used</p>
            <p className={`text-2xl font-bold ${isBlown ? "text-red-400" : isAtRisk ? "text-yellow-400" : "text-white"}`}>
              {pdllPercent.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isBlown ? "LIMIT BREACHED" : isAtRisk ? "Approaching limit" : "Within limits"}
            </p>
          </div>
        </div>

        {/* Progress bars */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Daily Loss Limit</span>
              <span className={isBlown ? "text-red-400" : isAtRisk ? "text-yellow-400" : "text-gray-300"}>
                ${pdllUsed.toFixed(0)} / ${pdll}
              </span>
            </div>
            <ProgressBar
              value={Math.min(pdllPercent, 100)}
              max={100}
              variant={isBlown ? "red" : isAtRisk ? "gold" : "green"}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Trades Used</span>
              <span className={maxTradesReached ? "text-red-400" : "text-gray-300"}>
                {tradesToday} / {maxTrades}
              </span>
            </div>
            <ProgressBar
              value={(tradesToday / maxTrades) * 100}
              max={100}
              variant={maxTradesReached ? "red" : tradesToday >= maxTrades - 1 ? "gold" : "green"}
            />
          </div>

          {pdpt > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Profit Target</span>
                <span className={pdptReached ? "text-emerald-400" : "text-gray-300"}>
                  ${Math.max(currentPnl, 0)} / ${pdpt}
                </span>
              </div>
              <ProgressBar
                value={Math.max(0, (currentPnl / pdpt) * 100)}
                max={100}
                variant="green"
              />
            </div>
          )}
        </div>

        {/* Warnings */}
        {isAtRisk && !isBlown && (
          <div className="mt-4 p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20 flex items-center gap-3">
            <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0" />
            <p className="text-xs text-yellow-400">
              <strong>WARNING:</strong> You&apos;ve used {pdllPercent.toFixed(0)}% of your daily loss limit. Consider reducing size or stopping.
            </p>
          </div>
        )}
        {isBlown && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
            <XCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-400">
              <strong>DAILY LOSS LIMIT BREACHED.</strong> You are locked out. Close your platform. Come back tomorrow.
            </p>
          </div>
        )}

        {/* Simulate buttons (for demo — remove in production) */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <p className="text-[10px] text-gray-600 mb-2">Demo: Simulate session activity</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCurrentPnl((p) => p + 350); }}
              className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 hover:bg-emerald-500/20"
            >
              +$350 Win
            </button>
            <button
              onClick={() => { setCurrentPnl((p) => p - 100); setTradesToday((t) => t + 1); }}
              className="px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 hover:bg-red-500/20"
            >
              -$100 Loss
            </button>
            <button
              onClick={() => { setTradesToday((t) => t + 1); setCurrentPnl((p) => p + 150); }}
              className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400 hover:bg-blue-500/20"
            >
              +1 Trade (Win)
            </button>
            <button
              onClick={() => { setCurrentPnl(0); setTradesToday(0); setIsLocked(false); }}
              className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10"
            >
              Reset Session
            </button>
          </div>
        </div>
      </Card>

      {/* Rules Summary */}
      <Card variant="default" className="p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
            <Settings size={18} className="text-yellow-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white mb-2">Your Active Rules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-400">
              <p>• Max risk per trade: <span className="text-white">{riskPercent}% (${riskDollars})</span></p>
              <p>• Minimum R:R: <span className="text-white">{rr}</span></p>
              <p>• Daily loss limit: <span className="text-white">${pdll}</span> → <span className="text-yellow-400">{PDLL_ACTIONS.find(a => a.value === pdllAction)?.label}</span></p>
              <p>• Profit target: <span className="text-white">{pdpt > 0 ? `$${pdpt}` : "Disabled"}</span></p>
              <p>• Max trades/session: <span className="text-white">{maxTrades}</span></p>
              <p>• Max contracts: <span className="text-white">{maxContracts}</span></p>
              <p>• Session window: <span className="text-white">{SESSION_TIMES.find(s => s.value === sessionWindow)?.label}</span></p>
              <p>• Blocked symbols: <span className="text-red-400">{blockedSymbols || "None"}</span></p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

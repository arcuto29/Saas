"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils";

interface PropFirm {
  id: string;
  firmName: string;
  accountSize: number;
  currentBalance: number;
  dailyLossLimit: number;
  overallMaxLoss: number;
  trailingDrawdown: boolean;
  profitTarget: number;
  activeTradingDays: number;
  requiredDays: number;
  phase: string;
  status: string;
}

const demoPropFirms: PropFirm[] = [
  {
    id: "1",
    firmName: "FTMO",
    accountSize: 100000,
    currentBalance: 104500,
    dailyLossLimit: 5000,
    overallMaxLoss: 10000,
    trailingDrawdown: false,
    profitTarget: 10000,
    activeTradingDays: 8,
    requiredDays: 10,
    phase: "challenge",
    status: "active",
  },
  {
    id: "2",
    firmName: "MyFundedFX",
    accountSize: 50000,
    currentBalance: 52800,
    dailyLossLimit: 2500,
    overallMaxLoss: 4000,
    trailingDrawdown: true,
    profitTarget: 4000,
    activeTradingDays: 12,
    requiredDays: 5,
    phase: "funded",
    status: "active",
  },
  {
    id: "3",
    firmName: "The5%ers",
    accountSize: 200000,
    currentBalance: 195000,
    dailyLossLimit: 4000,
    overallMaxLoss: 8000,
    trailingDrawdown: false,
    profitTarget: 16000,
    activeTradingDays: 5,
    requiredDays: 0,
    phase: "verification",
    status: "active",
  },
];

export default function PropFirmsPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "challenge": return "warning";
      case "verification": return "info";
      case "funded": return "success";
      case "failed": return "danger";
      default: return "default";
    }
  };

  const getRemainingDrawdown = (firm: PropFirm) => {
    if (firm.trailingDrawdown) {
      return firm.currentBalance - (firm.accountSize - firm.overallMaxLoss);
    }
    return firm.accountSize + firm.overallMaxLoss - (firm.accountSize - firm.currentBalance);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prop Firm Tracker</h1>
          <p className="text-sm text-gray-400">Track your challenges and funded accounts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Active Accounts</p>
          <p className="text-2xl font-bold text-white">{demoPropFirms.length}</p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Total Capital</p>
          <p className="text-2xl font-bold text-yellow-400">
            {formatCurrency(demoPropFirms.reduce((s, f) => s + f.accountSize, 0))}
          </p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Total P&L</p>
          <p className="text-2xl font-bold text-emerald-400">
            {formatCurrency(demoPropFirms.reduce((s, f) => s + (f.currentBalance - f.accountSize), 0))}
          </p>
        </Card>
        <Card variant="default" className="p-4">
          <p className="text-xs text-gray-400 mb-1">Funded</p>
          <p className="text-2xl font-bold text-emerald-400">
            {demoPropFirms.filter((f) => f.phase === "funded").length}
          </p>
        </Card>
      </div>

      {/* Prop Firm Cards */}
      <div className="space-y-4">
        {demoPropFirms.map((firm, idx) => {
          const profitMade = firm.currentBalance - firm.accountSize;
          const progressPercent = Math.max(0, (profitMade / firm.profitTarget) * 100);
          const remainingTarget = firm.profitTarget - profitMade;
          const dailyUsed = 320; // demo
          const dailyUsedPercent = (dailyUsed / firm.dailyLossLimit) * 100;

          return (
            <motion.div
              key={firm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card variant="glass" hover>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Left - Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                        <Building2 size={20} className="text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{firm.firmName}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPhaseColor(firm.phase) as "default" | "success" | "warning" | "danger" | "gold" | "info"} size="sm">
                            {firm.phase.charAt(0).toUpperCase() + firm.phase.slice(1)}
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {formatCurrency(firm.accountSize)} account
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Profit Target Progress</span>
                          <span className="text-white">
                            {formatCurrency(Math.max(0, profitMade))} / {formatCurrency(firm.profitTarget)}
                          </span>
                        </div>
                        <ProgressBar value={progressPercent} max={100} variant="gold" />
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">Daily Loss Used</span>
                          <span className="text-white">${dailyUsed} / {formatCurrency(firm.dailyLossLimit)}</span>
                        </div>
                        <ProgressBar value={dailyUsedPercent} max={100} variant={dailyUsedPercent > 70 ? "red" : "green"} />
                      </div>
                    </div>
                  </div>

                  {/* Right - Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:w-96">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <DollarSign size={10} />
                        Balance
                      </p>
                      <p className="text-sm font-bold text-white">{formatCurrency(firm.currentBalance)}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Target size={10} />
                        Remaining
                      </p>
                      <p className="text-sm font-bold text-yellow-400">
                        {formatCurrency(Math.max(0, remainingTarget))}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Max Loss
                      </p>
                      <p className="text-sm font-bold text-red-400">
                        {formatCurrency(firm.overallMaxLoss)}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        Trading Days
                      </p>
                      <p className="text-sm font-bold text-white">
                        {firm.activeTradingDays}{firm.requiredDays > 0 ? ` / ${firm.requiredDays}` : ""}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500">Drawdown Left</p>
                      <p className="text-sm font-bold text-emerald-400">
                        {formatCurrency(getRemainingDrawdown(firm))}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="text-xs text-gray-500">Trailing DD</p>
                      <p className="text-sm font-bold text-white">
                        {firm.trailingDrawdown ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Prop Firm Account" size="lg">
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Firm Name" placeholder="e.g. FTMO, MyFundedFX" required />
            <Input label="Account Size" type="number" placeholder="100000" required />
            <Input label="Current Balance" type="number" placeholder="100000" />
            <Input label="Daily Loss Limit" type="number" placeholder="5000" required />
            <Input label="Overall Max Loss" type="number" placeholder="10000" required />
            <Input label="Profit Target" type="number" placeholder="10000" required />
            <Input label="Required Trading Days" type="number" placeholder="10" />
            <Select
              label="Phase"
              options={[
                { value: "challenge", label: "Challenge" },
                { value: "verification", label: "Verification" },
                { value: "funded", label: "Funded" },
              ]}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/50" />
              <span className="text-sm text-gray-300">Trailing Drawdown</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Consistency Rule</label>
            <textarea
              rows={2}
              placeholder="e.g. No single day profit can exceed 30% of total profit"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit">Add Account</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
}

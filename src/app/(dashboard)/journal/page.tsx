"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Filter,
  Search,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  MessageSquare,
  Star,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import TradeForm from "@/components/forms/TradeForm";
import { formatCurrency } from "@/lib/utils";
import { EMOTIONS, MISTAKES, SESSIONS } from "@/constants";
import type { TradeFormValues } from "@/lib/validations/trade";

interface Trade {
  id: string;
  instrument: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  commission: number;
  result: number;
  setup: string;
  session: string;
  entryDate: string;
  notes: string;
  emotions: string[];
  mistakes: string[];
  tags: string[];
  rating: number;
  accountId: string;
}

const initialDemoTrades: Trade[] = [
  {
    id: "1", instrument: "NQ", direction: "long", entryPrice: 18250, exitPrice: 18320,
    stopLoss: 18220, takeProfit: 18350, quantity: 2, commission: 4.50, result: 425.50,
    setup: "Breaker Block", session: "new_york", entryDate: "2025-01-15T14:30:00",
    notes: "Clean setup at premium level. Waited for BOS confirmation before entry.",
    emotions: ["confident"], mistakes: [], tags: ["A+ Setup", "Trend"], rating: 5, accountId: "main",
  },
  {
    id: "2", instrument: "ES", direction: "short", entryPrice: 5980, exitPrice: 6005,
    stopLoss: 5995, takeProfit: 5950, quantity: 1, commission: 4.50, result: -180.50,
    setup: "Order Block", session: "new_york", entryDate: "2025-01-15T15:45:00",
    notes: "Stopped out, didn't respect session close. Took this trade too late.",
    emotions: ["frustrated"], mistakes: ["late_entry"], tags: ["Revenge"], rating: 2, accountId: "main",
  },
  {
    id: "3", instrument: "NQ", direction: "long", entryPrice: 18180, exitPrice: 18245,
    stopLoss: 18155, takeProfit: 18280, quantity: 2, commission: 4.50, result: 290.50,
    setup: "FVG", session: "london", entryDate: "2025-01-14T10:15:00",
    notes: "Textbook FVG fill during London. Price tapped and reversed immediately.",
    emotions: ["calm"], mistakes: [], tags: ["A+ Setup"], rating: 4, accountId: "ftmo",
  },
  {
    id: "4", instrument: "GC", direction: "short", entryPrice: 2045.50, exitPrice: 2038.80,
    stopLoss: 2049.00, takeProfit: 2035.00, quantity: 1, commission: 4.50, result: 150.50,
    setup: "Breaker Block", session: "london", entryDate: "2025-01-14T08:30:00",
    notes: "Gold short from supply zone. Nice move down during London open.",
    emotions: ["confident"], mistakes: [], tags: [], rating: 4, accountId: "main",
  },
  {
    id: "5", instrument: "ES", direction: "long", entryPrice: 5960, exitPrice: 5948,
    stopLoss: 5950, takeProfit: 5985, quantity: 1, commission: 4.50, result: -95.50,
    setup: "Liquidity Sweep", session: "overlap", entryDate: "2025-01-13T12:00:00",
    notes: "Overtraded after lunch, should have stopped. Was chasing after earlier loss.",
    emotions: ["greedy"], mistakes: ["oversize", "revenge_trade"], tags: [], rating: 1, accountId: "main",
  },
  {
    id: "6", instrument: "NQ", direction: "long", entryPrice: 18100, exitPrice: 18165,
    stopLoss: 18075, takeProfit: 18180, quantity: 2, commission: 4.50, result: 220.50,
    setup: "BOS", session: "new_york", entryDate: "2025-01-13T14:00:00",
    notes: "Break of structure long. Clean entry after liquidity grab below.",
    emotions: ["calm", "confident"], mistakes: [], tags: ["High Probability"], rating: 4, accountId: "ftmo",
  },
  {
    id: "7", instrument: "EURUSD", direction: "short", entryPrice: 1.0850, exitPrice: 1.0820,
    stopLoss: 1.0865, takeProfit: 1.0800, quantity: 100000, commission: 3.00, result: 297.00,
    setup: "Supply & Demand", session: "london", entryDate: "2025-01-12T09:30:00",
    notes: "Forex short from daily supply zone. Beautiful rejection with engulfing candle.",
    emotions: ["confident"], mistakes: [], tags: ["Forex", "A+ Setup"], rating: 5, accountId: "myfunded",
  },
];

export default function JournalPage() {
  const [trades, setTrades] = useState<Trade[]>(initialDemoTrades);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDirection, setFilterDirection] = useState("");
  const [filterSession, setFilterSession] = useState("");
  const [filterResult, setFilterResult] = useState<"" | "win" | "loss">("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "pnl" | "rr">("date");

  const filteredTrades = useMemo(() => {
    let result = trades.filter((trade) => {
      const matchesSearch =
        trade.instrument.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.setup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesDirection = !filterDirection || trade.direction === filterDirection;
      const matchesSession = !filterSession || trade.session === filterSession;
      const matchesResult = !filterResult ||
        (filterResult === "win" && trade.result > 0) ||
        (filterResult === "loss" && trade.result < 0);
      return matchesSearch && matchesDirection && matchesSession && matchesResult;
    });

    result.sort((a, b) => {
      if (sortBy === "date") return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
      if (sortBy === "pnl") return b.result - a.result;
      return 0;
    });

    return result;
  }, [trades, searchQuery, filterDirection, filterSession, filterResult, sortBy]);

  // Stats
  const totalPnl = filteredTrades.reduce((s, t) => s + t.result, 0);
  const winCount = filteredTrades.filter((t) => t.result > 0).length;
  const winRate = filteredTrades.length > 0 ? (winCount / filteredTrades.length) * 100 : 0;

  const handleAddTrade = (data: TradeFormValues) => {
    const entry = data.entryPrice;
    const exit = data.exitPrice || entry;
    const qty = data.quantity;
    const comm = data.commission;
    const pnl = data.direction === "long"
      ? (exit - entry) * qty - comm
      : (entry - exit) * qty - comm;

    const newTrade: Trade = {
      id: Date.now().toString(),
      instrument: data.instrument.toUpperCase(),
      direction: data.direction,
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: data.stopLoss || 0,
      takeProfit: data.takeProfit || 0,
      quantity: qty,
      commission: comm,
      result: pnl,
      setup: data.setup || "",
      session: data.session || "",
      entryDate: data.entryDate,
      notes: data.notes || "",
      emotions: data.emotions,
      mistakes: data.mistakes,
      tags: data.tags,
      rating: data.rating,
      accountId: data.accountId || "main",
    };

    setTrades([newTrade, ...trades]);
    setShowAddModal(false);
  };

  const handleEditTrade = (data: TradeFormValues) => {
    if (!editingTrade) return;
    const entry = data.entryPrice;
    const exit = data.exitPrice || entry;
    const qty = data.quantity;
    const comm = data.commission;
    const pnl = data.direction === "long"
      ? (exit - entry) * qty - comm
      : (entry - exit) * qty - comm;

    const updated: Trade = {
      ...editingTrade,
      instrument: data.instrument.toUpperCase(),
      direction: data.direction,
      entryPrice: entry,
      exitPrice: exit,
      stopLoss: data.stopLoss || 0,
      takeProfit: data.takeProfit || 0,
      quantity: qty,
      commission: comm,
      result: pnl,
      setup: data.setup || "",
      session: data.session || "",
      entryDate: data.entryDate,
      notes: data.notes || "",
      emotions: data.emotions,
      mistakes: data.mistakes,
      tags: data.tags,
      rating: data.rating,
      accountId: data.accountId || "main",
    };

    setTrades(trades.map((t) => (t.id === editingTrade.id ? updated : t)));
    setEditingTrade(null);
  };

  const handleDeleteTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
    setDeleteConfirmId(null);
    toast.success("Trade deleted");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterDirection("");
    setFilterSession("");
    setFilterResult("");
  };

  const hasActiveFilters = searchQuery || filterDirection || filterSession || filterResult;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Journal</h1>
          <p className="text-sm text-gray-400">
            {filteredTrades.length} trades · Win Rate {winRate.toFixed(1)}% · P&L{" "}
            <span className={totalPnl >= 0 ? "text-emerald-400" : "text-red-400"}>
              {formatCurrency(totalPnl)}
            </span>
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Trade
        </Button>
      </div>

      {/* Search & Filters */}
      <Card variant="glass" className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search instruments, setups, notes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={showFilters ? "outline" : "secondary"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={14} className="mr-1" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 w-2 h-2 rounded-full bg-yellow-400" />
              )}
              <ChevronDown size={12} className={`ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <RotateCcw size={14} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Extended Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 mt-3 border-t border-white/5">
                <select
                  value={filterDirection}
                  onChange={(e) => setFilterDirection(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/30 appearance-none"
                >
                  <option value="" className="bg-gray-900">All Directions</option>
                  <option value="long" className="bg-gray-900">Long</option>
                  <option value="short" className="bg-gray-900">Short</option>
                </select>
                <select
                  value={filterSession}
                  onChange={(e) => setFilterSession(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/30 appearance-none"
                >
                  <option value="" className="bg-gray-900">All Sessions</option>
                  {SESSIONS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-gray-900">{s.label}</option>
                  ))}
                </select>
                <select
                  value={filterResult}
                  onChange={(e) => setFilterResult(e.target.value as "" | "win" | "loss")}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/30 appearance-none"
                >
                  <option value="" className="bg-gray-900">All Results</option>
                  <option value="win" className="bg-gray-900">Winners</option>
                  <option value="loss" className="bg-gray-900">Losers</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "date" | "pnl" | "rr")}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/30 appearance-none"
                >
                  <option value="date" className="bg-gray-900">Sort by Date</option>
                  <option value="pnl" className="bg-gray-900">Sort by P&L</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Trade List */}
      {filteredTrades.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="No Trades Found"
          description={hasActiveFilters ? "No trades match your current filters." : "Start logging your trades to track your performance over time."}
          action={
            hasActiveFilters ? (
              <Button onClick={clearFilters} size="sm" variant="secondary">Clear Filters</Button>
            ) : (
              <Button onClick={() => setShowAddModal(true)} size="sm">Add Your First Trade</Button>
            )
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredTrades.map((trade, idx) => (
            <motion.div
              key={trade.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <Card variant="default" hover className="p-4" animate={false}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Main info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      trade.result > 0 ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                    }`}>
                      {trade.result > 0 ? (
                        <TrendingUp size={18} className="text-emerald-400" />
                      ) : (
                        <TrendingDown size={18} className="text-red-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white">{trade.instrument}</span>
                        <Badge variant={trade.direction === "long" ? "success" : "danger"} size="sm">
                          {trade.direction.toUpperCase()}
                        </Badge>
                        {trade.setup && <Badge variant="default" size="sm">{trade.setup}</Badge>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(trade.entryDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        {trade.session && ` · ${SESSIONS.find((s) => s.value === trade.session)?.label || trade.session}`}
                      </p>
                    </div>
                  </div>

                  {/* Prices */}
                  <div className="hidden md:flex items-center gap-6 text-xs text-gray-400">
                    <div>
                      <span className="block text-gray-500">Entry</span>
                      <span className="text-white font-medium">${trade.entryPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">Exit</span>
                      <span className="text-white font-medium">${trade.exitPrice.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500">SL</span>
                      <span className="text-red-400 font-medium">${trade.stopLoss.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Tags & Emotions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {trade.emotions.map((e) => {
                      const emotion = EMOTIONS.find((em) => em.value === e);
                      return emotion ? (
                        <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                          {emotion.emoji} {emotion.label}
                        </span>
                      ) : null;
                    })}
                    {trade.mistakes.map((m) => {
                      const mistake = MISTAKES.find((mk) => mk.value === m);
                      return mistake ? (
                        <Badge key={m} variant="danger" size="sm">{mistake.label}</Badge>
                      ) : null;
                    })}
                    {trade.tags.map((tag) => (
                      <Badge key={tag} variant="info" size="sm">{tag}</Badge>
                    ))}
                  </div>

                  {/* Result & Actions */}
                  <div className="flex items-center gap-4">
                    <span className={`text-lg font-bold whitespace-nowrap ${trade.result > 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {trade.result > 0 ? "+" : ""}{formatCurrency(trade.result)}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setEditingTrade(trade)}
                        className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
                        title="Edit trade"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(trade.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete trade"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {trade.notes && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-gray-400 flex items-start gap-1.5">
                      <MessageSquare size={12} className="mt-0.5 flex-shrink-0" />
                      <span>{trade.notes}</span>
                    </p>
                  </div>
                )}

                {/* Rating */}
                <div className="mt-2 flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < trade.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-700"}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Trade Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log New Trade"
        size="xl"
      >
        <TradeForm
          onSubmit={handleAddTrade}
          onCancel={() => setShowAddModal(false)}
          mode="create"
        />
      </Modal>

      {/* Edit Trade Modal */}
      <Modal
        isOpen={!!editingTrade}
        onClose={() => setEditingTrade(null)}
        title="Edit Trade"
        size="xl"
      >
        {editingTrade && (
          <TradeForm
            initialValues={{
              instrument: editingTrade.instrument,
              direction: editingTrade.direction,
              entryPrice: editingTrade.entryPrice,
              exitPrice: editingTrade.exitPrice,
              stopLoss: editingTrade.stopLoss,
              takeProfit: editingTrade.takeProfit,
              quantity: editingTrade.quantity,
              commission: editingTrade.commission,
              setup: editingTrade.setup,
              session: editingTrade.session,
              entryDate: editingTrade.entryDate,
              notes: editingTrade.notes,
              emotions: editingTrade.emotions,
              mistakes: editingTrade.mistakes,
              tags: editingTrade.tags,
              rating: editingTrade.rating,
              accountId: editingTrade.accountId,
            }}
            onSubmit={handleEditTrade}
            onCancel={() => setEditingTrade(null)}
            mode="edit"
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Trade"
        size="sm"
      >
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <p className="text-sm text-gray-300 mb-6">
            Are you sure you want to delete this trade? This action cannot be undone.
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => deleteConfirmId && handleDeleteTrade(deleteConfirmId)}>
              Delete Trade
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

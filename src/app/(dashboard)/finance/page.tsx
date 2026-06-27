"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  CreditCard,
  DollarSign,
  Target,
  Edit2,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Calendar,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { formatCurrency } from "@/lib/utils";


// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  type: "income" | "expense";
  category: string;
  description: string;
  amount: number;
  date: string;
  isRecurring: boolean;
}

interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  budgeted: number;
  spent: number;
  color: string;
}

interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  category: string;
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = [
  { value: "housing", label: "Housing & Rent", icon: "🏠" },
  { value: "food", label: "Food & Groceries", icon: "🍕" },
  { value: "transport", label: "Transportation", icon: "🚗" },
  { value: "utilities", label: "Utilities & Bills", icon: "💡" },
  { value: "trading", label: "Trading Fees & Tools", icon: "📊" },
  { value: "education", label: "Education & Courses", icon: "📚" },
  { value: "health", label: "Health & Fitness", icon: "💪" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "subscriptions", label: "Subscriptions", icon: "🔄" },
  { value: "savings", label: "Savings & Investments", icon: "🏦" },
  { value: "other", label: "Other", icon: "📦" },
];

const INCOME_CATEGORIES = [
  { value: "trading_profit", label: "Trading Profits", icon: "📈" },
  { value: "salary", label: "Salary / Job", icon: "💼" },
  { value: "prop_payout", label: "Prop Firm Payout", icon: "🏢" },
  { value: "freelance", label: "Freelance / Side Income", icon: "💻" },
  { value: "investments", label: "Investment Returns", icon: "🏦" },
  { value: "other", label: "Other Income", icon: "💰" },
];


const demoTransactions: Transaction[] = [
  { id: "1", type: "income", category: "trading_profit", description: "NQ Breaker Block trade", amount: 425.50, date: "2025-01-15", isRecurring: false },
  { id: "2", type: "income", category: "salary", description: "Monthly salary", amount: 4200.00, date: "2025-01-01", isRecurring: true },
  { id: "3", type: "income", category: "prop_payout", description: "FTMO January payout", amount: 1850.00, date: "2025-01-10", isRecurring: false },
  { id: "4", type: "expense", category: "housing", description: "Monthly rent", amount: 1500.00, date: "2025-01-01", isRecurring: true },
  { id: "5", type: "expense", category: "trading", description: "TradingView Pro subscription", amount: 39.95, date: "2025-01-01", isRecurring: true },
  { id: "6", type: "expense", category: "trading", description: "NinjaTrader data feed", amount: 55.00, date: "2025-01-01", isRecurring: true },
  { id: "7", type: "expense", category: "food", description: "Groceries", amount: 320.00, date: "2025-01-08", isRecurring: false },
  { id: "8", type: "expense", category: "utilities", description: "Internet + Electric", amount: 180.00, date: "2025-01-05", isRecurring: true },
  { id: "9", type: "expense", category: "education", description: "ICT mentorship course", amount: 150.00, date: "2025-01-03", isRecurring: false },
  { id: "10", type: "expense", category: "health", description: "Gym membership", amount: 45.00, date: "2025-01-01", isRecurring: true },
  { id: "11", type: "expense", category: "subscriptions", description: "Spotify + Netflix", amount: 28.00, date: "2025-01-01", isRecurring: true },
  { id: "12", type: "expense", category: "transport", description: "Gas + Insurance", amount: 210.00, date: "2025-01-07", isRecurring: false },
  { id: "13", type: "income", category: "trading_profit", description: "ES FVG trade", amount: 290.50, date: "2025-01-14", isRecurring: false },
  { id: "14", type: "expense", category: "food", description: "Dining out", amount: 85.00, date: "2025-01-12", isRecurring: false },
  { id: "15", type: "income", category: "trading_profit", description: "GC short from supply", amount: 150.50, date: "2025-01-14", isRecurring: false },
];


const demoBudgetCategories: BudgetCategory[] = [
  { id: "1", name: "Housing & Rent", icon: "🏠", budgeted: 1500, spent: 1500, color: "bg-blue-500" },
  { id: "2", name: "Food & Groceries", icon: "🍕", budgeted: 500, spent: 405, color: "bg-orange-500" },
  { id: "3", name: "Trading Fees & Tools", icon: "📊", budgeted: 150, spent: 94.95, color: "bg-yellow-500" },
  { id: "4", name: "Transportation", icon: "🚗", budgeted: 300, spent: 210, color: "bg-green-500" },
  { id: "5", name: "Utilities & Bills", icon: "💡", budgeted: 200, spent: 180, color: "bg-purple-500" },
  { id: "6", name: "Education & Courses", icon: "📚", budgeted: 200, spent: 150, color: "bg-indigo-500" },
  { id: "7", name: "Health & Fitness", icon: "💪", budgeted: 50, spent: 45, color: "bg-pink-500" },
  { id: "8", name: "Entertainment", icon: "🎬", budgeted: 100, spent: 28, color: "bg-red-500" },
  { id: "9", name: "Savings & Investments", icon: "🏦", budgeted: 1000, spent: 1000, color: "bg-emerald-500" },
];

const demoSavingsGoals: SavingsGoal[] = [
  { id: "1", name: "Emergency Fund", target: 15000, current: 8500, deadline: "2025-06-30", category: "safety" },
  { id: "2", name: "Trading Capital Growth", target: 50000, current: 32000, deadline: "2025-12-31", category: "trading" },
  { id: "3", name: "New Computer Setup", target: 5000, current: 3200, deadline: "2025-04-15", category: "equipment" },
  { id: "4", name: "Vacation Fund", target: 3000, current: 1200, deadline: "2025-08-01", category: "lifestyle" },
];


// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>(demoTransactions);
  const [budgets] = useState<BudgetCategory[]>(demoBudgetCategories);
  const [savingsGoals] = useState<SavingsGoal[]>(demoSavingsGoals);
  const [activeTab, setActiveTab] = useState<"overview" | "transactions" | "budget" | "savings">("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [txType, setTxType] = useState<"income" | "expense">("expense");

  // Transaction form
  const [txForm, setTxForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().slice(0, 10),
    isRecurring: false,
  });

  // Computed stats
  const stats = useMemo(() => {
    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const tradingIncome = transactions.filter((t) => t.category === "trading_profit").reduce((s, t) => s + t.amount, 0);
    const propPayouts = transactions.filter((t) => t.category === "prop_payout").reduce((s, t) => s + t.amount, 0);
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;
    const totalBudgeted = budgets.reduce((s, b) => s + b.budgeted, 0);
    const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
    const budgetRemaining = totalBudgeted - totalSpent;
    const recurringExpenses = transactions.filter((t) => t.type === "expense" && t.isRecurring).reduce((s, t) => s + t.amount, 0);

    return { totalIncome, totalExpenses, tradingIncome, propPayouts, netSavings, savingsRate, totalBudgeted, totalSpent, budgetRemaining, recurringExpenses };
  }, [transactions, budgets]);

  const handleAddTransaction = () => {
    if (!txForm.description || !txForm.amount || !txForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    const newTx: Transaction = {
      id: Date.now().toString(),
      type: txType,
      category: txForm.category,
      description: txForm.description,
      amount: parseFloat(txForm.amount),
      date: txForm.date,
      isRecurring: txForm.isRecurring,
    };
    setTransactions([newTx, ...transactions]);
    setShowAddModal(false);
    setTxForm({ description: "", amount: "", category: "", date: new Date().toISOString().slice(0, 10), isRecurring: false });
    toast.success(`${txType === "income" ? "Income" : "Expense"} added`);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    toast.success("Transaction removed");
  };


  const tabs = [
    { id: "overview" as const, label: "Overview", icon: BarChart3 },
    { id: "transactions" as const, label: "Transactions", icon: CreditCard },
    { id: "budget" as const, label: "Budget", icon: Wallet },
    { id: "savings" as const, label: "Savings Goals", icon: PiggyBank },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Financial Planner</h1>
          <p className="text-sm text-gray-400">Budget, track expenses, and grow your trading capital</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>


      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === "overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ArrowUpRight size={18} className="text-emerald-400" />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Income</span>
              </div>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(stats.totalIncome)}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </Card>
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <ArrowDownRight size={18} className="text-red-400" />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Total Expenses</span>
              </div>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(stats.totalExpenses)}</p>
              <p className="text-xs text-gray-500 mt-1">This month</p>
            </Card>
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <DollarSign size={18} className="text-yellow-400" />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Net Savings</span>
              </div>
              <p className={`text-2xl font-bold ${stats.netSavings >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(stats.netSavings)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{stats.savingsRate.toFixed(0)}% savings rate</p>
            </Card>
            <Card variant="glass" className="p-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <TrendingUp size={18} className="text-blue-400" />
                </div>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Trading Income</span>
              </div>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(stats.tradingIncome + stats.propPayouts)}</p>
              <p className="text-xs text-gray-500 mt-1">Profits + Payouts</p>
            </Card>
          </div>


          {/* Income Breakdown & Budget Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Income Sources */}
            <Card variant="gold">
              <CardHeader>
                <CardTitle className="text-yellow-400">
                  <TrendingUp size={14} className="inline mr-1" />
                  Income Breakdown
                </CardTitle>
                <Badge variant="success">+{formatCurrency(stats.totalIncome)}</Badge>
              </CardHeader>
              <div className="space-y-3">
                {INCOME_CATEGORIES.map((cat) => {
                  const amount = transactions
                    .filter((t) => t.type === "income" && t.category === cat.value)
                    .reduce((s, t) => s + t.amount, 0);
                  if (amount === 0) return null;
                  const percent = stats.totalIncome > 0 ? (amount / stats.totalIncome) * 100 : 0;
                  return (
                    <div key={cat.value} className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-300">{cat.label}</span>
                          <span className="text-white font-medium">{formatCurrency(amount)}</span>
                        </div>
                        <ProgressBar value={percent} max={100} variant="gold" size="sm" />
                      </div>
                      <span className="text-xs text-gray-500 w-10 text-right">{percent.toFixed(0)}%</span>
                    </div>
                  );
                }).filter(Boolean)}
              </div>
            </Card>

            {/* Budget Health */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <Wallet size={14} className="inline mr-1" />
                  Budget Health
                </CardTitle>
                <Badge variant={stats.budgetRemaining >= 0 ? "success" : "danger"}>
                  {stats.budgetRemaining >= 0 ? formatCurrency(stats.budgetRemaining) + " left" : "Over budget"}
                </Badge>
              </CardHeader>
              <div className="space-y-2">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Spent vs Budgeted</span>
                  <span className="text-white">{formatCurrency(stats.totalSpent)} / {formatCurrency(stats.totalBudgeted)}</span>
                </div>
                <ProgressBar
                  value={(stats.totalSpent / stats.totalBudgeted) * 100}
                  max={100}
                  variant={stats.totalSpent > stats.totalBudgeted ? "red" : stats.totalSpent > stats.totalBudgeted * 0.8 ? "gold" : "green"}
                  size="lg"
                />
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-xs text-gray-500">Recurring</p>
                    <p className="text-sm font-bold text-white">{formatCurrency(stats.recurringExpenses)}/mo</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-xs text-gray-500">Savings Rate</p>
                    <p className="text-sm font-bold text-emerald-400">{stats.savingsRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Profit Allocation */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <Percent size={14} className="inline mr-1" />
                Trading Profit Allocation Plan
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "Reinvest (Capital Growth)", percent: 40, amount: (stats.tradingIncome + stats.propPayouts) * 0.4, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
                { label: "Savings / Emergency", percent: 25, amount: (stats.tradingIncome + stats.propPayouts) * 0.25, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
                { label: "Taxes", percent: 20, amount: (stats.tradingIncome + stats.propPayouts) * 0.2, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                { label: "Personal / Lifestyle", percent: 15, amount: (stats.tradingIncome + stats.propPayouts) * 0.15, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
              ].map((item) => (
                <div key={item.label} className={`p-4 rounded-xl border ${item.bg}`}>
                  <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                  <p className={`text-lg font-bold ${item.color}`}>{formatCurrency(item.amount)}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.percent}% of trading income</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}


      {/* ─── TRANSACTIONS TAB ─── */}
      {activeTab === "transactions" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="default">All: {transactions.length}</Badge>
            <Badge variant="success">Income: {transactions.filter((t) => t.type === "income").length}</Badge>
            <Badge variant="danger">Expenses: {transactions.filter((t) => t.type === "expense").length}</Badge>
          </div>

          <div className="space-y-2">
            {transactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((tx, idx) => {
                const catList = tx.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
                const cat = catList.find((c) => c.value === tx.category);
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                  >
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        tx.type === "income" ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-red-500/10 border border-red-500/20"
                      }`}>
                        {cat?.icon || (tx.type === "income" ? "💰" : "💸")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                        <p className="text-xs text-gray-500">
                          {cat?.label} · {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          {tx.isRecurring && <span className="ml-1 text-yellow-400">· Recurring</span>}
                        </p>
                      </div>
                      <span className={`text-sm font-bold whitespace-nowrap ${
                        tx.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                      <button
                        onClick={() => handleDeleteTransaction(tx.id)}
                        className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      )}


      {/* ─── BUDGET TAB ─── */}
      {activeTab === "budget" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Budget Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Total Budgeted</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalBudgeted)}</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Total Spent</p>
              <p className="text-xl font-bold text-red-400">{formatCurrency(stats.totalSpent)}</p>
            </Card>
            <Card variant="default" className="p-4">
              <p className="text-xs text-gray-400 mb-1">Remaining</p>
              <p className={`text-xl font-bold ${stats.budgetRemaining >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {formatCurrency(stats.budgetRemaining)}
              </p>
            </Card>
          </div>

          {/* Budget Categories */}
          <div className="space-y-3">
            {budgets.map((budget) => {
              const percent = budget.budgeted > 0 ? (budget.spent / budget.budgeted) * 100 : 0;
              const remaining = budget.budgeted - budget.spent;
              const isOver = remaining < 0;
              return (
                <Card key={budget.id} variant="default" className="p-4" animate={false}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{budget.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white">{budget.name}</span>
                        <span className="text-xs text-gray-400">
                          {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                        </span>
                      </div>
                      <ProgressBar
                        value={Math.min(percent, 100)}
                        max={100}
                        variant={isOver ? "red" : percent > 80 ? "gold" : "green"}
                        size="sm"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">{percent.toFixed(0)}% used</span>
                        <span className={`text-xs font-medium ${isOver ? "text-red-400" : "text-emerald-400"}`}>
                          {isOver ? `-${formatCurrency(Math.abs(remaining))} over` : `${formatCurrency(remaining)} left`}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </motion.div>
      )}


      {/* ─── SAVINGS GOALS TAB ─── */}
      {activeTab === "savings" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsGoals.map((goal, idx) => {
              const percent = (goal.current / goal.target) * 100;
              const remaining = goal.target - goal.current;
              const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000));
              const monthlyNeeded = daysLeft > 0 ? remaining / (daysLeft / 30) : 0;
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <Card variant="glass" hover>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                        <PiggyBank size={18} className="text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white">{goal.name}</h3>
                        <p className="text-xs text-gray-500">
                          Due {new Date(goal.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          {" · "}{daysLeft} days left
                        </p>
                      </div>
                      <Badge variant={percent >= 100 ? "success" : percent > 50 ? "gold" : "default"}>
                        {percent.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-white font-medium">
                        {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                      </span>
                    </div>
                    <ProgressBar value={percent} max={100} variant={percent >= 100 ? "green" : "gold"} />
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <p className="text-xs text-gray-500">Remaining</p>
                        <p className="text-sm font-bold text-white">{formatCurrency(remaining)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-white/[0.03] border border-white/5">
                        <p className="text-xs text-gray-500">Monthly Needed</p>
                        <p className="text-sm font-bold text-yellow-400">{formatCurrency(monthlyNeeded)}</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Total Savings Overview */}
          <Card variant="gold">
            <CardHeader>
              <CardTitle className="text-yellow-400">
                <Target size={14} className="inline mr-1" />
                Total Savings Progress
              </CardTitle>
            </CardHeader>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-400">Total Target</p>
                <p className="text-xl font-bold text-white">{formatCurrency(savingsGoals.reduce((s, g) => s + g.target, 0))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Total Saved</p>
                <p className="text-xl font-bold text-emerald-400">{formatCurrency(savingsGoals.reduce((s, g) => s + g.current, 0))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Remaining</p>
                <p className="text-xl font-bold text-yellow-400">{formatCurrency(savingsGoals.reduce((s, g) => s + (g.target - g.current), 0))}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Goals Met</p>
                <p className="text-xl font-bold text-white">{savingsGoals.filter((g) => g.current >= g.target).length} / {savingsGoals.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}


      {/* ─── ADD TRANSACTION MODAL ─── */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Transaction" size="md">
        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setTxType("income")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm ${
                txType === "income"
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <ArrowUpRight size={16} />
              Income
            </button>
            <button
              onClick={() => setTxType("expense")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm ${
                txType === "expense"
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
              }`}
            >
              <ArrowDownRight size={16} />
              Expense
            </button>
          </div>

          <Input
            label="Description"
            placeholder={txType === "income" ? "e.g. Trading profits, Salary" : "e.g. Rent, Groceries"}
            value={txForm.description}
            onChange={(e) => setTxForm({ ...txForm, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Amount ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={txForm.amount}
              onChange={(e) => setTxForm({ ...txForm, amount: e.target.value })}
            />
            <Input
              label="Date"
              type="date"
              value={txForm.date}
              onChange={(e) => setTxForm({ ...txForm, date: e.target.value })}
            />
          </div>
          <Select
            label="Category"
            options={(txType === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((c) => ({
              value: c.value,
              label: `${c.icon} ${c.label}`,
            }))}
            value={txForm.category}
            onChange={(e) => setTxForm({ ...txForm, category: e.target.value })}
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={txForm.isRecurring}
              onChange={(e) => setTxForm({ ...txForm, isRecurring: e.target.checked })}
              className="w-4 h-4 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/50"
            />
            <span className="text-sm text-gray-300">This is a recurring monthly transaction</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddTransaction}>
              Add {txType === "income" ? "Income" : "Expense"}
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

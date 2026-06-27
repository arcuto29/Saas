"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Palette,
  Database,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Wallet,
  Check,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";

interface TradingAccount {
  id: string;
  name: string;
  broker: string;
  type: string;
  balance: number;
  currency: string;
  isDefault: boolean;
  status: "active" | "inactive";
}

const initialAccounts: TradingAccount[] = [
  { id: "1", name: "Main Trading Account", broker: "NinjaTrader", type: "live", balance: 50000, currency: "USD", isDefault: true, status: "active" },
  { id: "2", name: "FTMO Challenge", broker: "FTMO", type: "prop", balance: 100000, currency: "USD", isDefault: false, status: "active" },
  { id: "3", name: "MyFundedFX 50k", broker: "MyFundedFX", type: "prop", balance: 50000, currency: "USD", isDefault: false, status: "active" },
  { id: "4", name: "Paper Trading", broker: "TradingView", type: "demo", balance: 100000, currency: "USD", isDefault: false, status: "active" },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "accounts" | "preferences" | "notifications">("profile");
  const [accounts, setAccounts] = useState<TradingAccount[]>(initialAccounts);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [editingAccount, setEditingAccount] = useState<TradingAccount | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Account form state
  const [accountForm, setAccountForm] = useState({
    name: "",
    broker: "",
    type: "live",
    balance: "",
    currency: "USD",
  });

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "accounts" as const, label: "Trading Accounts", icon: Wallet },
    { id: "preferences" as const, label: "Preferences", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
  ];

  const handleAddAccount = () => {
    if (!accountForm.name || !accountForm.broker) {
      toast.error("Name and broker are required");
      return;
    }
    const newAccount: TradingAccount = {
      id: Date.now().toString(),
      name: accountForm.name,
      broker: accountForm.broker,
      type: accountForm.type,
      balance: parseFloat(accountForm.balance) || 0,
      currency: accountForm.currency,
      isDefault: accounts.length === 0,
      status: "active",
    };
    setAccounts([...accounts, newAccount]);
    setShowAddAccount(false);
    setAccountForm({ name: "", broker: "", type: "live", balance: "", currency: "USD" });
    toast.success("Account added successfully");
  };

  const handleUpdateAccount = () => {
    if (!editingAccount) return;
    setAccounts(accounts.map((a) => (a.id === editingAccount.id ? editingAccount : a)));
    setEditingAccount(null);
    toast.success("Account updated");
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((a) => a.id !== id));
    setDeleteConfirmId(null);
    toast.success("Account removed");
  };

  const setDefaultAccount = (id: string) => {
    setAccounts(accounts.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default account updated");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account, preferences, and trading accounts</p>
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <User size={14} className="inline mr-1" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-yellow-500/20">
                  JT
                </div>
                <div>
                  <p className="font-semibold text-white">John Trader</p>
                  <p className="text-sm text-gray-400">trader@example.com</p>
                  <p className="text-xs text-gray-500 mt-1">Member since January 2025</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <Input label="Full Name" defaultValue="John Trader" />
                <Input label="Email" type="email" defaultValue="trader@example.com" />
                <Input label="Display Name" defaultValue="JTrader" />
                <Input label="Timezone" defaultValue="EST (UTC-5)" />
              </div>
              <Button size="sm" onClick={() => toast.success("Profile saved")}>Save Changes</Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card variant="default" className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-400">
                <Shield size={14} className="inline mr-1" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">Export All Data</p>
                  <p className="text-xs text-gray-400">Download all your trading data as CSV</p>
                </div>
                <Button variant="secondary" size="sm">
                  <Database size={14} className="mr-1" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div>
                  <p className="text-sm text-white">Sign Out</p>
                  <p className="text-xs text-gray-400">Sign out from all devices</p>
                </div>
                <Button variant="danger" size="sm">
                  <LogOut size={14} className="mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Trading Accounts Tab */}
      {activeTab === "accounts" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Trading Accounts</h2>
              <p className="text-xs text-gray-400">Manage your trading accounts for journal tracking</p>
            </div>
            <Button size="sm" onClick={() => setShowAddAccount(true)}>
              <Plus size={14} className="mr-1" />
              Add Account
            </Button>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => (
              <Card key={account.id} variant="default" className="p-4" animate={false}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      account.type === "live" ? "bg-emerald-500/10 border border-emerald-500/20" :
                      account.type === "prop" ? "bg-yellow-500/10 border border-yellow-500/20" :
                      "bg-blue-500/10 border border-blue-500/20"
                    }`}>
                      <Wallet size={18} className={
                        account.type === "live" ? "text-emerald-400" :
                        account.type === "prop" ? "text-yellow-400" :
                        "text-blue-400"
                      } />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{account.name}</p>
                        {account.isDefault && <Badge variant="gold" size="sm">Default</Badge>}
                      </div>
                      <p className="text-xs text-gray-400">
                        {account.broker} · {account.type === "live" ? "Live" : account.type === "prop" ? "Prop Firm" : "Demo"} · ${account.balance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!account.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => setDefaultAccount(account.id)} title="Set as default">
                        <Check size={14} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => setEditingAccount(account)} title="Edit account">
                      <Edit2 size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirmId(account.id)} title="Remove account">
                      <Trash2 size={14} className="text-red-400" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {accounts.length === 0 && (
            <div className="text-center py-12">
              <Wallet size={32} className="mx-auto text-gray-600 mb-3" />
              <p className="text-sm text-gray-400">No trading accounts added yet.</p>
              <Button size="sm" className="mt-3" onClick={() => setShowAddAccount(true)}>Add Your First Account</Button>
            </div>
          )}
        </motion.div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <Palette size={14} className="inline mr-1" />
                Trading Preferences
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Daily Risk Limit ($)" type="number" defaultValue="500" />
                <Input label="Max Trades Per Day" type="number" defaultValue="3" />
                <Input label="Default Position Size" type="number" defaultValue="1" />
                <Select
                  label="Default Session"
                  options={[
                    { value: "new_york", label: "New York" },
                    { value: "london", label: "London" },
                    { value: "asia", label: "Asian" },
                    { value: "overlap", label: "London/NY Overlap" },
                  ]}
                />
                <Select
                  label="Base Currency"
                  options={[
                    { value: "USD", label: "USD ($)" },
                    { value: "EUR", label: "EUR (€)" },
                    { value: "GBP", label: "GBP (£)" },
                  ]}
                />
                <Select
                  label="Date Format"
                  options={[
                    { value: "us", label: "MM/DD/YYYY" },
                    { value: "eu", label: "DD/MM/YYYY" },
                    { value: "iso", label: "YYYY-MM-DD" },
                  ]}
                />
              </div>
              <Button size="sm" onClick={() => toast.success("Preferences saved")}>Save Preferences</Button>
            </div>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <Shield size={14} className="inline mr-1" />
                Risk Rules
              </CardTitle>
            </CardHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Max Consecutive Losses Before Stopping" type="number" defaultValue="2" />
                <Input label="Reduce Size After X Losses (%)" type="number" defaultValue="50" />
                <Input label="Minimum Sleep Hours" type="number" step="0.5" defaultValue="6" />
                <Input label="Max Daily Risk (%)" type="number" step="0.1" defaultValue="2" />
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-xs text-yellow-400 font-medium">Coach Integration</p>
                <p className="text-xs text-gray-400 mt-1">
                  These rules are used by the Priisma Coach to generate personalized alerts and warnings during your trading sessions.
                </p>
              </div>
              <Button size="sm" onClick={() => toast.success("Risk rules saved")}>Save Risk Rules</Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <Bell size={14} className="inline mr-1" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <div className="space-y-1">
              {[
                { label: "Daily readiness reminder", desc: "Morning prompt to log sleep, mood, and confidence", default: true },
                { label: "Coach alerts", desc: "Real-time coaching insights during trading", default: true },
                { label: "Goal progress updates", desc: "Notified when you hit milestones", default: true },
                { label: "Prop firm warnings", desc: "Alerts when approaching drawdown limits", default: true },
                { label: "Weekly performance report", desc: "Sunday evening recap of your week", default: true },
                { label: "Overtrading warnings", desc: "Alert when exceeding max daily trades", default: true },
                { label: "Loss streak notifications", desc: "Warning after consecutive losses", default: false },
                { label: "Rule-break tracking", desc: "Log when you deviate from your plan", default: false },
              ].map((item) => (
                <label key={item.label} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.03] cursor-pointer group">
                  <div>
                    <span className="text-sm text-gray-200 group-hover:text-white transition-colors">{item.label}</span>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                    <div className="w-10 h-5 bg-white/10 rounded-full peer-checked:bg-yellow-500/30 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gray-400 rounded-full peer-checked:translate-x-5 peer-checked:bg-yellow-400 transition-all" />
                  </div>
                </label>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Add Account Modal */}
      <Modal isOpen={showAddAccount} onClose={() => setShowAddAccount(false)} title="Add Trading Account" size="md">
        <div className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g. Main Trading Account"
            value={accountForm.name}
            onChange={(e) => setAccountForm({ ...accountForm, name: e.target.value })}
          />
          <Input
            label="Broker / Platform"
            placeholder="e.g. NinjaTrader, FTMO, TradingView"
            value={accountForm.broker}
            onChange={(e) => setAccountForm({ ...accountForm, broker: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Account Type"
              options={[
                { value: "live", label: "Live Account" },
                { value: "prop", label: "Prop Firm" },
                { value: "demo", label: "Demo / Paper" },
              ]}
              value={accountForm.type}
              onChange={(e) => setAccountForm({ ...accountForm, type: e.target.value })}
            />
            <Select
              label="Currency"
              options={[
                { value: "USD", label: "USD ($)" },
                { value: "EUR", label: "EUR (€)" },
                { value: "GBP", label: "GBP (£)" },
              ]}
              value={accountForm.currency}
              onChange={(e) => setAccountForm({ ...accountForm, currency: e.target.value })}
            />
          </div>
          <Input
            label="Starting Balance"
            type="number"
            placeholder="50000"
            value={accountForm.balance}
            onChange={(e) => setAccountForm({ ...accountForm, balance: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="secondary" onClick={() => setShowAddAccount(false)}>Cancel</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Account Modal */}
      <Modal isOpen={!!editingAccount} onClose={() => setEditingAccount(null)} title="Edit Account" size="md">
        {editingAccount && (
          <div className="space-y-4">
            <Input
              label="Account Name"
              value={editingAccount.name}
              onChange={(e) => setEditingAccount({ ...editingAccount, name: e.target.value })}
            />
            <Input
              label="Broker / Platform"
              value={editingAccount.broker}
              onChange={(e) => setEditingAccount({ ...editingAccount, broker: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Account Type"
                options={[
                  { value: "live", label: "Live Account" },
                  { value: "prop", label: "Prop Firm" },
                  { value: "demo", label: "Demo / Paper" },
                ]}
                value={editingAccount.type}
                onChange={(e) => setEditingAccount({ ...editingAccount, type: e.target.value })}
              />
              <Select
                label="Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]}
                value={editingAccount.status}
                onChange={(e) => setEditingAccount({ ...editingAccount, status: e.target.value as "active" | "inactive" })}
              />
            </div>
            <Input
              label="Current Balance"
              type="number"
              value={editingAccount.balance.toString()}
              onChange={(e) => setEditingAccount({ ...editingAccount, balance: parseFloat(e.target.value) || 0 })}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button variant="secondary" onClick={() => setEditingAccount(null)}>Cancel</Button>
              <Button onClick={handleUpdateAccount}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteConfirmId} onClose={() => setDeleteConfirmId(null)} title="Remove Account" size="sm">
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={20} className="text-red-400" />
          </div>
          <p className="text-sm text-gray-300 mb-2">Are you sure you want to remove this account?</p>
          <p className="text-xs text-gray-500 mb-6">Trades linked to this account won&apos;t be deleted.</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirmId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirmId && handleDeleteAccount(deleteConfirmId)}>Remove</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

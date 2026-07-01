"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Mail,
  DollarSign,
  Target,
  Flame,
  Eye,
  Trash2,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface Application {
  id: string;
  name: string;
  email: string;
  discord: string | null;
  plan: string;
  experience: string;
  market: string | null;
  goal: string | null;
  biggestStruggle: string | null;
  moneyLost: string | null;
  triedBefore: string | null;
  availability: string | null;
  whyNow: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "warning",
  contacted: "gold",
  accepted: "success",
  rejected: "danger",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  contacted: "Contacted",
  accepted: "Accepted",
  rejected: "Rejected",
};

const planLabels: Record<string, string> = {
  foundation: "Foundation — $500",
  complete: "Complete Trader — $1,000",
  "inner-circle": "Inner Circle — $1,500",
};

export default function AdminPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetch("/api/apply");
      const data = await res.json();
      if (data.applications) {
        setApplications(data.applications);
      }
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/apply/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status } : app))
        );
        if (selectedApp?.id === id) {
          setSelectedApp((prev) => prev ? { ...prev, status } : null);
        }
        toast.success(`Status updated to ${statusLabels[status]}`);
      }
    } catch {
      toast.error("Failed to update status");
    }
  }

  const filteredApps = filter === "all" 
    ? applications 
    : applications.filter((a) => a.status === filter);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    contacted: applications.filter((a) => a.status === "contacted").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center">
            <Shield size={20} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-sm text-gray-400">Mentorship applications & management</p>
          </div>
        </div>
        <Badge variant="gold">Owner Access</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={14} className="text-white" />
            <span className="text-xs text-gray-400">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={14} className="text-yellow-400" />
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={14} className="text-blue-400" />
            <span className="text-xs text-gray-400">Contacted</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{stats.contacted}</p>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs text-gray-400">Accepted</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.accepted}</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/10 w-fit">
        {["all", "pending", "contacted", "accepted", "rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize ${
              filter === f
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {f} {f !== "all" && `(${applications.filter(a => f === "all" || a.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Applications List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {filteredApps.length === 0 ? (
            <Card variant="glass" className="p-8 text-center">
              <FileText size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No applications yet</p>
              <p className="text-xs text-gray-600 mt-1">They&apos;ll appear here when people apply on your site</p>
            </Card>
          ) : (
            filteredApps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedApp(app)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedApp?.id === app.id
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-white/[0.02] border-white/5 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{app.name}</span>
                  <Badge variant={statusColors[app.status] as any}>{statusLabels[app.status]}</Badge>
                </div>
                <p className="text-xs text-gray-400 mb-1">{planLabels[app.plan] || app.plan}</p>
                <p className="text-xs text-gray-500">
                  {new Date(app.createdAt).toLocaleDateString()} · {app.experience}
                </p>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <Users size={14} className="inline mr-1" />
                  {selectedApp.name}
                </CardTitle>
                <Badge variant={statusColors[selectedApp.status] as any}>
                  {statusLabels[selectedApp.status]}
                </Badge>
              </CardHeader>

              <div className="space-y-5">
                {/* Contact info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Email</span>
                    </div>
                    <p className="text-sm text-white font-medium">{selectedApp.email}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Discord</span>
                    </div>
                    <p className="text-sm text-white font-medium">{selectedApp.discord || "Not provided"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-500">Plan</span>
                    </div>
                    <p className="text-sm text-yellow-400 font-medium">{planLabels[selectedApp.plan] || selectedApp.plan}</p>
                  </div>
                </div>

                {/* Trading info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500">Experience</span>
                    <p className="text-sm text-white mt-1">{selectedApp.experience}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500">Market</span>
                    <p className="text-sm text-white mt-1">{selectedApp.market || "Not specified"}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500">Money Lost</span>
                    <p className="text-sm text-red-400 mt-1">{selectedApp.moneyLost || "Not shared"}</p>
                  </div>
                </div>

                {/* Goal */}
                {selectedApp.goal && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={14} className="text-yellow-400" />
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Goal</span>
                    </div>
                    <p className="text-sm text-gray-300">{selectedApp.goal}</p>
                  </div>
                )}

                {/* Biggest Struggle */}
                {selectedApp.biggestStruggle && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame size={14} className="text-red-400" />
                      <span className="text-xs text-red-400 uppercase tracking-wide">Biggest Struggle</span>
                    </div>
                    <p className="text-sm text-gray-300">{selectedApp.biggestStruggle}</p>
                  </div>
                )}

                {/* What they've tried */}
                {selectedApp.triedBefore && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Tried Before</span>
                    <p className="text-sm text-gray-300 mt-2">{selectedApp.triedBefore}</p>
                  </div>
                )}

                {/* Why now */}
                {selectedApp.whyNow && (
                  <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                    <span className="text-xs text-yellow-400 uppercase tracking-wide">Why Now?</span>
                    <p className="text-sm text-gray-300 mt-2">{selectedApp.whyNow}</p>
                  </div>
                )}

                {/* Availability */}
                {selectedApp.availability && (
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500">Daily Availability: </span>
                    <span className="text-sm text-white">{selectedApp.availability}</span>
                  </div>
                )}

                {/* Message */}
                {selectedApp.message && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Additional Message</span>
                    <p className="text-sm text-gray-300 mt-2">{selectedApp.message}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => updateStatus(selectedApp.id, "contacted")}
                  >
                    <MessageSquare size={14} className="mr-1" />
                    Mark Contacted
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateStatus(selectedApp.id, "accepted")}
                  >
                    <CheckCircle2 size={14} className="mr-1" />
                    Accept
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => updateStatus(selectedApp.id, "rejected")}
                  >
                    <XCircle size={14} className="mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card variant="glass" className="flex items-center justify-center h-64">
              <div className="text-center">
                <Eye size={32} className="text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">Select an application to view details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}

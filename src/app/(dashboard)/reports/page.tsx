"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  FileSpreadsheet,
  File,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

// Demo report data
const demoTrades = [
  { date: "2025-01-15", instrument: "NQ", direction: "long", setup: "Breaker Block", session: "New York", entry: 18250, exit: 18320, result: 425.50, rr: 2.3, rating: 5 },
  { date: "2025-01-15", instrument: "ES", direction: "short", setup: "Order Block", session: "New York", entry: 5980, exit: 6005, result: -180.50, rr: 0, rating: 2 },
  { date: "2025-01-14", instrument: "NQ", direction: "long", setup: "FVG", session: "London", entry: 18180, exit: 18245, result: 290.50, rr: 2.6, rating: 4 },
  { date: "2025-01-14", instrument: "GC", direction: "short", setup: "Breaker Block", session: "London", entry: 2045.50, exit: 2038.80, result: 150.50, rr: 1.9, rating: 4 },
  { date: "2025-01-13", instrument: "ES", direction: "long", setup: "Liquidity Sweep", session: "Overlap", entry: 5960, exit: 5948, result: -95.50, rr: 0, rating: 1 },
  { date: "2025-01-13", instrument: "NQ", direction: "long", setup: "BOS", session: "New York", entry: 18100, exit: 18165, result: 220.50, rr: 2.6, rating: 4 },
  { date: "2025-01-12", instrument: "EURUSD", direction: "short", setup: "Supply & Demand", session: "London", entry: 1.085, exit: 1.082, result: 297.00, rr: 2.0, rating: 5 },
  { date: "2025-01-10", instrument: "NQ", direction: "long", setup: "Breaker Block", session: "New York", entry: 18050, exit: 18130, result: 355.00, rr: 3.2, rating: 5 },
  { date: "2025-01-10", instrument: "ES", direction: "short", setup: "Order Block", session: "London", entry: 5940, exit: 5925, result: 145.00, rr: 1.5, rating: 3 },
  { date: "2025-01-09", instrument: "GC", direction: "long", setup: "FVG", session: "New York", entry: 2020, exit: 2032, result: 240.00, rr: 2.4, rating: 4 },
  { date: "2025-01-08", instrument: "NQ", direction: "short", setup: "Liquidity Sweep", session: "New York", entry: 18200, exit: 18230, result: -160.00, rr: 0, rating: 2 },
  { date: "2025-01-07", instrument: "ES", direction: "long", setup: "Breaker Block", session: "London", entry: 5900, exit: 5935, result: 310.00, rr: 2.3, rating: 4 },
];

const demoReports = [
  {
    id: "1", type: "daily" as const, title: "Daily Report — Jan 15, 2025",
    date: "2025-01-15", pnl: 245.00, trades: 2, winRate: 50, profitFactor: 2.36,
  },
  {
    id: "2", type: "daily" as const, title: "Daily Report — Jan 14, 2025",
    date: "2025-01-14", pnl: 441.00, trades: 2, winRate: 100, profitFactor: 999,
  },
  {
    id: "3", type: "weekly" as const, title: "Weekly Report — Week 3, 2025",
    date: "2025-01-13", pnl: 1108.00, trades: 7, winRate: 71.4, profitFactor: 3.97,
  },
  {
    id: "4", type: "weekly" as const, title: "Weekly Report — Week 2, 2025",
    date: "2025-01-06", pnl: 890.00, trades: 5, winRate: 80, profitFactor: 6.56,
  },
  {
    id: "5", type: "monthly" as const, title: "Monthly Report — January 2025",
    date: "2025-01-01", pnl: 1998.00, trades: 12, winRate: 75, profitFactor: 4.58,
  },
];

export default function ReportsPage() {
  const [filter, setFilter] = useState("all");
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const filteredReports = filter === "all" ? demoReports : demoReports.filter((r) => r.type === filter);

  // Compute summary stats
  const totalPnl = demoTrades.reduce((s, t) => s + t.result, 0);
  const totalTrades = demoTrades.length;
  const wins = demoTrades.filter((t) => t.result > 0).length;
  const winRate = (wins / totalTrades) * 100;
  const grossProfit = demoTrades.filter((t) => t.result > 0).reduce((s, t) => s + t.result, 0);
  const grossLoss = Math.abs(demoTrades.filter((t) => t.result < 0).reduce((s, t) => s + t.result, 0));
  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit;
  const avgWin = wins > 0 ? grossProfit / wins : 0;
  const losses = totalTrades - wins;
  const avgLoss = losses > 0 ? grossLoss / losses : 0;

  const handleExportCSV = useCallback(() => {
    setIsExporting("csv");

    try {
      // Build CSV with papaparse-style formatting
      const headers = [
        "Date", "Instrument", "Direction", "Setup", "Session",
        "Entry", "Exit", "Result ($)", "R:R", "Rating"
      ];

      const rows = demoTrades.map((t) => [
        t.date,
        t.instrument,
        t.direction,
        t.setup,
        t.session,
        t.entry.toString(),
        t.exit.toString(),
        t.result.toFixed(2),
        t.rr.toFixed(1),
        t.rating.toString(),
      ]);

      // Add summary rows
      rows.push([]);
      rows.push(["=== SUMMARY ==="]);
      rows.push(["Total Trades", totalTrades.toString()]);
      rows.push(["Win Rate", `${winRate.toFixed(1)}%`]);
      rows.push(["Total P&L", `$${totalPnl.toFixed(2)}`]);
      rows.push(["Profit Factor", profitFactor.toFixed(2)]);
      rows.push(["Average Winner", `$${avgWin.toFixed(2)}`]);
      rows.push(["Average Loser", `-$${avgLoss.toFixed(2)}`]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `priisma-edge-report-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
    } catch {
      toast.error("Failed to export CSV");
    } finally {
      setTimeout(() => setIsExporting(null), 500);
    }
  }, [totalTrades, winRate, totalPnl, profitFactor, avgWin, avgLoss]);

  const handleExportPDF = useCallback(async () => {
    setIsExporting("pdf");

    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Header
      doc.setFontSize(20);
      doc.setTextColor(212, 175, 55); // Gold
      doc.text("Priisma Edge", 14, 20);

      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text("Trading Performance Report", 14, 28);

      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`, 14, 34);

      // Summary section
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Performance Summary", 14, 48);

      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      const summaryY = 56;
      const colWidth = 48;

      const summaryItems = [
        ["Total Trades", totalTrades.toString()],
        ["Win Rate", `${winRate.toFixed(1)}%`],
        ["Total P&L", `$${totalPnl.toFixed(2)}`],
        ["Profit Factor", profitFactor.toFixed(2)],
        ["Avg Winner", `$${avgWin.toFixed(2)}`],
        ["Avg Loser", `-$${avgLoss.toFixed(2)}`],
      ];

      summaryItems.forEach((item, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 14 + col * colWidth;
        const y = summaryY + row * 16;

        doc.setFontSize(8);
        doc.setTextColor(140, 140, 140);
        doc.text(item[0], x, y);

        doc.setFontSize(12);
        doc.setTextColor(40, 40, 40);
        doc.text(item[1], x, y + 6);
      });

      // Trade table
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text("Trade History", 14, 96);

      autoTable(doc, {
        startY: 100,
        head: [["Date", "Instrument", "Direction", "Setup", "Session", "Result", "R:R"]],
        body: demoTrades.map((t) => [
          t.date,
          t.instrument,
          t.direction.toUpperCase(),
          t.setup,
          t.session,
          `$${t.result.toFixed(2)}`,
          t.rr > 0 ? `${t.rr.toFixed(1)}R` : "—",
        ]),
        theme: "striped",
        headStyles: {
          fillColor: [212, 175, 55],
          textColor: [0, 0, 0],
          fontStyle: "bold",
          fontSize: 8,
        },
        bodyStyles: {
          fontSize: 8,
          textColor: [60, 60, 60],
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          5: { halign: "right" },
          6: { halign: "center" },
        },
      });

      // Footer
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text("Generated by Priisma Edge — Trading Performance OS", 14, pageHeight - 10);

      doc.save(`priisma-edge-report-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF exported successfully!");
    } catch (err) {
      console.error("PDF export error:", err);
      toast.error("Failed to export PDF");
    } finally {
      setTimeout(() => setIsExporting(null), 500);
    }
  }, [totalTrades, winRate, totalPnl, profitFactor, avgWin, avgLoss]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-sm text-gray-400">Generate and export your trading performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            isLoading={isExporting === "csv"}
          >
            <FileSpreadsheet size={14} className="mr-1.5" />
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportPDF}
            isLoading={isExporting === "pdf"}
          >
            <File size={14} className="mr-1.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["all", "daily", "weekly", "monthly"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-xs font-medium rounded-xl transition-all border ${
              filter === f
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                : "text-gray-400 border-white/10 hover:text-white hover:bg-white/5"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Monthly Summary Card */}
      <Card variant="gold">
        <CardHeader>
          <CardTitle className="text-yellow-400">
            <BarChart3 size={14} className="inline mr-1" />
            January 2025 Summary
          </CardTitle>
          <Badge variant="success">+{formatCurrency(totalPnl)}</Badge>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-gray-400">Total P&L</p>
            <p className="text-xl font-bold text-emerald-400">+{formatCurrency(totalPnl)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Trades</p>
            <p className="text-xl font-bold text-white">{totalTrades}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Win Rate</p>
            <p className="text-xl font-bold text-white">{winRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Profit Factor</p>
            <p className="text-xl font-bold text-white">{profitFactor.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Winner</p>
            <p className="text-xl font-bold text-emerald-400">{formatCurrency(avgWin)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Avg Loser</p>
            <p className="text-xl font-bold text-red-400">-{formatCurrency(avgLoss)}</p>
          </div>
        </div>

        {/* Win Rate Visual */}
        <div className="mt-4 pt-4 border-t border-yellow-500/10">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Win Rate Progress</span>
            <span className="text-white font-medium">{wins}W / {losses}L</span>
          </div>
          <ProgressBar value={winRate} max={100} variant="gold" />
        </div>
      </Card>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Best Day</p>
              <p className="text-xs text-gray-400">Jan 14 — 2 trades</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(441)}</p>
          <p className="text-xs text-gray-500 mt-1">100% win rate</p>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <Target size={18} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Best Setup</p>
              <p className="text-xs text-gray-400">Breaker Block — 4 trades</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-yellow-400">100% WR</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(1236)} total P&L</p>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Calendar size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Best Session</p>
              <p className="text-xs text-gray-400">New York — 6 trades</p>
            </div>
          </div>
          <p className="text-2xl font-bold text-blue-400">66.7% WR</p>
          <p className="text-xs text-gray-500 mt-1">{formatCurrency(1191)} total P&L</p>
        </Card>
      </div>

      {/* Reports List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Generated Reports</h2>
        <div className="space-y-3">
          {filteredReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card variant="default" hover className="p-4" animate={false}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      report.type === "daily" ? "bg-white/5 border border-white/10" :
                      report.type === "weekly" ? "bg-blue-500/10 border border-blue-500/20" :
                      "bg-yellow-500/10 border border-yellow-500/20"
                    }`}>
                      <FileText size={18} className={
                        report.type === "daily" ? "text-gray-400" :
                        report.type === "weekly" ? "text-blue-400" : "text-yellow-400"
                      } />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{report.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={
                          report.type === "daily" ? "default" :
                          report.type === "weekly" ? "info" : "gold"
                        } size="sm">
                          {report.type}
                        </Badge>
                        <span className="text-xs text-gray-500">{report.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-xs">
                    <div className="text-center">
                      <p className="text-gray-500">P&L</p>
                      <p className={`font-bold ${report.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {report.pnl >= 0 ? "+" : ""}{formatCurrency(report.pnl)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Trades</p>
                      <p className="font-bold text-white">{report.trades}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">Win Rate</p>
                      <p className="font-bold text-white">{report.winRate.toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-500">PF</p>
                      <p className="font-bold text-white">{report.profitFactor > 100 ? "∞" : report.profitFactor.toFixed(1)}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleExportCSV} title="Download report">
                      <Download size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Export Info */}
      <Card variant="default" className="p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-white">Export Options</p>
            <p className="text-xs text-gray-400 mt-1">
              CSV exports include all trade data with summary statistics. PDF reports are formatted with
              your logo, performance charts, and a professional layout suitable for prop firm submissions.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

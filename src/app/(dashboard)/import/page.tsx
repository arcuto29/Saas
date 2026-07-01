"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Download,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Building2,
  Zap,
  RefreshCw,
  Info,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import toast from "react-hot-toast";

// Supported platforms
const PLATFORMS = [
  {
    id: "topstep",
    name: "TopStep",
    icon: "🏆",
    description: "Export from TopStep Dashboard → Performance → Download CSV",
    format: "CSV with Date, Symbol, Side, Qty, Entry, Exit, P&L columns",
  },
  {
    id: "apex",
    name: "Apex Trader Funding",
    icon: "⚡",
    description: "Export from Apex → Account → Trade History → Export",
    format: "CSV with TradeDate, Instrument, Action, Quantity, Price, Realized P&L",
  },
  {
    id: "myfundedfutures",
    name: "MyFundedFutures",
    icon: "💰",
    description: "Export from MFF Dashboard → Trades → Download",
    format: "CSV with standard trade columns",
  },
  {
    id: "bulenox",
    name: "Bulenox",
    icon: "🎯",
    description: "Export from Bulenox → Trade History → CSV Export",
    format: "CSV with trade execution data",
  },
  {
    id: "rithmic",
    name: "Rithmic (R|Trader)",
    icon: "📊",
    description: "R|Trader Pro → Order History → Export to CSV",
    format: "CSV with Account, Symbol, Buy/Sell, Qty, AvgPrice, RealizedPnL",
  },
  {
    id: "tradovate",
    name: "Tradovate",
    icon: "📈",
    description: "Tradovate → Account → Trade History → Download CSV",
    format: "CSV with contractId, action, qty, price, realizedPnl",
  },
  {
    id: "ninjatrader",
    name: "NinjaTrader",
    icon: "🥷",
    description: "NinjaTrader → Trade Performance → Export Trades",
    format: "CSV with Entry/Exit times, Instrument, Market pos., Profit",
  },
  {
    id: "tradestation",
    name: "TradeStation",
    icon: "🖥️",
    description: "TradeStation → TradeManager → Orders → Export",
    format: "CSV with Symbol, Type, Qty, Price, Status, Filled",
  },
  {
    id: "quantower",
    name: "Quantower",
    icon: "📐",
    description: "Quantower → Trading Journal → Export",
    format: "CSV with standard columns",
  },
  {
    id: "tradingview",
    name: "TradingView (Paper/Broker)",
    icon: "📉",
    description: "TradingView → Account → Trades → Export CSV",
    format: "CSV with Symbol, Side, Quantity, Entry, Exit, P&L",
  },
  {
    id: "generic",
    name: "Other / Custom CSV",
    icon: "📁",
    description: "Any CSV with columns for date, instrument, direction, entry, exit, P&L",
    format: "We'll auto-detect your column format",
  },
];

interface ParsedTrade {
  date: string;
  instrument: string;
  direction: "long" | "short";
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  commission: number;
  session?: string;
  notes?: string;
}

interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: string[];
  trades: ParsedTrade[];
}

export default function ImportPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [step, setStep] = useState<"platform" | "upload" | "review" | "done">("platform");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".txt"))) {
      setFile(droppedFile);
    } else {
      toast.error("Please upload a CSV file");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processFile = async () => {
    if (!file || !selectedPlatform) return;

    setIsProcessing(true);

    try {
      const text = await file.text();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("platform", selectedPlatform);

      const res = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Import failed");
        setIsProcessing(false);
        return;
      }

      setResult(data);
      setStep("review");
      toast.success(`${data.imported} trades parsed successfully!`);
    } catch (error) {
      toast.error("Failed to process file");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmImport = async () => {
    if (!result) return;
    // In production, this would save to the database
    // For now, we'll just mark as done
    toast.success(`${result.imported} trades imported to your journal!`);
    setStep("done");
  };

  const resetImport = () => {
    setSelectedPlatform(null);
    setFile(null);
    setResult(null);
    setStep("platform");
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Import Trades</h1>
          <p className="text-sm text-gray-400">
            Auto-import from any broker or prop firm — NQ, ES, YM, and more
          </p>
        </div>
        {step !== "platform" && (
          <Button variant="ghost" size="sm" onClick={resetImport}>
            <RefreshCw size={14} className="mr-1" />
            Start Over
          </Button>
        )}
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {["platform", "upload", "review", "done"].map((s, idx) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === s
                  ? "bg-yellow-500 text-black"
                  : idx < ["platform", "upload", "review", "done"].indexOf(step)
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-white/5 text-gray-500 border border-white/10"
              }`}
            >
              {idx < ["platform", "upload", "review", "done"].indexOf(step) ? (
                <CheckCircle2 size={14} />
              ) : (
                idx + 1
              )}
            </div>
            {idx < 3 && <div className="w-8 h-px bg-white/10" />}
          </div>
        ))}
        <span className="text-xs text-gray-500 ml-2">
          {step === "platform" && "Select platform"}
          {step === "upload" && "Upload file"}
          {step === "review" && "Review trades"}
          {step === "done" && "Complete!"}
        </span>
      </div>

      {/* Step 1: Select Platform */}
      <AnimatePresence mode="wait">
        {step === "platform" && (
          <motion.div
            key="platform"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <Building2 size={14} className="inline mr-1" />
                  Select Your Platform
                </CardTitle>
                <Badge variant="gold">{PLATFORMS.length} supported</Badge>
              </CardHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {PLATFORMS.map((platform) => (
                  <motion.button
                    key={platform.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedPlatform(platform.id);
                      setStep("upload");
                    }}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      selectedPlatform === platform.id
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="text-sm font-semibold text-white">{platform.name}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{platform.description}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Upload File */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Selected platform info */}
            <Card variant="default" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {PLATFORMS.find((p) => p.id === selectedPlatform)?.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {PLATFORMS.find((p) => p.id === selectedPlatform)?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {PLATFORMS.find((p) => p.id === selectedPlatform)?.format}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep("platform")}>
                  Change
                </Button>
              </div>
            </Card>

            {/* How to export guide */}
            <Card variant="default" className="p-4">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white mb-1">How to export your trades:</p>
                  <p className="text-xs text-gray-400">
                    {PLATFORMS.find((p) => p.id === selectedPlatform)?.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Upload zone */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <Upload size={14} className="inline mr-1" />
                  Upload CSV File
                </CardTitle>
              </CardHeader>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-yellow-500 bg-yellow-500/5"
                    : file
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                      <FileText size={24} className="text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB · Ready to process
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                    >
                      <X size={12} className="mr-1" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
                      <Upload size={24} className="text-gray-400" />
                    </div>
                    <p className="text-sm text-white font-medium">
                      Drag & drop your CSV file here
                    </p>
                    <p className="text-xs text-gray-500">or click to browse</p>
                  </div>
                )}
              </div>

              {file && (
                <div className="mt-6">
                  <Button
                    onClick={processFile}
                    isLoading={isProcessing}
                    className="w-full justify-center"
                    size="lg"
                  >
                    <Zap size={16} className="mr-2" />
                    Process & Parse Trades
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Step 3: Review Parsed Trades */}
        {step === "review" && result && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Import summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card variant="default" className="p-4 text-center">
                <p className="text-xs text-gray-500">Total Rows</p>
                <p className="text-2xl font-bold text-white">{result.total}</p>
              </Card>
              <Card variant="default" className="p-4 text-center">
                <p className="text-xs text-gray-500">Parsed</p>
                <p className="text-2xl font-bold text-emerald-400">{result.imported}</p>
              </Card>
              <Card variant="default" className="p-4 text-center">
                <p className="text-xs text-gray-500">Skipped</p>
                <p className="text-2xl font-bold text-yellow-400">{result.skipped}</p>
              </Card>
              <Card variant="default" className="p-4 text-center">
                <p className="text-xs text-gray-500">Errors</p>
                <p className="text-2xl font-bold text-red-400">{result.errors.length}</p>
              </Card>
            </div>

            {/* Errors */}
            {result.errors.length > 0 && (
              <Card variant="default" className="p-4 border-l-4 border-l-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={14} className="text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">Warnings</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.errors.map((err, i) => (
                    <p key={i} className="text-xs text-gray-400">• {err}</p>
                  ))}
                </div>
              </Card>
            )}

            {/* Trade preview table */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <BarChart3 size={14} className="inline mr-1" />
                  Parsed Trades Preview
                </CardTitle>
                <Badge variant="gold">{result.imported} trades</Badge>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Instrument</th>
                      <th className="text-left py-2 px-3 text-gray-500 font-medium">Side</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Qty</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Entry</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">Exit</th>
                      <th className="text-right py-2 px-3 text-gray-500 font-medium">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.trades.slice(0, 20).map((trade, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="py-2 px-3 text-gray-300">{trade.date}</td>
                        <td className="py-2 px-3 text-white font-medium">{trade.instrument}</td>
                        <td className="py-2 px-3">
                          <span className={`flex items-center gap-1 ${trade.direction === "long" ? "text-emerald-400" : "text-red-400"}`}>
                            {trade.direction === "long" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right text-gray-300">{trade.quantity}</td>
                        <td className="py-2 px-3 text-right text-gray-300">{trade.entryPrice.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right text-gray-300">{trade.exitPrice.toFixed(2)}</td>
                        <td className={`py-2 px-3 text-right font-semibold ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.trades.length > 20 && (
                  <p className="text-xs text-gray-500 text-center py-3">
                    Showing first 20 of {result.trades.length} trades
                  </p>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={confirmImport} className="flex-1 justify-center" size="lg">
                  <CheckCircle2 size={16} className="mr-2" />
                  Import {result.imported} Trades to Journal
                </Button>
                <Button variant="ghost" size="lg" onClick={resetImport}>
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Trades Imported!</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              {result?.imported} trades have been added to your journal. Your analytics and stats will update automatically.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={() => window.location.href = "/journal"}>
                View Journal
              </Button>
              <Button variant="secondary" onClick={resetImport}>
                Import More
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

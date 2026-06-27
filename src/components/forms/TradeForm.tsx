"use client";

import { useState } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Star,
  X,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { tradeFormSchema, defaultTradeValues, type TradeFormValues } from "@/lib/validations/trade";
import { EMOTIONS, MISTAKES, SESSIONS } from "@/constants";
import { cn } from "@/lib/utils";

interface TradeFormProps {
  initialValues?: Partial<TradeFormValues>;
  onSubmit: (data: TradeFormValues) => Promise<void> | void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

const POPULAR_SETUPS = [
  "Breaker Block",
  "Order Block",
  "FVG",
  "Liquidity Sweep",
  "BOS",
  "MSS",
  "Supply & Demand",
  "Trendline Break",
  "Range Breakout",
  "Divergence",
];

const DEMO_ACCOUNTS = [
  { value: "main", label: "Main Account ($50,000)" },
  { value: "ftmo", label: "FTMO Challenge ($100,000)" },
  { value: "myfunded", label: "MyFundedFX ($50,000)" },
];

export default function TradeForm({ initialValues, onSubmit, onCancel, mode = "create" }: TradeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customTag, setCustomTag] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TradeFormValues>({
    resolver: zodResolver(tradeFormSchema) as Resolver<TradeFormValues>,
    defaultValues: { ...defaultTradeValues, ...initialValues },
  });

  const direction = watch("direction");
  const emotions = watch("emotions");
  const mistakes = watch("mistakes");
  const tags = watch("tags");
  const rating = watch("rating");

  const toggleArrayItem = (field: "emotions" | "mistakes" | "tags", value: string) => {
    const current = field === "emotions" ? emotions : field === "mistakes" ? mistakes : tags;
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, updated);
  };

  const addCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setValue("tags", [...tags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleFormSubmit = async (data: TradeFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      toast.success(mode === "create" ? "Trade logged successfully!" : "Trade updated!");
    } catch {
      toast.error("Failed to save trade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Direction Toggle */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Direction</label>
        <Controller
          name="direction"
          control={control}
          render={({ field }) => (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => field.onChange("long")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm",
                  field.value === "long"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                )}
              >
                <TrendingUp size={16} />
                Long
              </button>
              <button
                type="button"
                onClick={() => field.onChange("short")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-medium text-sm",
                  field.value === "short"
                    ? "bg-red-500/10 border-red-500/30 text-red-400"
                    : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                )}
              >
                <TrendingDown size={16} />
                Short
              </button>
            </div>
          )}
        />
        {errors.direction && <p className="text-xs text-red-400 mt-1">{errors.direction.message}</p>}
      </div>

      {/* Instrument & Account */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Instrument *"
          placeholder="e.g. NQ, ES, GC, EURUSD"
          error={errors.instrument?.message}
          {...register("instrument")}
        />
        <Select
          label="Account"
          options={DEMO_ACCOUNTS}
          error={errors.accountId?.message}
          {...register("accountId")}
        />
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Entry Price *"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.entryPrice?.message}
          {...register("entryPrice")}
        />
        <Input
          label="Exit Price"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.exitPrice?.message}
          {...register("exitPrice")}
        />
        <Input
          label="Stop Loss"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.stopLoss?.message}
          {...register("stopLoss")}
        />
        <Input
          label="Take Profit"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.takeProfit?.message}
          {...register("takeProfit")}
        />
      </div>

      {/* Quantity & Commission */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Input
          label="Quantity"
          type="number"
          step="0.01"
          placeholder="1"
          error={errors.quantity?.message}
          {...register("quantity")}
        />
        <Input
          label="Commission"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.commission?.message}
          {...register("commission")}
        />
        <Input
          label="Entry Date *"
          type="datetime-local"
          error={errors.entryDate?.message}
          {...register("entryDate")}
        />
        <Input
          label="Exit Date"
          type="datetime-local"
          error={errors.exitDate?.message}
          {...register("exitDate")}
        />
      </div>

      {/* Setup & Session */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">Setup</label>
          <input
            type="text"
            placeholder="e.g. Breaker Block, FVG"
            list="setup-suggestions"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 transition-all duration-200"
            {...register("setup")}
          />
          <datalist id="setup-suggestions">
            {POPULAR_SETUPS.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
          {errors.setup && <p className="text-xs text-red-400 mt-1">{errors.setup.message}</p>}
        </div>
        <Select
          label="Session"
          options={SESSIONS.map((s) => ({ value: s.value, label: s.label }))}
          error={errors.session?.message}
          {...register("session")}
        />
      </div>

      {/* Emotions */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Emotions</label>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((emotion) => (
            <button
              key={emotion.value}
              type="button"
              onClick={() => toggleArrayItem("emotions", emotion.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-all",
                emotions.includes(emotion.value)
                  ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              )}
            >
              {emotion.emoji} {emotion.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistakes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Mistakes</label>
        <div className="flex flex-wrap gap-2">
          {MISTAKES.map((mistake) => (
            <button
              key={mistake.value}
              type="button"
              onClick={() => toggleArrayItem("mistakes", mistake.value)}
              className={cn(
                "px-3 py-1.5 text-xs rounded-full border transition-all",
                mistakes.includes(mistake.value)
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "border-white/10 bg-white/5 hover:bg-white/10 text-gray-300"
              )}
            >
              {mistake.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400"
            >
              {tag}
              <button type="button" onClick={() => toggleArrayItem("tags", tag)}>
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="Add custom tag..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addCustomTag}>
            <Plus size={14} />
          </Button>
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Trade Quality Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue("rating", star)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                size={24}
                className={cn(
                  "transition-colors",
                  star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-400">{rating}/5</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
        <textarea
          rows={3}
          placeholder="What did you observe? What went right or wrong?"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 resize-none transition-all duration-200"
          {...register("notes")}
        />
      </div>

      {/* Screenshot Upload Area */}
      <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center hover:border-yellow-500/30 transition-colors cursor-pointer group">
        <ImageIcon size={24} className="mx-auto text-gray-500 mb-2 group-hover:text-yellow-400 transition-colors" />
        <p className="text-sm text-gray-400">Click to upload screenshot</p>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
      </div>

      {/* R:R Preview */}
      <RiskRewardPreview direction={direction} watch={watch} />

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {mode === "create" ? "Save Trade" : "Update Trade"}
        </Button>
      </div>
    </form>
  );
}

function RiskRewardPreview({ direction, watch }: { direction: string; watch: (name: string) => number }) {
  const entry = watch("entryPrice") || 0;
  const exit = watch("exitPrice") || 0;
  const stop = watch("stopLoss") || 0;
  const tp = watch("takeProfit") || 0;
  const qty = watch("quantity") || 1;
  const commission = watch("commission") || 0;

  if (!entry || !stop) return null;

  const risk = direction === "long" ? entry - stop : stop - entry;
  const reward = exit ? (direction === "long" ? exit - entry : entry - exit) : (direction === "long" ? tp - entry : entry - tp);
  const rr = risk > 0 ? reward / risk : 0;
  const pnl = exit ? (direction === "long" ? (exit - entry) * qty : (entry - exit) * qty) - commission : 0;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="p-4 rounded-xl bg-white/[0.03] border border-white/5"
    >
      <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">Trade Preview</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-500">Risk (pts)</p>
          <p className="text-sm font-bold text-red-400">{risk.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Reward (pts)</p>
          <p className="text-sm font-bold text-emerald-400">{reward.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">R:R Ratio</p>
          <p className={cn("text-sm font-bold", rr >= 1.5 ? "text-emerald-400" : rr >= 1 ? "text-yellow-400" : "text-red-400")}>
            {rr.toFixed(2)}
          </p>
        </div>
        {pnl !== 0 && (
          <div>
            <p className="text-xs text-gray-500">Est. P&L</p>
            <p className={cn("text-sm font-bold", pnl > 0 ? "text-emerald-400" : "text-red-400")}>
              {pnl > 0 ? "+" : ""}${pnl.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

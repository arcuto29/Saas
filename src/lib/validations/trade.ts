import { z } from "zod";

export const tradeFormSchema = z.object({
  instrument: z.string().min(1, "Instrument is required"),
  direction: z.enum(["long", "short"]),
  entryPrice: z.number().positive("Entry price must be positive"),
  exitPrice: z.number().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  quantity: z.number().positive("Quantity must be positive").default(1),
  commission: z.number().min(0, "Commission cannot be negative").default(0),
  setup: z.string().optional(),
  session: z.string().optional(),
  entryDate: z.string().min(1, "Entry date is required"),
  exitDate: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5).default(3),
  accountId: z.string().optional(),
  emotions: z.array(z.string()).default([]),
  mistakes: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export type TradeFormValues = z.infer<typeof tradeFormSchema>;

export const defaultTradeValues: TradeFormValues = {
  instrument: "",
  direction: "long",
  entryPrice: 0,
  exitPrice: 0,
  stopLoss: 0,
  takeProfit: 0,
  quantity: 1,
  commission: 0,
  setup: "",
  session: "",
  entryDate: new Date().toISOString().slice(0, 16),
  exitDate: "",
  notes: "",
  rating: 3,
  accountId: "",
  emotions: [],
  mistakes: [],
  tags: [],
};

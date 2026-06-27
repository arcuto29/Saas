export interface TradeFormData {
  instrument: string;
  direction: "long" | "short";
  entryPrice: number;
  exitPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
  quantity: number;
  commission: number;
  setup?: string;
  session?: string;
  entryDate: string;
  exitDate?: string;
  notes?: string;
  rating?: number;
  accountId?: string;
  emotions: string[];
  mistakes: string[];
  tags: string[];
}

export interface DashboardStats {
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  winRate: number;
  profitFactor: number;
  avgRiskReward: number;
  avgWinner: number;
  avgLoser: number;
  totalTrades: number;
  currentWinStreak: number;
  currentLossStreak: number;
  maxWinStreak: number;
  maxLossStreak: number;
}

export interface AnalyticsData {
  winRateBySetup: Record<string, number>;
  winRateByWeekday: Record<string, number>;
  winRateByHour: Record<string, number>;
  winRateBySession: Record<string, number>;
  longPerformance: { winRate: number; pnl: number; count: number };
  shortPerformance: { winRate: number; pnl: number; count: number };
  bestSetup: string;
  worstSetup: string;
  bestSession: string;
  worstSession: string;
  expectancy: number;
  maxDrawdown: number;
  disciplineScore: number;
  equityCurve: { date: string; equity: number }[];
  calendarHeatmap: { date: string; pnl: number; trades: number }[];
}

export interface CoachAlert {
  id: string;
  type: "alert" | "tip" | "warning" | "achievement" | "plan";
  category: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical" | "success";
  createdAt: string;
}

export interface ReadinessScore {
  overall: number;
  sleep: number;
  mood: number;
  stress: number;
  confidence: number;
  discipline: number;
  recentPerformance: number;
}

export interface PropFirmData {
  id: string;
  firmName: string;
  accountSize: number;
  currentBalance: number;
  dailyLossLimit: number;
  overallMaxLoss: number;
  trailingDrawdown: boolean;
  profitTarget: number;
  activeTradingDays: number;
  requiredDays?: number;
  consistencyRule?: string;
  phase: string;
  status: string;
  startDate: string;
  remainingDrawdown: number;
  remainingTarget: number;
  progressPercent: number;
}

export interface GoalData {
  id: string;
  title: string;
  description?: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  startDate: string;
  endDate?: string;
  isCompleted: boolean;
  progressPercent: number;
}

export interface CalendarDay {
  date: string;
  pnl: number;
  tradeCount: number;
  winRate: number;
  notes?: string;
}

export interface ReportData {
  type: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  totalTrades: number;
  winRate: number;
  pnl: number;
  profitFactor: number;
  avgRiskReward: number;
  bestTrade: number;
  worstTrade: number;
  avgWinner: number;
  avgLoser: number;
  disciplineScore: number;
  topSetups: { setup: string; winRate: number; pnl: number }[];
  topMistakes: { mistake: string; count: number }[];
}

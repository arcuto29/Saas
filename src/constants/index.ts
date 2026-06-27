export const EMOTIONS = [
  { value: "confident", label: "Confident", emoji: "💪" },
  { value: "calm", label: "Calm", emoji: "😌" },
  { value: "excited", label: "Excited", emoji: "🔥" },
  { value: "neutral", label: "Neutral", emoji: "😐" },
  { value: "anxious", label: "Anxious", emoji: "😰" },
  { value: "fearful", label: "Fearful", emoji: "😨" },
  { value: "greedy", label: "Greedy", emoji: "🤑" },
  { value: "frustrated", label: "Frustrated", emoji: "😤" },
] as const;

export const MISTAKES = [
  { value: "moved_stop", label: "Moved Stop Loss" },
  { value: "early_exit", label: "Exited Too Early" },
  { value: "late_entry", label: "Late Entry" },
  { value: "oversize", label: "Oversized Position" },
  { value: "revenge_trade", label: "Revenge Trade" },
  { value: "no_plan", label: "No Trading Plan" },
  { value: "fomo", label: "FOMO Entry" },
  { value: "broke_rules", label: "Broke Rules" },
] as const;

export const SESSIONS = [
  { value: "asia", label: "Asian Session" },
  { value: "london", label: "London Session" },
  { value: "new_york", label: "New York Session" },
  { value: "overlap", label: "London/NY Overlap" },
] as const;

export const DIRECTIONS = [
  { value: "long", label: "Long", color: "text-emerald-400" },
  { value: "short", label: "Short", color: "text-red-400" },
] as const;

export const GOAL_TYPES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "profit", label: "Profit Target" },
  { value: "consistency", label: "Consistency" },
  { value: "habit", label: "Habit" },
  { value: "discipline", label: "Discipline" },
] as const;

export const PROP_FIRM_PHASES = [
  { value: "challenge", label: "Challenge" },
  { value: "verification", label: "Verification" },
  { value: "funded", label: "Funded" },
  { value: "failed", label: "Failed" },
] as const;

export const CHART_COLORS = {
  gold: "#D4AF37",
  goldLight: "#F5E6A3",
  goldDark: "#A08520",
  green: "#10B981",
  red: "#EF4444",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  orange: "#F59E0B",
  pink: "#EC4899",
  cyan: "#06B6D4",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/journal", label: "Journal", icon: "BookOpen" },
  { href: "/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/risk", label: "Risk", icon: "Shield" },
  { href: "/prop-firms", label: "Prop Firms", icon: "Building2" },
  { href: "/goals", label: "Goals", icon: "Target" },
  { href: "/calendar", label: "Calendar", icon: "Calendar" },
  { href: "/reports", label: "Reports", icon: "FileText" },
  { href: "/coach", label: "Coach", icon: "Brain" },
] as const;

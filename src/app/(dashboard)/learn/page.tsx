"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Play,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Search,
  Zap,
  Target,
  Shield,
  Brain,
  BarChart3,
  TrendingUp,
  Award,
  Lock,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Flame,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";

// Course modules — structured like a real curriculum
const MODULES = [
  {
    id: "foundations",
    title: "Foundations",
    subtitle: "Understand futures before you trade them",
    icon: Layers,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    gradient: "from-blue-500/10 to-blue-600/5",
    lessons: 4,
    duration: "45 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "What are futures contracts?",
        points: [
          "Agreement to buy/sell at a set price in the future",
          "You don't own the underlying asset — just speculation",
          "Contracts have expiration dates (quarterly for NQ)",
          "Margin lets you control large value with small capital",
        ],
      },
      {
        title: "NQ contract specifications",
        points: [
          "Symbol: NQ (full) / MNQ (micro)",
          "Tick size: 0.25 points",
          "Tick value: $5.00 (NQ) or $0.50 (MNQ)",
          "1 point = 4 ticks = $20 (NQ) / $2 (MNQ)",
          "With 7 contracts: 1 tick = $35",
        ],
      },
      {
        title: "Why trade NQ specifically?",
        points: [
          "Tech-heavy index = trends cleanly",
          "High liquidity = tight spreads, easy fills",
          "Moves big = plenty of opportunity daily",
          "Most prop firms offer NQ accounts",
          "One instrument mastery > being average at many",
        ],
      },
      {
        title: "Margin, leverage & account types",
        points: [
          "Day trade margin: ~$500-$1000/contract (varies by broker)",
          "Leverage is a tool — it amplifies wins AND losses",
          "Demo → Funded Challenge → Live Funded → Personal Live",
          "Start with MNQ (micro) if underfunded",
        ],
      },
    ],
  },
  {
    id: "risk",
    title: "Risk Management",
    subtitle: "The rules that keep you in the game",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500/10 to-emerald-600/5",
    lessons: 4,
    duration: "50 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "The non-negotiable rules",
        points: [
          "Never risk more than 1-2% of account per trade",
          "Daily loss limit = 2x single trade risk. Hit it? Done.",
          "2 consecutive losses = stop for the day",
          "Stop loss is set BEFORE entry, never moved further",
          "Never average down on a losing position",
        ],
      },
      {
        title: "Position sizing formula",
        points: [
          "Max Contracts = (Account × Risk%) / (Stop ticks × $5)",
          "Example: $50K, 1% risk, 20 tick stop",
          "$500 / (20 × $5) = $500 / $100 = 5 contracts",
          "With 7 contracts + 10 tick stop = $350 risk per trade",
          "Know your number BEFORE every single trade",
        ],
      },
      {
        title: "Why R:R is everything",
        points: [
          "With 1:6 R:R and 50% win rate you're VERY profitable",
          "With 1:1 R:R you need 60%+ win rate just to break even",
          "Minimum 1:3 R:R or don't take the trade",
          "Your stop should be tight (structure-based), target wide",
          "80% WR + 1:6 RR = you only need to be right 4/5 times",
        ],
      },
      {
        title: "The math that makes you funded",
        points: [
          "10 trades: 8 wins × $600 = $4,800",
          "10 trades: 2 losses × $100 = -$200",
          "Net: +$4,600 from 10 trades",
          "That's a funded challenge PASSED in a few days",
          "The math works. You just have to follow the rules.",
        ],
      },
    ],
  },
  {
    id: "psychology",
    title: "Trading Psychology",
    subtitle: "80% of trading is between your ears",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    gradient: "from-purple-500/10 to-purple-600/5",
    lessons: 4,
    duration: "55 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "Why 90% of traders fail",
        points: [
          "It's not the strategy — it's the execution",
          "Knowing what to do ≠ doing it under pressure",
          "Emotions hijack logic every single time",
          "The market rewards patience and punishes impulse",
          "Most people quit right before the breakthrough",
        ],
      },
      {
        title: "Revenge trading — the account killer",
        points: [
          "You lose → you feel angry → you take another trade",
          "Second trade is emotional, not logical",
          "Result: small loss becomes catastrophic loss",
          "Fix: After ANY loss, walk away 15+ minutes minimum",
          "Your next trade should be BETTER than average",
        ],
      },
      {
        title: "FOMO & overtrading",
        points: [
          "Seeing NQ move without you is NOT a reason to enter",
          "Chasing = buying the top or selling the bottom",
          "If you missed it, you missed it. There's always tomorrow",
          "2-3 quality trades > 10 garbage trades",
          "Every trade you DON'T take is capital preserved",
        ],
      },
      {
        title: "Building discipline that lasts",
        points: [
          "Write your rules down. Print them. Read them daily.",
          "Journal EVERY trade — especially the bad ones",
          "Discipline is a muscle. It gets stronger with use.",
          "Your identity should be 'disciplined trader' not 'winning trader'",
          "Process > Outcome. Every. Single. Time.",
        ],
      },
    ],
  },
  {
    id: "sessions",
    title: "Market Sessions",
    subtitle: "When to trade and when to sit",
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    gradient: "from-yellow-500/10 to-yellow-600/5",
    lessons: 3,
    duration: "30 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "The session breakdown",
        points: [
          "Asia (6PM–3AM EST): Low vol, choppy. Skip it.",
          "London (3AM–8AM EST): Sets up NY direction. Pre-market.",
          "NY Open (9:30–11:30AM EST): YOUR WINDOW. Best setups. ⭐",
          "Midday (11:30AM–2PM): Chop. This kills accounts.",
          "Afternoon (2PM–4PM): Volume returns but risky on news days.",
        ],
      },
      {
        title: "Why NY Open is king",
        points: [
          "Highest volume and liquidity on NQ",
          "Cleanest directional moves",
          "Initial Balance (first 30 min) defines the day",
          "Most consistent R:R opportunities",
          "2 hours of focus beats 8 hours of noise",
        ],
      },
      {
        title: "Session rules for NQ",
        points: [
          "Only trade 9:30 AM – 11:30 AM EST",
          "Never hold into FOMC, CPI, or NFP",
          "If no A+ setup by 11:00 AM, done for the day",
          "Pre-holiday sessions = thin liquidity = sit out",
          "Friday afternoons = position squaring = unpredictable",
        ],
      },
    ],
  },
  {
    id: "funded",
    title: "Getting Funded",
    subtitle: "Pass challenges and get paid",
    icon: Award,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    gradient: "from-yellow-500/10 to-yellow-600/5",
    lessons: 4,
    duration: "40 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "Choose your prop firm",
        points: [
          "TopStep: Most popular, strict trailing drawdown",
          "Apex: Easier rules, frequent sales",
          "MyFundedFutures: Good middle ground",
          "Bulenox: Budget option, similar to Apex",
          "Start with 50K account — enough room, affordable challenge",
        ],
      },
      {
        title: "The rules you MUST know",
        points: [
          "Profit target: how much to pass (usually $3K–$6K)",
          "Daily loss limit: max single-day loss ($1K–$2K)",
          "Trailing drawdown: total loss from peak equity",
          "Min trading days: 5–10 days minimum",
          "Know EXACTLY what gets you failed before starting",
        ],
      },
      {
        title: "The strategy to pass",
        points: [
          "Days 1–3: Trade 1 contract. Build a buffer.",
          "Days 4–7: Size up to 2-3 contracts once in profit",
          "Days 8+: Push toward target with controlled risk",
          "Never trade more than 3x per day during challenge",
          "At 60% of target → go conservative, protect profits",
        ],
      },
      {
        title: "After passing — staying funded",
        points: [
          "Same rules apply with real money",
          "First payout = proof you can do this",
          "Don't change what worked during the challenge",
          "Scale by adding accounts, not by increasing risk",
          "Most fail 3-5 challenges before passing. Budget for it.",
        ],
      },
    ],
  },
  {
    id: "plan",
    title: "Trading Plan",
    subtitle: "Your daily operating system",
    icon: Target,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    gradient: "from-red-500/10 to-red-600/5",
    lessons: 3,
    duration: "35 min",
    progress: 0,
    free: true,
    topics: [
      {
        title: "The 7-point trading plan",
        points: [
          "1. WHEN: NY Open only (9:30–11:30 AM)",
          "2. WHAT: NQ futures only. Nothing else.",
          "3. WHY: Daily bias determined BEFORE session",
          "4. HOW: Only A+ setups matching my system",
          "5. SIZE: Max 7 contracts, stop based on structure",
          "6. TARGET: Minimum 1:3 R:R or no trade",
          "7. RULES: 3 trades max, 2 losses = done",
        ],
      },
      {
        title: "Pre-session routine",
        points: [
          "Check economic calendar (15 min before open)",
          "Mark prior day high/low, overnight high/low",
          "Determine bias: above PDH = bullish, below PDL = bearish",
          "Set alerts at key levels",
          "Review yesterday's journal entry",
          "Read your rules card out loud",
        ],
      },
      {
        title: "Post-session review",
        points: [
          "Screenshot every trade (win or loss)",
          "Rate each setup: A+, A, B, C, or F",
          "Did you follow the plan? Yes/No (no excuses)",
          "One lesson to carry into tomorrow",
          "Fill out daily journal prompt",
          "Close the platform. Walk away. You're done.",
        ],
      },
    ],
  },
];

// Module detail view component
function ModuleDetail({ module, onBack }: { module: typeof MODULES[0]; onBack: () => void }) {
  const [currentTopic, setCurrentTopic] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Modules
      </button>

      {/* Module header */}
      <div className={`p-6 rounded-2xl bg-gradient-to-br ${module.gradient} border ${module.border}`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl ${module.bg} border ${module.border} flex items-center justify-center`}>
            <module.icon size={26} className={module.color} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{module.title}</h1>
            <p className="text-sm text-gray-400">{module.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1"><BookOpen size={12} /> {module.lessons} lessons</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {module.duration}</span>
          <Badge variant="success">Free</Badge>
        </div>
      </div>

      {/* Lesson navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {module.topics.map((topic, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentTopic(idx)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
              currentTopic === idx
                ? `${module.bg} ${module.color} border ${module.border}`
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
            }`}
          >
            {idx + 1}. {topic.title.split(" ").slice(0, 3).join(" ")}...
          </button>
        ))}
      </div>

      {/* Current lesson content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTopic}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Card variant="glass">
            <div className="p-2">
              {/* Lesson header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className={`text-xs ${module.color} font-medium uppercase tracking-wide mb-1`}>
                    Lesson {currentTopic + 1} of {module.topics.length}
                  </p>
                  <h2 className="text-xl font-bold text-white">
                    {module.topics[currentTopic].title}
                  </h2>
                </div>
                <div className={`w-10 h-10 rounded-xl ${module.bg} border ${module.border} flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${module.color}`}>{currentTopic + 1}</span>
                </div>
              </div>

              {/* Key points */}
              <div className="space-y-3 mb-8">
                {module.topics[currentTopic].points.map((point, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                  >
                    <div className={`w-6 h-6 rounded-lg ${module.bg} border ${module.border} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <CheckCircle2 size={12} className={module.color} />
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{point}</p>
                  </motion.div>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentTopic(Math.max(0, currentTopic - 1))}
                  disabled={currentTopic === 0}
                >
                  <ChevronLeft size={14} className="mr-1" />
                  Previous
                </Button>
                <span className="text-xs text-gray-500">
                  {currentTopic + 1} / {module.topics.length}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setCurrentTopic(Math.min(module.topics.length - 1, currentTopic + 1))}
                  disabled={currentTopic === module.topics.length - 1}
                >
                  Next
                  <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export default function LearnPage() {
  const [selectedModule, setSelectedModule] = useState<typeof MODULES[0] | null>(null);

  if (selectedModule) {
    return <ModuleDetail module={selectedModule} onBack={() => setSelectedModule(null)} />;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center">
              <GraduationCap size={20} className="text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Learn NQ Futures</h1>
              <p className="text-sm text-gray-400">From zero to funded — the complete curriculum</p>
            </div>
          </div>
        </div>
        <Badge variant="success">100% Free</Badge>
      </div>

      {/* Progress overview */}
      <Card variant="gold" className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-sm font-medium text-yellow-400">Your Progress</span>
          </div>
          <span className="text-xs text-gray-500">0 / {MODULES.length} modules completed</span>
        </div>
        <ProgressBar value={0} max={MODULES.length} variant="gold" />
        <p className="text-xs text-gray-500 mt-2">
          Complete all {MODULES.length} modules to master NQ futures trading fundamentals.
        </p>
      </Card>

      {/* Learning path */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-yellow-400" />
          Learning Path
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Follow the modules in order. Each builds on the previous one.
        </p>

        {/* Module cards */}
        <div className="space-y-4">
          {MODULES.map((module, idx) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => setSelectedModule(module)}
              className="group cursor-pointer"
            >
              <div className={`relative p-5 rounded-2xl bg-gradient-to-r ${module.gradient} border ${module.border} hover:bg-opacity-80 transition-all duration-300 group-hover:scale-[1.01]`}>
                {/* Module number */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">{idx + 1}</span>
                </div>

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${module.bg} border ${module.border} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <module.icon size={22} className={module.color} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {module.title}
                      </h3>
                      <Badge variant="success" className="text-[9px]">Free</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{module.subtitle}</p>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={11} />
                        {module.lessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {module.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Layers size={11} />
                        {module.topics.length} topics
                      </span>
                    </div>

                    {/* Topic preview */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {module.topics.slice(0, 3).map((topic, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-400">
                          {topic.title.split(" ").slice(0, 4).join(" ")}
                        </span>
                      ))}
                      {module.topics.length > 3 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-500">
                          +{module.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-yellow-400 transition-colors flex-shrink-0 mt-1" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mentorship upsell */}
      <Card variant="gold" className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
              <Flame size={22} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Want the full system?</h3>
              <p className="text-sm text-gray-400">
                These modules cover the fundamentals. The mentorship teaches my exact strategy, live execution, and personal coaching.
              </p>
            </div>
          </div>
          <Button size="sm" className="flex-shrink-0">
            Apply for Mentorship
            <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Clock,
  Star,
  ChevronRight,
  Search,
  Filter,
  Zap,
  Target,
  Shield,
  Brain,
  BarChart3,
  TrendingUp,
  DollarSign,
  Layers,
  Award,
} from "lucide-react";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";

const CATEGORIES = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "basics", label: "Futures Basics", icon: Layers },
  { id: "nq", label: "NQ Trading", icon: Zap },
  { id: "risk", label: "Risk Management", icon: Shield },
  { id: "psychology", label: "Psychology", icon: Brain },
  { id: "funded", label: "Getting Funded", icon: Award },
  { id: "advanced", label: "Advanced", icon: Target },
];

const LESSONS = [
  {
    id: "1",
    title: "What Are Futures? A Complete Beginner's Guide",
    description: "Understand futures contracts, margin, tick values, and why NQ is the best market for new traders.",
    category: "basics",
    duration: "12 min read",
    difficulty: "beginner",
    free: true,
    topics: ["Contracts", "Margin", "Tick Value", "Symbols"],
    content: `
## What Are Futures Contracts?

A futures contract is an agreement to buy or sell an asset at a predetermined price at a specified time in the future. In trading, we use futures to speculate on the direction of indices like the Nasdaq 100 (NQ).

### Key Concepts:

**Contract Specifications (NQ):**
- Symbol: NQ (full) or MNQ (micro)
- Tick Size: 0.25 points
- Tick Value: $5.00 per tick (NQ) or $0.50 (MNQ)
- Point Value: $20.00 per point (NQ) or $2.00 (MNQ)
- Trading Hours: Sunday 6PM – Friday 5PM EST (with daily break)

**Why NQ?**
- High liquidity = tight spreads
- Moves well = plenty of opportunities
- Tech-heavy = trends cleanly
- Most prop firms offer NQ accounts

**Margin:**
Unlike stocks, you don't pay the full contract value. You post "margin" — a deposit to hold the position. For a $50K funded account, you might only need $500-$1000 margin per contract.

### Next Steps:
Once you understand what futures are, move to "Understanding NQ Tick Values & Position Sizing" to learn how to calculate your risk per trade.
    `,
  },
  {
    id: "2",
    title: "NQ Tick Values & Position Sizing for Beginners",
    description: "Learn exactly how much money each tick is worth and how to size your positions based on your account.",
    category: "nq",
    duration: "8 min read",
    difficulty: "beginner",
    free: true,
    topics: ["Tick Value", "Position Size", "Risk Per Trade", "Contracts"],
    content: `
## NQ Tick Values

Every 0.25 point move on NQ = 1 tick = $5.00 per contract.

### Quick Math:
- 1 tick = $5 (per contract)
- 4 ticks = 1 point = $20 (per contract)  
- 10 ticks = 2.5 points = $50 (per contract)
- 20 ticks = 5 points = $100 (per contract)

### With 7 Contracts (Prisma's size):
- 1 tick = $35
- 10 ticks = $350
- 20 ticks = $700
- 100 ticks = $3,500

### Position Sizing Formula:
\`Max Contracts = (Account × Risk%) / (Stop in ticks × $5)\`

Example: $50,000 account, 1% risk, 20 tick stop:
\`$50,000 × 0.01 / (20 × $5) = $500 / $100 = 5 contracts max\`
    `,
  },
  {
    id: "3",
    title: "The Only Risk Management Rules You Need",
    description: "Simple, non-negotiable rules that will keep you in the game. Break these and you blow accounts.",
    category: "risk",
    duration: "10 min read",
    difficulty: "beginner",
    free: true,
    topics: ["Daily Loss Limit", "Position Size", "Stop Loss", "Rules"],
    content: `
## Non-Negotiable Risk Rules

These aren't suggestions. These are laws. Break them = blow your account.

### Rule 1: Never risk more than 1-2% per trade
On a $50K account, that's $500-$1000 max per trade. Period.

### Rule 2: Daily loss limit = 2x your single trade risk
If you risk $500 per trade, your daily max loss is $1000. Hit it? Turn off the computer.

### Rule 3: 2 consecutive losses = STOP
Two losses in a row means your read is off today. Come back tomorrow.

### Rule 4: Stop loss is SET before entry
If you don't know where your stop is BEFORE you click buy/sell, you're gambling.

### Rule 5: Never move your stop loss further away
Moving your stop = hoping. Hoping = losing. Take the loss, move on.

### Rule 6: Never average down on a losing position
Adding to a loser is how $500 losses become $5000 losses.

### The Math That Matters:
- With 80% win rate and 1:6 R:R (like Prisma):
- 10 trades: 8 winners × $600 = $4,800 | 2 losers × $100 = $200
- Net: +$4,600 from 10 trades
- You can be wrong 20% of the time and still make a killing IF your risk management is perfect.
    `,
  },
  {
    id: "4",
    title: "Trading Psychology: Why 90% of Traders Fail",
    description: "It's not your strategy. It's your mind. Learn the psychological traps that destroy accounts.",
    category: "psychology",
    duration: "15 min read",
    difficulty: "intermediate",
    free: true,
    topics: ["Revenge Trading", "FOMO", "Discipline", "Emotions"],
    content: `
## The Real Reason Traders Fail

Strategy is 20% of trading. Psychology is 80%. Here's what destroys accounts:

### 1. Revenge Trading
You take a loss. You feel angry. You immediately take another trade to "make it back."
Result: You're trading emotionally, not logically. Second loss is usually bigger.

**Fix:** After a loss, walk away for 15 minutes minimum. Your next trade should be BETTER than average, not desperate.

### 2. FOMO (Fear of Missing Out)
You see NQ moving without you. You chase the move. You enter late with no plan.
Result: You bought the top or sold the bottom.

**Fix:** If you missed it, you missed it. There will be another setup. The market is open every single day.

### 3. Moving Your Stop Loss
The trade is going against you. You "know" it'll come back. You move your stop further.
Result: What was a $100 loss becomes a $500 loss.

**Fix:** Your stop was placed for a reason. If the reason is gone, the trade is gone. Accept it.

### 4. Overtrading
You take 8 trades when your plan says 2-3. More trades ≠ more money.
Result: Commission adds up, quality drops, discipline erodes.

**Fix:** 2-3 A+ setups per day maximum. Quality > Quantity. Always.
    `,
  },
  {
    id: "5",
    title: "How to Get Funded: Prop Firm Challenge Guide",
    description: "Step-by-step guide to passing TopStep, Apex, and other NQ funded challenges.",
    category: "funded",
    duration: "20 min read",
    difficulty: "intermediate",
    free: true,
    topics: ["TopStep", "Apex", "Challenge Rules", "Strategy"],
    content: `
## Getting Funded — The Complete Guide

### Step 1: Choose Your Firm
- **TopStep** — Most popular, strict trailing drawdown, $50K-$150K accounts
- **Apex Trader Funding** — Easier rules, frequent sales, good for beginners
- **MyFundedFutures** — Middle ground, decent rules
- **Bulenox** — Budget option, similar to Apex

### Step 2: Understand the Rules
Every prop firm has:
- **Profit Target** — How much you need to make to pass (usually $3K-$6K)
- **Daily Loss Limit** — Max you can lose in a single day ($1K-$2K typically)
- **Trailing Drawdown** — Total loss from your highest equity point
- **Minimum Trading Days** — Usually 5-10 days minimum

### Step 3: The Strategy to Pass
1. Risk small — 1 contract or micro contracts first few days
2. Build a buffer before sizing up
3. Never trade more than 2-3 times per day
4. Avoid news events entirely during the challenge
5. Once at 60% of target, reduce risk further — protect profits
6. Be patient — you have 30+ days, use them all

### Step 4: After Passing
- Get your funded account
- Same rules apply but now with real money
- First payout is proof — screenshot it, post it, celebrate
- Then do it again with another account

### The Reality:
Most people fail 3-5 challenges before passing. That's normal. Each fail teaches you something. Budget for it.
    `,
  },
  {
    id: "6",
    title: "Understanding Market Sessions & When to Trade NQ",
    description: "Not all hours are equal. Learn which session gives the best setups and when to sit out.",
    category: "nq",
    duration: "10 min read",
    difficulty: "beginner",
    free: true,
    topics: ["NY Open", "London", "Asia", "Best Times"],
    content: `
## Trading Sessions for NQ

### Asia Session (6PM - 3AM EST)
- Low volatility, choppy price action
- Not ideal for NQ trading unless you have a specific edge here
- Good for: Setting levels for the next day

### London Session (3AM - 8AM EST)
- Moderate volatility, can set up the NY direction
- Pre-market moves happen here
- Good for: Identifying overnight range extremes

### NY Open (9:30AM - 11:30AM EST) ⭐ BEST WINDOW
- Highest volume and volatility
- Cleanest moves, best R:R setups
- This is where 80%+ of your trades should happen
- The "Initial Balance" (first 30 min) defines the day's range

### Midday (11:30AM - 2:00PM EST)
- Chop city. Low volume. Range-bound.
- Avoid trading here. This is where accounts get chopped up.

### Afternoon (2:00PM - 4:00PM EST)
- Volume picks up for close
- Can be good for continuation trades
- Dangerous on FOMC/news days

### After Hours (4:00PM - 6:00PM EST)
- Low liquidity, wide spreads
- Only trade if you have a very specific reason

### Prisma's Rule:
Trade NY Open (9:30-11:30), then stop. That's it. 2 hours of focus beats 8 hours of noise.
    `,
  },
  {
    id: "7",
    title: "Building a Trading Plan That Actually Works",
    description: "A real trading plan template. Not theory — the exact structure funded traders use daily.",
    category: "advanced",
    duration: "12 min read",
    difficulty: "intermediate",
    free: true,
    topics: ["Trading Plan", "Rules", "Process", "Template"],
    content: `
## Your Trading Plan Template

### 1. Session (When)
- I trade NY Open only: 9:30 AM – 11:30 AM EST
- No trades before 9:30, no trades after 11:30 (exceptions: rare A+ setups)

### 2. Instrument (What)
- NQ Futures only
- No ES, no YM, no switching between instruments

### 3. Direction (Why)
- Determine daily bias BEFORE the session
- If NQ is above prior day high = bullish bias (look for longs)
- If NQ is below prior day low = bearish bias (look for shorts)
- If inside range = wait for breakout confirmation

### 4. Setup (How)
- Only take A+ setups that match my system
- Confirmation required before entry
- No "feel" trades. No "I think it's going up" trades.

### 5. Risk (How Much)
- Maximum 7 contracts
- Stop loss: structural, not arbitrary
- Risk per trade: $500 max (10 ticks × 7 contracts × $5 = $350 at 10 tick stop)
- Daily max loss: $1,000 (2 trades max)

### 6. Target (Where)
- Minimum 1:3 R:R or no trade
- Ideal: 1:6 R:R (my average)
- Partials at 1:3, runner to 1:6+

### 7. Rules (Non-Negotiable)
- 3 trades max per day
- 2 consecutive losses = done for the day
- No trading during high-impact news
- Journal EVERY trade (win or loss)
- Review at end of session before closing platform

Write this out. Print it. Put it next to your monitor. Read it every morning.
    `,
  },
  {
    id: "8",
    title: "The Journal Review Process: How to Actually Learn from Trades",
    description: "Most traders journal wrong. Here's the review process that turns losses into lessons.",
    category: "psychology",
    duration: "10 min read",
    difficulty: "intermediate",
    free: true,
    topics: ["Review", "Journaling", "Process", "Improvement"],
    content: `
## The Review Process

Journaling isn't just writing "took a trade, lost money." It's a structured review.

### After EVERY Trade (2 min):
1. Screenshot your chart with entry/exit marked
2. Rate the setup: A+, A, B, C, or F
3. Did you follow your rules? Yes/No
4. One sentence: What would you do differently?

### End of Day (10 min):
1. Total P&L
2. Win rate for the day
3. Discipline score (1-10): Did I follow my plan?
4. Emotional state: Was I calm or reactive?
5. Tomorrow's bias: Based on today's close, what am I looking for?

### End of Week (30 min):
1. Total trades, wins, losses
2. Best trade of the week — WHY was it good?
3. Worst trade — what RULE did I break?
4. Pattern: Is there a recurring mistake?
5. Goal for next week: ONE thing to improve

### The Key Insight:
You don't improve by trading more. You improve by REVIEWING more.

One trader taking 3 trades/day with thorough review will outperform a trader taking 10 trades/day with no review. Every single time.
    `,
  },
];

const difficultyColors = {
  beginner: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Beginner" },
  intermediate: { bg: "bg-yellow-500/10", text: "text-yellow-400", label: "Intermediate" },
  advanced: { bg: "bg-purple-500/10", text: "text-purple-400", label: "Advanced" },
};

export default function LearnPage() {
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLesson, setSelectedLesson] = useState<typeof LESSONS[0] | null>(null);

  const filtered = LESSONS.filter((lesson) => {
    const matchesCategory = category === "all" || lesson.category === category;
    const matchesSearch = searchQuery === "" ||
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (selectedLesson) {
    const diff = difficultyColors[selectedLesson.difficulty as keyof typeof difficultyColors];
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <button
          onClick={() => setSelectedLesson(null)}
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
        >
          ← Back to Learn Hub
        </button>

        <Card variant="glass">
          <div className="p-2">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={selectedLesson.free ? "success" : "gold"}>
                {selectedLesson.free ? "Free" : "Vault"}
              </Badge>
              <span className={`text-xs px-2 py-0.5 rounded ${diff.bg} ${diff.text}`}>
                {diff.label}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock size={10} /> {selectedLesson.duration}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">{selectedLesson.title}</h1>
            <p className="text-gray-400 mb-6">{selectedLesson.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedLesson.topics.map((topic) => (
                <span key={topic} className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                  {topic}
                </span>
              ))}
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed space-y-4">
                {selectedLesson.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-4">{line.replace("## ", "")}</h2>;
                  if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold text-white mt-6 mb-3">{line.replace("### ", "")}</h3>;
                  if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold text-white">{line.replace(/\*\*/g, "")}</p>;
                  if (line.startsWith("- ")) return <p key={i} className="pl-4 text-gray-300">• {line.replace("- ", "")}</p>;
                  if (line.trim() === "") return <br key={i} />;
                  return <p key={i} className="text-gray-300">{line}</p>;
                })}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Learn Futures Trading</h1>
          <p className="text-sm text-gray-400">Free educational content for NQ futures traders. From zero to funded.</p>
        </div>
        <Badge variant="success">100% Free</Badge>
      </div>

      {/* Search */}
      <Input
        placeholder="Search lessons (e.g. 'risk management', 'funded', 'psychology')"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        icon={<Search size={14} />}
      />

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              category === cat.id
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
            }`}
          >
            <cat.icon size={12} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((lesson, idx) => {
          const diff = difficultyColors[lesson.difficulty as keyof typeof difficultyColors];
          return (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedLesson(lesson)}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/20 hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={lesson.free ? "success" : "gold"}>
                  {lesson.free ? "Free" : "Vault"}
                </Badge>
                <span className={`text-[10px] px-2 py-0.5 rounded ${diff.bg} ${diff.text}`}>
                  {diff.label}
                </span>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 ml-auto">
                  <Clock size={9} /> {lesson.duration}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                {lesson.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{lesson.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {lesson.topics.slice(0, 3).map((topic) => (
                  <span key={topic} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                    {topic}
                  </span>
                ))}
                {lesson.topics.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                    +{lesson.topics.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <BookOpen size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No lessons found. Try a different search or category.</p>
        </Card>
      )}
    </motion.div>
  );
}

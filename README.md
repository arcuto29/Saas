# Priisma Edge

**The All-in-One Trading Performance Operating System**

A production-quality SaaS web app for traders — journal trades, analyze performance, manage risk, track prop firms, and get AI-powered coaching. Built with a premium black & gold design system.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-7-2d3748?logo=prisma)

---

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Daily/weekly/monthly P&L, equity curve, win rate, profit factor, streaks |
| **Trading Journal** | Full CRUD with search, filters, emotions, mistakes, screenshots |
| **Analytics** | Win rate by setup, weekday, hour, session; equity curve, drawdown |
| **Risk Management** | Position size calculator, drawdown calculator, trading checklist |
| **Prop Firm Tracker** | Multi-account support, progress bars, drawdown tracking |
| **Goals** | Daily, weekly, monthly, profit, consistency, habit, discipline goals |
| **Calendar** | Trading calendar heatmap with daily P&L and trade counts |
| **Reports** | Daily/weekly/monthly reports, CSV & PDF export |
| **AI Coach** | Rule-based coaching engine with readiness score, pattern detection |
| **Settings** | Profile, trading accounts CRUD, preferences, notifications |

### Design System
- Premium black & gold theme
- Glassmorphism effects
- Smooth Framer Motion animations
- Fully responsive (mobile bottom nav, tablet, desktop sidebar)
- Custom Recharts visualizations
- Loading skeletons and empty states

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Database:** Prisma 7 + PostgreSQL
- **Auth:** NextAuth v5
- **Charts:** Recharts 3
- **Animations:** Framer Motion 12
- **Forms:** React Hook Form + Zod
- **PDF Export:** jsPDF + jspdf-autotable
- **Icons:** Lucide React
- **Notifications:** react-hot-toast

---

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev

# Open http://localhost:3000
```

> **Note:** The app works fully with demo data — no database setup required to preview the UI.

### With Database (Optional)

```bash
# Set DATABASE_URL in .env
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Run with real data
npm run dev
```

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register pages
│   ├── (dashboard)/     # All dashboard pages
│   ├── api/             # API routes (trades, coach, goals, etc.)
│   ├── layout.tsx       # Root layout with Toaster
│   ├── page.tsx         # Landing page
│   └── globals.css      # Theme & custom styles
├── components/
│   ├── ui/              # Button, Card, Input, Select, Badge, Modal, etc.
│   ├── layout/          # Sidebar, TopNav, MobileBottomNav, DashboardLayout
│   ├── charts/          # EquityCurve, WinRateChart, PnLChart, CalendarHeatmap
│   └── forms/           # TradeForm with validation
├── services/
│   └── coach-engine.ts  # Rule-based AI coaching engine
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Prisma client
│   ├── utils.ts         # Utility functions
│   └── validations/     # Zod schemas
├── constants/           # App constants (emotions, sessions, etc.)
├── types/               # TypeScript type definitions
└── hooks/               # Custom hooks (useApi)
```

---

## AI Coach Engine

The Priisma Coach uses **rule-based intelligence** (no paid AI APIs) to detect patterns:

- Overtrading detection
- Revenge trading pattern recognition
- Win streak overconfidence warnings
- Daily loss limit monitoring
- Best/worst setup identification
- Best/worst session detection
- Best/worst weekday detection
- Sleep correlation analysis
- Rule-breaking pattern tracking
- Tomorrow's action plan generation
- Discipline score calculation
- Daily readiness score

Designed to be extended with real AI (OpenAI, etc.) as a premium feature later.

---

## Database Schema

15+ models including: User, TradingAccount, Trade, Screenshot, Tag, Goal, PropFirmAccount, DailyJournal, CoachInsight, ChecklistItem, Report, TradeEmotion, TradeMistake, TradeTag.

---

## Deployment

Optimized for **Vercel** deployment:

```bash
npm run build   # Builds with 0 errors
```

---

## Free-First Philosophy

This MVP uses **zero paid APIs or services**:
- No paid AI (rule-based coach instead)
- No paid market data
- No paid broker APIs
- No paid email services
- Free-tier compatible (Vercel, Supabase/Neon for PostgreSQL)

---

## Future Roadmap

Architecture designed for easy addition of:
- Real AI trade reviews (OpenAI/Claude)
- Screenshot/chart analysis
- Broker integrations
- Economic calendar
- TradingView integration
- Team/mentor dashboards
- Mobile app (React Native)
- Paid subscription tiers

---

## License

Private — All rights reserved.

"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Zap,
  BarChart3,
  Shield,
  Brain,
  Target,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Users,
  Award,
  ChevronDown,
} from "lucide-react";
import Button from "@/components/ui/Button";
import PricingSection from "@/components/landing/PricingSection";
import MentorStats from "@/components/landing/MentorStats";
import AboutMentor from "@/components/landing/AboutMentor";

const features = [
  {
    icon: BookOpen,
    title: "Trading Journal",
    description: "Log every trade with emotions, setups, screenshots, and detailed notes. Track what works.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Win rate by setup, session, weekday. Equity curves, drawdown analysis, and pattern detection.",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description: "Position sizing calculator, drawdown tracking, and pre-trade checklists to protect your capital.",
  },
  {
    icon: Brain,
    title: "AI Coach",
    description: "Pattern-based intelligence detects revenge trading, overtrading, and identifies your best setups.",
  },
  {
    icon: Target,
    title: "Goal Tracking",
    description: "Daily, weekly, and monthly goals with visual progress. Build consistency through accountability.",
  },
  {
    icon: Zap,
    title: "Prop Firm Tracker",
    description: "Manage multiple funded challenges. Track drawdown limits, profit targets, and payout history.",
  },
];

const stats = [
  { value: "500+", label: "Active Traders", icon: Users },
  { value: "$2.4M+", label: "Tracked P&L", icon: TrendingUp },
  { value: "94%", label: "User Retention", icon: Award },
  { value: "4.9/5", label: "User Rating", icon: Star },
];

const testimonials = [
  {
    name: "Marcus R.",
    role: "Funded Trader | FTMO",
    text: "Priisma Edge changed my trading. The AI coach caught my revenge trading pattern and the journal helped me see exactly when I was breaking rules. Got funded within 3 months.",
    avatar: "M",
    result: "+$12,400 first month funded",
  },
  {
    name: "Sarah K.",
    role: "Forex Trader",
    text: "The analytics are insane. I found out my win rate drops 20% after 2pm and I was best in London session. Simple adjustment, massive results.",
    avatar: "S",
    result: "Win rate: 48% → 67%",
  },
  {
    name: "James T.",
    role: "Prop Firm Trader",
    text: "Managing 3 funded accounts is chaos without this. The prop firm tracker keeps me within limits and the risk calculator means I never oversize. Worth every dollar.",
    avatar: "J",
    result: "3 funded accounts, $150k total",
  },
];

const techStack = [
  "Next.js 16",
  "TypeScript",
  "Tailwind CSS 4",
  "Prisma ORM",
  "PostgreSQL",
  "Framer Motion",
  "NextAuth v5",
  "Recharts",
];

export default function LandingPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] bg-yellow-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-yellow-600/[0.02] rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Header / Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-50 flex items-center justify-between px-6 lg:px-12 py-4 backdrop-blur-sm border-b border-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Zap size={22} className="text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Priisma Edge
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
            Features
          </a>
          <a href="#mentor" className="text-sm text-gray-400 hover:text-white transition-colors">
            Mentor
          </a>
          <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#testimonials" className="text-sm text-gray-400 hover:text-white transition-colors">
            Results
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative z-10 px-6 lg:px-12 pt-24 pb-32 max-w-6xl mx-auto text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
            </span>
            <span className="text-xs font-medium text-yellow-400 tracking-wide">
              Trading Performance OS — Now Live
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-8xl font-extrabold text-white mb-8 leading-[0.9] tracking-tight">
            Your Edge in the
            <br />
            <span className="text-gold-gradient">Markets Starts Here</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            The all-in-one trading performance platform. Journal trades, analyze patterns,
            manage risk, track prop firms, and get AI-powered coaching — all in one premium dashboard.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register">
              <Button size="lg" className="text-base px-10 py-4 shadow-xl shadow-yellow-500/20">
                Start Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="text-base px-10 py-4">
                View Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-500">Scroll to explore</span>
            <ChevronDown size={16} className="text-gray-500" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Bar */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.01] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <stat.icon size={20} className="text-yellow-400 mx-auto mb-2" />
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-12 py-28 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
              Platform Features
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Everything You Need to
            <span className="text-gold-gradient"> Trade Better</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Built by traders, for traders. Every feature designed to improve your edge and grow your account.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-yellow-500/10 transition-all duration-300">
                  <feature.icon size={22} className="text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview / Tech Stack */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 overflow-hidden"
        >
          {/* Mock dashboard preview */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Premium Dashboard Experience
                </h3>
                <p className="text-gray-400">
                  Black & gold design system with glassmorphism, smooth animations, and full responsiveness.
                </p>
              </div>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Try Demo
                  <ArrowRight size={14} className="ml-2" />
                </Button>
              </Link>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Mock dashboard cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">Daily P&L</span>
                  <TrendingUp size={14} className="text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-400">+$450.25</p>
                <p className="text-xs text-gray-500 mt-1">5 trades today</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">Win Rate</span>
                  <Target size={14} className="text-yellow-400" />
                </div>
                <p className="text-2xl font-bold text-white">62.5%</p>
                <p className="text-xs text-gray-500 mt-1">Above target</p>
              </div>
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">Profit Factor</span>
                  <BarChart3 size={14} className="text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-white">2.1</p>
                <p className="text-xs text-gray-500 mt-1">Excellent</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About Mentor Story */}
      <AboutMentor />

      {/* Mentor Stats Section */}
      <MentorStats />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 px-6 lg:px-12 py-28 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6">
            <span className="text-xs font-medium text-gray-400 tracking-wide uppercase">
              Real Results
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Traders Who Found Their
            <span className="text-gold-gradient"> Edge</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">
            Don&apos;t take our word for it. See what real traders are saying.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mb-5">
                <TrendingUp size={12} className="text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">{testimonial.result}</span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 flex items-center justify-center">
                  <span className="text-sm font-bold text-yellow-400">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{testimonial.name}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits / Why Section */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/10 rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            Why Traders Choose Priisma Edge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Track unlimited trades across multiple accounts",
              "AI-powered coaching without expensive subscriptions",
              "Real-time performance analytics & pattern detection",
              "Prop firm challenge management & tracking",
              "Position sizing and risk calculators",
              "Beautiful calendar heatmaps & equity curves",
              "Export reports to CSV and PDF instantly",
              "Premium black & gold design — mobile responsive",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 px-6 lg:px-12 py-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Find Your
            <span className="text-gold-gradient"> Edge</span>?
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto text-lg">
            Join the traders who use data-driven insights to consistently improve their performance and grow their accounts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-10 py-4 shadow-xl shadow-yellow-500/20">
                Get Started Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="secondary" size="lg" className="text-base px-10 py-4">
                View Pricing
              </Button>
            </a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Zap size={16} className="text-black" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Priisma Edge
              </span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-xs text-gray-500 hover:text-white transition-colors">
                Features
              </a>
              <a href="#mentor" className="text-xs text-gray-500 hover:text-white transition-colors">
                Mentor
              </a>
              <a href="#pricing" className="text-xs text-gray-500 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#testimonials" className="text-xs text-gray-500 hover:text-white transition-colors">
                Results
              </a>
              <Link href="/apply" className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors font-medium">
                Apply
              </Link>
              <Link href="/login" className="text-xs text-gray-500 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
            <p className="text-xs text-gray-600">
              © 2025 Priisma Edge. Built for traders who demand more.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

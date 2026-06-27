"use client";

import { motion } from "framer-motion";
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
} from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  { icon: BookOpen, title: "Trading Journal", description: "Log every trade with emotions, mistakes, and screenshots" },
  { icon: BarChart3, title: "Deep Analytics", description: "Win rate by setup, session, and weekday with equity curves" },
  { icon: Shield, title: "Risk Management", description: "Position sizing, drawdown tracking, and risk calculators" },
  { icon: Brain, title: "AI Coach", description: "Personalized insights from your trading patterns" },
  { icon: Target, title: "Goal Tracking", description: "Daily, weekly, and monthly goals with visual progress" },
  { icon: Zap, title: "Prop Firm Tracker", description: "Track multiple prop firm challenges and funded accounts" },
];

const benefits = [
  "Track unlimited trades across multiple accounts",
  "AI-powered coaching without expensive APIs",
  "Real-time performance analytics",
  "Prop firm challenge management",
  "Position size and risk calculators",
  "Beautiful calendar heatmaps",
  "Export reports to CSV and PDF",
  "Mobile responsive design",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-yellow-600/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Zap size={22} className="text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Priisma Edge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-12 pt-20 pb-32 max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Zap size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400">Trading Performance OS</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Edge in the
            <br />
            <span className="text-gold-gradient">Markets Starts Here</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            The all-in-one trading performance platform. Journal trades, analyze patterns,
            manage risk, and get AI-powered coaching — all in one premium dashboard.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="text-base px-8">
                Start Free
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="text-base px-8">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-12 py-20 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need to Trade Better
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Built by traders, for traders. Every feature designed to improve your edge.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-yellow-500/20 hover:bg-white/[0.04] transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={22} className="text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
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
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-12 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Edge?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join traders who use data-driven insights to consistently improve their performance.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-base px-8">
              Get Started Free
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 lg:px-12 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <span className="text-sm font-medium text-gray-400">Priisma Edge</span>
          </div>
          <p className="text-xs text-gray-500">© 2025 Priisma Edge. Built for traders who demand more.</p>
        </div>
      </footer>
    </div>
  );
}

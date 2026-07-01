"use client";

import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Award,
  Flame,
  Shield,
  BarChart3,
  Crown,
  Zap,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const stats = [
  {
    value: "80%",
    label: "Win Rate",
    icon: Target,
    description: "Consistent execution across all market conditions",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    value: "1:6",
    label: "Risk : Reward",
    icon: TrendingUp,
    description: "Average return per trade relative to risk taken",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    value: "Funded",
    label: "Multiple Accounts",
    icon: Award,
    description: "Passed and managing multiple prop firm challenges",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    value: "4+ Years",
    label: "Market Experience",
    icon: Flame,
    description: "Trading forex, crypto, and indices full-time",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
];

const tradingEdge = [
  { icon: Shield, text: "Strict risk management — never risking more than 1% per trade" },
  { icon: BarChart3, text: "ICT / Smart Money concepts with precision entries" },
  { icon: Crown, text: "Psychology-first approach — mindset before strategy" },
  { icon: Zap, text: "Sniper entries with minimal drawdown, maximum reward" },
];

export default function MentorStats() {
  return (
    <section id="mentor" className="relative z-10 px-6 lg:px-12 py-28 max-w-6xl mx-auto">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[400px] bg-yellow-500/[0.02] rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Crown size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400 tracking-wide uppercase">
              Your Mentor
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Learn From Someone Who
            <span className="text-gold-gradient"> Actually Trades</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            No theory. No recycled YouTube strategies. These are real stats from live funded accounts.
            I trade every single day and I&apos;ve been helping traders in my Discord with tips that actually get results.
            Now I&apos;m offering dedicated mentorship — my full system, one-on-one.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + idx * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300 text-center"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${stat.bg} border ${stat.border} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              {/* Value */}
              <p className={`text-4xl font-extrabold ${stat.color} mb-1`}>{stat.value}</p>
              {/* Label */}
              <p className="text-sm font-semibold text-white mb-2">{stat.label}</p>
              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trading edge details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-gradient-to-br from-yellow-500/[0.05] to-transparent border border-yellow-500/10 rounded-3xl p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">My Trading Edge</h3>
                <p className="text-sm text-gray-400">
                  This is what I teach. This is how I trade. No secrets held back.
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Live Trading Daily</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {tradingEdge.map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon size={14} className="text-yellow-400" />
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-white/5">
              <Link href="/apply">
                <Button size="lg" className="text-sm px-8 shadow-lg shadow-yellow-500/20">
                  Apply for Mentorship
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <p className="text-xs text-gray-500">
                Limited spots — I only mentor a few students at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

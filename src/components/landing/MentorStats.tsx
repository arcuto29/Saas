"use client";

import { motion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Award,
  Flame,
  Crown,
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
    label: "Futures Accounts",
    icon: Award,
    description: "Passed and managing multiple futures prop firm challenges",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    value: "4+ Years",
    label: "Futures Experience",
    icon: Flame,
    description: "Trading NQ, ES, and other index futures full-time",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
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
            No theory. No recycled YouTube strategies. These are real stats from live funded futures accounts.
            I trade NQ and ES every single day and I&apos;ve been helping futures traders in my Discord with tips that actually get results.
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
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
        </motion.div>
      </div>
    </section>
  );
}

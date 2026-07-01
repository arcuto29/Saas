"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import {
  Crown,
  Heart,
  TrendingUp,
  Flame,
  ArrowRight,
  Skull,
  Frown,
  Zap,
  Trophy,
  Car,
  DollarSign,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

// Journey phases — each one appears as user scrolls
const phases = [
  {
    id: "broke",
    year: "2019–2020",
    title: "The Dark Days",
    subtitle: "Rock Bottom",
    description:
      "Broke. Couldn't afford a can of soda or a candy bar for 2 years. Sleeping on the floor. Everyone around me laughed. Family members doubted me. Said I was wasting my time. Said trading was gambling.",
    quote: "\"You'll never make money from this.\"",
    quoteAuthor: "— Everyone around me",
    icon: Skull,
    colors: {
      accent: "#EF4444",
      bg: "from-red-950/40 via-gray-950 to-gray-950",
      glow: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      particle: "bg-red-500",
    },
    stats: [
      { label: "Account Balance", value: "$0" },
      { label: "Win Rate", value: "20%" },
      { label: "Mental State", value: "Broken" },
    ],
  },
  {
    id: "grind",
    year: "2021",
    title: "The Grind",
    subtitle: "Blood, Sweat, Charts",
    description:
      "Blew account after account. Failed funded challenges. Lost count of how many times I restarted. But every single loss was a lesson. I studied harder than anyone around me. 16-hour days. No social life. Just charts.",
    quote: "\"One more blown account and I'm done... but I wasn't done.\"",
    quoteAuthor: "— Me, every single month",
    icon: Flame,
    colors: {
      accent: "#F97316",
      bg: "from-orange-950/30 via-gray-950 to-gray-950",
      glow: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      particle: "bg-orange-500",
    },
    stats: [
      { label: "Accounts Blown", value: "12+" },
      { label: "Hours Studying", value: "5000+" },
      { label: "Failed Challenges", value: "8" },
    ],
  },
  {
    id: "breakthrough",
    year: "2022",
    title: "The Breakthrough",
    subtitle: "Everything Changed",
    description:
      "Mastered my psychology first. Then the strategy clicked. Got my first funded account. Then another. Then payouts started hitting. Consistent. Real. Life-changing money for the first time ever.",
    quote: "\"The same people who doubted me started asking for help.\"",
    quoteAuthor: "— The best feeling",
    icon: Zap,
    colors: {
      accent: "#FACC15",
      bg: "from-yellow-950/30 via-gray-950 to-gray-950",
      glow: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
      particle: "bg-yellow-500",
    },
    stats: [
      { label: "Funded Accounts", value: "3" },
      { label: "Win Rate", value: "72%" },
      { label: "First Big Payout", value: "$14,200" },
    ],
  },
  {
    id: "mastery",
    year: "2023",
    title: "The Mastery",
    subtitle: "Scaling Up",
    description:
      "Multiple funded accounts. Six-figure months became normal. Bought my Lambo Urus. Moved into a new place. Helped my family. Started teaching others. Building real generational wealth.",
    quote: "\"All glory to God. None of this is possible without Him.\"",
    quoteAuthor: "— Prisma",
    icon: Crown,
    colors: {
      accent: "#10B981",
      bg: "from-emerald-950/30 via-gray-950 to-gray-950",
      glow: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
      particle: "bg-emerald-500",
    },
    stats: [
      { label: "Monthly Income", value: "6 Figures+" },
      { label: "Win Rate", value: "80%" },
      { label: "Risk:Reward", value: "1:6" },
    ],
  },
  {
    id: "now",
    year: "2024–NOW",
    title: "The Legacy",
    subtitle: "Teaching the Path",
    description:
      "Now I shorten your learning curve from 5 years to months. I teach my exact system — mindset, strategy, and execution. So you don't have to suffer like I did. Your breakthrough is closer than you think.",
    quote: "\"I went through hell so you don't have to.\"",
    quoteAuthor: "— Prisma",
    icon: Trophy,
    colors: {
      accent: "#D4AF37",
      bg: "from-yellow-900/20 via-gray-950 to-gray-950",
      glow: "bg-yellow-500/15",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      particle: "bg-yellow-400",
    },
    stats: [
      { label: "Students Mentored", value: "50+" },
      { label: "Students Funded", value: "30+" },
      { label: "Your Turn?", value: "Apply Now" },
    ],
  },
];

function PhaseCard({ phase, index }: { phase: (typeof phases)[0]; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // 3D transforms based on scroll position
  const rotateX = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [15, 5, 0, -5, -15]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.85, 0.95, 1, 0.95, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [0, 1, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [100, 30, 0, -30, -100]);
  const blur = useTransform(scrollYProgress, [0, 0.2, 0.4, 0.6, 0.8, 1], [8, 2, 0, 0, 2, 8]);

  // Parallax for background elements
  const bgY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const particleY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div ref={ref} className="min-h-screen flex items-center justify-center py-20 perspective-[1200px]">
      <motion.div
        style={{
          rotateX,
          scale,
          opacity,
          y,
          filter: useTransform(blur, (v) => `blur(${v}px)`),
        }}
        className="relative w-full max-w-5xl mx-auto px-6"
      >
        {/* Floating particles */}
        <motion.div
          style={{ y: particleY }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${phase.colors.particle} opacity-30`}
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </motion.div>

        {/* Background glow */}
        <motion.div
          style={{ y: bgY }}
          className={`absolute inset-0 ${phase.colors.glow} rounded-[40px] blur-3xl -z-10`}
        />

        {/* Main card */}
        <div
          className={`relative rounded-3xl bg-gradient-to-br ${phase.colors.bg} border ${phase.colors.border} backdrop-blur-xl overflow-hidden`}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1 opacity-60"
            style={{ background: `linear-gradient(90deg, transparent, ${phase.colors.accent}, transparent)` }}
          />

          <div className="p-8 md:p-12 lg:p-16">
            {/* Phase header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                {/* 3D icon container */}
                <motion.div
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className={`w-16 h-16 rounded-2xl ${phase.colors.glow} border ${phase.colors.border} flex items-center justify-center`}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <phase.icon size={28} className={phase.colors.text} />
                </motion.div>
                <div>
                  <p className={`text-xs font-bold ${phase.colors.text} uppercase tracking-widest mb-1`}>
                    {phase.year}
                  </p>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white">
                    {phase.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{phase.subtitle}</p>
                </div>
              </div>

              {/* Phase indicator */}
              <div className="flex items-center gap-2">
                {phases.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i <= index
                        ? `${phase.colors.particle} shadow-sm`
                        : "bg-white/10"
                    }`}
                    style={
                      i <= index
                        ? { boxShadow: `0 0 8px ${phase.colors.accent}` }
                        : {}
                    }
                  />
                ))}
              </div>
            </div>

            {/* Story text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl"
            >
              {phase.description}
            </motion.p>

            {/* Quote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className={`relative pl-6 border-l-2 ${phase.colors.border} mb-10`}
            >
              <p className={`text-lg md:text-xl italic ${phase.colors.text} font-medium`}>
                {phase.quote}
              </p>
              <p className="text-sm text-gray-500 mt-2">{phase.quoteAuthor}</p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
              {phase.stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`p-4 md:p-5 rounded-2xl bg-white/[0.03] border border-white/5 text-center`}
                >
                  <p className={`text-2xl md:text-3xl font-extrabold ${phase.colors.text}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Scroll progress indicator on the side
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:block">
      <div className="relative w-1 h-48 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          style={{ height }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-500 via-yellow-500 to-emerald-500 rounded-full"
        />
      </div>
      <div className="flex flex-col items-center gap-1 mt-3">
        <Skull size={10} className="text-red-400/50" />
        <Flame size={10} className="text-orange-400/50" />
        <Zap size={10} className="text-yellow-400/50" />
        <Crown size={10} className="text-emerald-400/50" />
        <Trophy size={10} className="text-yellow-400/50" />
      </div>
    </div>
  );
}

export default function AboutMentor() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <section id="about" ref={containerRef} className="relative">
      {/* Scroll progress bar */}
      <ScrollProgressBar />

      {/* Section intro */}
      <div className="relative z-10 px-6 lg:px-12 pt-28 pb-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
            <Heart size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400 tracking-wide uppercase">
              The Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
            From
            <span className="text-red-400"> Nothing</span> to
            <span className="text-gold-gradient"> Everything</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Scroll through my journey. Every phase shaped who I am as a trader and mentor today.
            This is the real story — no filter, no cap.
          </p>

          {/* Scroll hint */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-10 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-600">Scroll to experience</span>
            <div className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center p-1">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Phase cards with 3D scroll */}
      <div className="relative" style={{ perspective: "1200px" }}>
        {phases.map((phase, index) => (
          <PhaseCard key={phase.id} phase={phase} index={index} />
        ))}
      </div>

      {/* Final CTA after the journey */}
      <div className="relative z-10 px-6 lg:px-12 py-28 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Glowing divider */}
          <div className="w-24 h-1 mx-auto mb-10 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500 shadow-lg shadow-yellow-500/20" />

          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Your Story Doesn&apos;t Have to Take
            <span className="text-gold-gradient"> 5 Years</span>
          </h3>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            I went through the pain so you don&apos;t have to. Let me shortcut your
            journey from where you are now to funded and profitable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/apply">
              <Button size="lg" className="text-base px-10 py-4 shadow-xl shadow-yellow-500/20">
                Apply for Mentorship
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <a href="#pricing">
              <Button variant="secondary" size="lg" className="text-base px-8 py-4">
                View Plans
              </Button>
            </a>
          </div>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-gray-500">Limited spots</span>
            </div>
            <div className="flex items-center gap-2">
              <Crown size={12} className="text-yellow-400" />
              <span className="text-xs text-gray-500">80% Win Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={12} className="text-yellow-400" />
              <span className="text-xs text-gray-500">1:6 R:R</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

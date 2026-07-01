"use client";

import { motion } from "framer-motion";
import {
  Crown,
  Heart,
  TrendingUp,
  Flame,
  Quote,
  ArrowRight,
  Car,
  DollarSign,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

const timeline = [
  {
    year: "Year 1–2",
    title: "The Trenches",
    description:
      "Broke. Couldn't afford a can of soda or a candy bar for 2 years straight. Everyone laughed. Family doubted me. But I kept going.",
    icon: Flame,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    year: "Year 3",
    title: "The Grind",
    description:
      "Went through more losses than I can count. Blew accounts. Failed challenges. But every loss was a lesson. I studied harder than anyone around me.",
    icon: TrendingUp,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    year: "Year 4",
    title: "The Breakthrough",
    description:
      "Everything clicked. Mastered my psychology. Built a system that actually worked. Got funded. Started seeing real, consistent payouts.",
    icon: Sparkles,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
  },
  {
    year: "Year 5+",
    title: "The Lifestyle",
    description:
      "6 figures a month. Bought my Lambo Urus last year. Living life on my terms. All glory to God. Now I teach others the same path.",
    icon: Crown,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
];

export default function AboutMentor() {
  return (
    <section id="about" className="relative z-10 px-6 lg:px-12 py-28 max-w-6xl mx-auto">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[600px] h-[400px] bg-yellow-500/[0.02] rounded-full blur-3xl" />
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
            <Heart size={14} className="text-yellow-400" />
            <span className="text-xs font-medium text-yellow-400 tracking-wide uppercase">
              My Story
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            From the Trenches to
            <span className="text-gold-gradient"> Six Figures</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            I didn&apos;t come from money. I didn&apos;t have connections. I built this from nothing —
            and I teach you the exact path I took so you don&apos;t have to suffer for 5 years like I did.
          </p>
        </motion.div>

        {/* Quote Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="relative p-8 md:p-10 rounded-3xl bg-gradient-to-br from-yellow-500/[0.05] to-transparent border border-yellow-500/10">
            <Quote size={32} className="text-yellow-500/20 absolute top-6 left-6" />
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed italic pl-6 md:pl-8">
              &ldquo;I&apos;ve been trading for 5 years and I&apos;ve mastered my craft. I went through
              a lot of ups and downs — mainly downs at the start. I built myself up from the
              trenches. Had no money for a can of soda or candy for like 2 years. I was broke.
              Everyone laughed at me. Doubted me. Even family members. Now I make 6 figures a month,
              own a Lambo Urus I bought last year, and life is good. All glory to God.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-6 pl-6 md:pl-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Crown size={16} className="text-black" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Prisma</p>
                <p className="text-xs text-gray-500">Founder & Head Mentor</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-red-500/30 via-yellow-500/30 to-emerald-500/30 hidden md:block" />

            <div className="space-y-6">
              {timeline.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.5 }}
                  className="flex gap-5"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${item.bg} border ${item.border} flex items-center justify-center flex-shrink-0 z-10`}>
                    <item.icon size={20} className={item.color} />
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-xs font-bold ${item.color} uppercase tracking-wide`}>
                        {item.year}
                      </span>
                      <span className="text-sm font-semibold text-white">{item.title}</span>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Life Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <DollarSign size={20} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-white">6 Fig+</p>
              <p className="text-xs text-gray-500">Monthly Income</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Calendar size={20} className="text-yellow-400 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-white">5 Years</p>
              <p className="text-xs text-gray-500">Trading Experience</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Car size={20} className="text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-white">Urus</p>
              <p className="text-xs text-gray-500">Lambo &apos;24</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
              <Heart size={20} className="text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-extrabold text-white">God</p>
              <p className="text-xs text-gray-500">All Glory To</p>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              I went through hell so you don&apos;t have to. Let me shorten your learning curve
              from 5 years to months. Apply now and let&apos;s build your future together.
            </p>
            <Link href="/apply">
              <Button size="lg" className="text-base px-10 shadow-xl shadow-yellow-500/20">
                Apply for Mentorship
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

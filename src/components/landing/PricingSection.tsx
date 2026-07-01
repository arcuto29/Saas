"use client";

import { motion } from "framer-motion";
import { Check, X, Crown, Zap, Rocket, ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import Link from "next/link";

const plans = [
  {
    name: "Foundation",
    price: 500,
    installment: { amount: 175, payments: 3 },
    icon: Zap,
    badge: null,
    description: "Get the NQ system and start building your edge",
    duration: "4 weeks",
    gradient: "from-gray-500/20 to-gray-600/5",
    borderColor: "border-white/10",
    iconBg: "bg-white/10",
    iconColor: "text-white",
    features: [
      { text: "Full NQ Trading Strategy", included: true },
      { text: "Mindset Framework", included: true },
      { text: "Group Sessions (4 weeks)", included: true },
      { text: "Trading Plan Template", included: true },
      { text: "Educational Resources", included: true },
      { text: "1-on-1 Calls", included: false },
      { text: "DM Access", included: false },
      { text: "Personal Chart Reviews", included: false },
      { text: "Funded Challenge Support", included: false },
      { text: "Vault Access", included: false },
      { text: "Access to My Projects", included: false },
    ],
  },
  {
    name: "Complete Trader",
    price: 1000,
    installment: { amount: 350, payments: 3 },
    icon: Crown,
    badge: "Most Popular",
    description: "Personal mentorship to get you funded & consistent on NQ",
    duration: "8 weeks",
    gradient: "from-yellow-500/20 to-yellow-600/5",
    borderColor: "border-yellow-500/30",
    iconBg: "bg-yellow-500/20",
    iconColor: "text-yellow-400",
    features: [
      { text: "Full NQ Trading Strategy", included: true },
      { text: "Deep Mindset Coaching", included: true },
      { text: "Group Sessions (8 weeks)", included: true },
      { text: "4x 1-on-1 Calls", included: true },
      { text: "DM Access (8 weeks)", included: true },
      { text: "Weekly Chart Reviews", included: true },
      { text: "Custom Trading Plan", included: true },
      { text: "Funded Challenge Gameplan", included: true },
      { text: "Vault Access (8 weeks)", included: true },
      { text: "Post-Completion Support", included: false },
      { text: "Access to My Projects", included: false },
    ],
  },
  {
    name: "Inner Circle",
    price: 1500,
    installment: { amount: 525, payments: 3 },
    icon: Rocket,
    badge: "All Access",
    description: "Full transformation + lifetime access to everything I build",
    duration: "12 weeks + ongoing",
    gradient: "from-purple-500/20 via-yellow-500/10 to-purple-600/5",
    borderColor: "border-purple-500/30",
    iconBg: "bg-gradient-to-br from-yellow-500/20 to-purple-500/20",
    iconColor: "text-yellow-300",
    features: [
      { text: "Full NQ Trading Strategy", included: true },
      { text: "Complete Mindset Overhaul", included: true },
      { text: "Group Sessions (12 weeks)", included: true },
      { text: "8x 1-on-1 Calls", included: true },
      { text: "Unlimited DM Access (12 weeks)", included: true },
      { text: "Daily Chart Reviews", included: true },
      { text: "Custom Trading Plan", included: true },
      { text: "Full Funded Challenge Support", included: true },
      { text: "Lifetime Vault Access", included: true },
      { text: "30-Day Post-Completion Support", included: true },
      { text: "Access to All My Projects", included: true },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function PricingSection() {
  return (
    <section id="pricing" className="relative z-10 px-6 lg:px-12 py-28 max-w-7xl mx-auto">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-yellow-500/[0.03] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-20 relative"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
          <Sparkles size={14} className="text-yellow-400" />
          <span className="text-xs font-medium text-yellow-400 tracking-wide uppercase">
            Mentorship Plans
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5">
          Invest in Your
          <span className="text-gold-gradient"> Trading Future</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
          I don&apos;t just teach a strategy. I build the complete trader — mind, system, and execution.
          Choose your level.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 items-stretch"
      >
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.name}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className={`relative rounded-3xl bg-gradient-to-b ${plan.gradient} border ${plan.borderColor} p-8 flex flex-col backdrop-blur-sm ${
              idx === 1
                ? "lg:scale-[1.03] shadow-2xl shadow-yellow-500/10"
                : ""
            }`}
          >
            {/* Popular badge */}
            {plan.badge && (
              <div
                className={`absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                  idx === 1
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg shadow-yellow-500/30"
                    : "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                }`}
              >
                {plan.badge}
              </div>
            )}

            {/* Card Header */}
            <div className="mb-8">
              <div
                className={`w-14 h-14 rounded-2xl ${plan.iconBg} border border-white/10 flex items-center justify-center mb-5`}
              >
                <plan.icon size={26} className={plan.iconColor} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{plan.description}</p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white tracking-tight">
                  ${plan.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-2 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
                {plan.duration}
              </p>
              {plan.installment && (
                <p className="text-xs text-emerald-400 mt-2 font-medium">
                  or 3 payments of ${plan.installment.amount}/mo
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

            {/* Features List */}
            <div className="flex-1 space-y-3.5 mb-8">
              {plan.features.map((feature) => (
                <div key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-yellow-400" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                      <X size={12} className="text-gray-600" strokeWidth={3} />
                    </div>
                  )}
                  <span
                    className={`text-sm ${
                      feature.included ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link href="/apply" className="w-full">
              <Button
                variant={idx === 1 ? "primary" : "secondary"}
                size="lg"
                className={`w-full justify-center text-sm font-semibold ${
                  idx === 2
                    ? "bg-gradient-to-r from-purple-600 to-yellow-500 text-white border-0 hover:from-purple-500 hover:to-yellow-400 shadow-lg shadow-purple-500/20"
                    : ""
                }`}
              >
                {idx === 0
                  ? "Apply Now"
                  : idx === 1
                  ? "Apply Now"
                  : "Apply for Inner Circle"}
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom trust badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-400">Limited spots available</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Crown size={14} className="text-yellow-400" />
            <span className="text-sm text-gray-400">Real results from real students</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-sm text-gray-400">DM to apply</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

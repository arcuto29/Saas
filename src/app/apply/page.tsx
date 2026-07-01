"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  User,
  Mail,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Crown,
  Rocket,
  Clock,
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  Send,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import toast from "react-hot-toast";

const planOptions = [
  { value: "foundation", label: "Foundation — $500 (4 weeks)" },
  { value: "complete", label: "Complete Trader — $1,000 (8 weeks)" },
  { value: "inner-circle", label: "Inner Circle — $1,500 (12 weeks + projects)" },
];

const experienceOptions = [
  { value: "beginner", label: "Beginner (0–6 months)" },
  { value: "intermediate", label: "Intermediate (6 months – 2 years)" },
  { value: "advanced", label: "Advanced (2+ years)" },
  { value: "funded", label: "Already Funded" },
];

const marketOptions = [
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "stocks", label: "Stocks / Indices" },
  { value: "futures", label: "Futures" },
  { value: "multiple", label: "Multiple Markets" },
];

const goalOptions = [
  { value: "get-funded", label: "Get funded with a prop firm" },
  { value: "consistency", label: "Become consistent & profitable" },
  { value: "mindset", label: "Fix my trading psychology" },
  { value: "strategy", label: "Learn a proven strategy" },
  { value: "scale", label: "Scale my funded accounts" },
  { value: "all", label: "All of the above" },
];

const planHighlights = [
  {
    name: "Foundation",
    price: "$500",
    icon: Zap,
    color: "text-white",
    bg: "bg-white/10",
    features: ["Full strategy", "4 weeks group sessions", "Mindset framework"],
  },
  {
    name: "Complete Trader",
    price: "$1,000",
    icon: Crown,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    badge: "Popular",
    features: ["4x 1-on-1 calls", "DM access", "Weekly chart reviews", "Vault access"],
  },
  {
    name: "Inner Circle",
    price: "$1,500",
    icon: Rocket,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    features: ["8x 1-on-1 calls", "Daily chart reviews", "Lifetime Vault", "Project access"],
  },
];

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    discord: "",
    plan: "",
    experience: "",
    market: "",
    goal: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.plan || !formData.experience) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      setIsSubmitted(true);
      toast.success("Application submitted!");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full max-w-lg text-center"
        >
          <div className="bg-gray-900/50 border border-white/5 rounded-3xl p-10 backdrop-blur-xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Application Received!</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              I&apos;ll review your application and get back to you within 24 hours.
              Check your DMs on Discord — that&apos;s where we&apos;ll connect.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <Clock size={18} className="text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-300 text-left">Response within 24 hours</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <MessageSquare size={18} className="text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-300 text-left">I&apos;ll reach out via Discord DM</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                <Shield size={18} className="text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-gray-300 text-left">No payment until we talk first</p>
              </div>
            </div>
            <Link href="/" className="mt-8 inline-block">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-yellow-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <Zap size={22} className="text-black" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Priisma Edge
          </span>
        </Link>
        <Link href="/#pricing">
          <Button variant="ghost" size="sm">
            View Plans
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Apply for
              <span className="text-gold-gradient"> Mentorship</span>
            </h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              I only take a limited number of students at a time so I can give real,
              personal attention. Fill out the form and I&apos;ll get back to you within 24 hours.
            </p>

            {/* Plan summaries */}
            <div className="space-y-3 mb-8">
              {planHighlights.map((plan) => (
                <div
                  key={plan.name}
                  className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg ${plan.bg} flex items-center justify-center`}>
                        <plan.icon size={16} className={plan.color} />
                      </div>
                      <span className="text-sm font-semibold text-white">{plan.name}</span>
                      {plan.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-[10px] font-bold text-yellow-400 uppercase">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-white">{plan.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {plan.features.map((f) => (
                      <span key={f} className="text-[11px] text-gray-500 px-2 py-0.5 rounded-md bg-white/5">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mentor stats mini */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-yellow-500/5 to-transparent border border-yellow-500/10">
              <p className="text-xs text-yellow-400 font-medium uppercase tracking-wide mb-3">Your Mentor&apos;s Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-bold text-white">80%</p>
                  <p className="text-xs text-gray-500">Win Rate</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">1:6</p>
                  <p className="text-xs text-gray-500">Risk:Reward</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-400">Funded</p>
                  <p className="text-xs text-gray-500">Multiple Accounts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">4+ yrs</p>
                  <p className="text-xs text-gray-500">Experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-900/50 border border-white/5 rounded-3xl p-8 lg:p-10 backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Send size={18} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Application Form</h2>
                  <p className="text-xs text-gray-500">Takes less than 2 minutes</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 - Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    icon={<User size={16} />}
                    required
                  />
                  <Input
                    label="Email *"
                    name="email"
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    icon={<Mail size={16} />}
                    required
                  />
                </div>

                {/* Discord */}
                <Input
                  label="Discord Username"
                  name="discord"
                  type="text"
                  placeholder="username#0000 or just username"
                  value={formData.discord}
                  onChange={handleChange}
                  icon={<MessageSquare size={16} />}
                />

                {/* Plan Selection */}
                <Select
                  label="Which plan interests you? *"
                  name="plan"
                  value={formData.plan}
                  onChange={handleChange}
                  options={planOptions}
                />

                {/* Experience Level */}
                <Select
                  label="Trading experience level *"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  options={experienceOptions}
                />

                {/* Market */}
                <Select
                  label="What do you trade?"
                  name="market"
                  value={formData.market}
                  onChange={handleChange}
                  options={marketOptions}
                />

                {/* Goal */}
                <Select
                  label="What&apos;s your #1 goal?"
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  options={goalOptions}
                />

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">
                    Anything else you want me to know?
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your trading journey, biggest struggles, what you've tried before..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all duration-200 resize-none text-sm"
                  />
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full justify-center text-base shadow-xl shadow-yellow-500/20"
                  isLoading={isSubmitting}
                >
                  Submit Application
                  <ArrowRight size={18} className="ml-2" />
                </Button>

                {/* Trust note */}
                <p className="text-center text-xs text-gray-500">
                  No payment required to apply. I&apos;ll review your application and reach out personally.
                </p>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

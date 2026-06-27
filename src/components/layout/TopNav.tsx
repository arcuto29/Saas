"use client";

import { useState } from "react";
import { Bell, Search, User, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Shield,
  Building2,
  Target,
  Calendar,
  FileText,
  Brain,
  Zap,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/journal", label: "Journal", icon: BookOpen },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/risk", label: "Risk", icon: Shield },
  { href: "/prop-firms", label: "Prop Firms", icon: Building2 },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/coach", label: "Coach", icon: Brain },
  { href: "/finance", label: "Finance", icon: Wallet },
];

export default function TopNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-gray-950/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-4 lg:px-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-gray-400"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Zap size={14} className="text-black" />
          </div>
          <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Priisma Edge
          </span>
        </div>

        {/* Search - Desktop */}
        <div className="hidden lg:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search trades, setups..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-500 rounded-full" />
          </button>
          <Link href="/settings" className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
            <User size={18} />
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-gray-950 border-r border-white/5 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                    <Zap size={16} className="text-black" />
                  </div>
                  <span className="font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                    Priisma Edge
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="p-4 space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all",
                        isActive
                          ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}>
                        <item.icon size={20} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import MobileBottomNav from "./MobileBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <div className="lg:ml-64">
        <TopNav />
        <main className="p-4 lg:p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

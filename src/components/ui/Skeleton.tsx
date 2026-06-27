"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "circular" | "text";
}

export default function Skeleton({ className, variant = "default" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-white/5 rounded-xl",
        variant === "circular" && "rounded-full",
        variant === "text" && "rounded-md h-4",
        className
      )}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton variant="text" className="w-64" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="text" className="w-24" />
              <Skeleton className="h-4 w-4 rounded" />
            </div>
            <Skeleton className="h-8 w-28 mb-2" />
            <Skeleton variant="text" className="w-20" />
          </div>
        ))}
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Skeleton variant="text" className="w-16 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <Skeleton variant="text" className="w-32" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-[250px] w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function JournalSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton variant="text" className="w-56" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>

      {/* Trade Cards */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" className="w-32" />
              <Skeleton variant="text" className="w-48 h-3" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton variant="text" className="w-72" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <Skeleton variant="text" className="w-16 mb-2" />
            <Skeleton className="h-6 w-12" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="space-y-1">
                <Skeleton variant="text" className="w-28" />
                <Skeleton variant="text" className="w-16 h-3" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j}>
                  <Skeleton variant="text" className="w-12 mb-1 h-3" />
                  <Skeleton className="h-5 w-14" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="w-3/4" />
              <Skeleton variant="text" className="w-1/2 h-3" />
            </div>
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton variant="text" className="w-20 h-3" />
        </div>
      ))}
    </div>
  );
}

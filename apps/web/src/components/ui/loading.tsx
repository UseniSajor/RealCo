"use client"

import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div
      className={cn(
        "rounded-full border-slate-200 border-t-[#56CCF2] animate-spin",
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn("rounded-xl border-4 border-slate-200 p-6 animate-pulse", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-24 bg-slate-200 rounded" />
        <div className="w-12 h-12 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-8 w-20 bg-slate-200 rounded mb-2" />
      <div className="h-3 w-32 bg-slate-100 rounded" />
    </div>
  )
}

interface LoadingGridProps {
  count?: number
  className?: string
}

export function LoadingGrid({ count = 4, className }: LoadingGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  )
}

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Spinner size="lg" className="border-white/30 border-t-white" />
        </div>
        <p className="text-lg font-semibold text-slate-600">{message}</p>
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  message?: string
}

export function LoadingOverlay({ message = "Processing..." }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-2xl text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="font-semibold text-slate-700 dark:text-slate-200">{message}</p>
      </div>
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-slate-200 dark:bg-slate-700 rounded animate-pulse", className)} />
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  )
}

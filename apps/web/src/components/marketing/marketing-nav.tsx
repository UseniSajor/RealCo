"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2 } from "lucide-react"
import { DarkModeToggle } from "@/components/layout/DarkModeToggle"

export function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-realco-gray/90 backdrop-blur-lg border-b-2 border-gray-200 dark:border-white/10">
      <div className="container max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 shape-circle bg-gradient-realco flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black text-realco-navy dark:text-white">RealCo</span>
              <p className="text-xs text-muted-foreground">Real Estate Syndication Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/sponsors"
              className="px-4 py-2 shape-oval text-sm font-semibold text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Sponsors
            </Link>
            <Link
              href="/investors"
              className="px-4 py-2 shape-oval text-sm font-semibold text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Investors
            </Link>
            <Link
              href="/fund-managers"
              className="px-4 py-2 shape-oval text-sm font-semibold text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Fund Managers
            </Link>
            <Link
              href="/providers"
              className="px-4 py-2 shape-oval text-sm font-semibold text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Service Providers
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 shape-oval text-sm font-semibold text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Pricing
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <div className="hidden md:block">
              <DarkModeToggle />
            </div>

            {/* Login Button */}
            <Link href="/login">
              <Button
                variant="outline"
                className="shape-oval border-2 border-realco-blue text-realco-blue hover:bg-realco-blue hover:text-white font-semibold transition-all"
              >
                Log In
              </Button>
            </Link>

            {/* Sign Up Button */}
            <Link href="/signup">
              <Button className="shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-bold shadow-lg hover:shadow-xl transition-all">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

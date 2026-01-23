"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

export function MarketingNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      <div className="container flex h-20 max-w-7xl items-center justify-between px-6 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-black gradient-text">RealCo</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/" 
            className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-[#56CCF2] transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/sponsors" 
            className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-[#56CCF2] transition-colors"
          >
            Sponsors
          </Link>
          <Link 
            href="/investors" 
            className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-[#56CCF2] transition-colors"
          >
            Investors
          </Link>
          <Link 
            href="/providers" 
            className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-[#56CCF2] transition-colors"
          >
            Providers
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="border-2 border-[#E07A47] text-[#E07A47] hover:bg-[#E07A47] hover:text-white font-bold">
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild className="bg-[#56CCF2] hover:bg-[#3BB5E0] font-bold">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

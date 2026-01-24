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
    <nav className="sticky top-0 z-50 w-full border-b-4 border-[#E07A47] bg-[#1e40af]/95 backdrop-blur shadow-lg shadow-[#E07A47]/10">
      <div className="container flex h-20 max-w-7xl items-center justify-between px-6 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-3xl font-black text-white">RealCo</span>
        </Link>

        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4">
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4">
            <Link href="/sponsors">Sponsors</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4">
            <Link href="/investors">Investors</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4">
            <Link href="/providers">Providers</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4">
            <Link href="/fund-managers">Fund Managers</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="bg-[#56CCF2]/20 hover:bg-[#56CCF2]/30 text-[#56CCF2] font-semibold rounded-full px-4 border border-[#56CCF2]">
            <Link href="/pricing">Pricing</Link>
          </Button>
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-white hover:bg-white/20"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
          <Button variant="outline" size="sm" asChild className="border-2 border-white text-white hover:bg-white hover:text-[#1e40af] font-bold rounded-full">
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild className="bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-full">
            <Link href="/login">Sign Up</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

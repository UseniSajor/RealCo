"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, LogIn, UserPlus, Sparkles } from "lucide-react"
import { useTheme } from "next-themes"
import * as React from "react"

export function MarketingNav() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/sponsors", label: "Sponsors" },
    { href: "/investors", label: "Investors" },
    { href: "/providers", label: "Providers" },
    { href: "/fund-managers", label: "Fund Managers" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b-4 border-[#E07A47] bg-[#1e40af]/95 backdrop-blur shadow-lg shadow-[#E07A47]/10">
      <div className="container flex h-20 max-w-7xl items-center justify-between px-6 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center">
            <span className="text-white font-black text-lg">R</span>
          </div>
          <span className="text-2xl font-black text-white">RealCo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4"
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="bg-[#56CCF2]/20 hover:bg-[#56CCF2]/30 text-[#56CCF2] font-semibold rounded-full px-4 border border-[#56CCF2]"
          >
            <Link href="/pricing">Pricing</Link>
          </Button>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full text-white hover:bg-white/20"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}

          {/* Try Demo Button */}
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full px-4"
          >
            <Link href="/dashboard">
              <Sparkles className="mr-2 h-4 w-4" />
              Try Demo
            </Link>
          </Button>

          {/* Sign In */}
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-2 border-white text-white hover:bg-white hover:text-[#1e40af] font-bold rounded-full"
          >
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>

          {/* Sign Up - Primary CTA */}
          <Button
            size="sm"
            asChild
            className="bg-gradient-to-r from-[#E07A47] to-[#D96835] hover:from-[#D96835] hover:to-[#C55A28] text-white font-bold rounded-full shadow-lg shadow-[#E07A47]/30"
          >
            <Link href="/signup">
              <UserPlus className="mr-2 h-4 w-4" />
              Start Free
            </Link>
          </Button>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white hover:bg-white/20 rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1e40af] border-t border-white/20 py-4">
          <div className="container max-w-7xl px-6 mx-auto space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-white hover:bg-white/10 rounded-xl font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/pricing"
              className="block py-3 px-4 text-[#56CCF2] hover:bg-[#56CCF2]/10 rounded-xl font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <div className="pt-4 border-t border-white/20 space-y-2">
              <Link
                href="/dashboard"
                className="block py-3 px-4 text-white bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles className="inline mr-2 h-4 w-4" />
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

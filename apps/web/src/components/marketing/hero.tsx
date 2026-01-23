"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface HeroProps {
  headline: string
  subheadline: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  tertiaryCta?: { label: string; href: string }
  trustLine?: string
}

export function Hero({ headline, subheadline, primaryCta, secondaryCta, tertiaryCta, trustLine }: HeroProps) {
  return (
    <section className="relative py-24 md:py-32 gradient-hero overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      <div className="container relative z-10 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
            {headline}
          </h1>
          
          <p className="text-xl md:text-2xl text-white/95 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            {subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" asChild className="min-w-[200px] group">
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            {secondaryCta && (
              <Button size="lg" variant="outline" asChild className="min-w-[200px] bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white hover:text-[#2C3E50]">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
            {tertiaryCta && (
              <Button size="lg" variant="ghost" asChild className="min-w-[200px] text-white hover:bg-white/10">
                <Link href={tertiaryCta.href}>{tertiaryCta.label}</Link>
              </Button>
            )}
          </div>

          {trustLine && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg font-semibold text-white/95"
            >
              {trustLine}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

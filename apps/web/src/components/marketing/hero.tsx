"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"

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
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-br from-white via-realco-blue/5 to-realco-orange/5 dark:from-realco-gray dark:via-realco-navy/20 dark:to-realco-gray overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-64 h-64 shape-circle bg-realco-blue/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 shape-circle bg-realco-orange/10 blur-3xl" />
      
      <div className="container relative z-10 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-realco-navy dark:text-white mb-8 leading-tight">
            {headline}
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            {subheadline}
          </p>

          {/* CTA Buttons - All Oval/Circular */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href={primaryCta.href}>
              <Button 
                size="lg" 
                className="min-w-[240px] h-14 shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all group"
              >
                {primaryCta.label}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            
            {secondaryCta && (
              <Link href={secondaryCta.href}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="min-w-[240px] h-14 shape-oval border-2 border-realco-blue text-realco-blue hover:bg-realco-blue hover:text-white font-bold transition-all hover:scale-105"
                >
                  {secondaryCta.label}
                </Button>
              </Link>
            )}
            
            {tertiaryCta && (
              <Link href={tertiaryCta.href}>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="min-w-[240px] h-14 shape-oval text-realco-navy dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 font-semibold group"
                >
                  <div className="w-10 h-10 shape-circle bg-realco-orange/20 flex items-center justify-center mr-2">
                    <Play className="h-5 w-5 text-realco-orange" />
                  </div>
                  {tertiaryCta.label}
                </Button>
              </Link>
            )}
          </div>

          {/* Trust Line */}
          {trustLine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex items-center justify-center gap-4 flex-wrap"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 shape-circle bg-realco-blue" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                  {trustLine}
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

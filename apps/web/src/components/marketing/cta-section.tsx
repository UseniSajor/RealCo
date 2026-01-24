"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket } from "lucide-react"
import { motion } from "framer-motion"

interface CTAButton {
  label: string
  href: string
  variant?: "default" | "outline" | "ghost"
}

interface CTASectionProps {
  title: string
  subtitle: string
  buttons: CTAButton[]
}

export function CTASection({ title, subtitle, buttons }: CTASectionProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-realco-blue via-realco-navy to-realco-orange relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-64 h-64 shape-circle bg-white/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 shape-circle bg-realco-orange/20 blur-3xl" />
      
      <div className="container max-w-6xl px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 shape-circle bg-white/20 backdrop-blur flex items-center justify-center">
              <Rocket className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            {title}
          </h2>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-medium">
            {subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {buttons.map((button, index) => (
              <Link key={index} href={button.href}>
                <Button
                  size="lg"
                  variant={button.variant || "default"}
                  className={`
                    min-w-[220px] h-14 shape-oval font-bold transition-all hover:scale-105
                    ${button.variant === "outline" 
                      ? "border-2 border-white text-white hover:bg-white hover:text-realco-navy" 
                      : button.variant === "ghost"
                      ? "text-white hover:bg-white/20"
                      : "bg-white text-realco-navy hover:bg-gray-100 shadow-xl"
                    }
                  `}
                >
                  {button.label}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

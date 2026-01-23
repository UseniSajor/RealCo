"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface CTASectionProps {
  title: string
  subtitle?: string
  buttons: Array<{ label: string; href: string; variant?: "default" | "secondary" | "outline" }>
}

export function CTASection({ title, subtitle, buttons }: CTASectionProps) {
  return (
    <section className="py-24 gradient-hero">
      <div className="container max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xl text-white/90 mb-8">
              {subtitle}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {buttons.map((button, index) => (
              <Button
                key={index}
                size="lg"
                variant={button.variant || "default"}
                asChild
                className={button.variant === "outline" 
                  ? "bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white hover:text-[#2C3E50]"
                  : ""
                }
              >
                <Link href={button.href}>{button.label}</Link>
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

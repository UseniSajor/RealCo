"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface FeatureGridProps {
  title: string
  subtitle?: string
  items: string[]
  columns?: 1 | 2
}

export function FeatureGrid({ title, subtitle, items, columns = 2 }: FeatureGridProps) {
  const gridCols = columns === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
  
  return (
    <section className="py-24">
      <div className="container max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-muted-foreground">{subtitle}</p>}
        </motion.div>

        <div className={`grid ${gridCols} gap-6`}>
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border-4 border-[#E07A47] hover:border-[#D96835] transition-all duration-300 hover:shadow-xl hover:shadow-[#E07A47]/20"
            >
              <CheckCircle2 className="h-6 w-6 text-[#E07A47] flex-shrink-0 mt-1" />
              <p className="text-base font-medium text-foreground leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

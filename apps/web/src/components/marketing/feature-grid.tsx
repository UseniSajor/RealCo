"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

interface FeatureGridProps {
  title: string
  subtitle: string
  items: string[]
}

export function FeatureGrid({ title, subtitle, items }: FeatureGridProps) {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-realco-blue/5 dark:from-realco-gray dark:to-realco-navy/20">
      <div className="container max-w-6xl px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-realco-navy dark:text-white mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="shape-oval-lg border-2 border-transparent hover:border-realco-blue transition-all duration-300 hover:shadow-xl bg-white dark:bg-realco-gray-dark h-full group">
                <CardContent className="p-6 flex items-start gap-4">
                  {/* Check Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 shape-circle bg-gradient-realco flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* Text */}
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                    {item}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

const returnsData = [
  {
    assetClass: "Value-Add Multifamily",
    targetIRR: "~15–20%",
    equityMultiple: "~1.6x–2.0x",
    holdPeriod: "3–5 yrs",
  },
  {
    assetClass: "Ground-Up Development",
    targetIRR: "~18–25%",
    equityMultiple: "~1.8x–2.5x",
    holdPeriod: "2–4 yrs",
  },
  {
    assetClass: "Core / Core-Plus",
    targetIRR: "~10–15%",
    equityMultiple: "~1.4x–1.7x",
    holdPeriod: "5–10 yrs",
  },
]

export function ReturnsEducation() {
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            What investors typically target (educational ranges).
          </h2>
          <p className="text-xl text-muted-foreground">
            Understanding typical return expectations across asset classes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {returnsData.map((range, index) => (
            <motion.div
              key={range.assetClass}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 mb-4 rounded-xl gradient-secondary flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{range.assetClass}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 p-4 rounded-xl bg-muted">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Target IRR</span>
                      <span className="text-base font-black text-[#E07A47]">{range.targetIRR}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Equity Multiple</span>
                      <span className="text-base font-black text-[#56CCF2]">{range.equityMultiple}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Hold</span>
                      <span className="text-base font-semibold text-slate-600 dark:text-slate-400">{range.holdPeriod}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900"
        >
          <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
            <strong>Required disclosure:</strong> Past performance does not guarantee future results. 
            All investments carry risk, including loss of principal. Returns vary by sponsor, market, leverage, and execution.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

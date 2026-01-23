"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle2 } from "lucide-react"

const complianceItems = [
  "Structured workflows for private offerings (Reg D oriented)",
  "Verification workflows",
  "Deadline tracking",
  "Immutable activity logs",
]

export function ComplianceBlock() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-secondary flex items-center justify-center">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">Compliance-forward by design.</h2>
          <p className="text-xl text-muted-foreground">Built with regulatory requirements at the core</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {complianceItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border-2 border-border"
            >
              <CheckCircle2 className="h-6 w-6 text-[#E07A47] flex-shrink-0 mt-1" />
              <p className="text-base font-medium">{item}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-200 dark:border-amber-900"
        >
          <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold leading-relaxed">
            <strong>Important Disclosure:</strong> RealCo provides software and workflows, not legal/tax/investment advice. 
            Consult qualified professionals regarding your specific situation.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

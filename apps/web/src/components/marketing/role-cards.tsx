"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Wrench, ArrowRight } from "lucide-react"

const roles = [
  {
    icon: Building2,
    title: "Sponsors / Developers",
    description: "Raise capital and manage projects end-to-end",
    href: "/sponsors",
    features: [
      "Capital raise + investor portal",
      "Compliance workflows (Reg D)",
      "Construction tracking + payments",
      "Automated investor reporting"
    ]
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Invest in opportunities with full transparency",
    href: "/investors",
    features: [
      "Deal transparency + documents",
      "Secure digital onboarding",
      "Real-time project updates",
      "Automated distributions + K-1s"
    ]
  },
  {
    icon: Wrench,
    title: "Service Providers",
    description: "Partner with sponsors on deals",
    href: "/providers",
    features: [
      "Faster approvals + payments",
      "Digital workflows + lien waivers",
      "Payment tracking + billing",
      "Direct sponsor connections"
    ]
  },
]

export function RoleCards() {
  return (
      <section className="py-24 bg-muted/30">
      <div className="container max-w-6xl px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">Choose your role</h2>
          <p className="text-xl text-muted-foreground">Select the path that matches your needs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={role.href}>
                  <Card className="h-full cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{role.title}</CardTitle>
                      <CardDescription className="text-base">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-left space-y-2">
                        {role.features.map((feature, i) => (
                          <p key={i} className="text-sm text-muted-foreground">✓ {feature}</p>
                        ))}
                      </div>
                      <Button className="w-full group-hover:scale-105 transition-transform" size="lg">
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

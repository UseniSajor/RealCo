"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Wrench, CheckCircle2, ArrowRight } from "lucide-react"

export function RoleFeatures() {
  const roles = [
    {
      icon: Building2,
      title: "For Sponsors",
      subtitle: "Close deals faster with all-in-one platform",
      features: [
        "Digital subscriptions + e-signatures",
        "Reg D compliance workflows + Form D filing",
        "Automated investor portal + document distribution",
        "Real-time construction tracking + budget management",
        "Escrow-style milestone payments + lien waivers",
        "Waterfall distributions + K-1 preparation",
        "Audit trails + immutable activity logs",
      ],
      cta: "See Sponsor Features",
      href: "/sponsors",
      stat: { value: "$850M+", label: "Capital Raised" },
    },
    {
      icon: TrendingUp,
      title: "For Investors",
      subtitle: "Transparent access to every detail",
      features: [
        "Secure accreditation + identity verification",
        "Digital subscription documents + instant signing",
        "Real-time project updates + photo galleries",
        "Construction progress tracking + daily logs",
        "Automated distribution payments via ACH",
        "Tax document center + K-1 delivery",
        "Performance dashboard + IRR tracking",
      ],
      cta: "See Investor Features",
      href: "/investors",
      stat: { value: "12-18%", label: "Typical Target Returns" },
    },
    {
      icon: Wrench,
      title: "For Providers",
      subtitle: "Get paid faster, work smarter",
      features: [
        "Digital draw requests + progress photos",
        "Automated lien waiver generation",
        "Real-time approval status tracking",
        "ACH payments + payment history",
        "Commission tracking for brokers",
        "Compliance document management",
        "Mobile-friendly field updates",
      ],
      cta: "See Provider Features",
      href: "/providers",
      stat: { value: "15 Days", label: "Faster Payments" },
    },
  ]

  return (
    <section className="py-24">
      <div className="container max-w-7xl px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Built for Every Role in the Deal
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            One platform that serves sponsors, investors, and service providers with role-specific workflows
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="w-16 h-16 mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl mb-2">{role.title}</CardTitle>
                    <p className="text-sm text-muted-foreground font-semibold">{role.subtitle}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-3 mb-6 flex-1">
                      {role.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-[#E07A47] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-4 rounded-xl bg-muted mb-6">
                      <div className="text-3xl font-black text-[#56CCF2] mb-1">{role.stat.value}</div>
                      <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">{role.stat.label}</div>
                    </div>

                    <Link href={role.href} className="block">
                      <Button variant="outline" className="w-full group">
                        {role.cta}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

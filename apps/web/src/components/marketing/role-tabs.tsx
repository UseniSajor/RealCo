"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Wrench, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface RoleTabsProps {
  currentRole?: "sponsors" | "investors" | "providers"
}

const roles = [
  {
    id: "sponsors",
    icon: Building2,
    title: "Sponsors / Developers",
    description: "Raise capital and manage projects",
    href: "/sponsors",
    features: [
      "Capital raise + investor portal",
      "Compliance workflows (Reg D)",
      "Construction tracking",
      "Investor reporting"
    ]
  },
  {
    id: "investors",
    icon: TrendingUp,
    title: "Investors",
    description: "Invest with full transparency",
    href: "/investors",
    features: [
      "Deal documents + updates",
      "Secure onboarding",
      "Real-time project status",
      "Automated distributions"
    ]
  },
  {
    id: "providers",
    icon: Wrench,
    title: "Service Providers",
    description: "Partner with sponsors",
    href: "/providers",
    features: [
      "Faster approvals",
      "Digital workflows",
      "Payment tracking",
      "Direct connections"
    ]
  },
]

export function RoleTabs({ currentRole }: RoleTabsProps) {
  return (
    <section className="py-16 bg-muted/30 border-b-4 border-[#E07A47]">
      <div className="container max-w-6xl px-6 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            {currentRole ? "Explore Other Roles" : "Choose Your Role"}
          </h2>
          <p className="text-lg text-muted-foreground">
            {currentRole ? "See how RealCo works for other users" : "Select the option that best describes you"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon
            const isCurrent = currentRole === role.id
            
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={role.href}>
                  <Card 
                    className={`h-full cursor-pointer hover:shadow-2xl transition-all border-4 group ${
                      isCurrent 
                        ? 'border-[#56CCF2] shadow-lg shadow-[#56CCF2]/20 bg-[#56CCF2]/5' 
                        : 'hover:border-[#E07A47]'
                    }`}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform ${
                        isCurrent ? 'bg-[#56CCF2]' : 'gradient-primary'
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-xl">
                        {role.title}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-[#56CCF2] text-white px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-sm">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-left space-y-2">
                        {role.features.map((feature, i) => (
                          <p key={i} className="text-sm text-muted-foreground">✓ {feature}</p>
                        ))}
                      </div>
                      {!isCurrent && (
                        <Button className="w-full group-hover:scale-105 transition-transform" size="sm" variant="outline">
                          View {role.title}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                      {isCurrent && (
                        <div className="text-center pt-2">
                          <span className="text-sm font-semibold text-[#56CCF2]">You're viewing this role</span>
                        </div>
                      )}
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

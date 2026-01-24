"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Users, Wrench, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const roles = [
  {
    title: "Sponsors / Developers",
    icon: Building2,
    description: "Raise capital and manage projects end-to-end",
    features: [
      "Deal Pipeline Management",
      "Capital Formation (Reg D)",
      "Construction Tracking",
      "Investor Relations"
    ],
    href: "/sponsors",
    gradient: "from-realco-blue/10 to-realco-orange/10"
  },
  {
    title: "Fund Managers",
    icon: TrendingUp,
    description: "Manage assets and maximize returns",
    features: [
      "Portfolio Management",
      "NOI Optimization",
      "Distribution Processing",
      "Performance Analytics"
    ],
    href: "/fund-managers",
    gradient: "from-realco-orange/10 to-realco-navy/10"
  },
  {
    title: "Investors",
    icon: Users,
    description: "Discover deals and track your portfolio",
    features: [
      "Investment Opportunities",
      "Portfolio Dashboard",
      "Distribution History",
      "Tax Documents (K-1s)"
    ],
    href: "/investors",
    gradient: "from-realco-navy/10 to-realco-blue/10"
  },
  {
    title: "Service Providers",
    icon: Wrench,
    description: "Get paid faster with verified invoices",
    features: [
      "Vendor Portal",
      "Invoice Submission",
      "Payment Tracking",
      "Lien Waivers"
    ],
    href: "/providers",
    gradient: "from-realco-blue/10 to-realco-orange/10"
  }
]

export function RoleCards() {
  return (
    <section className="py-24 bg-white dark:bg-realco-gray">
      <div className="container max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-realco-navy dark:text-white mb-4">
            Choose your role
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Select the path that matches your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`shape-oval-lg border-4 border-transparent hover:border-realco-blue h-full group transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gradient-to-br ${role.gradient}`}>
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="w-16 h-16 shape-circle bg-gradient-realco flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-black text-realco-navy dark:text-white mb-3">
                      {role.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      {role.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {role.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="w-6 h-6 shape-circle bg-realco-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 shape-circle bg-white" />
                          </div>
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href={role.href}>
                      <Button className="w-full shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-bold h-12 group/btn">
                        Learn More
                        <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
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

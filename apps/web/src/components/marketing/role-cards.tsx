"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, TrendingUp, Wrench } from "lucide-react"

const roles = [
  {
    icon: Building2,
    title: "Sponsors",
    description: "Raise faster. Run projects. Report automatically.",
    href: "/sponsors",
  },
  {
    icon: TrendingUp,
    title: "Investors",
    description: "Transparency, documents, updates, distributions.",
    href: "/investors",
  },
  {
    icon: Wrench,
    title: "Providers",
    description: "Faster approvals, cleaner paperwork, predictable pay.",
    href: "/providers",
  },
]

export function RoleCards() {
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
          <h2 className="text-4xl md:text-5xl font-black mb-4">Choose your role</h2>
          <p className="text-xl text-muted-foreground">Select the path that matches your needs</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <Card className="h-full cursor-pointer group">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center">
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{role.title}</CardTitle>
                      <CardDescription className="text-base">{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Button variant="link" className="group-hover:translate-x-2 transition-transform">
                        Learn More →
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

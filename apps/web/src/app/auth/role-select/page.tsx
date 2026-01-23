"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, TrendingUp, Wrench, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RoleSelectPage() {
  const router = useRouter()

  const handleRoleSelect = (role: string, path: string) => {
    // In a real app, this would save the role to state/localStorage
    localStorage.setItem('userRole', role)
    router.push(path)
  }

  const roles = [
    {
      id: "sponsor",
      icon: Building2,
      title: "Sponsor / Developer",
      description: "Raise capital and manage projects end-to-end",
      path: "/dashboard/sponsor",
      features: [
        "Capital raise + investor portal",
        "Compliance workflows (Reg D)",
        "Construction tracking + payments",
        "Automated investor reporting"
      ]
    },
    {
      id: "investor",
      icon: TrendingUp,
      title: "Investor",
      description: "Invest in opportunities with full transparency",
      path: "/dashboard/investor",
      features: [
        "Deal transparency + documents",
        "Secure digital onboarding",
        "Real-time project updates",
        "Automated distributions + K-1s"
      ]
    },
    {
      id: "provider",
      icon: Wrench,
      title: "Service Provider",
      description: "Partner with sponsors on deals",
      path: "/dashboard/provider",
      features: [
        "Faster approvals + payments",
        "Digital workflows + lien waivers",
        "Payment tracking + billing",
        "Direct sponsor connections"
      ]
    },
  ]

  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="container max-w-6xl px-6 mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Choose Your Role</h1>
            <p className="text-xl text-muted-foreground">
              Select the option that best describes you to access your dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-5xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Card 
                  key={role.id}
                  className="cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group"
                  onClick={() => handleRoleSelect(role.id, role.path)}
                >
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
                      Access {role.title} Portal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Want to explore without choosing?{" "}
              <Link href="/dashboard" className="text-[#56CCF2] font-semibold hover:underline">
                View demo dashboards
              </Link>
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

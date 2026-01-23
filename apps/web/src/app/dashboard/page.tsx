"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, TrendingUp, Wrench, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  const roles = [
    {
      icon: Building2,
      title: "Sponsor Demo",
      description: "See how sponsors raise capital and manage projects",
      href: "/dashboard/sponsor",
      color: "text-[#E07A47]",
      features: [
        "Raise capital + manage deals",
        "Track construction progress",
        "Process draw requests",
        "Investor reporting dashboard"
      ]
    },
    {
      icon: TrendingUp,
      title: "Investor Demo",
      description: "Experience the investor portal and deal tracking",
      href: "/dashboard/investor",
      color: "text-[#56CCF2]",
      features: [
        "View investment portfolio",
        "Track deal performance",
        "Access documents + K-1s",
        "Distribution history"
      ]
    },
    {
      icon: Wrench,
      title: "Provider Demo",
      description: "Explore contractor and service provider tools",
      href: "/dashboard/provider",
      color: "text-[#E07A47]",
      features: [
        "Submit invoices + draw requests",
        "Upload lien waivers",
        "Track payment status",
        "Project communication"
      ]
    },
  ]

  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="container max-w-6xl px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Choose Your Demo Portal</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Explore how RealCo works for each role with real sample data
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" asChild>
                <Link href="/contact">Book Full Demo</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Link key={role.title} href={role.href}>
                  <Card className="h-full cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group">
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform`}>
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
                        View Demo
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Info Section */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-white dark:bg-[#6b7280] border-4 border-[#56CCF2] shadow-lg">
              <h2 className="text-2xl font-black mb-4">No Login Required</h2>
              <p className="text-muted-foreground mb-6">
                All demo portals use sample data so you can explore the platform freely. 
                When you're ready, sign up for a free trial to see your own data.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/" className="text-[#56CCF2] font-semibold hover:underline">
                  ← Back to Home
                </Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                  Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { MediaViewer } from "@/components/media/MediaViewer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, TrendingUp, Wrench, Building, ArrowRight, Play, Users, DollarSign, BarChart3, FileText } from "lucide-react"

export default function DashboardPage() {
  const roles = [
    {
      icon: Building2,
      title: "Sponsor Portal",
      description: "Raise capital and manage real estate projects from acquisition to exit",
      href: "/dashboard/sponsor",
      gradient: "from-orange-500 to-red-500",
      color: "text-[#E07A47]",
      features: [
        "Property Search & Lead Management",
        "Deal Pipeline & Underwriting",
        "Capital Raising Tools",
        "Construction Management",
        "Investor Reporting Dashboard"
      ],
      stats: { projects: "8", capital: "$32.5M", investors: "342" }
    },
    {
      icon: TrendingUp,
      title: "Investor Portal",
      description: "Track portfolio performance, distributions, and access all investment documents",
      href: "/dashboard/investor",
      gradient: "from-blue-500 to-cyan-500",
      color: "text-[#56CCF2]",
      features: [
        "Real-Time Portfolio Analytics",
        "Investment Opportunities",
        "Distribution History",
        "Tax Documents (K-1s, 1099s)",
        "Performance Reporting"
      ],
      stats: { invested: "$2.5M", value: "$3.2M", deals: "12" }
    },
    {
      icon: Building,
      title: "Fund Manager",
      description: "Oversee multiple properties, manage investor relations, and automate reporting",
      href: "/dashboard/fund-manager",
      gradient: "from-purple-500 to-pink-500",
      color: "text-purple-500",
      features: [
        "Asset Management Dashboard",
        "Financial Reporting & P&L",
        "Distribution Processing",
        "Investor Communications",
        "Portfolio Analytics"
      ],
      stats: { properties: "24", aum: "$485M", investors: "1,247" }
    },
    {
      icon: Wrench,
      title: "Service Provider",
      description: "Submit invoices, track payments, and manage work across construction projects",
      href: "/dashboard/provider",
      gradient: "from-amber-500 to-orange-500",
      color: "text-[#E07A47]",
      features: [
        "Invoice Submission Portal",
        "Payment Tracking",
        "Lien Waiver Management",
        "Project Communication",
        "Compliance Documents"
      ],
      stats: { projects: "8", pending: "$284K", approved: "15" }
    },
  ]

  return (
    <>
      <MarketingNav />
      
      <section className="py-16 min-h-screen bg-muted/30">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-[#56CCF2] to-[#E07A47] bg-clip-text text-transparent">
              Choose Your Demo Portal
            </h1>
            <p className="text-xl text-muted-foreground mb-2">
              Experience RealCo from different perspectives with real sample data
            </p>
            <p className="text-md text-muted-foreground mb-8">
              No login required • Instant access • Full feature exploration
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">
                  <Users className="mr-2 h-5 w-5" />
                  Book Full Demo
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-[#56CCF2] to-[#E07A47] hover:opacity-90" asChild>
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Platform Overview Video */}
          <div className="mb-16">
            <MediaViewer
              type="video"
              src="/platform-overview.mp4"
              title="🎬 Welcome to RealCo - Platform Overview"
              description="Watch this 3-minute demo to see how RealCo transforms real estate syndication for sponsors, investors, and fund managers"
            />
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="border-4 border-[#56CCF2] text-center">
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-[#56CCF2] mx-auto mb-3" />
                <div className="text-4xl font-black mb-2">$520M+</div>
                <p className="text-muted-foreground">Capital Managed</p>
              </CardContent>
            </Card>
            <Card className="border-4 border-[#E07A47] text-center">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-[#E07A47] mx-auto mb-3" />
                <div className="text-4xl font-black mb-2">40+</div>
                <p className="text-muted-foreground">Active Properties</p>
              </CardContent>
            </Card>
            <Card className="border-4 border-[#56CCF2] text-center">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-[#56CCF2] mx-auto mb-3" />
                <div className="text-4xl font-black mb-2">1,600+</div>
                <p className="text-muted-foreground">Active Investors</p>
              </CardContent>
            </Card>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Link key={role.title} href={role.href} className="group">
                  <Card className="h-full border-4 hover:border-[#E07A47] transition-all hover:shadow-2xl">
                    <CardHeader>
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center transform group-hover:scale-110 transition-transform flex-shrink-0`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2 group-hover:text-[#E07A47] transition-colors">
                            {role.title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {role.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Key Stats */}
                      <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-muted/50">
                        {Object.entries(role.stats).map(([key, value], i) => (
                          <div key={i} className="text-center">
                            <div className="text-2xl font-black">{value}</div>
                            <div className="text-xs text-muted-foreground capitalize">{key}</div>
                          </div>
                        ))}
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        {role.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm">
                            <div className={`w-2 h-2 rounded-full ${role.color === 'text-[#E07A47]' ? 'bg-[#E07A47]' : role.color === 'text-[#56CCF2]' ? 'bg-[#56CCF2]' : 'bg-purple-500'}`}></div>
                            <span className="text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA Button */}
                      <Button className="w-full group-hover:scale-105 transition-transform" size="lg">
                        Explore {role.title}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Platform Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-black text-center mb-12">
              Everything You Need in One Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-4 border-[#56CCF2] text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-[#56CCF2]/10 flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-8 w-8 text-[#56CCF2]" />
                  </div>
                  <CardTitle>Real-Time Analytics</CardTitle>
                  <CardDescription>
                    Live dashboards with property performance, investor metrics, and portfolio tracking
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-4 border-[#E07A47] text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-[#E07A47]/10 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="h-8 w-8 text-[#E07A47]" />
                  </div>
                  <CardTitle>Integrated Payments</CardTitle>
                  <CardDescription>
                    Automated distributions, ACH transfers, and compliance with Plaid & Stripe integration
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-4 border-[#56CCF2] text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-[#56CCF2]/10 flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-8 w-8 text-[#56CCF2]" />
                  </div>
                  <CardTitle>Document Management</CardTitle>
                  <CardDescription>
                    Centralized storage for K-1s, operating agreements, and all investment documents
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center max-w-3xl mx-auto">
            <Card className="border-4 border-[#56CCF2] shadow-lg">
              <CardContent className="p-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center mx-auto mb-6">
                  <Play className="h-10 w-10 text-white ml-1" />
                </div>
                <h2 className="text-3xl font-black mb-4">No Login Required</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  All demo portals use sample data so you can explore the platform freely. 
                  Each role has its own dashboard with full features and realistic data.
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  When you're ready to use RealCo with your own data, sign up for a free trial. 
                  No credit card required.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Link href="/" className="text-[#56CCF2] font-semibold hover:underline text-lg">
                    ← Back to Home
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline text-lg">
                    Sign In →
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/contact" className="text-[#56CCF2] font-semibold hover:underline text-lg">
                    Contact Sales
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

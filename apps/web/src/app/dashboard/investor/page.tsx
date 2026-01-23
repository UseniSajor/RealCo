"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertCircle,
  PieChart,
  Download
} from "lucide-react"

export default function InvestorDashboardPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-12 min-h-screen bg-muted/30">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="h-8 w-8 text-[#56CCF2]" />
                  <h1 className="text-4xl font-black">Investor Portal</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Demo Portal - John Smith
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard">Switch Role</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Start Trial</Link>
                </Button>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="bg-[#56CCF2]/10 border-2 border-[#56CCF2] rounded-xl p-4 flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-[#56CCF2] mt-0.5" />
              <div>
                <p className="font-bold text-[#56CCF2]">Investor Demo Portal</p>
                <p className="text-sm text-muted-foreground">
                  This is how RealCo looks for investors tracking their investments.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Invested
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$2.5M</div>
                <p className="text-xs text-muted-foreground mt-1">Across 12 deals</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Current Value
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$3.2M</div>
                <p className="text-xs text-green-600 mt-1">+28% unrealized gain</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Distributions (YTD)
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$187K</div>
                <p className="text-xs text-muted-foreground mt-1">7.5% cash yield</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Active Deals
                  </CardTitle>
                  <PieChart className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">12</div>
                <p className="text-xs text-muted-foreground mt-1">3 pending funding</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Investment Portfolio */}
            <Card className="lg:col-span-2 border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Your Investment Portfolio
                </CardTitle>
                <CardDescription>Real estate investments and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: "Sunset Apartments", 
                      location: "Austin, TX", 
                      invested: "$250K", 
                      currentValue: "$285K",
                      return: "+14%",
                      distributions: "$18.5K",
                      status: "Under Construction",
                      statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]"
                    },
                    { 
                      name: "Downtown Office Tower", 
                      location: "Denver, CO", 
                      invested: "$500K", 
                      currentValue: "$675K",
                      return: "+35%",
                      distributions: "$45K",
                      status: "Performing",
                      statusColor: "bg-green-500/20 text-green-600"
                    },
                    { 
                      name: "Riverside Condos", 
                      location: "Portland, OR", 
                      invested: "$150K", 
                      currentValue: "$168K",
                      return: "+12%",
                      distributions: "$9.8K",
                      status: "Under Construction",
                      statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]"
                    },
                  ].map((investment, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 border-2 border-slate-200 dark:border-[#E07A47] hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{investment.name}</h4>
                          <p className="text-sm text-muted-foreground">{investment.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${investment.statusColor}`}>
                          {investment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Invested</p>
                          <p className="font-bold">{investment.invested}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Current Value</p>
                          <p className="font-bold">{investment.currentValue}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Return</p>
                          <p className="font-bold text-green-600">{investment.return}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Distributions</p>
                          <p className="font-bold">{investment.distributions}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Investor tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Browse Opportunities
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Documents
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download K-1s
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Distribution History
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <PieChart className="mr-2 h-4 w-4" />
                  Performance Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* New Opportunities */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  New Investment Opportunities
                </CardTitle>
                <CardDescription>Deals accepting capital</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Marina Bay Apartments", location: "San Diego, CA", target: "$12M", min: "$50K", irr: "15-18%", type: "Multifamily" },
                    { name: "Tech Park Office", location: "Seattle, WA", target: "$25M", min: "$100K", irr: "18-22%", type: "Office" },
                    { name: "Suburban Storage", location: "Phoenix, AZ", target: "$8M", min: "$25K", irr: "12-15%", type: "Self-Storage" },
                  ].map((opp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 border-2 border-slate-200 dark:border-[#E07A47] hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold">{opp.name}</h4>
                          <p className="text-xs text-muted-foreground">{opp.location}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#E07A47]/20 text-[#E07A47]">
                          {opp.type}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                        <div>
                          <p className="text-muted-foreground">Target</p>
                          <p className="font-bold">{opp.target}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min. Invest</p>
                          <p className="font-bold">{opp.min}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Target IRR</p>
                          <p className="font-bold text-green-600">{opp.irr}</p>
                        </div>
                      </div>
                      <Button className="w-full mt-3" size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Updates from your investments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Distribution received", detail: "$12,500 from Downtown Office Tower", time: "2d ago", icon: DollarSign, color: "text-green-500" },
                    { action: "Project update", detail: "Sunset Apartments Phase 1 complete", time: "4d ago", icon: AlertCircle, color: "text-[#56CCF2]" },
                    { action: "Document available", detail: "Q4 2025 financial report ready", time: "1w ago", icon: FileText, color: "text-blue-500" },
                    { action: "K-1 ready", detail: "Tax documents for 2025 available", time: "2w ago", icon: Download, color: "text-[#E07A47]" },
                    { action: "Milestone achieved", detail: "Riverside Condos 50% pre-sold", time: "3w ago", icon: CheckCircle2, color: "text-green-500" },
                  ].map((activity, i) => {
                    const Icon = activity.icon
                    return (
                      <div key={i} className="flex items-start gap-3 p-2">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.detail}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                      </div>
                    )
                  })}
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

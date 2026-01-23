"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Building2, 
  TrendingUp, 
  Wrench, 
  DollarSign, 
  Users, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3
} from "lucide-react"

export default function DashboardPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-12 min-h-screen bg-muted/30">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                  Welcome to RealCo Demo Platform
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/contact">Book a Demo</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Start Free Trial</Link>
                </Button>
              </div>
            </div>
            
            {/* Demo Notice */}
            <div className="bg-[#56CCF2]/10 border-2 border-[#56CCF2] rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-[#56CCF2] mt-0.5" />
              <div>
                <p className="font-bold text-[#56CCF2]">Demo Mode</p>
                <p className="text-sm text-muted-foreground">
                  You're viewing a demo dashboard with sample data. Sign up for a free trial to access the full platform.
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
                    Active Deals
                  </CardTitle>
                  <Building2 className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">12</div>
                <p className="text-xs text-muted-foreground mt-1">+3 this month</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Capital
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$45.2M</div>
                <p className="text-xs text-muted-foreground mt-1">Across all deals</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Investors
                  </CardTitle>
                  <Users className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">847</div>
                <p className="text-xs text-muted-foreground mt-1">+52 this quarter</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Distributions
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$2.3M</div>
                <p className="text-xs text-muted-foreground mt-1">Last quarter</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Deals */}
            <Card className="lg:col-span-2 border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Recent Deals
                </CardTitle>
                <CardDescription>Your active real estate projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sunset Apartments", location: "Austin, TX", raised: "$8.5M", target: "$10M", status: "Raising" },
                    { name: "Downtown Office Tower", location: "Denver, CO", raised: "$15M", target: "$15M", status: "Construction" },
                    { name: "Riverside Condos", location: "Portland, OR", raised: "$6.2M", target: "$8M", status: "Raising" },
                  ].map((deal, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all border-2 border-slate-200 dark:border-[#E07A47]">
                      <div className="flex-1">
                        <h4 className="font-bold">{deal.name}</h4>
                        <p className="text-sm text-muted-foreground">{deal.location}</p>
                      </div>
                      <div className="text-right mr-6">
                        <p className="font-bold text-sm">{deal.raised} / {deal.target}</p>
                        <p className="text-xs text-muted-foreground">Capital Raised</p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          deal.status === "Construction" 
                            ? "bg-[#56CCF2]/20 text-[#56CCF2]" 
                            : "bg-[#E07A47]/20 text-[#E07A47]"
                        }`}>
                          {deal.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" variant="outline">
                  View All Deals
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Create New Deal
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Investors
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Process Distribution
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Wrench className="mr-2 h-4 w-4" />
                  Manage Providers
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <Card className="mt-8 border-4 border-[#E07A47]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates across your deals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { icon: CheckCircle2, color: "text-green-500", action: "Investor commitment received", detail: "John Smith committed $250K to Sunset Apartments", time: "2 hours ago" },
                  { icon: FileText, color: "text-blue-500", action: "Document signed", detail: "Subscription agreement signed by Sarah Johnson", time: "5 hours ago" },
                  { icon: DollarSign, color: "text-[#56CCF2]", action: "Distribution processed", detail: "$125K distributed to Downtown Office Tower investors", time: "1 day ago" },
                  { icon: Users, color: "text-[#E07A47]", action: "New investor onboarded", detail: "Michael Chen completed accreditation verification", time: "2 days ago" },
                  { icon: Building2, color: "text-purple-500", action: "Construction milestone", detail: "Riverside Condos Phase 1 completed", time: "3 days ago" },
                ].map((activity, i) => {
                  const Icon = activity.icon
                  return (
                    <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all">
                      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.detail}</p>
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {activity.time}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="mt-12 text-center p-12 rounded-2xl bg-gradient-hero border-4 border-[#E07A47]">
            <h2 className="text-3xl font-black text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              This is just a preview. Sign up for a free trial to access the full platform with real data and all features.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" variant="outline" className="bg-white text-[#2C3E50] hover:bg-white/90" asChild>
                <Link href="/contact">Book a Demo</Link>
              </Button>
              <Button size="lg" className="bg-[#2C3E50] text-white hover:bg-[#2C3E50]/90" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

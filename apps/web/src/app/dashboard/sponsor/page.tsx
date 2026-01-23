"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Building2, 
  Users, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Hammer,
  AlertTriangle,
  CreditCard,
  BarChart3,
  Calculator,
  Target,
  Search,
  UserPlus,
  MapPin
} from "lucide-react"

export default function SponsorDashboardPage() {
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
                  <Building2 className="h-8 w-8 text-[#E07A47]" />
                  <h1 className="text-4xl font-black">Sponsor Dashboard</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Demo Portal - Acme Development Group
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
            <div className="bg-[#E07A47]/10 border-2 border-[#E07A47] rounded-xl p-4 flex items-start gap-3">
              <Building2 className="h-5 w-5 text-[#E07A47] mt-0.5" />
              <div>
                <p className="font-bold text-[#E07A47]">Sponsor Demo Portal</p>
                <p className="text-sm text-muted-foreground">
                  This is how RealCo looks for sponsors raising capital and managing projects.
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
                    Active Projects
                  </CardTitle>
                  <Building2 className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">8</div>
                <p className="text-xs text-muted-foreground mt-1">2 raising, 6 in construction</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Capital Raised
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$32.5M</div>
                <p className="text-xs text-muted-foreground mt-1">Target: $38M (85%)</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Investors
                  </CardTitle>
                  <Users className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">342</div>
                <p className="text-xs text-muted-foreground mt-1">18 pending onboarding</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Pending Tasks
                  </CardTitle>
                  <AlertTriangle className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">7</div>
                <p className="text-xs text-muted-foreground mt-1">3 urgent, 4 normal</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Active Deals */}
            <Card className="lg:col-span-2 border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Your Deals in Progress
                </CardTitle>
                <CardDescription>Capital raising and construction projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: "Sunset Apartments", 
                      location: "Austin, TX", 
                      raised: "$8.5M", 
                      target: "$10M", 
                      percent: 85,
                      investors: 127,
                      status: "Raising Capital",
                      statusColor: "bg-[#E07A47]/20 text-[#E07A47]"
                    },
                    { 
                      name: "Downtown Office Tower", 
                      location: "Denver, CO", 
                      raised: "$15M", 
                      target: "$15M", 
                      percent: 100,
                      investors: 183,
                      status: "Under Construction",
                      statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]"
                    },
                    { 
                      name: "Riverside Condos", 
                      location: "Portland, OR", 
                      raised: "$6.2M", 
                      target: "$8M", 
                      percent: 78,
                      investors: 89,
                      status: "Raising Capital",
                      statusColor: "bg-[#E07A47]/20 text-[#E07A47]"
                    },
                  ].map((deal, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 border-2 border-slate-200 dark:border-[#E07A47] hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{deal.name}</h4>
                          <p className="text-sm text-muted-foreground">{deal.location}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${deal.statusColor}`}>
                          {deal.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-semibold">{deal.raised} / {deal.target}</span>
                            <span className="text-muted-foreground">{deal.percent}%</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#56CCF2]" 
                              style={{ width: `${deal.percent}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {deal.investors} investors
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
                <CardDescription>Deal sourcing & management tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deal Sourcing</p>
                  <Button className="w-full justify-start bg-[#56CCF2] hover:bg-[#56CCF2]/90 text-white" asChild>
                    <Link href="/dashboard/sponsor/property-search">
                      <Search className="mr-2 h-4 w-4" />
                      Property Search
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/sponsor/leads">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Lead Management
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/sponsor/market-research">
                      <MapPin className="mr-2 h-4 w-4" />
                      Market Research
                    </Link>
                  </Button>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Deal Management</p>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/sponsor/deal-pipeline">
                      <Target className="mr-2 h-4 w-4" />
                      Deal Pipeline
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/sponsor/underwriting">
                      <Calculator className="mr-2 h-4 w-4" />
                      Underwriting
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/sponsor/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analytics
                    </Link>
                  </Button>
                </div>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/sponsor/capital-raised">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Capital Raised
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/sponsor/distributions">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Distributions
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/sponsor/draw-request">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Request Draw
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/sponsor/construction">
                    <Hammer className="mr-2 h-4 w-4" />
                    Construction Dashboard
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Investors
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Tasks */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Pending Tasks
                </CardTitle>
                <CardDescription>Items requiring your attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { task: "Review subscription agreement", deal: "Sunset Apartments", priority: "Urgent", icon: FileText, color: "text-red-500" },
                    { task: "Approve draw request ($125K)", deal: "Downtown Office Tower", priority: "Urgent", icon: DollarSign, color: "text-red-500" },
                    { task: "Send Q4 investor update", deal: "Riverside Condos", priority: "Urgent", icon: TrendingUp, color: "text-red-500" },
                    { task: "Review budget variance", deal: "Sunset Apartments", priority: "Normal", icon: AlertCircle, color: "text-[#E07A47]" },
                  ].map((item, i) => {
                    const Icon = item.icon
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${item.color}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm">{item.task}</p>
                          <p className="text-xs text-muted-foreground">{item.deal}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.priority === "Urgent" ? "bg-red-100 text-red-600" : "bg-[#E07A47]/20 text-[#E07A47]"
                        }`}>
                          {item.priority}
                        </span>
                      </div>
                    )
                  })}
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
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Investor commitment", detail: "Sarah Chen committed $500K", time: "1h ago", icon: CheckCircle2, color: "text-green-500" },
                    { action: "Document signed", detail: "Subscription agreement executed", time: "3h ago", icon: FileText, color: "text-blue-500" },
                    { action: "Draw approved", detail: "$250K released for construction", time: "5h ago", icon: DollarSign, color: "text-[#56CCF2]" },
                    { action: "Milestone complete", detail: "Phase 1 foundation completed", time: "1d ago", icon: Hammer, color: "text-[#E07A47]" },
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

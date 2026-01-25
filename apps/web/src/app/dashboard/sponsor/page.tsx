"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { MediaViewer, MediaGallery } from "@/components/media/MediaViewer"
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
  BarChart3,
  Calculator,
  Target,
  Search,
  UserPlus,
  MapPin,
  Home,
  Briefcase,
  MessageSquare,
  Settings,
  HardHat,
  ClipboardList,
  Camera,
  FileQuestion,
  Receipt,
  Workflow,
  Zap,
  ArrowRight,
  Shield,
  LineChart
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SponsorDashboardPage() {
  const { user, logout } = useAuth()

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development Group"}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Welcome Back, Sponsor!</h1>
                <p className="text-lg text-muted-foreground">
                  Here's what's happening with your projects today
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/sponsor/deal-pipeline">
                    <Target className="mr-2 h-4 w-4" />
                    Pipeline
                  </Link>
                </Button>
                <Button className="bg-[#E07A47] hover:bg-[#D96835]" asChild>
                  <Link href="/dashboard/sponsor/construction">
                    <HardHat className="mr-2 h-4 w-4" />
                    Construction Hub
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Workflow Actions */}
            <div className="bg-gradient-to-r from-[#56CCF2]/5 via-white to-[#E07A47]/5 border-2 border-[#E07A47] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center">
                    <Workflow className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Automated Workflows Active</h3>
                    <p className="text-sm text-muted-foreground">5 processes running • 3 pending approvals</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="automation-badge">
                    <Zap className="h-3 w-3" />
                    Auto-Processing
                  </span>
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Workflows
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-4 border-[#E07A47] hover:shadow-xl transition-all stat-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Active Projects
                  </CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-[#E07A47]/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-[#E07A47]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">8</div>
                <p className="text-xs text-muted-foreground">2 raising, 6 in construction</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 status-dot"></div>
                    <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                      +2 this quarter
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2] hover:shadow-xl transition-all stat-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Capital Raised
                  </CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#56CCF2]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">$32.5M</div>
                <p className="text-xs text-muted-foreground">Target: $38M total</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold">85% Complete</span>
                    <span className="text-xs text-muted-foreground">$5.5M to go</span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full progress-gradient" style={{ width: "85%" }} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2] hover:shadow-xl transition-all stat-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Total Investors
                  </CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#56CCF2]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">342</div>
                <p className="text-xs text-muted-foreground">18 pending onboarding</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E07A47]"></div>
                    <span className="text-xs text-[#E07A47] font-semibold">
                      Avg investment: $95K
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47] hover:shadow-xl transition-all stat-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Pending Tasks
                  </CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">7</div>
                <p className="text-xs text-muted-foreground">3 urgent, 4 normal</p>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/sponsor/issues">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      View All Tasks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Construction Quick Access Panel */}
          <div className="mb-8">
            <div className="section-header mb-4">
              <h2 className="text-2xl font-black">Construction Management Hub</h2>
              <p className="text-muted-foreground">Quick access to all construction operations</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { title: "Daily Logs", href: "/dashboard/sponsor/daily-logs", icon: ClipboardList, count: "Today", color: "bg-[#56CCF2]" },
                { title: "Draw Requests", href: "/dashboard/sponsor/draw-request", icon: Receipt, count: "3 Pending", color: "bg-[#E07A47]" },
                { title: "RFIs", href: "/dashboard/sponsor/rfis", icon: FileQuestion, count: "5 Open", color: "bg-purple-500" },
                { title: "Submittals", href: "/dashboard/sponsor/submittals", icon: FileText, count: "8 Review", color: "bg-teal-500" },
                { title: "Photo Gallery", href: "/dashboard/sponsor/photos", icon: Camera, count: "156 Photos", color: "bg-blue-500" },
                { title: "Punch List", href: "/dashboard/sponsor/punch-list", icon: CheckCircle2, count: "12 Items", color: "bg-green-500" },
              ].map((item, i) => {
                const Icon = item.icon
                return (
                  <Link key={i} href={item.href}>
                    <Card className="border-3 border-[#E07A47] hover:shadow-xl hover:scale-105 transition-all cursor-pointer h-full">
                      <CardContent className="p-4 text-center">
                        <div className={`w-12 h-12 mx-auto rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.count}</p>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Active Deals */}
            <Card className="lg:col-span-2 border-4 border-[#E07A47]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Your Deals in Progress
                    </CardTitle>
                    <CardDescription>Capital raising and construction projects</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/sponsor/deal-pipeline">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sunset Apartments",
                      location: "Austin, TX",
                      type: "Multifamily",
                      raised: "$8.5M",
                      target: "$10M",
                      percent: 85,
                      investors: 127,
                      status: "Raising Capital",
                      statusColor: "bg-[#E07A47]/20 text-[#E07A47]",
                      updated: "2 hours ago"
                    },
                    {
                      name: "Downtown Office Tower",
                      location: "Denver, CO",
                      type: "Commercial",
                      raised: "$15M",
                      target: "$15M",
                      percent: 100,
                      investors: 183,
                      status: "Under Construction",
                      statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]",
                      updated: "1 day ago"
                    },
                    {
                      name: "Riverside Condos",
                      location: "Portland, OR",
                      type: "Residential",
                      raised: "$6.2M",
                      target: "$8M",
                      percent: 78,
                      investors: 89,
                      status: "Raising Capital",
                      statusColor: "bg-[#E07A47]/20 text-[#E07A47]",
                      updated: "5 hours ago"
                    },
                  ].map((deal, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:shadow-xl hover:border-[#E07A47] transition-all group cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-xl">{deal.name}</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                              {deal.type}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {deal.location}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${deal.statusColor}`}>
                          {deal.status}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-bold text-lg">{deal.raised} <span className="text-sm text-muted-foreground font-normal">/ {deal.target}</span></span>
                            <span className="text-[#56CCF2] font-black text-lg">{deal.percent}%</span>
                          </div>
                          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full progress-gradient transition-all"
                              style={{ width: `${deal.percent}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{deal.investors}</span> investors
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Updated {deal.updated}
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1" variant="outline">
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1 bg-[#E07A47] hover:bg-[#E07A47]/90">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Manage
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats & Info */}
            <div className="space-y-6">
              {/* Pending Tasks */}
              <Card className="border-4 border-[#E07A47]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Urgent Tasks
                  </CardTitle>
                  <CardDescription>Requires immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { task: "Review subscription docs", deal: "Sunset Apartments", icon: FileText, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/20" },
                      { task: "Approve draw ($125K)", deal: "Office Tower", icon: DollarSign, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/20" },
                      { task: "Send Q4 update", deal: "Riverside Condos", icon: TrendingUp, color: "text-[#E07A47]", bg: "bg-[#E07A47]/10" },
                    ].map((item, i) => {
                      const Icon = item.icon
                      return (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer quick-action">
                          <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0 ${item.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">{item.task}</p>
                            <p className="text-xs text-muted-foreground">{item.deal}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "New commitment", detail: "Sarah Chen - $500K", time: "1h", icon: CheckCircle2, color: "text-green-500" },
                      { action: "Document signed", detail: "Subscription agreement", time: "3h", icon: FileText, color: "text-blue-500" },
                      { action: "Draw approved", detail: "$250K construction", time: "5h", icon: DollarSign, color: "text-[#56CCF2]" },
                      { action: "Milestone hit", detail: "Foundation complete", time: "1d", icon: Hammer, color: "text-[#E07A47]" },
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
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Offerings Section */}
          <div className="mb-8">
            <div className="section-header mb-6">
              <h2 className="text-2xl font-black">Platform Services</h2>
              <p className="text-muted-foreground">Everything you need to succeed</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Capital Raise", description: "Streamlined fundraising with investor CRM", icon: TrendingUp, color: "text-[#56CCF2]", href: "/dashboard/sponsor/capital-raised" },
                { title: "Construction Mgmt", description: "Full project tracking & documentation", icon: HardHat, color: "text-[#E07A47]", href: "/dashboard/sponsor/construction" },
                { title: "Investor Relations", description: "Automated updates & communications", icon: Users, color: "text-purple-500", href: "/dashboard/sponsor/team" },
                { title: "Compliance & Docs", description: "SEC-ready documentation & audit trail", icon: Shield, color: "text-green-500", href: "/dashboard/sponsor/analytics" },
              ].map((service, i) => {
                const Icon = service.icon
                return (
                  <Link key={i} href={service.href}>
                    <Card className="service-card h-full hover:shadow-xl transition-all cursor-pointer">
                      <div className={`w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mb-4 ${service.color}`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="font-black text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio IRR</CardTitle>
                <CardDescription>Internal rate of return</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black metric-value-primary mb-2">14.2%</div>
                <p className="text-sm text-muted-foreground mb-4">Target: 12-15% annually</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">+2.1% vs target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="text-lg">Avg Hold Period</CardTitle>
                <CardDescription>Time to exit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black metric-value-secondary mb-2">3.2yr</div>
                <p className="text-sm text-muted-foreground mb-4">Target: 3-5 years</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-[#56CCF2]"></div>
                  <span className="text-[#56CCF2] font-semibold">Within target range</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="text-lg">Success Rate</CardTitle>
                <CardDescription>Profitable exits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-green-600 mb-2">96%</div>
                <p className="text-sm text-muted-foreground mb-4">24 of 25 deals profitable</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Industry leading</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

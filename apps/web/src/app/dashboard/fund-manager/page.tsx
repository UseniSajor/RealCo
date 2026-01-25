"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  DollarSign,
  FileText,
  BarChart3,
  Users,
  TrendingUp,
  Home,
  Calculator,
  Mail,
  Settings,
  PieChart,
  Briefcase,
  ArrowRight,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  Clock,
  LineChart
} from "lucide-react"
import { useEffect, useState } from "react"
import { portfolioAPI } from "@/lib/api/portfolio.api"
import { useAuth } from "@/lib/auth-context"

export default function FundManagerDashboardPage() {
  const { user, logout } = useAuth()

  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await portfolioAPI.getPortfolioSummary()
        setSummary(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio summary')
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/fund-manager", icon: Home },
    { title: "Properties", href: "/dashboard/fund-manager/properties", icon: Building2, badge: "24" },
    { title: "Analytics", href: "/dashboard/fund-manager/analytics", icon: BarChart3 },
    { title: "Financials", href: "/dashboard/fund-manager/reports", icon: Calculator },
    { title: "Distributions", href: "/dashboard/fund-manager/distributions", icon: DollarSign },
    { title: "Capital Accounts", href: "/dashboard/fund-manager/capital-accounts", icon: PieChart },
    { title: "Dispositions", href: "/dashboard/fund-manager/dispositions", icon: TrendingUp },
    { title: "Investor Relations", href: "/dashboard/fund-manager/communications", icon: Users },
    { title: "Reports", href: "/dashboard/fund-manager/reports", icon: FileText },
    { title: "Maintenance", href: "/dashboard/fund-manager/maintenance", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Fund Manager"
        roleIcon={Briefcase}
        userName={user?.name || "Elite Asset Management"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Fund Manager Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                  Manage assets, track performance, and report to investors
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/fund-manager/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button className="bg-[#E07A47] hover:bg-[#D96835]" asChild>
                  <Link href="/dashboard/fund-manager/distributions">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Process Distribution
                  </Link>
                </Button>
              </div>
            </div>

            {/* Fund Status Banner */}
            <div className="bg-gradient-to-r from-purple-500/5 via-white to-[#E07A47]/5 border-2 border-purple-500 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-[#E07A47] flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Portfolio Status: Strong Performance</h3>
                    <p className="text-sm text-muted-foreground">All funds above target IRR • Next distribution: Jan 31 • $5.9M scheduled</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="automation-badge">
                    <Zap className="h-3 w-3" />
                    Auto-Reports Active
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/fund-manager/reports">
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid (Live Data) */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-4 border-slate-200 animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-24 bg-slate-100 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border-2 border-red-200 mb-8">{error}</div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-4 border-purple-500 hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Properties</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.properties}</div>
                  <p className="text-xs text-muted-foreground">Across all markets</p>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 status-dot"></div>
                      <span className="text-xs text-green-600 font-semibold">All performing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Assets Under Mgmt</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-[#E07A47]/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#E07A47]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.currentValue)}</div>
                  <p className="text-xs text-muted-foreground">Current portfolio value</p>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-600 font-semibold">+18% YoY</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2] hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Total Investors</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-[#56CCF2]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.activeInvestments}</div>
                  <p className="text-xs text-muted-foreground">Active LPs</p>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#56CCF2]"></div>
                      <span className="text-xs text-[#56CCF2] font-semibold">98% retention</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Portfolio IRR</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.weightedAvgIRR}%</div>
                  <p className="text-xs text-green-600 font-semibold">Above target</p>
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600 font-bold">Top quartile</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Process Distribution", icon: DollarSign, href: "/dashboard/fund-manager/distributions", color: "bg-[#E07A47]" },
              { title: "Investor Reports", icon: FileText, href: "/dashboard/fund-manager/reports", color: "bg-purple-500" },
              { title: "Property Analytics", icon: BarChart3, href: "/dashboard/fund-manager/analytics", color: "bg-[#56CCF2]" },
              { title: "Communications", icon: Users, href: "/dashboard/fund-manager/communications", color: "bg-green-500" },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={i} href={action.href}>
                  <Card className="border-3 border-[#E07A47] hover:shadow-xl hover:scale-105 transition-all cursor-pointer h-full">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{action.title}</h4>
                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-4 border-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Performing Properties</CardTitle>
                    <CardDescription>Based on NOI and appreciation</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/fund-manager/properties">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Skyline Apartments", location: "Seattle, WA", noi: "$2.8M", appreciation: "+18%", occupancy: "98%" },
                    { name: "Harbor Plaza", location: "San Diego, CA", noi: "$3.2M", appreciation: "+22%", occupancy: "96%" },
                    { name: "Tech Hub Offices", location: "Austin, TX", noi: "$4.5M", appreciation: "+25%", occupancy: "100%" },
                  ].map((property, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:shadow-xl hover:border-purple-500 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-black text-lg">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                          {property.occupancy} Occupied
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Annual NOI</p>
                          <p className="font-bold text-lg">{property.noi}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Appreciation</p>
                          <p className="font-bold text-lg text-green-600">{property.appreciation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-4 border-[#E07A47]">
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Distributions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { fund: "Fund III", amount: "$2.8M", date: "Jan 15", investors: 245 },
                      { fund: "Fund II", amount: "$1.9M", date: "Jan 20", investors: 183 },
                      { fund: "Fund I", amount: "$1.2M", date: "Jan 25", investors: 142 },
                    ].map((dist, i) => (
                      <div key={i} className="p-3 rounded-xl hover:bg-muted/50 transition-all quick-action">
                        <div className="flex justify-between mb-2">
                          <p className="font-bold">{dist.fund}</p>
                          <p className="text-sm text-muted-foreground">{dist.date}</p>
                        </div>
                        <p className="text-2xl font-black text-[#E07A47] mb-1">{dist.amount}</p>
                        <p className="text-xs text-muted-foreground">{dist.investors} investors</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Portfolio Analytics */}
          <div className="mb-8">
            <div className="section-header mb-6">
              <h2 className="text-2xl font-black">Portfolio Performance Analytics</h2>
              <p className="text-muted-foreground">Track key metrics across all funds</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="text-lg">NOI Growth</CardTitle>
                  <CardDescription>Year-over-year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black metric-value-primary mb-2">+18.2%</div>
                  <p className="text-sm text-muted-foreground mb-4">Portfolio-wide increase</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-semibold">Exceeding targets</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47]">
                <CardHeader>
                  <CardTitle className="text-lg">Occupancy Rate</CardTitle>
                  <CardDescription>Across all properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black metric-value-secondary mb-2">96.8%</div>
                  <p className="text-sm text-muted-foreground mb-4">24 properties</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-semibold">Above market average</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500">
                <CardHeader>
                  <CardTitle className="text-lg">Equity Multiple</CardTitle>
                  <CardDescription>Realized + unrealized</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-green-600 mb-2">2.4x</div>
                  <p className="text-sm text-muted-foreground mb-4">Average across funds</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-semibold">Strong returns</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Investor Relations & Acquisitions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-4 border-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Investor Communications</CardTitle>
                    <CardDescription>Recent updates and engagement</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/fund-manager/communications">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Quarterly Report", recipients: "1,247 investors", date: "Jan 20", status: "Sent" },
                    { type: "Tax Document (K-1s)", recipients: "1,189 investors", date: "Jan 18", status: "Sent" },
                    { type: "Distribution Notice", recipients: "245 investors", date: "Jan 15", status: "Sent" },
                    { type: "Portfolio Update", recipients: "1,247 investors", date: "Jan 10", status: "Sent" },
                  ].map((comm, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:border-purple-300 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-sm mb-1">{comm.type}</h4>
                          <p className="text-xs text-muted-foreground">{comm.recipients}</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                          {comm.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{comm.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Active Acquisitions</CardTitle>
                    <CardDescription>Properties in due diligence</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/fund-manager/dispositions">
                      Pipeline
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { property: "Marina View Apartments", location: "San Francisco, CA", price: "$42.5M", status: "Under LOI", daysRemaining: 45 },
                    { property: "Innovation Office Park", location: "Austin, TX", price: "$28.3M", status: "Due Diligence", daysRemaining: 18 },
                    { property: "Lakeside Retail Center", location: "Denver, CO", price: "$15.8M", status: "Inspection Period", daysRemaining: 8 },
                  ].map((acq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:shadow-lg hover:border-[#E07A47] transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold mb-1">{acq.property}</h4>
                          <p className="text-xs text-muted-foreground">{acq.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#E07A47]">{acq.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs font-semibold text-blue-600">{acq.status}</span>
                        <span className="text-xs text-muted-foreground">{acq.daysRemaining} days remaining</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fund Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="text-sm">Distributions Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">$8.2M</div>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500">
              <CardHeader>
                <CardTitle className="text-sm">Capital Raised YTD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">$52M</div>
                <p className="text-xs text-green-600 font-semibold">+35% vs last year</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="text-sm">Active Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">5</div>
                <p className="text-xs text-muted-foreground">3 funds, 2 SPVs</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500">
              <CardHeader>
                <CardTitle className="text-sm">Investor Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">4.8/5</div>
                <p className="text-xs text-green-600 font-semibold">Based on surveys</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

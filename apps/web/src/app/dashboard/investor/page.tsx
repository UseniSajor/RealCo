"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  TrendingUp,
  DollarSign,
  FileText,
  PieChart,
  CreditCard,
  Download,
  Home,
  Calendar,
  Receipt,
  Settings,
  Bell,
  Building2,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Shield,
  LineChart,
  Target,
  Clock,
  Zap,
  BarChart3
} from "lucide-react"
import { useEffect, useState } from "react"
import { transactionsAPI } from "@/lib/api/transactions.api"
import { useAuth } from "@/lib/auth-context"

export default function InvestorDashboardPage() {
  const { user, logout } = useAuth()

  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await transactionsAPI.getTransactionSummary()
        setSummary(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load investment summary')
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
    { title: "Dashboard", href: "/dashboard/investor", icon: Home },
    { title: "Portfolio Analytics", href: "/dashboard/investor/portfolio-analytics", icon: PieChart },
    { title: "New Investments", href: "/dashboard/investor/invest", icon: TrendingUp },
    { title: "Transactions", href: "/dashboard/investor/transactions", icon: Receipt },
    { title: "Banking", href: "/dashboard/investor/banking", icon: CreditCard },
    { title: "Tax Center", href: "/dashboard/investor/tax-center", icon: FileText, badge: "K-1" },
    { title: "Documents", href: "/dashboard/investor/documents", icon: Download },
    { title: "Events", href: "/dashboard/investor/events", icon: Calendar },
    { title: "Notifications", href: "/dashboard/investor", icon: Bell, badge: "4" },
    { title: "Settings", href: "/dashboard/investor", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <DashboardSidebar
        items={sidebarItems}
        role="Investor Portal"
        roleIcon={TrendingUp}
        userName={user?.name || "John Smith"}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Your Investment Portfolio</h1>
                <p className="text-lg text-muted-foreground">
                  Track performance and manage your real estate investments
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href="/dashboard/investor/portfolio-analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics
                  </Link>
                </Button>
                <Button className="bg-[#E07A47] hover:bg-[#D96835]" asChild>
                  <Link href="/dashboard/investor/invest">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    New Investment
                  </Link>
                </Button>
              </div>
            </div>

            {/* Portfolio Status Banner */}
            <div className="bg-gradient-to-r from-[#56CCF2]/5 via-white to-[#E07A47]/5 border-2 border-[#E07A47] rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg">Portfolio Health: Excellent</h3>
                    <p className="text-sm text-muted-foreground">All investments performing above target • Next distribution: Jan 31</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="automation-badge">
                    <Zap className="h-3 w-3" />
                    Auto-Reinvest Active
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/investor/documents">
                      <FileText className="mr-2 h-4 w-4" />
                      Tax Documents
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
              <Card className="border-4 border-[#56CCF2] hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      Total Invested
                    </CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#56CCF2]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.totalInvested)}</div>
                  <p className="text-xs text-muted-foreground">{summary.transactionCount} investments</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 status-dot"></div>
                      <span className="text-xs text-green-600 font-semibold">Fully funded</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      Distributions
                    </CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.totalDistributions)}</div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Total received</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs text-green-600 font-bold">On schedule</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      Total Fees
                    </CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-[#E07A47]/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-[#E07A47]" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.totalFees)}</div>
                  <p className="text-xs text-muted-foreground">Management fees</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <div className="text-xs text-[#E07A47] font-semibold">
                      Industry-low fee structure
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-purple-500 hover:shadow-xl transition-all stat-card">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">
                      Pending Amount
                    </CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.pendingAmount)}</div>
                  <p className="text-xs text-muted-foreground">Awaiting deployment</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <Button size="sm" variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/investor/portfolio-analytics">
                        View Portfolio
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Quick Actions Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { title: "Download K-1s", icon: FileText, href: "/dashboard/investor/tax-center", color: "bg-[#56CCF2]" },
              { title: "View Distributions", icon: DollarSign, href: "/dashboard/investor/transactions", color: "bg-green-500" },
              { title: "Update Banking", icon: CreditCard, href: "/dashboard/investor/banking", color: "bg-[#E07A47]" },
              { title: "Browse Investments", icon: Target, href: "/dashboard/investor/invest", color: "bg-purple-500" },
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

          {/* Portfolio Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-4 border-[#56CCF2]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Investment Portfolio</CardTitle>
                    <CardDescription>Your active real estate investments</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/dashboard/investor/portfolio-analytics">
                      View Analytics
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Sunset Apartments", location: "Austin, TX", invested: "$250K", value: "$325K", gain: "+30%", gainColor: "text-green-600", status: "Active" },
                    { name: "Downtown Office Tower", location: "Denver, CO", invested: "$500K", value: "$620K", gain: "+24%", gainColor: "text-green-600", status: "Active" },
                    { name: "Riverside Condos", location: "Portland, OR", invested: "$300K", value: "$378K", gain: "+26%", gainColor: "text-green-600", status: "Active" },
                    { name: "Tech Campus", location: "Seattle, WA", invested: "$400K", value: "$485K", gain: "+21%", gainColor: "text-green-600", status: "Active" },
                  ].map((investment, i) => (
                    <div key={i} className="p-5 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:shadow-xl hover:border-[#56CCF2] transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-black text-lg mb-1">{investment.name}</h4>
                          <p className="text-sm text-muted-foreground">{investment.location}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                          {investment.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Invested</p>
                          <p className="font-bold">{investment.invested}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                          <p className="font-bold">{investment.value}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Gain</p>
                          <p className={`font-bold ${investment.gainColor}`}>{investment.gain}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {/* Recent Distributions */}
              <Card className="border-4 border-[#E07A47]">
                <CardHeader>
                  <CardTitle className="text-lg">Recent Distributions</CardTitle>
                  <CardDescription>Last 3 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { property: "Sunset Apartments", amount: "$8,250", date: "Dec 15", type: "Quarterly" },
                      { property: "Office Tower", amount: "$15,500", date: "Dec 10", type: "Quarterly" },
                      { property: "Riverside Condos", amount: "$6,800", date: "Dec 5", type: "Monthly" },
                    ].map((dist, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all quick-action">
                        <div className="w-10 h-10 rounded-xl bg-[#E07A47]/10 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-[#E07A47]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm">{dist.amount}</p>
                          <p className="text-xs text-muted-foreground">{dist.property}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-semibold">{dist.date}</p>
                          <p className="text-xs text-muted-foreground">{dist.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="text-lg">Investor Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/investor/tax-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Tax Center & K-1s
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/investor/banking">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Banking & Distributions
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/investor/documents">
                      <Download className="mr-2 h-4 w-4" />
                      Document Center
                    </Link>
                  </Button>
                  <Button className="w-full justify-start bg-[#E07A47] hover:bg-[#D96835]" asChild>
                    <Link href="/dashboard/investor/invest">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Explore Opportunities
                    </Link>
                  </Button>
                </CardContent>
              </Card>
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
                <div className="text-5xl font-black metric-value-primary mb-2">15.8%</div>
                <p className="text-sm text-muted-foreground mb-4">Since inception (Jan 2021)</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Above target</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="text-lg">Cash on Cash</CardTitle>
                <CardDescription>Annual return</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black metric-value-secondary mb-2">9.8%</div>
                <p className="text-sm text-muted-foreground mb-4">Average across portfolio</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">Strong performance</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="text-lg">Total Returns</CardTitle>
                <CardDescription>Appreciation + distributions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black text-green-600 mb-2">$945K</div>
                <p className="text-sm text-muted-foreground mb-4">Lifetime earnings</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">+37.8% total return</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

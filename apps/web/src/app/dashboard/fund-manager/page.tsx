"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Calendar,
  FileText,
  Target,
  Home,
  Key,
  Wrench,
  PiggyBank,
  Mail,
  Award,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

export default function FundManagerDashboard() {
  const { user } = useAuth()

  // Mock data for the dashboard
  const portfolioMetrics = {
    totalAssets: 23,
    totalUnits: 1847,
    avgOccupancy: 94.3,
    totalInvestors: 412,
    aum: 485000000, // Assets Under Management
    ytdNOI: 28400000,
  }

  const recentActivity = [
    { type: 'lease', message: 'New lease signed at Maple Heights #302', time: '2 hours ago' },
    { type: 'maintenance', message: 'HVAC repair completed at Oak Plaza', time: '5 hours ago' },
    { type: 'payment', message: 'Distribution processed: $2.4M to 89 investors', time: '1 day ago' },
    { type: 'report', message: 'Q1 2026 investor reports sent', time: '2 days ago' },
  ]

  const upcomingTasks = [
    { task: '12 lease renewals', due: 'This week', urgent: true },
    { task: 'Monthly operating statements', due: 'Due in 3 days', urgent: false },
    { task: 'Capital project: Roof replacement approval', due: 'Due in 5 days', urgent: false },
    { task: 'Investor annual meeting', due: 'March 15', urgent: false },
  ]

  const topPerformers = [
    { name: 'Riverside Apartments', noi: '$845K', occupancy: 98.2, growth: 12.4 },
    { name: 'Downtown Lofts', noi: '$720K', occupancy: 97.5, growth: 8.3 },
    { name: 'Parkside Townhomes', noi: '$580K', occupancy: 95.8, growth: 6.7 },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Asset & Fund Management</h1>
              <p className="text-white/80">Welcome back, {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-[#56CCF2] text-white text-lg px-4 py-2">
                {user?.tier?.toUpperCase()} TIER
              </Badge>
              <Button asChild variant="outline" className="bg-white text-[#2C3E50]">
                <Link href="/pricing">Upgrade Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Portfolio Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">Total Assets</p>
                  <p className="text-3xl font-black dark:text-white">{portfolioMetrics.totalAssets}</p>
                </div>
                <Building2 className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">Total Units</p>
                  <p className="text-3xl font-black dark:text-white">{portfolioMetrics.totalUnits.toLocaleString()}</p>
                </div>
                <Home className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">Avg Occupancy</p>
                  <p className="text-3xl font-black dark:text-white">{portfolioMetrics.avgOccupancy}%</p>
                </div>
                <Key className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">Investors</p>
                  <p className="text-3xl font-black dark:text-white">{portfolioMetrics.totalInvestors}</p>
                </div>
                <Users className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">AUM</p>
                  <p className="text-2xl font-black dark:text-white">
                    ${(portfolioMetrics.aum / 1000000).toFixed(1)}M
                  </p>
                </div>
                <PiggyBank className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-white/70 mb-1">YTD NOI</p>
                  <p className="text-2xl font-black dark:text-white">
                    ${(portfolioMetrics.ytdNOI / 1000000).toFixed(1)}M
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-[#E07A47]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Asset Operations (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl dark:text-white">Asset Operations</CardTitle>
                  <Building2 className="h-6 w-6 text-[#E07A47]" />
                </div>
                <CardDescription className="dark:text-white/80">
                  Manage properties, leases, and maintenance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/properties">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Properties</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        View all {portfolioMetrics.totalAssets} properties
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/leases">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Leases</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Manage leases & renewals
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/maintenance">
                      <div className="flex items-center gap-2 mb-2">
                        <Wrench className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Maintenance</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Track work orders & projects
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/financials">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Financials</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Operating statements & NOI
                      </p>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Fund Accounting */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl dark:text-white">Fund Accounting</CardTitle>
                  <DollarSign className="h-6 w-6 text-[#E07A47]" />
                </div>
                <CardDescription className="dark:text-white/80">
                  Investor capital accounts and distributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/capital-accounts">
                      <div className="flex items-center gap-2 mb-2">
                        <PiggyBank className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Capital Accounts</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Track investor positions
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/distributions">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Distributions</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Process waterfall payments
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/reports">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Reports</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Quarterly investor reports
                      </p>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47]">
                    <Link href="/dashboard/fund-manager/communications">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-5 w-5 text-[#E07A47]" />
                        <span className="font-bold">Communications</span>
                      </div>
                      <p className="text-sm text-muted-foreground text-left">
                        Investor updates & events
                      </p>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Assets */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <CardTitle className="text-2xl dark:text-white">Top Performing Assets</CardTitle>
                <CardDescription className="dark:text-white/80">Based on YTD NOI and occupancy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((property, index) => (
                    <div key={property.name} className="flex items-center justify-between p-4 bg-muted/50 dark:bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#E07A47] text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{property.name}</p>
                          <p className="text-sm text-muted-foreground dark:text-white/70">
                            {property.occupancy}% occupied
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold dark:text-white">{property.noi}</p>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowUpRight className="h-4 w-4" />
                          <span className="text-sm font-semibold">+{property.growth}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Activity & Tasks */}
          <div className="space-y-6">
            {/* Upcoming Tasks */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-white">Upcoming Tasks</CardTitle>
                  <Calendar className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTasks.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border-2 ${
                        item.urgent ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-600 bg-muted/50 dark:bg-slate-700'
                      }`}
                    >
                      <p className="font-semibold text-sm dark:text-white">{item.task}</p>
                      <p className="text-xs text-muted-foreground dark:text-white/70 mt-1">
                        {item.due}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <CardTitle className="dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                        activity.type === 'lease' ? 'bg-blue-500' :
                        activity.type === 'maintenance' ? 'bg-yellow-500' :
                        activity.type === 'payment' ? 'bg-green-500' :
                        'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium dark:text-white">{activity.message}</p>
                        <p className="text-xs text-muted-foreground dark:text-white/70">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Analytics */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-white">Portfolio Analytics</CardTitle>
                  <BarChart3 className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                  <Link href="/dashboard/fund-manager/analytics">
                    View Full Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Exit Management */}
            <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="dark:text-white">Exit Management</CardTitle>
                  <Target className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground dark:text-white/80 mb-4">
                  Manage property dispositions and exits
                </p>
                <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                  <Link href="/dashboard/fund-manager/dispositions">
                    View Dispositions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <Link href="/dashboard/fund-manager/properties/new">Add Property</Link>
              </Button>
              <Button asChild className="bg-[#E07A47] hover:bg-[#E07A47]/90">
                <Link href="/dashboard/fund-manager/reports/new">Generate Report</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-[#E07A47]">
                <Link href="/dashboard/fund-manager/communications/new">Send Update</Link>
              </Button>
              <Button asChild variant="outline" className="border-2 border-[#E07A47]">
                <Link href="/dashboard/fund-manager/distributions/new">Process Distribution</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

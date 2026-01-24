"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { MediaViewer } from "@/components/media/MediaViewer"
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
  Briefcase
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function FundManagerDashboardPage() {
  const { user, logout } = useAuth()

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/fund-manager", icon: Home },
    { title: "Properties", href: "/dashboard/fund-manager/properties", icon: Building2, badge: "24" },
    { title: "Analytics", href: "/dashboard/fund-manager/analytics", icon: BarChart3 },
    { title: "Financials", href: "/dashboard/fund-manager/financials", icon: Calculator },
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

      <main className="flex-1 ml-64 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Fund Manager Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                  Manage assets, track performance, and report to investors
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/fund-manager/distributions">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Process Distribution
                </Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500/10 to-[#E07A47]/10 border-2 border-purple-500 rounded-xl p-4 flex items-start gap-3">
              <Building2 className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-bold text-purple-600 dark:text-purple-400">🏢 Fund Manager Demo Portal</p>
                <p className="text-sm text-muted-foreground">
                  See how fund managers oversee portfolios, manage properties, and report performance to investors.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <MediaViewer
              type="video"
              src="/fund-manager-demo.mp4"
              title="🎬 Fund Management Overview"
              description="Learn how to manage $485M in assets, track property performance, and automate investor reporting"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-4 border-purple-500 hover:shadow-xl transition-all bg-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Properties</CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">24</div>
                <p className="text-xs text-muted-foreground">Across 8 markets</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47] hover:shadow-xl transition-all bg-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Assets Under Mgmt</CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-[#E07A47]/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-[#E07A47]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">$485M</div>
                <p className="text-xs text-muted-foreground">+12% YoY</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2] hover:shadow-xl transition-all bg-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Total Investors</CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-[#56CCF2]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">1,247</div>
                <p className="text-xs text-muted-foreground">Active LPs</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500 hover:shadow-xl transition-all bg-slate-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">Portfolio IRR</CardTitle>
                  <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black mb-1">11.2%</div>
                <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Above target</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-4 border-purple-500 bg-slate-50">
              <CardHeader>
                <CardTitle>Top Performing Properties</CardTitle>
                <CardDescription>Based on NOI and appreciation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Skyline Apartments", location: "Seattle, WA", noi: "$2.8M", appreciation: "+18%", occupancy: "98%" },
                    { name: "Harbor Plaza", location: "San Diego, CA", noi: "$3.2M", appreciation: "+22%", occupancy: "96%" },
                    { name: "Tech Hub Offices", location: "Austin, TX", noi: "$4.5M", appreciation: "+25%", occupancy: "100%" },
                  ].map((property, i) => (
                    <div key={i} className="p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-purple-500 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-black text-lg">{property.name}</h4>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/20 text-green-600">
                          {property.occupancy} Occupied
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 dark:border-slate-700">
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
              <Card className="border-4 border-[#E07A47] bg-slate-50">
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
                      <div key={i} className="p-3 rounded-xl hover:bg-muted/50">
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
            <h2 className="text-2xl font-black mb-6">Portfolio Performance Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">NOI Growth</CardTitle>
                  <CardDescription>Year-over-year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-[#56CCF2] mb-2">+18.2%</div>
                  <p className="text-sm text-muted-foreground mb-4">Portfolio-wide increase</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-semibold">Exceeding targets</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Occupancy Rate</CardTitle>
                  <CardDescription>Across all properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-5xl font-black text-[#E07A47] mb-2">96.8%</div>
                  <p className="text-sm text-muted-foreground mb-4">24 properties</p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-semibold">Above market average</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 bg-slate-50">
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

          {/* Investor Relations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border-4 border-purple-500 bg-slate-50">
              <CardHeader>
                <CardTitle>Investor Communications</CardTitle>
                <CardDescription>Recent updates and engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Quarterly Report", recipients: "1,247 investors", date: "Jan 20", status: "Sent" },
                    { type: "Tax Document (K-1s)", recipients: "1,189 investors", date: "Jan 18", status: "Sent" },
                    { type: "Distribution Notice", recipients: "245 investors", date: "Jan 15", status: "Sent" },
                    { type: "Portfolio Update", recipients: "1,247 investors", date: "Jan 10", status: "Sent" },
                  ].map((comm, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border-2 border-slate-200">
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

            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardHeader>
                <CardTitle>Active Acquisitions</CardTitle>
                <CardDescription>Properties in due diligence</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { property: "Marina View Apartments", location: "San Francisco, CA", price: "$42.5M", status: "Under LOI", daysRemaining: 45 },
                    { property: "Innovation Office Park", location: "Austin, TX", price: "$28.3M", status: "Due Diligence", daysRemaining: 18 },
                    { property: "Lakeside Retail Center", location: "Denver, CO", price: "$15.8M", status: "Inspection Period", daysRemaining: 8 },
                  ].map((acq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border-2 border-slate-200 hover:shadow-lg transition-all">
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
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">Distributions Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">$8.2M</div>
                <p className="text-xs text-muted-foreground">Last 12 months</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">Capital Raised YTD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">$52M</div>
                <p className="text-xs text-green-600 font-semibold">+35% vs last year</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardHeader>
                <CardTitle className="text-sm">Active Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black mb-1">5</div>
                <p className="text-xs text-muted-foreground">3 funds, 2 SPVs</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500 bg-slate-50">
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

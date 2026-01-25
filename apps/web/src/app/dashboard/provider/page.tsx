"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { MediaViewer } from "@/components/media/MediaViewer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Wrench, 
  DollarSign, 
  FileText, 
  CreditCard,
  CheckCircle2,
  Clock,
  Home,
  Upload,
  MessageSquare,
  Settings,
  Receipt,
  AlertCircle
} from "lucide-react"
import { useEffect, useState } from "react"
import { portfolioAPI } from "@/lib/api/portfolio.api"
import { useAuth } from "@/lib/auth-context"

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
    { title: "Dashboard", href: "/dashboard/provider", icon: Home },
    { title: "Vendor Portal", href: "/dashboard/provider/vendor-portal", icon: Wrench },
    { title: "Submit Invoice", href: "/dashboard/provider/submit-invoice", icon: Upload },
    { title: "Transactions", href: "/dashboard/provider/transactions", icon: Receipt },
    { title: "Banking", href: "/dashboard/provider/banking", icon: CreditCard },
    { title: "Messages", href: "/dashboard/provider/vendor-portal", icon: MessageSquare, badge: "2" },
    { title: "Documents", href: "/dashboard/provider/vendor-portal", icon: FileText },
    { title: "Settings", href: "/dashboard/provider/vendor-portal", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Service Provider"
        roleIcon={Wrench}
        userName={user?.name || "BuildRight Construction"}
        onLogout={logout}
      />

      <main className="flex-1 ml-64 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-black mb-2">Service Provider Portal</h1>
                <p className="text-lg text-muted-foreground">
                  Submit invoices, track payments, and manage projects
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/provider/submit-invoice">
                  <Upload className="mr-2 h-4 w-4" />
                  Submit Invoice
                </Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-orange-500/10 to-[#E07A47]/10 border-2 border-[#E07A47] rounded-xl p-4 flex items-start gap-3">
              <Wrench className="h-5 w-5 text-[#E07A47] mt-0.5" />
              <div>
                <p className="font-bold text-[#E07A47]">🔧 Service Provider Demo Portal</p>
                <p className="text-sm text-muted-foreground">
                  See how contractors and service providers submit invoices, track payments, and manage work orders.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <MediaViewer
              type="video"
              src="/provider-demo.mp4"
              title="🎬 Provider Portal Walkthrough"
              description="Learn how to submit invoices, upload documents, and get paid faster on construction projects"
            />
          </div>

          {/* Stats Grid (Live Data) */}
          {loading ? (
            <div className="p-8 text-center text-lg">Loading portfolio summary...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">{error}</div>
          ) : summary ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-4 border-primary hover:shadow-xl transition-all bg-slate-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Active Projects</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Wrench className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.activeInvestments}</div>
                  <p className="text-xs text-muted-foreground">Construction sites</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-orange-500 hover:shadow-xl transition-all bg-slate-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Pending Invoices</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{formatCurrency(summary.pendingAmount)}</div>
                  <p className="text-xs text-muted-foreground">Invoices pending</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 hover:shadow-xl transition-all bg-slate-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Approved This Month</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.totalGain}</div>
                  <p className="text-xs text-green-600 font-semibold">Total paid</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-secondary hover:shadow-xl transition-all bg-slate-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-muted-foreground">Awaiting Review</CardTitle>
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-black mb-1">{summary.properties}</div>
                  <p className="text-xs text-muted-foreground">In review queue</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 border-4 border-[#56CCF2] bg-slate-50">
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your submission history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { project: "Sunset Apartments", invoice: "#INV-2401", amount: "$85,250", status: "Pending", statusColor: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600", date: "Jan 20" },
                    { project: "Office Tower", invoice: "#INV-2398", amount: "$125,000", status: "Approved", statusColor: "bg-green-100 dark:bg-green-900/20 text-green-600", date: "Jan 18" },
                    { project: "Riverside Condos", invoice: "#INV-2395", amount: "$73,800", status: "Paid", statusColor: "bg-blue-100 dark:bg-blue-900/20 text-blue-600", date: "Jan 15" },
                  ].map((invoice, i) => (
                    <div key={i} className="p-5 rounded-xl bg-white border-2 border-slate-200 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-black text-lg">{invoice.project}</h4>
                          <p className="text-sm text-muted-foreground">{invoice.invoice} • {invoice.date}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${invoice.statusColor}`}>
                          {invoice.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-2xl font-black">{invoice.amount}</p>
                        <Button size="sm" variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full justify-start bg-[#E07A47] hover:bg-[#E07A47]/90" asChild>
                    <Link href="/dashboard/provider/submit-invoice">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit New Invoice
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/provider/transactions">
                      <Receipt className="mr-2 h-4 w-4" />
                      View Payments
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/dashboard/provider/banking">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Update Banking
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg">Payment Stats</CardTitle>
                  <CardDescription>30-day average</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Payment Time</p>
                    <p className="text-3xl font-black text-primary">7 days</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Paid YTD</p>
                    <p className="text-3xl font-black">$1.2M</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Active Work Orders */}
          <div className="mb-8">
            <h2 className="text-2xl font-black mb-6">Active Work Orders</h2>
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardHeader>
                <CardTitle>Current Projects & Tasks</CardTitle>
                <CardDescription>Track work completion and submit for payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { project: "Sunset Apartments", task: "3rd Floor Framing", dueDate: "Jan 28", completion: 75, budget: "$45,000", status: "In Progress" },
                    { project: "Office Tower", task: "HVAC Installation", dueDate: "Feb 5", completion: 40, budget: "$125,000", status: "In Progress" },
                    { project: "Riverside Condos", task: "Electrical Rough-In", dueDate: "Jan 30", completion: 90, budget: "$38,500", status: "Ready to Invoice" },
                    { project: "Tech Campus", task: "Foundation Pour", dueDate: "Feb 10", completion: 20, budget: "$95,000", status: "Scheduled" },
                  ].map((order, i) => (
                    <div key={i} className="p-5 rounded-xl bg-white border-2 border-slate-200 hover:shadow-xl transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-black text-lg mb-1">{order.task}</h4>
                          <p className="text-sm text-muted-foreground">{order.project}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          order.status === 'Ready to Invoice' ? 'bg-green-100 text-green-600' :
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Budget</p>
                          <p className="font-bold">{order.budget}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                          <p className="font-bold">{order.dueDate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Completion</p>
                          <p className="font-bold">{order.completion}%</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">Progress</span>
                          <span className="text-muted-foreground">{order.completion}% Complete</span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-primary to-secondary"
                            style={{ width: `${order.completion}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-4 border-green-500 bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg">Payment Performance</CardTitle>
                <CardDescription>Track your payment history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average Payment Time</p>
                    <p className="text-4xl font-black text-green-600">7 days</p>
                    <p className="text-xs text-green-600 font-semibold mt-1">Faster than industry average (15 days)</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground mb-1">On-Time Payment Rate</p>
                    <p className="text-2xl font-black">98.5%</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-muted-foreground mb-1">Total Paid YTD</p>
                    <p className="text-2xl font-black text-primary">$1.2M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Opportunities</CardTitle>
                <CardDescription>New projects available for bidding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { project: "Harbor Plaza Renovation", value: "$185K", deadline: "Feb 1", type: "Plumbing" },
                    { project: "University Housing", value: "$320K", deadline: "Feb 8", type: "Framing" },
                    { project: "Medical Center Expansion", value: "$275K", deadline: "Feb 12", type: "HVAC" },
                  ].map((opp, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border-2 border-slate-200 hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm mb-1">{opp.project}</h4>
                          <p className="text-xs text-muted-foreground">{opp.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#E07A47]">{opp.value}</p>
                          <p className="text-xs text-muted-foreground">Budget</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <span className="text-xs text-muted-foreground">Bid deadline: {opp.deadline}</span>
                        <Button size="sm" variant="outline">Submit Bid</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

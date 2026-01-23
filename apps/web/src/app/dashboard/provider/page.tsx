"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Wrench, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  Clock,
  AlertCircle,
  Hammer,
  Upload,
  CreditCard
} from "lucide-react"

export default function ProviderDashboardPage() {
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
                  <Wrench className="h-8 w-8 text-[#E07A47]" />
                  <h1 className="text-4xl font-black">Provider Portal</h1>
                </div>
                <p className="text-lg text-muted-foreground">
                  Demo Portal - Elite Construction Co.
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
              <Wrench className="h-5 w-5 text-[#E07A47] mt-0.5" />
              <div>
                <p className="font-bold text-[#E07A47]">Provider Demo Portal</p>
                <p className="text-sm text-muted-foreground">
                  This is how RealCo looks for contractors, attorneys, and service providers.
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
                  <Hammer className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">6</div>
                <p className="text-xs text-muted-foreground mt-1">3 sponsors</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Pending Invoices
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$487K</div>
                <p className="text-xs text-muted-foreground mt-1">4 awaiting approval</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Paid (Last 30d)
                  </CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">$1.2M</div>
                <p className="text-xs text-muted-foreground mt-1">Avg 8 days to payment</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-muted-foreground">
                    Pending Tasks
                  </CardTitle>
                  <AlertCircle className="h-5 w-5 text-[#E07A47]" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">5</div>
                <p className="text-xs text-muted-foreground mt-1">2 lien waivers due</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Active Projects */}
            <Card className="lg:col-span-2 border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hammer className="h-5 w-5" />
                  Your Active Projects
                </CardTitle>
                <CardDescription>Construction and service projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { 
                      name: "Sunset Apartments", 
                      sponsor: "Acme Development", 
                      phase: "Foundation & Framing",
                      invoiced: "$125K",
                      pending: "$45K",
                      paid: "$80K",
                      status: "In Progress",
                      statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]"
                    },
                    { 
                      name: "Downtown Office Tower", 
                      sponsor: "Summit Properties", 
                      phase: "Interior Finishes",
                      invoiced: "$275K",
                      pending: "$175K",
                      paid: "$100K",
                      status: "Payment Pending",
                      statusColor: "bg-[#E07A47]/20 text-[#E07A47]"
                    },
                    { 
                      name: "Riverside Condos", 
                      sponsor: "Peak Investors", 
                      phase: "Site Preparation",
                      invoiced: "$87K",
                      pending: "$0",
                      paid: "$87K",
                      status: "Up to Date",
                      statusColor: "bg-green-500/20 text-green-600"
                    },
                  ].map((project, i) => (
                    <div key={i} className="p-4 rounded-xl bg-muted/50 border-2 border-slate-200 dark:border-[#E07A47] hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{project.name}</h4>
                          <p className="text-sm text-muted-foreground">{project.sponsor} • {project.phase}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${project.statusColor}`}>
                          {project.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">Total Invoiced</p>
                          <p className="font-bold">{project.invoiced}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Pending</p>
                          <p className="font-bold text-[#E07A47]">{project.pending}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">Paid</p>
                          <p className="font-bold text-green-600">{project.paid}</p>
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
                <CardDescription>Provider tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard/provider/submit-invoice">
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Invoice
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Upload Lien Waiver
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Hammer className="mr-2 h-4 w-4" />
                  Log Progress
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payment History
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Contracts
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Submit Change Order
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Invoices */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pending Invoices
                </CardTitle>
                <CardDescription>Awaiting approval or payment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { invoice: "INV-2401", project: "Downtown Office Tower", amount: "$175K", status: "Awaiting Approval", date: "Jan 15", statusColor: "bg-[#E07A47]/20 text-[#E07A47]" },
                    { invoice: "INV-2402", project: "Sunset Apartments", amount: "$45K", status: "Approved", date: "Jan 18", statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]" },
                    { invoice: "INV-2403", project: "Riverside Condos", amount: "$87K", status: "Processing Payment", date: "Jan 20", statusColor: "bg-green-500/20 text-green-600" },
                    { invoice: "INV-2404", project: "Marina Bay Apartments", amount: "$180K", status: "Awaiting Approval", date: "Jan 22", statusColor: "bg-[#E07A47]/20 text-[#E07A47]" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all border-2 border-slate-200 dark:border-[#E07A47]">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{item.invoice}</p>
                        <p className="text-xs text-muted-foreground">{item.project}</p>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold">{item.amount}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${item.statusColor}`}>
                        {item.status}
                      </span>
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
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: "Payment received", detail: "$87K for Riverside Condos", time: "1d ago", icon: CheckCircle2, color: "text-green-500" },
                    { action: "Invoice approved", detail: "INV-2402 approved by sponsor", time: "2d ago", icon: FileText, color: "text-[#56CCF2]" },
                    { action: "Lien waiver signed", detail: "Downtown Office Tower - Phase 3", time: "3d ago", icon: FileText, color: "text-blue-500" },
                    { action: "New project assigned", detail: "Marina Bay Apartments", time: "5d ago", icon: Hammer, color: "text-[#E07A47]" },
                    { action: "Payment received", detail: "$125K for Sunset Apartments", time: "1w ago", icon: CheckCircle2, color: "text-green-500" },
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

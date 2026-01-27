"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { useOfferings, useDistributions, useInvestors, type Distribution, type Investment } from "@/lib/supabase-hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Home,
  Search,
  UserPlus,
  MapPin,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
  { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
  { title: "Leads", href: "/dashboard/sponsor/leads", icon: UserPlus },
  { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
  { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
  { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
  { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
  { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
  { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
]

export default function SponsorDistributionsPage() {
  const { user, logout } = useAuth()

  // Fetch offerings for the project selector
  const { data: offerings, isLoading: offeringsLoading } = useOfferings()
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null)

  // Fetch distributions and investors for the selected offering
  const { data: distributions, isLoading, refetch } = useDistributions(selectedOfferingId || '')
  const { data: investors } = useInvestors(selectedOfferingId || '')

  // Set initial selected offering once loaded
  if (!selectedOfferingId && offerings.length > 0) {
    setSelectedOfferingId(offerings[0].id)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const selectedOffering = offerings.find(o => o.id === selectedOfferingId)

  // Calculate totals from real data
  const totalDistributed = distributions.reduce((sum, d) => sum + d.total_amount, 0)
  const investorCount = investors.length
  const avgPerInvestor = investorCount > 0 ? totalDistributed / investorCount : 0

  // Separate completed vs pending/scheduled distributions
  const completedDistributions = distributions.filter(d => d.status === 'COMPLETED')
  const pendingDistributions = distributions.filter(d =>
    d.status === 'PENDING_APPROVAL' || d.status === 'APPROVED' || d.status === 'PROCESSING' || d.status === 'DRAFT'
  )
  const upcomingDistribution = pendingDistributions[0]

  // Calculate investor payouts from investments
  const investorPayouts = investors.map((investment: Investment) => ({
    id: investment.id,
    investorId: investment.investor_id,
    investmentAmount: investment.investment_amount,
    currentBalance: investment.current_balance,
    returnedCapital: investment.returned_capital,
    preferredReturnPaid: investment.preferred_return_paid,
    profitsPaid: investment.profits_paid,
    ownershipPercentage: investment.ownership_percentage || 0,
    totalReceived: investment.returned_capital + investment.preferred_return_paid + investment.profits_paid,
  }))

  // Calculate waterfall status based on real data
  const totalCapital = investors.reduce((sum, i) => sum + i.investment_amount, 0)
  const totalReturnedCapital = investors.reduce((sum, i) => sum + i.returned_capital, 0)
  const totalPreferredPaid = investors.reduce((sum, i) => sum + i.preferred_return_paid, 0)
  const totalProfitsPaid = investors.reduce((sum, i) => sum + i.profits_paid, 0)

  const waterfallStructure = [
    {
      tier: 1,
      name: 'Return of Capital',
      priority: 'First',
      allocation: '100% to investors',
      status: totalReturnedCapital >= totalCapital ? 'COMPLETED' : totalReturnedCapital > 0 ? 'IN_PROGRESS' : 'PENDING',
      returned: totalReturnedCapital,
      remaining: Math.max(0, totalCapital - totalReturnedCapital),
    },
    {
      tier: 2,
      name: 'Preferred Return (8% IRR)',
      priority: 'Second',
      allocation: '100% to investors',
      status: totalReturnedCapital >= totalCapital ? (totalPreferredPaid > 0 ? 'IN_PROGRESS' : 'PENDING') : 'PENDING',
      returned: totalPreferredPaid,
      target: totalCapital * 0.08,
    },
    {
      tier: 3,
      name: 'Catch-Up (Sponsor)',
      priority: 'Third',
      allocation: '100% to sponsor until 20/80 split',
      status: 'PENDING',
      returned: 0,
      target: totalCapital * 0.02,
    },
    {
      tier: 4,
      name: 'Residual Split',
      priority: 'Fourth',
      allocation: '80% investors / 20% sponsor',
      status: totalProfitsPaid > 0 ? 'IN_PROGRESS' : 'PENDING',
      returned: totalProfitsPaid,
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'IN_PROGRESS': return 'bg-[#56CCF2] text-white'
      case 'COMPLETED': return 'bg-green-500 text-white'
      case 'PENDING': return 'bg-slate-400 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getDistributionStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-500 text-white'
      case 'PROCESSING': return 'bg-blue-500 text-white'
      case 'APPROVED': return 'bg-[#56CCF2] text-white'
      case 'PENDING_APPROVAL': return 'bg-yellow-500 text-white'
      case 'DRAFT': return 'bg-slate-400 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName={user?.email || "Sponsor User"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-6xl px-6 py-12 mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-black mb-2">Distribution Planning</h2>
              <p className="text-base text-muted-foreground">
                Manage investor distributions and waterfall calculations
              </p>
            </div>

            {/* Loading State */}
            {offeringsLoading && (
              <Card className="border-2 border-slate-200">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2] mb-4" />
                    <p className="text-muted-foreground">Loading offerings...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State - No Offerings */}
            {!offeringsLoading && offerings.length === 0 && (
              <Card className="border-2 border-slate-200">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">No Offerings Found</h3>
                    <p className="text-muted-foreground max-w-md">
                      Create an offering first to manage distributions. Offerings allow you to raise capital and distribute returns to investors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Project Selector */}
            {!offeringsLoading && offerings.length > 0 && (
              <Card className="border-2 border-[#E07A47]">
                <CardHeader>
                  <CardTitle>Select Offering</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offerings.map((offering) => (
                      <button
                        key={offering.id}
                        onClick={() => setSelectedOfferingId(offering.id)}
                        className={`p-4 rounded-lg border-4 text-left transition-all ${
                          selectedOfferingId === offering.id
                            ? 'border-[#56CCF2] bg-[#56CCF2]/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-[#E07A47]'
                        }`}
                      >
                        <h3 className="font-bold text-lg mb-2">{offering.name}</h3>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            Target Raise: <span className="font-bold text-foreground">{formatCurrency(offering.target_raise || 0)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Current Raised: <span className="font-bold text-foreground">{formatCurrency(offering.current_raised || 0)}</span>
                          </p>
                          <p className="text-muted-foreground">
                            Investors: <span className="font-bold text-foreground">{offering.investor_count || 0}</span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedOffering && (
              <>
                {/* Loading State for Distributions */}
                {isLoading && (
                  <Card className="border-2 border-slate-200">
                    <CardContent className="py-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2] mb-4" />
                        <p className="text-muted-foreground">Loading distributions...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!isLoading && (
                  <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <Card className="border-4 border-[#56CCF2]">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Total Distributed</p>
                            <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                          </div>
                          <p className="text-3xl font-black text-[#56CCF2]">
                            {formatCurrency(totalDistributed)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {selectedOffering.current_raised && selectedOffering.current_raised > 0
                              ? `${((totalDistributed / selectedOffering.current_raised) * 100).toFixed(1)}% of capital`
                              : '0% of capital'}
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-4 border-[#E07A47]">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Total Investors</p>
                            <Users className="h-5 w-5 text-[#E07A47]" />
                          </div>
                          <p className="text-3xl font-black text-[#E07A47]">
                            {investorCount}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Receiving distributions
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-4 border-green-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Distributions</p>
                            <Calendar className="h-5 w-5 text-green-600" />
                          </div>
                          <p className="text-3xl font-black text-green-600">
                            {completedDistributions.length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Completed to date
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="border-4 border-purple-500">
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-muted-foreground">Avg Distribution</p>
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                          </div>
                          <p className="text-3xl font-black text-purple-600">
                            {formatCurrency(avgPerInvestor)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            per investor
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Upcoming Distribution */}
                    {upcomingDistribution && (
                      <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5 text-[#56CCF2]" />
                                Upcoming Distribution
                              </CardTitle>
                              <CardDescription className="mt-1">
                                Scheduled for {formatDate(upcomingDistribution.distribution_date)}
                              </CardDescription>
                            </div>
                            <Badge className={getDistributionStatusBadge(upcomingDistribution.status)}>
                              {upcomingDistribution.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                              <p className="text-sm text-muted-foreground mb-1">Estimated Amount</p>
                              <p className="text-2xl font-black text-[#56CCF2]">
                                {formatCurrency(upcomingDistribution.total_amount)}
                              </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                              <p className="text-sm text-muted-foreground mb-1">Recipients</p>
                              <p className="text-2xl font-black">{investorCount}</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                              <p className="text-sm text-muted-foreground mb-1">Per Investor</p>
                              <p className="text-2xl font-black">
                                {formatCurrency(investorCount > 0 ? upcomingDistribution.total_amount / investorCount : 0)}
                              </p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                              <p className="text-sm text-muted-foreground mb-1">Type</p>
                              <p className="text-sm font-bold">{upcomingDistribution.distribution_type.replace('_', ' ')}</p>
                            </div>
                          </div>
                          <Button className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Send className="mr-2 h-4 w-4" />
                            Execute Distribution
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {/* No Upcoming Distribution */}
                    {!upcomingDistribution && (
                      <Card className="border-2 border-slate-200">
                        <CardContent className="py-8">
                          <div className="flex flex-col items-center justify-center text-center">
                            <Calendar className="h-10 w-10 text-slate-400 mb-3" />
                            <h3 className="text-lg font-bold mb-1">No Upcoming Distributions</h3>
                            <p className="text-muted-foreground text-sm">
                              Schedule a new distribution to send returns to your investors.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Investor Payouts Table */}
                    {investorPayouts.length > 0 && (
                      <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
                        <CardHeader>
                          <CardTitle>Investor Payouts</CardTitle>
                          <CardDescription>Individual investor distribution breakdown</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {investorPayouts.map((payout) => (
                              <div
                                key={payout.id}
                                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-[#E07A47]" />
                                    <span className="font-bold">Investor</span>
                                  </div>
                                  <Badge className="bg-[#56CCF2] text-white">
                                    {payout.ownershipPercentage.toFixed(2)}% ownership
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Investment</p>
                                    <p className="font-bold text-lg">{formatCurrency(payout.investmentAmount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Capital Returned</p>
                                    <p className="font-bold text-lg">{formatCurrency(payout.returnedCapital)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Preferred Paid</p>
                                    <p className="font-bold text-lg">{formatCurrency(payout.preferredReturnPaid)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Total Received</p>
                                    <p className="font-bold text-lg text-green-600">{formatCurrency(payout.totalReceived)}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Waterfall Structure */}
                    <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
                      <CardHeader>
                        <CardTitle>Waterfall Structure</CardTitle>
                        <CardDescription>Distribution priority and allocation rules</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {waterfallStructure.map((tier, index) => (
                            <div key={index} className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-muted/30">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#E07A47] text-white flex items-center justify-center font-black">
                                    {tier.tier}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg">{tier.name}</h4>
                                    <p className="text-sm text-muted-foreground">{tier.priority} priority</p>
                                  </div>
                                </div>
                                <Badge className={getStatusColor(tier.status)}>
                                  {tier.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <p className="text-sm mb-3 text-muted-foreground">{tier.allocation}</p>
                              {tier.tier === 1 && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Returned:</span>
                                    <span className="font-bold">{formatCurrency(tier.returned)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Remaining:</span>
                                    <span className="font-bold text-[#E07A47]">{formatCurrency(tier.remaining || 0)}</span>
                                  </div>
                                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#56CCF2]"
                                      style={{ width: `${((tier.returned || 0) / ((tier.returned || 0) + (tier.remaining || 0))) * 100 || 0}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                              {tier.target && (
                                <div className="text-sm">
                                  <span className="text-muted-foreground">Target: </span>
                                  <span className="font-bold">{formatCurrency(tier.target || 0)}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Distribution History */}
                    <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
                      <CardHeader>
                        <CardTitle>Distribution History</CardTitle>
                        <CardDescription>Past distributions for this offering</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {completedDistributions.length === 0 ? (
                          <div className="flex flex-col items-center justify-center text-center py-8">
                            <DollarSign className="h-10 w-10 text-slate-400 mb-3" />
                            <h3 className="text-lg font-bold mb-1">No Distributions Yet</h3>
                            <p className="text-muted-foreground text-sm">
                              Completed distributions will appear here once they are processed.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {completedDistributions.map((dist: Distribution) => (
                              <div
                                key={dist.id}
                                className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                    <span className="font-bold">{formatDate(dist.distribution_date)}</span>
                                  </div>
                                  <Badge className="bg-green-500 text-white">
                                    {dist.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">Total Amount</p>
                                    <p className="font-bold text-lg">{formatCurrency(dist.total_amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Investors</p>
                                    <p className="font-bold text-lg">{investorCount}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">Avg Per Investor</p>
                                    <p className="font-bold text-lg">
                                      {formatCurrency(investorCount > 0 ? dist.total_amount / investorCount : 0)}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Type: {dist.distribution_type.replace('_', ' ')}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

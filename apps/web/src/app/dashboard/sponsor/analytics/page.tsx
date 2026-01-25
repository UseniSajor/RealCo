"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Building2,
  ArrowLeft,
  Download,
  Target,
  Calendar,
  Percent,
  Home,
  Search,
  UserPlus,
  MapPin,
  Calculator,
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

export default function SponsorAnalyticsPage() {
  const { user, logout } = useAuth()
  const [timeframe, setTimeframe] = useState<'mtd' | 'qtd' | 'ytd' | 'all'>('ytd')

  // Mock comprehensive analytics data
  const portfolioMetrics = {
    totalProjects: 12,
    activeProjects: 8,
    totalCapitalRaised: 127500000,
    totalInvestors: 847,
    avgCheckSize: 150532,
    capitalDeployed: 98250000,
    capitalDeployedPercent: 77.0,
    activeOfferings: 2,
    closedDeals: 10,
  }

  const fundraisingMetrics = {
    ytdCapitalRaised: 32500000,
    ytdTarget: 45000000,
    ytdProgress: 72.2,
    avgDaysToClose: 87,
    conversionRate: 68.5,
    repeatInvestorRate: 42.3,
    avgInvestmentSize: 125000,
    investorGrowth: 15.8, // % growth YoY
  }

  const performanceByAssetType = [
    { type: "Multifamily", projects: 5, capitalRaised: 52500000, avgIRR: 17.2, avgEquityMultiple: 1.95 },
    { type: "Industrial", projects: 3, capitalRaised: 38200000, avgIRR: 18.5, avgEquityMultiple: 2.03 },
    { type: "Office", projects: 2, capitalRaised: 24300000, avgIRR: 15.2, avgEquityMultiple: 1.82 },
    { type: "Self-Storage", projects: 2, capitalRaised: 12500000, avgIRR: 17.5, avgEquityMultiple: 1.88 },
  ]

  const performanceByMarket = [
    { market: "Dallas-Fort Worth", projects: 4, capitalRaised: 45600000, avgIRR: 17.8 },
    { market: "Austin", projects: 3, capitalRaised: 38900000, avgIRR: 16.5 },
    { market: "Houston", projects: 3, capitalRaised: 28700000, avgIRR: 16.9 },
    { market: "San Antonio", projects: 2, capitalRaised: 14300000, avgIRR: 15.3 },
  ]

  const quarterlyFundraising = [
    { quarter: "Q1 2023", raised: 8500000, investors: 68, avgDeal: 125000 },
    { quarter: "Q2 2023", raised: 12300000, investors: 98, avgDeal: 125510 },
    { quarter: "Q3 2023", raised: 15700000, investors: 126, avgDeal: 124603 },
    { quarter: "Q4 2023", raised: 18900000, investors: 151, avgDeal: 125166 },
    { quarter: "Q1 2024", raised: 9800000, investors: 78, avgDeal: 125641 },
  ]

  const investorSegmentation = [
    { segment: "Accredited Individual", count: 523, percent: 61.7, avgInvestment: 95000 },
    { segment: "Self-Directed IRA", count: 185, percent: 21.8, avgInvestment: 175000 },
    { segment: "Entity (LLC/Trust)", count: 98, percent: 11.6, avgInvestment: 250000 },
    { segment: "Family Office", count: 41, percent: 4.9, avgInvestment: 850000 },
  ]

  const topInvestors = [
    { name: "Anderson Family Trust", totalInvested: 2850000, deals: 8, avgReturn: 18.2 },
    { name: "Miller Capital LLC", totalInvested: 2100000, deals: 6, avgReturn: 17.5 },
    { name: "Johnson Self-Directed IRA", totalInvested: 1750000, deals: 7, avgReturn: 16.8 },
    { name: "Roberts Family Office", totalInvested: 1500000, deals: 5, avgReturn: 19.3 },
    { name: "Thompson Investment Group", totalInvested: 1250000, deals: 5, avgReturn: 15.9 },
  ]

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
        {/* Header */}
        <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
          <div className="container max-w-7xl px-6 py-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                  <Link href="/dashboard/sponsor">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <div>
                  <h1 className="text-4xl font-black">Executive Analytics</h1>
                  <p className="text-white/80">Comprehensive performance insights and trends</p>
                </div>
              </div>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Projects</p>
                    <p className="text-3xl font-black">{portfolioMetrics.totalProjects}</p>
                    <p className="text-xs text-green-400 mt-1">{portfolioMetrics.activeProjects} active</p>
                  </div>
                  <Building2 className="h-10 w-10 text-white/50" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Capital Raised</p>
                    <p className="text-2xl font-black">${(portfolioMetrics.totalCapitalRaised / 1000000).toFixed(0)}M</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Investors</p>
                    <p className="text-3xl font-black">{portfolioMetrics.totalInvestors}</p>
                  </div>
                  <Users className="h-10 w-10 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Avg Check Size</p>
                    <p className="text-2xl font-black">${(portfolioMetrics.avgCheckSize / 1000).toFixed(0)}K</p>
                  </div>
                  <Target className="h-10 w-10 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Deployed</p>
                    <p className="text-2xl font-black">{portfolioMetrics.capitalDeployedPercent}%</p>
                    <p className="text-xs text-white/70 mt-1">${(portfolioMetrics.capitalDeployed / 1000000).toFixed(0)}M</p>
                  </div>
                  <Percent className="h-10 w-10 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl px-6 py-8 mx-auto">
          {/* Timeframe Filter */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-semibold">Timeframe:</p>
            <div className="flex gap-2">
              {(['mtd', 'qtd', 'ytd', 'all'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeframe === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(period)}
                  className={timeframe === period ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
                >
                  {period.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Fundraising Performance */}
          <Card className="border-4 border-[#E07A47] mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Fundraising Performance - {timeframe.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Capital Raised</p>
                  <p className="text-3xl font-black text-green-600">${(fundraisingMetrics.ytdCapitalRaised / 1000000).toFixed(1)}M</p>
                  <p className="text-xs text-muted-foreground mt-1">Target: ${(fundraisingMetrics.ytdTarget / 1000000).toFixed(0)}M</p>
                </div>
                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Progress to Goal</p>
                  <p className="text-4xl font-black text-[#56CCF2]">{fundraisingMetrics.ytdProgress}%</p>
                </div>
                <div className="bg-orange-50 border-2 border-[#E07A47] rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Avg Days to Close</p>
                  <p className="text-4xl font-black text-[#E07A47]">{fundraisingMetrics.avgDaysToClose}</p>
                </div>
                <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Conversion Rate</p>
                  <p className="text-4xl font-black text-purple-600">{fundraisingMetrics.conversionRate}%</p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Avg Investment Size</p>
                  <p className="text-2xl font-black text-[#56CCF2]">${(fundraisingMetrics.avgInvestmentSize / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Repeat Investor Rate</p>
                  <p className="text-2xl font-black text-green-600">{fundraisingMetrics.repeatInvestorRate}%</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Investor Growth (YoY)</p>
                  <p className="text-2xl font-black text-[#E07A47]">+{fundraisingMetrics.investorGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance by Asset Type */}
          <Card className="border-4 border-[#E07A47] mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Performance by Asset Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-bold">Asset Type</th>
                      <th className="text-center py-3 px-4 font-bold">Projects</th>
                      <th className="text-right py-3 px-4 font-bold">Capital Raised</th>
                      <th className="text-right py-3 px-4 font-bold">Avg IRR</th>
                      <th className="text-right py-3 px-4 font-bold">Avg Multiple</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceByAssetType.map((asset) => (
                      <tr key={asset.type} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-bold">{asset.type}</td>
                        <td className="text-center py-3 px-4">{asset.projects}</td>
                        <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">${(asset.capitalRaised / 1000000).toFixed(1)}M</td>
                        <td className="text-right py-3 px-4 text-green-600 font-bold">{asset.avgIRR}%</td>
                        <td className="text-right py-3 px-4 text-[#E07A47] font-bold">{asset.avgEquityMultiple}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Performance by Market */}
          <Card className="border-4 border-[#E07A47] mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Performance by Market</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {performanceByMarket.map((market) => (
                  <div key={market.market} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold">{market.market}</p>
                        <p className="text-xs text-muted-foreground">{market.projects} projects</p>
                      </div>
                      <Badge className="bg-green-600 text-white">{market.avgIRR}% IRR</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Capital Raised:</span>
                      <span className="font-bold text-[#56CCF2]">${(market.capitalRaised / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quarterly Fundraising Trend */}
          <Card className="border-4 border-[#56CCF2] mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Quarterly Fundraising Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-bold">Quarter</th>
                      <th className="text-right py-3 px-4 font-bold">Capital Raised</th>
                      <th className="text-right py-3 px-4 font-bold">New Investors</th>
                      <th className="text-right py-3 px-4 font-bold">Avg Investment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quarterlyFundraising.map((quarter) => (
                      <tr key={quarter.quarter} className="border-b border-slate-100">
                        <td className="py-3 px-4 font-bold">{quarter.quarter}</td>
                        <td className="text-right py-3 px-4 text-green-600 font-bold">${(quarter.raised / 1000000).toFixed(1)}M</td>
                        <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">{quarter.investors}</td>
                        <td className="text-right py-3 px-4 text-[#E07A47] font-bold">${(quarter.avgDeal / 1000).toFixed(0)}K</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Investor Segmentation */}
          <Card className="border-4 border-[#E07A47] mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Investor Segmentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investorSegmentation.map((segment) => (
                  <div key={segment.segment}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-bold">{segment.segment}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({segment.count} investors)
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#56CCF2] mr-3">{segment.percent}%</span>
                        <span className="text-sm text-muted-foreground">
                          Avg: ${(segment.avgInvestment / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-[#56CCF2] h-3 rounded-full"
                        style={{ width: `${segment.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Investors */}
          <Card className="border-4 border-[#56CCF2]">
            <CardHeader>
              <CardTitle className="text-2xl">Top 5 Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topInvestors.map((investor, index) => (
                  <div key={investor.name} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-[#56CCF2] text-white">#{index + 1}</Badge>
                        <div>
                          <p className="font-bold">{investor.name}</p>
                          <p className="text-xs text-muted-foreground">{investor.deals} deals</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-[#56CCF2]">${(investor.totalInvested / 1000000).toFixed(2)}M</p>
                        <p className="text-xs text-green-600 font-bold">Avg Return: {investor.avgReturn}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

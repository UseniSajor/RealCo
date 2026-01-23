"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  ArrowLeft,
  Download,
  Users,
  Percent,
  Target,
} from "lucide-react"

export default function FundManagerAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'mtd' | 'qtd' | 'ytd' | 'inception'>('ytd')

  // Mock fund-level analytics
  const fundMetrics = {
    totalAssets: 23,
    totalUnits: 1847,
    aum: 485000000,
    totalInvestors: 412,
    avgOccupancy: 94.3,
    portfolioNOI: 28400000,
    portfolioCashFlow: 12650000,
    distributionsYTD: 15800000,
  }

  const performanceMetrics = {
    portfolioIRR: 16.2,
    portfolioEquityMultiple: 1.68,
    portfolioTVPI: 1.45,
    portfolioDPI: 0.32,
    avgCashOnCash: 8.4,
    avgCapRate: 6.2,
    preferredReturnCoverage: 1.85, // How many times over preferred return is covered
  }

  const assetPerformance = [
    { name: "Riverside Apartments", units: 156, occupancy: 98.2, noi: 845000, budget: 820000, variance: 3.0, irr: 18.5 },
    { name: "Tech Center Plaza", units: 12, occupancy: 91.7, noi: 1100000, budget: 1050000, variance: 4.8, irr: 16.8 },
    { name: "Downtown Lofts", units: 84, occupancy: 97.5, noi: 720000, budget: 700000, variance: 2.9, irr: 17.2 },
    { name: "Parkside Townhomes", units: 64, occupancy: 95.8, noi: 580000, budget: 590000, variance: -1.7, irr: 15.5 },
    { name: "Westside Storage", units: 280, occupancy: 88.5, noi: 420000, budget: 450000, variance: -6.7, irr: 14.3 },
  ]

  const occupancyTrend = [
    { month: "Sep", occupancy: 93.2 },
    { month: "Oct", occupancy: 93.8 },
    { month: "Nov", occupancy: 94.1 },
    { month: "Dec", occupancy: 94.3 },
    { month: "Jan", occupancy: 94.3 },
  ]

  const distributionHistory = [
    { quarter: "Q1 2023", amount: 3200000, investors: 398, avgDist: 8040, preferredReturn: 2150000, profit: 1050000 },
    { quarter: "Q2 2023", amount: 3450000, investors: 402, avgDist: 8582, preferredReturn: 2200000, profit: 1250000 },
    { quarter: "Q3 2023", amount: 3800000, investors: 406, avgDist: 9360, preferredReturn: 2250000, profit: 1550000 },
    { quarter: "Q4 2023", amount: 4200000, investors: 410, avgDist: 10244, preferredReturn: 2300000, profit: 1900000 },
    { quarter: "Q1 2024", amount: 4350000, investors: 412, avgDist: 10559, preferredReturn: 2350000, profit: 2000000 },
  ]

  const investorConcentration = [
    { bracket: "$1M+", count: 15, percent: 3.6, totalInvested: 21500000 },
    { bracket: "$500K-$1M", count: 32, percent: 7.8, totalInvested: 24800000 },
    { bracket: "$250K-$500K", count: 68, percent: 16.5, totalInvested: 25650000 },
    { bracket: "$100K-$250K", count: 142, percent: 34.5, totalInvested: 23420000 },
    { bracket: "$50K-$100K", count: 155, percent: 37.6, totalInvested: 11630000 },
  ]

  const revenueByAssetType = [
    { type: "Multifamily", properties: 18, noi: 18400000, percent: 64.8 },
    { type: "Commercial", properties: 3, noi: 6200000, percent: 21.8 },
    { type: "Industrial", properties: 2, noi: 3800000, percent: 13.4 },
  ]

  const capitalProjects = [
    { property: "Riverside Apartments", project: "Exterior Renovation", budget: 385000, spent: 298000, completion: 77 },
    { property: "Downtown Lofts", project: "HVAC Replacement", budget: 215000, spent: 189000, completion: 88 },
    { property: "Tech Center Plaza", project: "Parking Lot Repaving", budget: 145000, spent: 145000, completion: 100 },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Portfolio Analytics</h1>
                <p className="text-white/80">Fund performance and asset metrics</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {/* Fund Summary */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Assets</p>
                  <p className="text-3xl font-black">{fundMetrics.totalAssets}</p>
                  <p className="text-xs text-white/70 mt-1">{fundMetrics.totalUnits} units</p>
                </div>
                <Building2 className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">AUM</p>
                  <p className="text-2xl font-black">${(fundMetrics.aum / 1000000).toFixed(0)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Investors</p>
                  <p className="text-3xl font-black">{fundMetrics.totalInvestors}</p>
                </div>
                <Users className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Occupancy</p>
                  <p className="text-3xl font-black">{fundMetrics.avgOccupancy}%</p>
                </div>
                <Percent className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">YTD Distributions</p>
                  <p className="text-2xl font-black">${(fundMetrics.distributionsYTD / 1000000).toFixed(1)}M</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-400" />
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
            {(['mtd', 'qtd', 'ytd', 'inception'] as const).map((period) => (
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

        {/* Performance Metrics */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Fund Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Portfolio IRR</p>
                <p className="text-4xl font-black text-green-600">{performanceMetrics.portfolioIRR}%</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4">
                <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Equity Multiple</p>
                <p className="text-4xl font-black text-[#56CCF2]">{performanceMetrics.portfolioEquityMultiple}x</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-[#E07A47] rounded-lg p-4">
                <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">TVPI</p>
                <p className="text-4xl font-black text-[#E07A47]">{performanceMetrics.portfolioTVPI}x</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-lg p-4">
                <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">DPI</p>
                <p className="text-4xl font-black text-purple-600">{performanceMetrics.portfolioDPI}x</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-muted-foreground dark:text-white/70 mb-2">Avg Cash-on-Cash</p>
                <p className="text-2xl font-black text-[#56CCF2]">{performanceMetrics.avgCashOnCash}%</p>
              </div>
              <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-muted-foreground dark:text-white/70 mb-2">Avg Cap Rate</p>
                <p className="text-2xl font-black text-[#E07A47]">{performanceMetrics.avgCapRate}%</p>
              </div>
              <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                <p className="text-sm text-muted-foreground dark:text-white/70 mb-2">Pref Return Coverage</p>
                <p className="text-2xl font-black text-green-600">{performanceMetrics.preferredReturnCoverage}x</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Asset Performance */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Asset Performance - YTD</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-bold dark:text-white">Property</th>
                    <th className="text-center py-3 px-4 font-bold dark:text-white">Units</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Occupancy</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">YTD NOI</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Budget</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Variance</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">IRR</th>
                  </tr>
                </thead>
                <tbody>
                  {assetPerformance.map((asset) => (
                    <tr key={asset.name} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4 font-bold dark:text-white">{asset.name}</td>
                      <td className="text-center py-3 px-4 dark:text-white">{asset.units}</td>
                      <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">{asset.occupancy}%</td>
                      <td className="text-right py-3 px-4 text-green-600 font-bold">${(asset.noi / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 dark:text-white">${(asset.budget / 1000).toFixed(0)}K</td>
                      <td className={`text-right py-3 px-4 font-bold ${asset.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.variance >= 0 ? '+' : ''}{asset.variance}%
                      </td>
                      <td className="text-right py-3 px-4 text-[#E07A47] font-bold">{asset.irr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Distribution History */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Distribution History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-bold dark:text-white">Quarter</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Total Amount</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Investors</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Avg/Investor</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Pref Return</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Profit Split</th>
                  </tr>
                </thead>
                <tbody>
                  {distributionHistory.map((dist) => (
                    <tr key={dist.quarter} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4 font-bold dark:text-white">{dist.quarter}</td>
                      <td className="text-right py-3 px-4 text-green-600 font-bold">${(dist.amount / 1000000).toFixed(2)}M</td>
                      <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">{dist.investors}</td>
                      <td className="text-right py-3 px-4 dark:text-white">${dist.avgDist.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 text-blue-600 font-bold">${(dist.preferredReturn / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 text-[#E07A47] font-bold">${(dist.profit / 1000).toFixed(0)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Revenue by Asset Type */}
          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Revenue by Asset Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByAssetType.map((revenue) => (
                  <div key={revenue.type}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-bold dark:text-white">{revenue.type}</span>
                        <span className="text-sm text-muted-foreground dark:text-white/70 ml-2">
                          ({revenue.properties} {revenue.properties === 1 ? 'property' : 'properties'})
                        </span>
                      </div>
                      <span className="font-bold text-[#56CCF2]">{revenue.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3 mb-2">
                      <div 
                        className="bg-[#56CCF2] h-3 rounded-full" 
                        style={{ width: `${revenue.percent}%` }}
                      />
                    </div>
                    <div className="text-right text-sm">
                      <span className="font-bold text-green-600">${(revenue.noi / 1000000).toFixed(2)}M NOI</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Investor Concentration */}
          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Investor Concentration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investorConcentration.map((bracket) => (
                  <div key={bracket.bracket} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-bold dark:text-white">{bracket.bracket}</p>
                        <p className="text-xs text-muted-foreground dark:text-white/70">
                          {bracket.count} investors ({bracket.percent}%)
                        </p>
                      </div>
                      <p className="font-bold text-[#56CCF2]">${(bracket.totalInvested / 1000000).toFixed(1)}M</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capital Projects */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280]">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Active Capital Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {capitalProjects.map((project) => (
                <div key={`${project.property}-${project.project}`} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold dark:text-white">{project.property}</p>
                      <p className="text-sm text-muted-foreground dark:text-white/70">{project.project}</p>
                    </div>
                    <Badge className={`${project.completion === 100 ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                      {project.completion}% Complete
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground dark:text-white/70">Budget:</span>
                    <span className="font-bold dark:text-white">${project.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-muted-foreground dark:text-white/70">Spent:</span>
                    <span className="font-bold text-[#56CCF2]">${project.spent.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${project.completion === 100 ? 'bg-green-500' : 'bg-[#56CCF2]'}`}
                      style={{ width: `${project.completion}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

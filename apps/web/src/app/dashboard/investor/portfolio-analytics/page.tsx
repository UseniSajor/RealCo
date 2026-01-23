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
  Percent,
  ArrowLeft,
  Download,
  Target,
  PieChart,
} from "lucide-react"

export default function PortfolioAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'ytd' | '1y' | '3y' | 'inception'>('ytd')

  // Mock portfolio analytics data
  const portfolioData = {
    totalInvested: 750000,
    currentValue: 982500,
    totalGain: 232500,
    totalGainPercent: 31.0,
    totalDistributions: 127500,
    unrealizedGain: 105000,
    weightedAvgIRR: 14.8,
    portfolioTVPI: 1.31,
    portfolioDPI: 0.17,
  }

  const performanceByYear = [
    { year: 2021, invested: 250000, value: 287500, return: 15.0, distributions: 15000 },
    { year: 2022, invested: 300000, value: 348000, return: 16.0, distributions: 24000 },
    { year: 2023, invested: 200000, value: 247000, return: 23.5, distributions: 35500 },
    { year: 2024, invested: 0, value: 100000, return: 12.8, distributions: 53000 },
  ]

  const investmentsByType = [
    { type: "Multifamily", count: 3, invested: 425000, currentValue: 551250, percent: 56.1 },
    { type: "Industrial", count: 2, invested: 225000, currentValue: 292500, percent: 29.8 },
    { type: "Office", count: 1, invested: 100000, currentValue: 138750, percent: 14.1 },
  ]

  const investmentsByLocation = [
    { location: "Austin, TX", count: 2, invested: 300000, currentValue: 390000, irr: 16.2 },
    { location: "Dallas, TX", count: 2, invested: 250000, currentValue: 325000, irr: 14.5 },
    { location: "Houston, TX", count: 1, invested: 150000, currentValue: 195000, irr: 13.8 },
    { location: "San Antonio, TX", count: 1, invested: 50000, currentValue: 72500, irr: 12.5 },
  ]

  const topPerformers = [
    { name: "Riverside Apartments", invested: 175000, value: 245000, irr: 18.5, tvpi: 1.40 },
    { name: "Tech Center Plaza", invested: 125000, value: 168750, irr: 16.8, tvpi: 1.35 },
    { name: "Gateway Industrial", invested: 100000, value: 132500, irr: 15.2, tvpi: 1.33 },
  ]

  const cashFlowProjection = [
    { quarter: "Q1 2024", distributions: 12500, capitalCalls: 0, net: 12500 },
    { quarter: "Q2 2024", distributions: 13750, capitalCalls: 0, net: 13750 },
    { quarter: "Q3 2024", distributions: 15000, capitalCalls: 50000, net: -35000 },
    { quarter: "Q4 2024", distributions: 16250, capitalCalls: 0, net: 16250 },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/investor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Portfolio Analytics</h1>
                <p className="text-white/80">Comprehensive performance analysis and insights</p>
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
                  <p className="text-white/70 text-sm mb-1">Total Invested</p>
                  <p className="text-2xl font-black">${(portfolioData.totalInvested / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Current Value</p>
                  <p className="text-2xl font-black">${(portfolioData.currentValue / 1000).toFixed(0)}K</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Gain</p>
                  <p className="text-xl font-black text-green-400">+${(portfolioData.totalGain / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-green-400">+{portfolioData.totalGainPercent}%</p>
                </div>
                <Percent className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg IRR</p>
                  <p className="text-3xl font-black">{portfolioData.weightedAvgIRR}%</p>
                </div>
                <Target className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">TVPI</p>
                  <p className="text-3xl font-black">{portfolioData.portfolioTVPI}x</p>
                </div>
                <BarChart3 className="h-10 w-10 text-blue-400" />
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
            {(['ytd', '1y', '3y', 'inception'] as const).map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
                className={timeframe === period ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {period === 'ytd' ? 'YTD' : period === '1y' ? '1 Year' : period === '3y' ? '3 Years' : 'Inception'}
              </Button>
            ))}
          </div>
        </div>

        {/* Performance Over Time */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Performance by Year</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-bold dark:text-white">Year</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Invested</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Value</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Return</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Distributions</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceByYear.map((year) => (
                    <tr key={year.year} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4 font-bold dark:text-white">{year.year}</td>
                      <td className="text-right py-3 px-4 dark:text-white">${(year.invested / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">${(year.value / 1000).toFixed(0)}K</td>
                      <td className="text-right py-3 px-4 text-green-600 font-bold">+{year.return}%</td>
                      <td className="text-right py-3 px-4 text-[#E07A47] font-bold">${(year.distributions / 1000).toFixed(0)}K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Asset Allocation */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Allocation by Asset Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {investmentsByType.map((investment) => (
                  <div key={investment.type}>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-bold dark:text-white">{investment.type}</span>
                        <span className="text-sm text-muted-foreground dark:text-white/70 ml-2">
                          ({investment.count} {investment.count === 1 ? 'property' : 'properties'})
                        </span>
                      </div>
                      <span className="font-bold text-[#56CCF2]">{investment.percent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-3">
                      <div 
                        className="bg-[#56CCF2] h-3 rounded-full" 
                        style={{ width: `${investment.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground dark:text-white/70">
                      <span>Invested: ${(investment.invested / 1000).toFixed(0)}K</span>
                      <span>Value: ${(investment.currentValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
            <CardHeader>
              <CardTitle className="text-2xl dark:text-white">Allocation by Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {investmentsByLocation.map((location) => (
                  <div key={location.location} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-bold dark:text-white">{location.location}</p>
                        <p className="text-xs text-muted-foreground dark:text-white/70">
                          {location.count} {location.count === 1 ? 'investment' : 'investments'}
                        </p>
                      </div>
                      <Badge className="bg-green-600 text-white">
                        {location.irr}% IRR
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground dark:text-white/70">Invested:</span>
                      <span className="font-bold dark:text-white">${(location.invested / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground dark:text-white/70">Value:</span>
                      <span className="font-bold text-[#56CCF2]">${(location.currentValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Top Performing Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className="bg-[#56CCF2] text-white">#{index + 1}</Badge>
                    <h4 className="font-bold dark:text-white">{performer.name}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-white/70">Invested:</span>
                      <span className="font-bold dark:text-white">${(performer.invested / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-white/70">Value:</span>
                      <span className="font-bold text-[#56CCF2]">${(performer.value / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-white/70">IRR:</span>
                      <span className="font-bold text-green-600">{performer.irr}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground dark:text-white/70">TVPI:</span>
                      <span className="font-bold text-[#E07A47]">{performer.tvpi}x</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Projection */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280]">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Projected Cash Flow (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                    <th className="text-left py-3 px-4 font-bold dark:text-white">Quarter</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Distributions</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Capital Calls</th>
                    <th className="text-right py-3 px-4 font-bold dark:text-white">Net Cash Flow</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlowProjection.map((period) => (
                    <tr key={period.quarter} className="border-b border-slate-100 dark:border-slate-700">
                      <td className="py-3 px-4 font-bold dark:text-white">{period.quarter}</td>
                      <td className="text-right py-3 px-4 text-green-600 font-bold">
                        +${period.distributions.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4 text-red-600 font-bold">
                        {period.capitalCalls > 0 ? `-$${period.capitalCalls.toLocaleString()}` : '$0'}
                      </td>
                      <td className={`text-right py-3 px-4 font-black ${period.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {period.net >= 0 ? '+' : ''}${period.net.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

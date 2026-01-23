"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Target, CheckCircle2, Clock } from "lucide-react"

export function CapitalRaisedDashboard() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Mock data for capital raised
  const offerings = [
    {
      id: '1',
      name: 'Sunset Apartments',
      target: 8000000,
      raised: 8000000,
      investors: 32,
      status: 'FUNDED',
      avgInvestment: 250000,
      closeDate: '2025-12-15',
    },
    {
      id: '2',
      name: 'Marina Bay Development',
      target: 12000000,
      raised: 8500000,
      investors: 17,
      status: 'ACTIVE',
      avgInvestment: 500000,
      closeDate: '2026-03-31',
    },
    {
      id: '3',
      name: 'Downtown Office Tower',
      target: 25000000,
      raised: 15000000,
      investors: 25,
      status: 'ACTIVE',
      avgInvestment: 600000,
      closeDate: '2026-06-30',
    },
  ]

  const totalTarget = offerings.reduce((sum, o) => sum + o.target, 0)
  const totalRaised = offerings.reduce((sum, o) => sum + o.raised, 0)
  const totalInvestors = offerings.reduce((sum, o) => sum + o.investors, 0)
  const percentRaised = (totalRaised / totalTarget) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Capital Raised</h2>
        <p className="text-base text-muted-foreground">
          Track fundraising progress across all your offerings
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <DollarSign className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {formatCurrency(totalRaised)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              of {formatCurrency(totalTarget)} target
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion</p>
              <Target className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {percentRaised.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              across all offerings
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Investors</p>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {totalInvestors}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              unique investors
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Offerings</p>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {offerings.filter(o => o.status === 'ACTIVE').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              currently raising
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Offerings List */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Offerings</h3>
        <div className="space-y-4">
          {offerings.map((offering) => {
            const percentComplete = (offering.raised / offering.target) * 100
            const isFunded = percentComplete >= 100

            return (
              <Card key={offering.id} className="border-4 border-[#E07A47]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{offering.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        {isFunded ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-semibold">Fully Funded</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-[#56CCF2]" />
                            <span className="text-[#56CCF2] font-semibold">Active</span>
                          </>
                        )}
                        <span className="text-muted-foreground">• Closes {offering.closeDate}</span>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Target Raise</p>
                      <p className="text-xl font-black">{formatCurrency(offering.target)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Amount Raised</p>
                      <p className="text-xl font-black text-[#56CCF2]">{formatCurrency(offering.raised)}</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                      <p className="text-xl font-black text-[#E07A47]">
                        {formatCurrency(offering.target - offering.raised)}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">Progress</span>
                      <span className="text-muted-foreground">{percentComplete.toFixed(1)}% funded</span>
                    </div>
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isFunded ? 'bg-green-500' : 'bg-[#56CCF2]'}`}
                        style={{ width: `${Math.min(percentComplete, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span><span className="font-bold">{offering.investors}</span> investors</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>Avg: <span className="font-bold">{formatCurrency(offering.avgInvestment)}</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Investor Breakdown */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardHeader>
          <CardTitle>Investor Breakdown</CardTitle>
          <CardDescription>Investment size distribution across all offerings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { range: '$25K - $50K', count: 12, total: 450000, color: 'bg-blue-500' },
              { range: '$50K - $250K', count: 35, total: 5250000, color: 'bg-[#56CCF2]' },
              { range: '$250K - $500K', count: 18, total: 6750000, color: 'bg-[#E07A47]' },
              { range: '$500K+', count: 9, total: 9050000, color: 'bg-purple-500' },
            ].map((bracket) => (
              <div key={bracket.range} className="text-center p-4 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                <div className={`w-12 h-12 rounded-full ${bracket.color} mx-auto mb-3 flex items-center justify-center text-white font-black text-xl`}>
                  {bracket.count}
                </div>
                <p className="font-bold text-sm mb-1">{bracket.range}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(bracket.total)} total</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

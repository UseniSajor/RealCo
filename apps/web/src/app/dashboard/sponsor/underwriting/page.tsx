"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  ArrowLeft,
  Plus,
  Download,
  BarChart3,
  FileText,
} from "lucide-react"

export default function UnderwritingPage() {
  const [selectedDeal, setSelectedDeal] = useState<string>('all')

  // Mock underwriting models
  const models = [
    {
      id: 1,
      dealName: "Gateway Industrial Park",
      address: "Dallas, TX",
      purchasePrice: 42500000,
      acquisitionCosts: 1275000,
      totalBasis: 43775000,
      debtAmount: 29750000,
      equityRequired: 14025000,
      ltv: 68.0,
      holdPeriod: 5,
      exitCapRate: 6.5,
      exitValue: 58200000,
      totalProceeds: 28450000,
      irr: 18.5,
      equityMultiple: 2.03,
      averageCashYield: 6.8,
      yearlyProjections: [
        { year: 1, noi: 2635000, cashFlow: 1230000, cumulativeReturn: 8.8 },
        { year: 2, noi: 2742000, cashFlow: 1335000, cumulativeReturn: 18.3 },
        { year: 3, noi: 2854000, cashFlow: 1445000, cumulativeReturn: 28.6 },
        { year: 4, noi: 2971000, cashFlow: 1560000, cumulativeReturn: 39.7 },
        { year: 5, noi: 3094000, cashFlow: 1680000, cumulativeReturn: 51.7 },
      ],
      status: "approved",
      lastModified: "2024-01-22",
      analyst: "Michael Chen",
    },
    {
      id: 2,
      dealName: "Cypress Creek Apartments",
      address: "Houston, TX",
      purchasePrice: 28900000,
      acquisitionCosts: 867000,
      totalBasis: 29767000,
      debtAmount: 20230000,
      equityRequired: 9537000,
      ltv: 68.0,
      holdPeriod: 5,
      exitCapRate: 6.0,
      exitValue: 38500000,
      totalProceeds: 18270000,
      irr: 16.8,
      equityMultiple: 1.92,
      averageCashYield: 7.2,
      yearlyProjections: [
        { year: 1, noi: 1673000, cashFlow: 685000, cumulativeReturn: 7.2 },
        { year: 2, noi: 1740000, cashFlow: 755000, cumulativeReturn: 15.1 },
        { year: 3, noi: 1810000, cashFlow: 830000, cumulativeReturn: 23.8 },
        { year: 4, noi: 1883000, cashFlow: 910000, cumulativeReturn: 33.3 },
        { year: 5, noi: 1960000, cashFlow: 995000, cumulativeReturn: 43.7 },
      ],
      status: "in_review",
      lastModified: "2024-01-20",
      analyst: "Sarah Johnson",
    },
    {
      id: 3,
      dealName: "Tech Plaza Office Tower",
      address: "Austin, TX",
      purchasePrice: 56000000,
      acquisitionCosts: 1680000,
      totalBasis: 57680000,
      debtAmount: 36400000,
      equityRequired: 21280000,
      ltv: 63.1,
      holdPeriod: 7,
      exitCapRate: 6.8,
      exitValue: 68400000,
      totalProceeds: 32000000,
      irr: 15.2,
      equityMultiple: 1.50,
      averageCashYield: 5.4,
      yearlyProjections: [
        { year: 1, noi: 3640000, cashFlow: 1150000, cumulativeReturn: 5.4 },
        { year: 2, noi: 3748000, cashFlow: 1235000, cumulativeReturn: 11.2 },
        { year: 3, noi: 3859000, cashFlow: 1325000, cumulativeReturn: 17.4 },
        { year: 4, noi: 3975000, cashFlow: 1420000, cumulativeReturn: 24.1 },
        { year: 5, noi: 4094000, cashFlow: 1520000, cumulativeReturn: 31.2 },
      ],
      status: "approved",
      lastModified: "2024-01-15",
      analyst: "David Kim",
    },
  ]

  const filteredModels = selectedDeal === 'all' 
    ? models 
    : models.filter(m => m.id.toString() === selectedDeal)

  const portfolioMetrics = {
    totalBasis: models.reduce((sum, m) => sum + m.totalBasis, 0),
    avgIRR: models.reduce((sum, m) => sum + m.irr, 0) / models.length,
    avgMultiple: models.reduce((sum, m) => sum + m.equityMultiple, 0) / models.length,
    totalEquity: models.reduce((sum, m) => sum + m.equityRequired, 0),
  }

  return (
    <div className="min-h-screen bg-muted/30">
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
                <h1 className="text-4xl font-black">Underwriting & Pro Forma</h1>
                <p className="text-white/80">Financial models and investment analysis</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/sponsor/underwriting/new">
                <Plus className="h-4 w-4 mr-2" />
                New Model
              </Link>
            </Button>
          </div>

          {/* Portfolio Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Models</p>
                  <p className="text-3xl font-black">{models.length}</p>
                </div>
                <Calculator className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Basis</p>
                  <p className="text-2xl font-black">${(portfolioMetrics.totalBasis / 1000000).toFixed(0)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg IRR</p>
                  <p className="text-3xl font-black">{portfolioMetrics.avgIRR.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Multiple</p>
                  <p className="text-3xl font-black">{portfolioMetrics.avgMultiple.toFixed(2)}x</p>
                </div>
                <Percent className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <select
              value={selectedDeal}
              onChange={(e) => setSelectedDeal(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
            >
              <option value="all">All Deals</option>
              {models.map(m => (
                <option key={m.id} value={m.id.toString()}>{m.dealName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Underwriting Models */}
        <div className="space-y-6">
          {filteredModels.map((model) => (
            <Card key={model.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl dark:text-white">{model.dealName}</CardTitle>
                    <p className="text-sm text-muted-foreground dark:text-white/70 mt-1">{model.address}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${model.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                      {model.status === 'approved' ? 'APPROVED' : 'IN REVIEW'}
                    </Badge>
                    <Button variant="outline" size="sm" className="border-2 border-[#E07A47]">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Acquisition Summary */}
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-2 border-slate-200 dark:border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm dark:text-white">Acquisition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Purchase Price:</span>
                        <span className="font-bold dark:text-white">${(model.purchasePrice / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Acquisition Costs:</span>
                        <span className="font-bold dark:text-white">${(model.acquisitionCosts / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-bold dark:text-white">Total Basis:</span>
                        <span className="font-black text-[#56CCF2]">${(model.totalBasis / 1000000).toFixed(2)}M</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-slate-200 dark:border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm dark:text-white">Capitalization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Debt:</span>
                        <span className="font-bold dark:text-white">${(model.debtAmount / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Equity:</span>
                        <span className="font-bold text-[#56CCF2]">${(model.equityRequired / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-bold dark:text-white">LTV:</span>
                        <span className="font-black text-[#E07A47]">{model.ltv.toFixed(1)}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-slate-200 dark:border-slate-600">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm dark:text-white">Exit Strategy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Hold Period:</span>
                        <span className="font-bold dark:text-white">{model.holdPeriod} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Exit Cap Rate:</span>
                        <span className="font-bold dark:text-white">{model.exitCapRate}%</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-bold dark:text-white">Exit Value:</span>
                        <span className="font-black text-green-600">${(model.exitValue / 1000000).toFixed(2)}M</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Returns Summary */}
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Levered IRR</p>
                    <p className="text-4xl font-black text-green-600">{model.irr}%</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Equity Multiple</p>
                    <p className="text-4xl font-black text-[#56CCF2]">{model.equityMultiple}x</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-[#E07A47] rounded-lg p-4">
                    <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Avg Cash Yield</p>
                    <p className="text-4xl font-black text-[#E07A47]">{model.averageCashYield}%</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Total Proceeds</p>
                    <p className="text-3xl font-black text-purple-600">${(model.totalProceeds / 1000000).toFixed(1)}M</p>
                  </div>
                </div>

                {/* 5-Year Projections */}
                <div>
                  <h4 className="font-bold text-lg mb-4 dark:text-white">Yearly Projections</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-slate-200 dark:border-slate-600">
                          <th className="text-left py-3 px-4 font-bold dark:text-white">Year</th>
                          <th className="text-right py-3 px-4 font-bold dark:text-white">NOI</th>
                          <th className="text-right py-3 px-4 font-bold dark:text-white">Cash Flow</th>
                          <th className="text-right py-3 px-4 font-bold dark:text-white">Cumulative Return</th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.yearlyProjections.map((proj) => (
                          <tr key={proj.year} className="border-b border-slate-100 dark:border-slate-700">
                            <td className="py-3 px-4 font-bold dark:text-white">Year {proj.year}</td>
                            <td className="text-right py-3 px-4 dark:text-white">${(proj.noi / 1000000).toFixed(2)}M</td>
                            <td className="text-right py-3 px-4 text-[#56CCF2] font-bold">${(proj.cashFlow / 1000000).toFixed(2)}M</td>
                            <td className="text-right py-3 px-4 text-green-600 font-bold">{proj.cumulativeReturn}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6 pt-6 border-t-2 border-slate-200 dark:border-slate-600">
                  <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                    <Link href={`/dashboard/sponsor/underwriting/${model.id}`}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Full Model
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-[#E07A47]">
                    <Link href={`/dashboard/sponsor/underwriting/${model.id}/edit`}>
                      Edit Assumptions
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-2 border-green-500">
                    <Link href={`/dashboard/sponsor/investment-memo/${model.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Memo
                    </Link>
                  </Button>
                  <div className="text-sm text-muted-foreground dark:text-white/70 ml-auto self-center">
                    Last modified: {new Date(model.lastModified).toLocaleDateString()} by {model.analyst}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

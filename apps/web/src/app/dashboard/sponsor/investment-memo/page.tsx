"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  Download,
  Send,
  Eye,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function InvestmentMemoPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'review' | 'approved'>('all')

  // Mock investment memos
  const memos = [
    {
      id: 1,
      dealName: "Gateway Industrial Park",
      address: "Dallas, TX",
      assetType: "Industrial",
      dealSize: 42500000,
      equityRaise: 14025000,
      targetIRR: 18.5,
      targetMultiple: 2.03,
      status: "approved",
      version: "3.0",
      createdDate: "2024-01-15",
      lastModified: "2024-01-22",
      author: "Michael Chen",
      approvedBy: "Investment Committee",
      approvedDate: "2024-01-22",
      sections: {
        executiveSummary: true,
        marketAnalysis: true,
        propertyDetails: true,
        financialProjections: true,
        riskFactors: true,
        exitStrategy: true,
      },
      highlights: [
        "Prime location with excellent highway access",
        "100% institutional-quality tenants",
        "Below-market rents with 15% upside potential",
      ],
      risks: [
        "Economic downturn could impact tenant demand",
        "Requires $2.5M in deferred maintenance",
      ],
    },
    {
      id: 2,
      dealName: "Cypress Creek Apartments",
      address: "Houston, TX",
      assetType: "Multifamily",
      dealSize: 28900000,
      equityRaise: 9537000,
      targetIRR: 16.8,
      targetMultiple: 1.92,
      status: "review",
      version: "2.1",
      createdDate: "2024-01-12",
      lastModified: "2024-01-20",
      author: "Sarah Johnson",
      approvedBy: null,
      approvedDate: null,
      sections: {
        executiveSummary: true,
        marketAnalysis: true,
        propertyDetails: true,
        financialProjections: true,
        riskFactors: true,
        exitStrategy: false,
      },
      highlights: [
        "Strong Houston submarket with 3% annual rent growth",
        "Value-add opportunity through unit renovations",
        "Experienced property management team in place",
      ],
      risks: [
        "Houston market volatility",
        "Renovation timeline risk",
      ],
    },
    {
      id: 3,
      dealName: "Tech Plaza Office Tower",
      address: "Austin, TX",
      assetType: "Office",
      dealSize: 56000000,
      equityRaise: 21280000,
      targetIRR: 15.2,
      targetMultiple: 1.50,
      status: "approved",
      version: "4.2",
      createdDate: "2023-12-01",
      lastModified: "2024-01-15",
      author: "David Kim",
      approvedBy: "Investment Committee",
      approvedDate: "2024-01-15",
      sections: {
        executiveSummary: true,
        marketAnalysis: true,
        propertyDetails: true,
        financialProjections: true,
        riskFactors: true,
        exitStrategy: true,
      },
      highlights: [
        "Class A office in Austin's fastest-growing tech corridor",
        "89% occupied with credit tenants",
        "Recently renovated with modern amenities",
      ],
      risks: [
        "Office sector headwinds from remote work trends",
        "Lease rollover risk in years 3-4",
      ],
    },
    {
      id: 4,
      dealName: "Sunset Storage Facility",
      address: "San Antonio, TX",
      assetType: "Self-Storage",
      dealSize: 12400000,
      equityRaise: 3720000,
      targetIRR: 17.5,
      targetMultiple: 1.88,
      status: "draft",
      version: "1.0",
      createdDate: "2024-01-19",
      lastModified: "2024-01-21",
      author: "Amanda Foster",
      approvedBy: null,
      approvedDate: null,
      sections: {
        executiveSummary: true,
        marketAnalysis: false,
        propertyDetails: true,
        financialProjections: false,
        riskFactors: false,
        exitStrategy: false,
      },
      highlights: [
        "High-growth San Antonio submarket",
        "Climate-controlled units command premium rates",
      ],
      risks: [
        "New competition under construction nearby",
      ],
    },
  ]

  const filteredMemos = memos.filter(m => statusFilter === 'all' || m.status === statusFilter)

  const metrics = {
    totalMemos: memos.length,
    approved: memos.filter(m => m.status === 'approved').length,
    inReview: memos.filter(m => m.status === 'review').length,
    totalEquityRaise: memos.reduce((sum, m) => sum + m.equityRaise, 0),
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-500'
      case 'review': return 'bg-yellow-500'
      case 'draft': return 'bg-slate-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'review': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'draft': return <FileText className="h-5 w-5 text-slate-600" />
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />
    }
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
                <h1 className="text-4xl font-black">Investment Memos</h1>
                <p className="text-white/80">Comprehensive deal documentation and analysis</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/sponsor/investment-memo/new">
                <Plus className="h-4 w-4 mr-2" />
                New Memo
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Memos</p>
                  <p className="text-3xl font-black">{metrics.totalMemos}</p>
                </div>
                <FileText className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Approved</p>
                  <p className="text-3xl font-black">{metrics.approved}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">In Review</p>
                  <p className="text-3xl font-black">{metrics.inReview}</p>
                </div>
                <Clock className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Equity</p>
                  <p className="text-2xl font-black">${(metrics.totalEquityRaise / 1000000).toFixed(0)}M</p>
                </div>
                <Download className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'draft', 'review', 'approved'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Investment Memos Grid */}
        <div className="grid gap-6">
          {filteredMemos.map((memo) => (
            <Card key={memo.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Memo Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3 mb-4">
                      <FileText className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1 dark:text-white">{memo.dealName}</h3>
                        <p className="text-sm text-muted-foreground dark:text-white/70 mb-2">{memo.address}</p>
                        <div className="flex gap-2 mb-3">
                          <Badge className={`${getStatusColor(memo.status)} text-white`}>
                            {memo.status.toUpperCase()}
                          </Badge>
                          <Badge className="bg-slate-600 text-white">
                            {memo.assetType}
                          </Badge>
                          <Badge className="bg-blue-600 text-white">
                            v{memo.version}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Deal Size:</span>
                        <span className="font-bold dark:text-white">${(memo.dealSize / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Equity Raise:</span>
                        <span className="font-bold text-[#56CCF2]">${(memo.equityRaise / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Target IRR:</span>
                        <span className="font-bold text-green-600">{memo.targetIRR}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Target Multiple:</span>
                        <span className="font-bold text-[#E07A47]">{memo.targetMultiple}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Author:</span>
                        <span className="font-bold dark:text-white">{memo.author}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Last Modified:</span>
                        <span className="font-bold dark:text-white">{new Date(memo.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {memo.status === 'approved' && memo.approvedBy && (
                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <p className="text-xs font-semibold text-green-800 dark:text-green-200">
                            Approved by {memo.approvedBy}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground dark:text-white/70">
                          {memo.approvedDate && new Date(memo.approvedDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Memo Sections & Highlights */}
                  <div className="lg:col-span-5">
                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-3 dark:text-white">Memo Sections</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(memo.sections).map(([section, completed]) => (
                          <div key={section} className="flex items-center gap-2">
                            {completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className={`text-xs ${completed ? 'dark:text-white' : 'text-muted-foreground dark:text-white/70'}`}>
                              {section.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2 dark:text-white">Investment Highlights</h4>
                      <ul className="space-y-1">
                        {memo.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-600 shrink-0">✓</span>
                            <span className="text-xs dark:text-white">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2 dark:text-white">Risk Factors</h4>
                      <ul className="space-y-1">
                        {memo.risks.map((risk, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-600 shrink-0">⚠</span>
                            <span className="text-xs dark:text-white">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/sponsor/investment-memo/${memo.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Memo
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full border-2 border-slate-300 dark:border-slate-600">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>

                      {memo.status === 'draft' && (
                        <>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/sponsor/investment-memo/${memo.id}/edit`}>
                              Edit Memo
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-blue-500 text-blue-600 hover:bg-blue-50">
                            <Link href={`/dashboard/sponsor/investment-memo/${memo.id}/submit`}>
                              <Send className="h-4 w-4 mr-2" />
                              Submit for Review
                            </Link>
                          </Button>
                        </>
                      )}

                      {memo.status === 'review' && (
                        <>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/sponsor/investment-memo/${memo.id}/edit`}>
                              Revise Memo
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                            <Link href={`/dashboard/sponsor/investment-memo/${memo.id}/approve`}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </Link>
                          </Button>
                        </>
                      )}

                      {memo.status === 'approved' && (
                        <>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/sponsor/investment-memo/${memo.id}/share`}>
                              <Send className="h-4 w-4 mr-2" />
                              Share with Investors
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-purple-500">
                            <Link href={`/offerings/new?memoId=${memo.id}`}>
                              Create Offering
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Memo Template Info */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mt-8">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Investment Memo Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Deal Overview</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Executive summary</li>
                  <li>• Investment thesis</li>
                  <li>• Property details</li>
                  <li>• Market analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Financial Analysis</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Pro forma projections</li>
                  <li>• Return metrics (IRR, Multiple)</li>
                  <li>• Sensitivity analysis</li>
                  <li>• Exit strategy</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Risk Assessment</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Market risks</li>
                  <li>• Execution risks</li>
                  <li>• Mitigation strategies</li>
                  <li>• Contingency plans</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

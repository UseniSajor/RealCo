"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"

export default function DealPipelinePage() {
  const [stageFilter, setStageFilter] = useState<'all' | 'sourcing' | 'underwriting' | 'diligence' | 'closing'>('all')

  // Mock deal pipeline data
  const deals = [
    {
      id: 1,
      name: "Gateway Industrial Park",
      address: "8500 Commerce Way, Dallas, TX",
      assetType: "Industrial",
      stage: "underwriting",
      dealSize: 42500000,
      targetEquity: 12750000,
      targetDebt: 29750000,
      ltv: 70,
      projectedIRR: 18.5,
      projectedEquityMultiple: 2.1,
      capRate: 6.2,
      units: 0,
      squareFeet: 385000,
      occupancy: 94,
      broker: "CBRE",
      sourceDate: "2024-01-10",
      daysInPipeline: 13,
      status: "active",
      team: "Dallas Team",
      nextMilestone: "Complete financial model",
      milestoneDate: "2024-01-28",
      confidence: "high",
    },
    {
      id: 2,
      name: "Cypress Creek Apartments",
      address: "2400 Meadow Lane, Houston, TX",
      assetType: "Multifamily",
      stage: "diligence",
      dealSize: 28900000,
      targetEquity: 8670000,
      targetDebt: 20230000,
      ltv: 70,
      projectedIRR: 16.8,
      projectedEquityMultiple: 1.95,
      capRate: 5.8,
      units: 184,
      squareFeet: 195000,
      occupancy: 96,
      broker: "Marcus & Millichap",
      sourceDate: "2023-12-15",
      daysInPipeline: 39,
      status: "active",
      team: "Houston Team",
      nextMilestone: "Property inspection",
      milestoneDate: "2024-01-25",
      confidence: "medium",
    },
    {
      id: 3,
      name: "Tech Plaza Office Tower",
      address: "1200 Innovation Dr, Austin, TX",
      assetType: "Office",
      stage: "closing",
      dealSize: 56000000,
      targetEquity: 19600000,
      targetDebt: 36400000,
      ltv: 65,
      projectedIRR: 15.2,
      projectedEquityMultiple: 1.82,
      capRate: 6.5,
      units: 0,
      squareFeet: 280000,
      occupancy: 89,
      broker: "JLL",
      sourceDate: "2023-11-01",
      daysInPipeline: 83,
      status: "active",
      team: "Austin Team",
      nextMilestone: "Closing date",
      milestoneDate: "2024-02-05",
      confidence: "high",
    },
    {
      id: 4,
      name: "Sunset Storage Facility",
      address: "5600 West Blvd, San Antonio, TX",
      assetType: "Self-Storage",
      stage: "sourcing",
      dealSize: 12400000,
      targetEquity: 3720000,
      targetDebt: 8680000,
      ltv: 70,
      projectedIRR: 17.5,
      projectedEquityMultiple: 1.88,
      capRate: 7.2,
      units: 0,
      squareFeet: 85000,
      occupancy: 91,
      broker: "Direct to Seller",
      sourceDate: "2024-01-18",
      daysInPipeline: 5,
      status: "active",
      team: "San Antonio Team",
      nextMilestone: "Initial site visit",
      milestoneDate: "2024-01-26",
      confidence: "low",
    },
    {
      id: 5,
      name: "Lakeside Townhomes",
      address: "900 Lake View Dr, Fort Worth, TX",
      assetType: "Multifamily",
      stage: "underwriting",
      dealSize: 18700000,
      targetEquity: 5610000,
      targetDebt: 13090000,
      ltv: 70,
      projectedIRR: 19.2,
      projectedEquityMultiple: 2.15,
      capRate: 6.0,
      units: 86,
      squareFeet: 102000,
      occupancy: 97,
      broker: "Berkadia",
      sourceDate: "2024-01-05",
      daysInPipeline: 18,
      status: "active",
      team: "DFW Team",
      nextMilestone: "Underwriting review",
      milestoneDate: "2024-01-30",
      confidence: "medium",
    },
  ]

  const filteredDeals = deals.filter(d => stageFilter === 'all' || d.stage === stageFilter)

  const metrics = {
    totalDeals: deals.length,
    totalPipelineValue: deals.reduce((sum, d) => sum + d.dealSize, 0),
    avgIRR: deals.reduce((sum, d) => sum + d.projectedIRR, 0) / deals.length,
    totalEquityNeeded: deals.reduce((sum, d) => sum + d.targetEquity, 0),
  }

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'sourcing': return 'bg-yellow-500'
      case 'underwriting': return 'bg-blue-500'
      case 'diligence': return 'bg-purple-500'
      case 'closing': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getConfidenceColor = (confidence: string) => {
    switch(confidence) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
      default: return 'text-gray-600'
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
                <h1 className="text-4xl font-black">Deal Pipeline</h1>
                <p className="text-white/80">Track and manage acquisition opportunities</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/sponsor/deal-pipeline/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Active Deals</p>
                  <p className="text-3xl font-black">{metrics.totalDeals}</p>
                </div>
                <Target className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Pipeline Value</p>
                  <p className="text-2xl font-black">${(metrics.totalPipelineValue / 1000000).toFixed(0)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Proj. IRR</p>
                  <p className="text-3xl font-black">{metrics.avgIRR.toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Equity Needed</p>
                  <p className="text-2xl font-black">${(metrics.totalEquityNeeded / 1000000).toFixed(0)}M</p>
                </div>
                <Building2 className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals by name, location, or asset type..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'sourcing', 'underwriting', 'diligence', 'closing'] as const).map((stage) => (
              <Button
                key={stage}
                variant={stageFilter === stage ? "default" : "outline"}
                size="sm"
                onClick={() => setStageFilter(stage)}
                className={stageFilter === stage ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {stage === 'all' ? 'All' : stage.charAt(0).toUpperCase() + stage.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Deal Pipeline Grid */}
        <div className="grid gap-6">
          {filteredDeals.map((deal) => (
            <Card key={deal.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Deal Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Building2 className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1 dark:text-white">{deal.name}</h3>
                        <p className="text-sm text-muted-foreground dark:text-white/70 mb-3">{deal.address}</p>
                        <div className="flex gap-2 flex-wrap mb-3">
                          <Badge className={`${getStageColor(deal.stage)} text-white`}>
                            {deal.stage.toUpperCase()}
                          </Badge>
                          <Badge className="bg-slate-600 text-white">
                            {deal.assetType}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Deal Size:</span>
                        <span className="font-bold dark:text-white">${(deal.dealSize / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Target Equity:</span>
                        <span className="font-bold text-[#56CCF2]">${(deal.targetEquity / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">LTV:</span>
                        <span className="font-bold dark:text-white">{deal.ltv}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Days in Pipeline:</span>
                        <span className="font-bold dark:text-white">{deal.daysInPipeline} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Broker:</span>
                        <span className="font-bold dark:text-white">{deal.broker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Team:</span>
                        <span className="font-bold dark:text-white">{deal.team}</span>
                      </div>
                    </div>
                  </div>

                  {/* Deal Metrics */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Projected IRR</p>
                      <p className="text-3xl font-black text-green-600">{deal.projectedIRR}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Equity Multiple</p>
                      <p className="text-3xl font-black text-[#56CCF2]">{deal.projectedEquityMultiple}x</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Cap Rate</p>
                      <p className="text-2xl font-black text-[#E07A47]">{deal.capRate}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Occupancy</p>
                      <p className="text-2xl font-black dark:text-white">{deal.occupancy}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">
                        {deal.units > 0 ? 'Units' : 'Square Feet'}
                      </p>
                      <p className="text-xl font-black dark:text-white">
                        {deal.units > 0 ? deal.units : `${(deal.squareFeet / 1000).toFixed(0)}K SF`}
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Confidence</p>
                      <p className={`text-xl font-black ${getConfidenceColor(deal.confidence)}`}>
                        {deal.confidence.toUpperCase()}
                      </p>
                    </div>

                    <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-1">
                        <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                            Next Milestone
                          </p>
                          <p className="text-sm font-bold dark:text-white mt-1">{deal.nextMilestone}</p>
                          <p className="text-xs text-muted-foreground dark:text-white/70 mt-1">
                            Due: {new Date(deal.milestoneDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/sponsor/deal-pipeline/${deal.id}`}>
                          View Deal
                        </Link>
                      </Button>
                      
                      <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                        <Link href={`/dashboard/sponsor/underwriting/${deal.id}`}>
                          Underwriting
                        </Link>
                      </Button>

                      <Button asChild variant="outline" className="w-full border-2 border-green-500">
                        <Link href={`/dashboard/sponsor/investment-memo/${deal.id}`}>
                          Investment Memo
                        </Link>
                      </Button>

                      {deal.stage === 'closing' && (
                        <Button asChild variant="outline" className="w-full border-2 border-purple-500">
                          <Link href={`/dashboard/sponsor/deal-pipeline/${deal.id}/close`}>
                            Closing Checklist
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pipeline Stages Explanation */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mt-8">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Deal Pipeline Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500" />
                  <h4 className="font-bold dark:text-white">Sourcing</h4>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Initial deal identification and preliminary review
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <h4 className="font-bold dark:text-white">Underwriting</h4>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Financial modeling and investment analysis
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  <h4 className="font-bold dark:text-white">Due Diligence</h4>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Property inspection, title review, and verification
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <h4 className="font-bold dark:text-white">Closing</h4>
                </div>
                <p className="text-sm text-muted-foreground dark:text-white/70">
                  Final negotiations and transaction completion
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

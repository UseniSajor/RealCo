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
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react"

export default function DispositionsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'planning' | 'listed' | 'under_contract' | 'sold'>('all')

  // Mock disposition data
  const dispositions = [
    {
      id: 1,
      property: "Tech Center Plaza",
      address: "2000 Innovation Dr, Houston, TX",
      status: "planning",
      listPrice: 24500000,
      currentValue: 23800000,
      acquisitionPrice: 19200000,
      totalInvested: 21500000,
      projectedSalePrice: 24000000,
      projectedIRR: 15.8,
      projectedEquityMultiple: 1.68,
      holdPeriod: 5.2, // years
      targetListDate: "2024-03-01",
      broker: null,
      offers: 0,
      daysOnMarket: 0,
    },
    {
      id: 2,
      property: "Westside Storage",
      address: "4500 Industrial Blvd, San Antonio, TX",
      status: "listed",
      listPrice: 8900000,
      currentValue: 8500000,
      acquisitionPrice: 6800000,
      totalInvested: 7600000,
      projectedSalePrice: 8700000,
      projectedIRR: 12.4,
      projectedEquityMultiple: 1.45,
      holdPeriod: 1.2,
      targetListDate: "2023-12-01",
      listDate: "2023-12-15",
      broker: "Marcus & Millichap",
      offers: 3,
      daysOnMarket: 40,
      bestOffer: 8500000,
    },
    {
      id: 3,
      property: "Maple Heights Apartments",
      address: "500 Maple St, Dallas, TX",
      status: "under_contract",
      listPrice: 18500000,
      currentValue: 18200000,
      acquisitionPrice: 13500000,
      totalInvested: 15200000,
      projectedSalePrice: 18300000,
      projectedIRR: 18.2,
      projectedEquityMultiple: 1.92,
      holdPeriod: 4.8,
      targetListDate: "2023-09-01",
      listDate: "2023-09-15",
      contractDate: "2023-11-20",
      expectedCloseDate: "2024-02-15",
      broker: "CBRE",
      offers: 8,
      daysOnMarket: 66,
      bestOffer: 18300000,
      buyer: "Institutional Buyer - REIT",
    },
    {
      id: 4,
      property: "Sunset Villas",
      address: "1200 Sunset Rd, Austin, TX",
      status: "sold",
      listPrice: 12800000,
      currentValue: 12600000,
      acquisitionPrice: 8900000,
      totalInvested: 10100000,
      actualSalePrice: 12600000,
      realizedIRR: 16.5,
      realizedEquityMultiple: 1.78,
      holdPeriod: 3.5,
      listDate: "2023-06-01",
      contractDate: "2023-07-15",
      closeDate: "2023-09-01",
      broker: "JLL",
      offers: 12,
      daysOnMarket: 45,
      buyer: "Private Investor Group",
      netProceeds: 12150000,
    },
  ]

  const filteredDispositions = dispositions.filter(d => 
    statusFilter === 'all' || d.status === statusFilter
  )

  const metrics = {
    totalDispositions: dispositions.length,
    activeListed: dispositions.filter(d => d.status === 'listed').length,
    underContract: dispositions.filter(d => d.status === 'under_contract').length,
    totalValue: dispositions.reduce((sum, d) => sum + (d.actualSalePrice || d.projectedSalePrice || 0), 0),
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planning': return 'bg-yellow-500'
      case 'listed': return 'bg-blue-500'
      case 'under_contract': return 'bg-purple-500'
      case 'sold': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'planning': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'listed': return <FileText className="h-5 w-5 text-blue-600" />
      case 'under_contract': return <Calendar className="h-5 w-5 text-purple-600" />
      case 'sold': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
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
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Disposition & Exit Management</h1>
                <p className="text-white/80">Track property sales and execute successful exits</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/fund-manager/dispositions/new">
                <Plus className="h-4 w-4 mr-2" />
                Plan Disposition
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Exits</p>
                  <p className="text-3xl font-black">{metrics.totalDispositions}</p>
                </div>
                <Target className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Listed</p>
                  <p className="text-3xl font-black">{metrics.activeListed}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Under Contract</p>
                  <p className="text-3xl font-black">{metrics.underContract}</p>
                </div>
                <Calendar className="h-10 w-10 text-purple-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Value</p>
                  <p className="text-2xl font-black">${(metrics.totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'planning', 'listed', 'under_contract', 'sold'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {status === 'all' ? 'All' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </Button>
            ))}
          </div>
        </div>

        {/* Dispositions Grid */}
        <div className="grid gap-6">
          {filteredDispositions.map((disposition) => (
            <Card key={disposition.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Property Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Building2 className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      <div>
                        <h3 className="text-2xl font-black mb-1 dark:text-white">{disposition.property}</h3>
                        <p className="text-sm text-muted-foreground dark:text-white/70 mb-3">{disposition.address}</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(disposition.status)}
                          <Badge className={`${getStatusColor(disposition.status)} text-white`}>
                            {disposition.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Acquisition Price:</span>
                        <span className="font-bold dark:text-white">${(disposition.acquisitionPrice / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Total Invested:</span>
                        <span className="font-bold dark:text-white">${(disposition.totalInvested / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Hold Period:</span>
                        <span className="font-bold dark:text-white">{disposition.holdPeriod.toFixed(1)} years</span>
                      </div>
                      {disposition.broker && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Broker:</span>
                          <span className="font-bold dark:text-white">{disposition.broker}</span>
                        </div>
                      )}
                      {disposition.daysOnMarket > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Days on Market:</span>
                          <span className="font-bold dark:text-white">{disposition.daysOnMarket} days</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">
                        {disposition.status === 'sold' ? 'Sale Price' : 'List Price'}
                      </p>
                      <p className="text-2xl font-black text-[#56CCF2]">
                        ${((disposition.actualSalePrice || disposition.listPrice) / 1000000).toFixed(2)}M
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Current Value</p>
                      <p className="text-2xl font-black dark:text-white">
                        ${(disposition.currentValue / 1000000).toFixed(2)}M
                      </p>
                    </div>

                    <div className={`rounded-lg p-4 ${disposition.status === 'sold' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-muted/50 dark:bg-slate-700'}`}>
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">
                        {disposition.status === 'sold' ? 'Realized IRR' : 'Projected IRR'}
                      </p>
                      <p className={`text-3xl font-black ${disposition.status === 'sold' ? 'text-green-600' : 'text-[#E07A47]'}`}>
                        {(disposition.realizedIRR || disposition.projectedIRR || 0).toFixed(1)}%
                      </p>
                    </div>

                    <div className={`rounded-lg p-4 ${disposition.status === 'sold' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500' : 'bg-muted/50 dark:bg-slate-700'}`}>
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">
                        {disposition.status === 'sold' ? 'Equity Multiple' : 'Projected Multiple'}
                      </p>
                      <p className={`text-3xl font-black ${disposition.status === 'sold' ? 'text-green-600' : 'text-[#E07A47]'}`}>
                        {(disposition.realizedEquityMultiple || disposition.projectedEquityMultiple || 0).toFixed(2)}x
                      </p>
                    </div>

                    {disposition.offers > 0 && (
                      <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-bold text-blue-800 dark:text-blue-200">
                              {disposition.offers} Offer{disposition.offers !== 1 ? 's' : ''} Received
                            </p>
                            {disposition.bestOffer && (
                              <p className="text-xs text-muted-foreground dark:text-white/70 mt-1">
                                Best: ${(disposition.bestOffer / 1000000).toFixed(2)}M
                              </p>
                            )}
                          </div>
                          {disposition.buyer && (
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground dark:text-white/70">Buyer:</p>
                              <p className="text-sm font-bold dark:text-white">{disposition.buyer}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {disposition.status === 'sold' && disposition.netProceeds && (
                      <div className="col-span-2 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                        <p className="text-sm font-bold text-green-800 dark:text-green-200 mb-2">
                          Net Proceeds to Investors
                        </p>
                        <p className="text-3xl font-black text-green-600">
                          ${(disposition.netProceeds / 1000000).toFixed(2)}M
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions & Timeline */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-3 mb-4">
                      {disposition.status === 'planning' && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-3">
                          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                            📋 Disposition Planning
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            Target List Date: {disposition.targetListDate ? new Date(disposition.targetListDate).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                      )}

                      {disposition.status === 'listed' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-3">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200 mb-1">
                            🏢 Active Listing
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            Listed: {disposition.listDate && new Date(disposition.listDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {disposition.status === 'under_contract' && disposition.expectedCloseDate && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-lg p-3">
                          <p className="text-xs font-semibold text-purple-800 dark:text-purple-200 mb-1">
                            📝 Under Contract
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            Expected Close: {disposition.expectedCloseDate ? new Date(disposition.expectedCloseDate).toLocaleDateString() : 'TBD'}
                          </p>
                        </div>
                      )}

                      {disposition.status === 'sold' && disposition.closeDate && (
                        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <p className="text-xs font-semibold text-green-800 dark:text-green-200">
                              Sale Completed
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            Closed: {disposition.closeDate ? new Date(disposition.closeDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/fund-manager/dispositions/${disposition.id}`}>
                          View Details
                        </Link>
                      </Button>

                      {disposition.status === 'planning' && (
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/dispositions/${disposition.id}/list`}>
                            List Property
                          </Link>
                        </Button>
                      )}

                      {disposition.status === 'listed' && (
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/dispositions/${disposition.id}/offers`}>
                            Manage Offers
                          </Link>
                        </Button>
                      )}

                      {disposition.status === 'sold' && (
                        <Button asChild variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                          <Link href={`/dashboard/fund-manager/dispositions/${disposition.id}/exit-analysis`}>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Exit Analysis
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
      </div>
    </div>
  )
}

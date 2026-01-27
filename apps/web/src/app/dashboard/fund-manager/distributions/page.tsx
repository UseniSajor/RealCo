"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Send,
  Building,
  Building2,
  Home,
  Receipt,
  Calculator,
  BarChart3,
  FileText,
  MessageSquare,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/fund-manager", icon: Home },
  { title: "Properties", href: "/dashboard/fund-manager/properties", icon: Building2 },
  { title: "Investors", href: "/dashboard/fund-manager/investors", icon: Users },
  { title: "Capital Accounts", href: "/dashboard/fund-manager/capital-accounts", icon: DollarSign },
  { title: "Distributions", href: "/dashboard/fund-manager/distributions", icon: Receipt },
  { title: "Financials", href: "/dashboard/fund-manager/financials", icon: Calculator },
  { title: "Analytics", href: "/dashboard/fund-manager/analytics", icon: BarChart3 },
  { title: "Reports", href: "/dashboard/fund-manager/reports", icon: FileText },
  { title: "Communications", href: "/dashboard/fund-manager/communications", icon: MessageSquare },
]

export default function DistributionsPage() {
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'processed' | 'scheduled'>('all')

  // Mock distribution data
  const distributions = [
    {
      id: 1,
      offering: "Riverside Apartments Fund",
      distributionType: "Quarterly Distribution",
      period: "Q4 2023",
      totalAmount: 425000,
      investorCount: 24,
      distributionDate: "2024-01-15",
      status: "processed",
      waterfall: {
        returnOfCapital: 185000,
        preferredReturn: 145000,
        profitSplit: 95000,
      },
      avgDistribution: 17708,
      processedDate: "2024-01-15",
    },
    {
      id: 2,
      offering: "Downtown Lofts Fund",
      distributionType: "Quarterly Distribution",
      period: "Q4 2023",
      totalAmount: 312000,
      investorCount: 18,
      distributionDate: "2024-01-20",
      status: "scheduled",
      waterfall: {
        returnOfCapital: 140000,
        preferredReturn: 108000,
        profitSplit: 64000,
      },
      avgDistribution: 17333,
      processedDate: null,
    },
    {
      id: 3,
      offering: "Parkside Townhomes Fund",
      distributionType: "Annual Distribution",
      period: "Year 2023",
      totalAmount: 185000,
      investorCount: 12,
      distributionDate: "2024-02-01",
      status: "pending",
      waterfall: {
        returnOfCapital: 85000,
        preferredReturn: 68000,
        profitSplit: 32000,
      },
      avgDistribution: 15417,
      processedDate: null,
    },
    {
      id: 4,
      offering: "Riverside Apartments Fund",
      distributionType: "Quarterly Distribution",
      period: "Q3 2023",
      totalAmount: 398000,
      investorCount: 24,
      distributionDate: "2023-10-15",
      status: "processed",
      waterfall: {
        returnOfCapital: 175000,
        preferredReturn: 135000,
        profitSplit: 88000,
      },
      avgDistribution: 16583,
      processedDate: "2023-10-15",
    },
  ]

  const filteredDistributions = distributions.filter(d =>
    statusFilter === 'all' || d.status === statusFilter
  )

  const metrics = {
    totalAmount: distributions.reduce((sum, d) => sum + d.totalAmount, 0),
    pendingAmount: distributions.filter(d => d.status !== 'processed').reduce((sum, d) => sum + d.totalAmount, 0),
    processedCount: distributions.filter(d => d.status === 'processed').length,
    totalInvestors: distributions.reduce((sum, d) => sum + d.investorCount, 0) / distributions.length,
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'processed': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'processed': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'scheduled': return <Calendar className="h-5 w-5 text-blue-600" />
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Fund Manager Portal"
        roleIcon={Building}
        userName={user?.name || "Fund Manager"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        {/* Header */}
        <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
          <div className="container max-w-7xl px-6 py-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black">Distribution Management</h1>
                <p className="text-white/80">Process and track investor distributions with waterfall calculations</p>
              </div>
              <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <Link href="/dashboard/fund-manager/distributions/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Distribution
                </Link>
              </Button>
            </div>

            {/* Summary Metrics */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Distributed</p>
                    <p className="text-2xl font-black">${(metrics.totalAmount / 1000000).toFixed(2)}M</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Pending</p>
                    <p className="text-2xl font-black">${(metrics.pendingAmount / 1000).toFixed(0)}K</p>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Processed</p>
                    <p className="text-3xl font-black">{metrics.processedCount}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Avg Investors</p>
                    <p className="text-3xl font-black">{Math.round(metrics.totalInvestors)}</p>
                  </div>
                  <Users className="h-10 w-10 text-white/50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl px-6 py-8 mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              {(['all', 'pending', 'scheduled', 'processed'] as const).map((status) => (
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

          {/* Distributions Grid */}
          <div className="grid gap-6">
            {filteredDistributions.map((distribution) => (
              <Card key={distribution.id} className="border-4 border-[#E07A47] bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Distribution Info */}
                    <div className="lg:col-span-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-black mb-2">{distribution.offering}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {distribution.distributionType}
                          </p>
                          <Badge className="bg-[#56CCF2] text-white mb-3">
                            {distribution.period}
                          </Badge>
                          <div className="flex items-center gap-2 mt-3">
                            {getStatusIcon(distribution.status)}
                            <Badge className={`${getStatusColor(distribution.status)} text-white`}>
                              {distribution.status.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distribution Date:</span>
                          <span className="font-bold">{new Date(distribution.distributionDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investors:</span>
                          <span className="font-bold">{distribution.investorCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avg per Investor:</span>
                          <span className="font-bold">${distribution.avgDistribution.toLocaleString()}</span>
                        </div>
                        {distribution.processedDate && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Processed:</span>
                            <span className="font-bold text-green-600">{new Date(distribution.processedDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Waterfall Breakdown */}
                    <div className="lg:col-span-5">
                      <h4 className="font-bold text-lg mb-4">Waterfall Distribution</h4>
                      <div className="space-y-3">
                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold">1. Return of Capital</span>
                            <span className="text-lg font-black">${(distribution.waterfall.returnOfCapital / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(distribution.waterfall.returnOfCapital / distribution.totalAmount) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((distribution.waterfall.returnOfCapital / distribution.totalAmount) * 100).toFixed(1)}% of total
                          </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold">2. Preferred Return (8%)</span>
                            <span className="text-lg font-black text-green-600">${(distribution.waterfall.preferredReturn / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${(distribution.waterfall.preferredReturn / distribution.totalAmount) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((distribution.waterfall.preferredReturn / distribution.totalAmount) * 100).toFixed(1)}% of total
                          </p>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold">3. Profit Split (70/30)</span>
                            <span className="text-lg font-black text-[#E07A47]">${(distribution.waterfall.profitSplit / 1000).toFixed(0)}K</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-[#E07A47] h-2 rounded-full"
                              style={{ width: `${(distribution.waterfall.profitSplit / distribution.totalAmount) * 100}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {((distribution.waterfall.profitSplit / distribution.totalAmount) * 100).toFixed(1)}% of total
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Total & Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-between">
                      <div>
                        <div className="bg-[#56CCF2]/10 rounded-lg p-4 border-2 border-[#56CCF2] mb-4">
                          <p className="text-sm font-bold text-[#56CCF2] mb-2">Total Distribution</p>
                          <p className="text-4xl font-black text-[#56CCF2]">${(distribution.totalAmount / 1000).toFixed(0)}K</p>
                        </div>

                        {distribution.status === 'pending' && (
                          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 mb-4">
                            <p className="text-xs font-semibold text-yellow-800">
                              Awaiting approval and scheduling
                            </p>
                          </div>
                        )}

                        {distribution.status === 'scheduled' && (
                          <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-3 mb-4">
                            <p className="text-xs font-semibold text-blue-800">
                              Scheduled for {new Date(distribution.distributionDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        {distribution.status === 'processed' && (
                          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <p className="text-xs font-semibold text-green-800">
                                Distributed to {distribution.investorCount} investors
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                          <Link href={`/dashboard/fund-manager/distributions/${distribution.id}`}>
                            View Details
                          </Link>
                        </Button>

                        {distribution.status === 'pending' && (
                          <Button asChild variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                            <Link href={`/dashboard/fund-manager/distributions/${distribution.id}/approve`}>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve & Schedule
                            </Link>
                          </Button>
                        )}

                        {distribution.status === 'scheduled' && (
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/fund-manager/distributions/${distribution.id}/process`}>
                              <Send className="h-4 w-4 mr-2" />
                              Process Now
                            </Link>
                          </Button>
                        )}

                        {distribution.status === 'processed' && (
                          <Button asChild variant="outline" className="w-full border-2 border-slate-300">
                            <Link href={`/dashboard/fund-manager/distributions/${distribution.id}/report`}>
                              Download Report
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

          {/* Waterfall Explanation Card */}
          <Card className="border-4 border-[#56CCF2] bg-white mt-8">
            <CardHeader>
              <CardTitle className="text-2xl">Distribution Waterfall Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500" />
                    <h4 className="font-bold">Tier 1: Return of Capital</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    First priority: Return 100% of investor capital contributions
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-green-500" />
                    <h4 className="font-bold">Tier 2: Preferred Return</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Second priority: 8% annual preferred return to investors
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-4 h-4 rounded-full bg-[#E07A47]" />
                    <h4 className="font-bold">Tier 3: Profit Split</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remaining profits: 70% to investors, 30% to sponsor (promote)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

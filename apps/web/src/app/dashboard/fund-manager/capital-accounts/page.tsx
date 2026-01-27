"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  PiggyBank,
  TrendingUp,
  DollarSign,
  User,
  Download,
  BarChart3,
  CheckCircle2,
  Building,
  Building2,
  Users,
  Home,
  Receipt,
  Calculator,
  FileText,
  MessageSquare,
  Search,
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

export default function CapitalAccountsPage() {
  const { user, logout } = useAuth()
  const [offeringFilter, setOfferingFilter] = useState<'all' | string>('all')

  // Mock capital account data
  const accounts = [
    {
      id: 1,
      investorName: "Sarah Johnson",
      investorEmail: "sarah.j@email.com",
      offering: "Riverside Apartments Fund",
      committedCapital: 250000,
      calledCapital: 250000,
      uncalledCapital: 0,
      returnOfCapital: 45000,
      preferredReturnPaid: 32500,
      profitDistributions: 15000,
      totalDistributions: 92500,
      currentCapitalBalance: 157500,
      unrealizedGain: 48000,
      totalValue: 205500,
      tvpi: 1.64, // Total Value / Paid-In
      dpi: 0.37, // Distributed / Paid-In
      irr: 14.2,
      investmentDate: "2021-03-15",
    },
    {
      id: 2,
      investorName: "Michael Chen",
      investorEmail: "m.chen@email.com",
      offering: "Downtown Lofts Fund",
      committedCapital: 500000,
      calledCapital: 500000,
      uncalledCapital: 0,
      returnOfCapital: 75000,
      preferredReturnPaid: 52000,
      profitDistributions: 28000,
      totalDistributions: 155000,
      currentCapitalBalance: 345000,
      unrealizedGain: 92000,
      totalValue: 437000,
      tvpi: 1.18,
      dpi: 0.31,
      irr: 11.8,
      investmentDate: "2020-11-22",
    },
    {
      id: 3,
      investorName: "Emily Rodriguez",
      investorEmail: "emily.r@email.com",
      offering: "Parkside Townhomes Fund",
      committedCapital: 150000,
      calledCapital: 150000,
      uncalledCapital: 0,
      returnOfCapital: 18000,
      preferredReturnPaid: 14500,
      profitDistributions: 8200,
      totalDistributions: 40700,
      currentCapitalBalance: 109300,
      unrealizedGain: 25000,
      totalValue: 134300,
      tvpi: 1.17,
      dpi: 0.27,
      irr: 10.5,
      investmentDate: "2022-06-10",
    },
    {
      id: 4,
      investorName: "David Kim",
      investorEmail: "d.kim@email.com",
      offering: "Riverside Apartments Fund",
      committedCapital: 350000,
      calledCapital: 350000,
      uncalledCapital: 0,
      returnOfCapital: 63000,
      preferredReturnPaid: 45500,
      profitDistributions: 21000,
      totalDistributions: 129500,
      currentCapitalBalance: 220500,
      unrealizedGain: 67200,
      totalValue: 287700,
      tvpi: 1.64,
      dpi: 0.37,
      irr: 14.1,
      investmentDate: "2021-03-15",
    },
    {
      id: 5,
      investorName: "Amanda Foster",
      investorEmail: "a.foster@email.com",
      offering: "Downtown Lofts Fund",
      committedCapital: 200000,
      calledCapital: 200000,
      uncalledCapital: 0,
      returnOfCapital: 30000,
      preferredReturnPaid: 20800,
      profitDistributions: 11200,
      totalDistributions: 62000,
      currentCapitalBalance: 138000,
      unrealizedGain: 36800,
      totalValue: 174800,
      tvpi: 1.18,
      dpi: 0.31,
      irr: 11.9,
      investmentDate: "2020-11-22",
    },
  ]

  const offerings = ['Riverside Apartments Fund', 'Downtown Lofts Fund', 'Parkside Townhomes Fund']

  const filteredAccounts = offeringFilter === 'all'
    ? accounts
    : accounts.filter(a => a.offering === offeringFilter)

  const totals = filteredAccounts.reduce((acc, a) => ({
    committedCapital: acc.committedCapital + a.committedCapital,
    calledCapital: acc.calledCapital + a.calledCapital,
    totalDistributions: acc.totalDistributions + a.totalDistributions,
    currentCapitalBalance: acc.currentCapitalBalance + a.currentCapitalBalance,
    totalValue: acc.totalValue + a.totalValue,
  }), { committedCapital: 0, calledCapital: 0, totalDistributions: 0, currentCapitalBalance: 0, totalValue: 0 })

  const avgMetrics = {
    tvpi: (totals.totalValue / totals.calledCapital).toFixed(2),
    dpi: (totals.totalDistributions / totals.calledCapital).toFixed(2),
    avgIRR: (filteredAccounts.reduce((sum, a) => sum + a.irr, 0) / filteredAccounts.length).toFixed(1),
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
                <h1 className="text-4xl font-black">Capital Accounts</h1>
                <p className="text-white/80">Track investor capital positions and returns</p>
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
                    <p className="text-white/70 text-sm mb-1">Total Committed</p>
                    <p className="text-2xl font-black">${(totals.committedCapital / 1000000).toFixed(2)}M</p>
                  </div>
                  <PiggyBank className="h-10 w-10 text-white/50" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Distributed</p>
                    <p className="text-2xl font-black">${(totals.totalDistributions / 1000000).toFixed(2)}M</p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Total Value</p>
                    <p className="text-2xl font-black">${(totals.totalValue / 1000000).toFixed(2)}M</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-yellow-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Avg TVPI</p>
                    <p className="text-3xl font-black">{avgMetrics.tvpi}x</p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Avg IRR</p>
                    <p className="text-3xl font-black">{avgMetrics.avgIRR}%</p>
                  </div>
                  <TrendingUp className="h-10 w-10 text-green-400" />
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
                placeholder="Search by investor name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white"
              />
            </div>
            <div>
              <select
                value={offeringFilter}
                onChange={(e) => setOfferingFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white"
              >
                <option value="all">All Offerings</option>
                {offerings.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Capital Accounts Grid */}
          <div className="grid gap-6">
            {filteredAccounts.map((account) => (
              <Card key={account.id} className="border-4 border-[#E07A47] bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Investor Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-3 mb-3">
                        <User className="h-6 w-6 text-[#E07A47]" />
                        <div>
                          <h3 className="text-xl font-black">{account.investorName}</h3>
                          <p className="text-sm text-muted-foreground">{account.investorEmail}</p>
                        </div>
                      </div>
                      <Badge className="bg-[#56CCF2] text-white mb-3">
                        {account.offering}
                      </Badge>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Investment Date:</span>
                          <span className="font-bold">{new Date(account.investmentDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Committed:</span>
                          <span className="font-bold">${(account.committedCapital / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Called:</span>
                          <span className="font-bold">${(account.calledCapital / 1000).toFixed(0)}K</span>
                        </div>
                      </div>
                    </div>

                    {/* Capital Activity */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Return of Capital</p>
                        <p className="text-2xl font-black">${(account.returnOfCapital / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Preferred Return</p>
                        <p className="text-2xl font-black text-green-600">${(account.preferredReturnPaid / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Profit Distributions</p>
                        <p className="text-2xl font-black text-[#56CCF2]">${(account.profitDistributions / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Total Distributed</p>
                        <p className="text-2xl font-black text-[#E07A47]">${(account.totalDistributions / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Current Balance</p>
                        <p className="text-2xl font-black">${(account.currentCapitalBalance / 1000).toFixed(0)}K</p>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground mb-1">Unrealized Gain</p>
                        <p className="text-2xl font-black text-green-600">${(account.unrealizedGain / 1000).toFixed(0)}K</p>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="lg:col-span-4">
                      <div className="bg-[#56CCF2]/10 rounded-lg p-4 border-2 border-[#56CCF2] mb-4">
                        <p className="text-sm font-bold text-[#56CCF2] mb-2">Total Account Value</p>
                        <p className="text-4xl font-black text-[#56CCF2]">${(account.totalValue / 1000).toFixed(0)}K</p>
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-bold text-green-600">
                            +${((account.totalValue - account.calledCapital) / 1000).toFixed(0)}K gain
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">TVPI</p>
                          <p className="text-xl font-black text-[#56CCF2]">{account.tvpi}x</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">DPI</p>
                          <p className="text-xl font-black text-[#E07A47]">{account.dpi}x</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center">
                          <p className="text-xs text-muted-foreground mb-1">IRR</p>
                          <p className="text-xl font-black text-green-600">{account.irr}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                          <Link href={`/dashboard/fund-manager/capital-accounts/${account.id}`}>
                            View Full Account
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/capital-accounts/${account.id}/statement`}>
                            Generate Statement
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

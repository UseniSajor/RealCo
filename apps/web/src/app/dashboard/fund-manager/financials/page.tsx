"use client"

import { useState, useEffect } from "react"
import { operatingStatementAPI, OperatingStatement } from "@/lib/api/operating-statement.api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  ArrowLeft,
  Download,
  FileText,
  AlertCircle,
  Home,
  Building2,
  Users,
  Receipt,
  Calculator,
  MessageSquare,
  Building,
} from "lucide-react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"

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

export default function FinancialsPage() {
  const { user, logout } = useAuth()

  const [period, setPeriod] = useState<'monthly' | 'quarterly' | 'ytd'>('monthly')
  const [selectedProperty, setSelectedProperty] = useState<'all' | string>('all')
  const [statements, setStatements] = useState<OperatingStatement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    operatingStatementAPI.getAll()
      .then(res => {
        setStatements(res.items)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message || 'Failed to load financials')
        setLoading(false)
      })
  }, [])

  // Get unique property/project names for filter
  const propertyOptions = Array.from(new Set(statements.map(s => s.project?.developmentProject.name || 'Unknown')))

  const filteredStatements = selectedProperty === 'all'
    ? statements
    : statements.filter(s => (s.project?.developmentProject.name || 'Unknown') === selectedProperty)

  const totals = filteredStatements.reduce((acc, s) => ({
    rentalIncome: acc.rentalIncome + s.rentalIncome,
    effectiveGrossIncome: acc.effectiveGrossIncome + s.effectiveGrossIncome,
    totalOpex: acc.totalOpex + s.totalOpex,
    noi: acc.noi + s.noi,
    budgetedNOI: acc.budgetedNOI + s.budgetedNOI,
  }), { rentalIncome: 0, effectiveGrossIncome: 0, totalOpex: 0, noi: 0, budgetedNOI: 0 })

  const portfolioMetrics = {
    noiMargin: totals.effectiveGrossIncome ? ((totals.noi / totals.effectiveGrossIncome) * 100).toFixed(1) : '0',
    opexRatio: totals.effectiveGrossIncome ? ((totals.totalOpex / totals.effectiveGrossIncome) * 100).toFixed(1) : '0',
    avgVariance: totals.budgetedNOI ? (((totals.noi - totals.budgetedNOI) / totals.budgetedNOI) * 100).toFixed(1) : '0',
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
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Financial Performance</h1>
                <p className="text-white/80">Operating statements and NOI tracking</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <FileText className="h-4 w-4 mr-2" />
                Import Statement
              </Button>
            </div>
          </div>

          {/* Portfolio Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total NOI</p>
                  <p className="text-3xl font-black">${(totals.noi / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">NOI Margin</p>
                  <p className="text-3xl font-black">{portfolioMetrics.noiMargin}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">OpEx Ratio</p>
                  <p className="text-3xl font-black">{portfolioMetrics.opexRatio}%</p>
                </div>
                <BarChart3 className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">vs Budget</p>
                  <p className={`text-3xl font-black ${parseFloat(portfolioMetrics.avgVariance) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {parseFloat(portfolioMetrics.avgVariance) >= 0 ? '+' : ''}{portfolioMetrics.avgVariance}%
                  </p>
                </div>
                {parseFloat(portfolioMetrics.avgVariance) >= 0 ? 
                  <TrendingUp className="h-10 w-10 text-green-400" /> :
                  <TrendingDown className="h-10 w-10 text-red-400" />
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold mb-2">Period:</p>
            <div className="flex gap-2">
              {(['monthly', 'quarterly', 'ytd'] as const).map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPeriod(p)}
                  className={period === p ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
                >
                  {p === 'ytd' ? 'YTD' : p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Property:</p>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="px-4 py-2 rounded-lg border-2 border-slate-200 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white bg-white text-slate-900"
            >
              <option value="all">All Properties</option>
              {statements.map(s => (
                <option key={s.property} value={s.property}>{s.property}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Operating Statements */}
        <div className="space-y-6">
          {filteredStatements.map((statement) => (
            <Card key={statement.id} className="border-4 border-[#E07A47] bg-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-900">{statement.property}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground text-slate-900/70">{statement.period}</span>
                      <Badge className={`ml-2 ${statement.noiVariance >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {statement.noiVariance >= 0 ? '+' : ''}{statement.noiVariancePct}% vs Budget
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground text-slate-900/70 mb-1">Net Operating Income</p>
                    <p className="text-4xl font-black text-[#56CCF2]">${(statement.noi / 1000).toFixed(1)}K</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Income Section */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 text-slate-900">Income</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Rental Income</span>
                        <span className="font-bold text-slate-900">${(statement.rentalIncome / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Other Income</span>
                        <span className="font-bold text-slate-900">${(statement.otherIncome / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Vacancy Loss</span>
                        <span className="font-bold">-${(statement.vacancyLoss / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="border-t-2 border-slate-200 border-slate-200 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-900">Effective Gross Income</span>
                          <span className="text-[#56CCF2]">${(statement.effectiveGrossIncome / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operating Expenses */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 text-slate-900">Operating Expenses</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Property Management</span>
                        <span className="font-bold text-slate-900">${(statement.propertyManagement / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Utilities</span>
                        <span className="font-bold text-slate-900">${(statement.utilities / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Insurance</span>
                        <span className="font-bold text-slate-900">${(statement.insurance / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Property Taxes</span>
                        <span className="font-bold text-slate-900">${(statement.propertyTaxes / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Repairs & Maintenance</span>
                        <span className="font-bold text-slate-900">${(statement.repairsMaintenance / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Marketing</span>
                        <span className="font-bold text-slate-900">${(statement.marketing / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground text-slate-900/70">Administrative</span>
                        <span className="font-bold text-slate-900">${(statement.administrative / 1000).toFixed(1)}K</span>
                      </div>
                      <div className="border-t-2 border-slate-200 border-slate-200 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-900">Total OpEx</span>
                          <span className="text-red-600">${(statement.totalOpex / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Analysis */}
                  <div>
                    <h4 className="font-bold text-lg mb-4 text-slate-900">Performance</h4>
                    <div className="space-y-4">
                      <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">Net Operating Income</p>
                        <p className="text-3xl font-black text-[#56CCF2]">${(statement.noi / 1000).toFixed(1)}K</p>
                      </div>

                      <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">Budgeted NOI</p>
                        <p className="text-2xl font-black text-slate-900">${(statement.budgetedNOI / 1000).toFixed(1)}K</p>
                      </div>

                      <div className={`rounded-lg p-4 ${statement.noiVariance >= 0 ? 'bg-green-50 bg-green-50 border-2 border-green-500' : 'bg-red-50 bg-red-50 border-2 border-red-500'}`}>
                        <div className="flex items-center gap-2 mb-1">
                          {statement.noiVariance >= 0 ? 
                            <TrendingUp className="h-4 w-4 text-green-600" /> :
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          }
                          <p className="text-xs font-semibold text-muted-foreground text-slate-900/70">Variance</p>
                        </div>
                        <p className={`text-2xl font-black ${statement.noiVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {statement.noiVariance >= 0 ? '+' : ''}${(statement.noiVariance / 1000).toFixed(1)}K
                        </p>
                        <p className="text-sm font-bold mt-1 text-slate-900">
                          {statement.noiVariancePct >= 0 ? '+' : ''}{statement.noiVariancePct}%
                        </p>
                      </div>

                      <Button asChild className="w-full bg-[#E07A47] hover:bg-[#E07A47]/90">
                        <Link href={`/dashboard/fund-manager/financials/${statement.id}`}>
                          View Full Statement
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Portfolio Summary Card */}
        {selectedProperty === 'all' && (
          <Card className="border-4 border-[#56CCF2] bg-white mt-6">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Portfolio Summary - {period.toUpperCase()}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-slate-900/70 mb-2">Total Rental Income</p>
                  <p className="text-3xl font-black text-slate-900">${(totals.rentalIncome / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-slate-900/70 mb-2">Effective Gross Income</p>
                  <p className="text-3xl font-black text-slate-900">${(totals.effectiveGrossIncome / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground text-slate-900/70 mb-2">Total Operating Expenses</p>
                  <p className="text-3xl font-black text-red-600">${(totals.totalOpex / 1000).toFixed(0)}K</p>
                </div>
                <div className="bg-[#56CCF2]/10 bg-[#56CCF2]/10 rounded-lg p-4 border-2 border-[#56CCF2]">
                  <p className="text-sm font-bold text-[#56CCF2] mb-2">Portfolio NOI</p>
                  <p className="text-4xl font-black text-[#56CCF2]">${(totals.noi / 1000).toFixed(0)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </main>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Percent,
  Plus,
  Download,
  BarChart3,
  FileText,
  Home,
  Search,
  UserPlus,
  MapPin,
  Target,
  Users,
  MessageSquare,
  Settings,
  Building2,
  LineChart,
  PieChart,
  Activity,
  Sliders,
  Table,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export default function UnderwritingPage() {
  const { user, logout } = useAuth()

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]
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

  // State for advanced model inputs
  const [showAdvancedModel, setShowAdvancedModel] = useState(false)
  const [advancedInputs, setAdvancedInputs] = useState({
    purchasePrice: "42500000",
    acquisitionCosts: "3",
    debtAmount: "70",
    interestRate: "6.5",
    loanTerm: "10",
    amortization: "30",
    exitCapRate: "6.5",
    holdPeriod: "5",
    rentGrowth: "3",
    expenseGrowth: "2.5",
    vacancyRate: "5",
    managementFee: "4",
    capexReserve: "250"
  })

  // Sensitivity analysis data
  const sensitivityData = {
    irr: [
      { exitCap: "5.5%", rentGrowth2: "22.5%", rentGrowth3: "21.2%", rentGrowth4: "19.8%" },
      { exitCap: "6.0%", rentGrowth2: "20.8%", rentGrowth3: "19.5%", rentGrowth4: "18.2%" },
      { exitCap: "6.5%", rentGrowth2: "19.2%", rentGrowth3: "17.9%", rentGrowth4: "16.6%" },
      { exitCap: "7.0%", rentGrowth2: "17.6%", rentGrowth3: "16.3%", rentGrowth4: "15.0%" },
      { exitCap: "7.5%", rentGrowth2: "16.1%", rentGrowth3: "14.8%", rentGrowth4: "13.5%" }
    ]
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development Group"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24">
        {/* Header */}
        <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
          <div className="container max-w-7xl px-6 py-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <BackButton href="/dashboard/sponsor" />
                <div>
                  <h1 className="text-4xl font-black">Underwriting & Pro Forma</h1>
                  <p className="text-white/80">Financial models and investment analysis</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                  onClick={() => setShowAdvancedModel(!showAdvancedModel)}
                >
                  <Sliders className="h-4 w-4 mr-2" />
                  {showAdvancedModel ? "Hide" : "Show"} Advanced Model
                </Button>
                <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                  <Link href="/dashboard/sponsor/underwriting/new">
                    <Plus className="h-4 w-4 mr-2" />
                    New Model
                  </Link>
                </Button>
              </div>
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
        {/* Advanced Model Builder */}
        {showAdvancedModel && (
          <div className="mb-8 space-y-6">
            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-6 w-6 text-[#56CCF2]" />
                  Advanced Pro Forma Model Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  {/* Acquisition Inputs */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#E07A47] flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Acquisition
                    </h4>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Purchase Price ($)</label>
                      <Input
                        type="number"
                        value={advancedInputs.purchasePrice}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, purchasePrice: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Acquisition Costs (%)</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={advancedInputs.acquisitionCosts}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, acquisitionCosts: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                  </div>

                  {/* Debt Inputs */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#56CCF2] flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Debt Assumptions
                    </h4>
                    <div>
                      <label className="text-sm font-medium mb-1 block">LTV (%)</label>
                      <Input
                        type="number"
                        step="1"
                        value={advancedInputs.debtAmount}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, debtAmount: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Interest Rate (%)</label>
                      <Input
                        type="number"
                        step="0.25"
                        value={advancedInputs.interestRate}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, interestRate: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Loan Term (years)</label>
                      <Input
                        type="number"
                        value={advancedInputs.loanTerm}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, loanTerm: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Amortization (years)</label>
                      <Input
                        type="number"
                        value={advancedInputs.amortization}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, amortization: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                  </div>

                  {/* Operating Assumptions */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-green-600 flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Operating Assumptions
                    </h4>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Rent Growth (%/yr)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={advancedInputs.rentGrowth}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, rentGrowth: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Expense Growth (%/yr)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={advancedInputs.expenseGrowth}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, expenseGrowth: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Vacancy Rate (%)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={advancedInputs.vacancyRate}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, vacancyRate: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Management Fee (%)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={advancedInputs.managementFee}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, managementFee: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                  </div>

                  {/* Exit Assumptions */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-purple-600 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Exit Assumptions
                    </h4>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Hold Period (years)</label>
                      <Input
                        type="number"
                        value={advancedInputs.holdPeriod}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, holdPeriod: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Exit Cap Rate (%)</label>
                      <Input
                        type="number"
                        step="0.25"
                        value={advancedInputs.exitCapRate}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, exitCapRate: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">CapEx Reserve ($/unit/yr)</label>
                      <Input
                        type="number"
                        value={advancedInputs.capexReserve}
                        onChange={(e) => setAdvancedInputs(prev => ({ ...prev, capexReserve: e.target.value }))}
                        className="border-2"
                      />
                    </div>
                    <Button className="w-full mt-4 bg-[#E07A47] hover:bg-[#D96835]">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Run Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card className="border-4 border-[#E07A47]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-6 w-6 text-[#E07A47]" />
                  IRR Sensitivity Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-3 px-4 font-bold bg-slate-100">Exit Cap Rate</th>
                        <th className="text-center py-3 px-4 font-bold bg-green-50">2% Rent Growth</th>
                        <th className="text-center py-3 px-4 font-bold bg-yellow-50">3% Rent Growth</th>
                        <th className="text-center py-3 px-4 font-bold bg-red-50">4% Rent Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sensitivityData.irr.map((row, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50">
                          <td className="py-3 px-4 font-bold bg-slate-50">{row.exitCap}</td>
                          <td className="py-3 px-4 text-center text-green-600 font-bold">{row.rentGrowth2}</td>
                          <td className="py-3 px-4 text-center text-yellow-600 font-bold">{row.rentGrowth3}</td>
                          <td className="py-3 px-4 text-center text-red-600 font-bold">{row.rentGrowth4}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-bold text-green-800">Base Case</span>
                    </div>
                    <p className="text-2xl font-black text-green-600">18.5% IRR</p>
                    <p className="text-sm text-green-700">6.5% exit cap / 3% rent growth</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUpRight className="h-5 w-5 text-blue-600" />
                      <span className="font-bold text-blue-800">Upside Case</span>
                    </div>
                    <p className="text-2xl font-black text-blue-600">22.5% IRR</p>
                    <p className="text-sm text-blue-700">5.5% exit cap / 2% rent growth</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowDownRight className="h-5 w-5 text-yellow-600" />
                      <span className="font-bold text-yellow-800">Downside Case</span>
                    </div>
                    <p className="text-2xl font-black text-yellow-600">13.5% IRR</p>
                    <p className="text-sm text-yellow-700">7.5% exit cap / 4% rent growth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
      </main>
    </div>
  )
}

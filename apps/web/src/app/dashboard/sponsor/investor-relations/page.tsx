"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Hammer,
  BarChart3,
  Calculator,
  Target,
  Search,
  UserPlus,
  MapPin,
  Home,
  Plus,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  Download,
  Eye,
  MessageSquare,
  Briefcase,
  PieChart,
  ArrowUpRight,
  Filter,
  Star,
  Bell,
  Settings,
  Globe,
  Video,
  FileSpreadsheet,
  Wallet,
  HandshakeIcon,
  Award,
  Megaphone
} from "lucide-react"

// Mock investor data
const MOCK_INVESTORS = [
  {
    id: "inv_001",
    name: "Sarah Chen",
    email: "sarah.chen@investment.com",
    phone: "(512) 555-0123",
    type: "Accredited Individual",
    status: "active",
    totalInvested: 2500000,
    activeDeals: 3,
    avgInvestment: 833333,
    joinDate: "2022-03-15",
    lastActivity: "2024-01-22",
    commitments: [
      { deal: "Sunset Apartments", amount: 500000, status: "funded" },
      { deal: "Downtown Office Tower", amount: 1000000, status: "funded" },
      { deal: "Riverside Condos", amount: 1000000, status: "committed" }
    ],
    tags: ["Repeat Investor", "High Net Worth", "Quick Decisions"],
    relationship: "Strong"
  },
  {
    id: "inv_002",
    name: "Capital Partners Fund III",
    email: "investments@capitalpartners.com",
    phone: "(214) 555-0456",
    type: "Family Office",
    status: "active",
    totalInvested: 8500000,
    activeDeals: 5,
    avgInvestment: 1700000,
    joinDate: "2021-06-20",
    lastActivity: "2024-01-23",
    commitments: [
      { deal: "Industrial Portfolio", amount: 3000000, status: "funded" },
      { deal: "Sunset Apartments", amount: 2500000, status: "funded" },
      { deal: "Retail Center", amount: 1500000, status: "committed" },
      { deal: "Student Housing", amount: 1500000, status: "pending" }
    ],
    tags: ["Institutional", "Long-term Partner", "Multi-deal"],
    relationship: "Strategic Partner"
  },
  {
    id: "inv_003",
    name: "Michael Thompson",
    email: "m.thompson@gmail.com",
    phone: "(713) 555-0789",
    type: "Accredited Individual",
    status: "pending",
    totalInvested: 0,
    activeDeals: 0,
    avgInvestment: 0,
    joinDate: "2024-01-15",
    lastActivity: "2024-01-20",
    commitments: [],
    tags: ["New Lead", "Referral"],
    relationship: "Prospect"
  },
  {
    id: "inv_004",
    name: "Horizon Wealth Advisors",
    email: "deals@horizonwealth.com",
    phone: "(210) 555-0321",
    type: "RIA/Wealth Manager",
    status: "active",
    totalInvested: 4200000,
    activeDeals: 4,
    avgInvestment: 350000,
    joinDate: "2022-09-10",
    lastActivity: "2024-01-21",
    commitments: [
      { deal: "Sunset Apartments", amount: 1200000, status: "funded" },
      { deal: "Downtown Office Tower", amount: 1500000, status: "funded" },
      { deal: "Riverside Condos", amount: 750000, status: "committed" },
      { deal: "Medical Office", amount: 750000, status: "pending" }
    ],
    tags: ["Channel Partner", "Multiple Clients", "Quarterly Updates"],
    relationship: "Strong"
  }
]

const MOCK_ACTIVE_RAISES = [
  {
    id: "raise_001",
    dealName: "Sunset Apartments Phase 2",
    location: "Austin, TX",
    targetRaise: 10000000,
    currentRaise: 8500000,
    minInvestment: 100000,
    investors: 127,
    softCircle: 1200000,
    hardClose: "2024-02-28",
    status: "active",
    projectedIRR: "18.5%",
    equityMultiple: "2.1x",
    holdPeriod: "4 years"
  },
  {
    id: "raise_002",
    dealName: "Riverside Condos",
    location: "Portland, OR",
    targetRaise: 8000000,
    currentRaise: 6200000,
    minInvestment: 50000,
    investors: 89,
    softCircle: 800000,
    hardClose: "2024-03-15",
    status: "active",
    projectedIRR: "16.2%",
    equityMultiple: "1.9x",
    holdPeriod: "3 years"
  }
]

const MOCK_COMMUNICATIONS = [
  { id: "comm_001", type: "Quarterly Update", deal: "Downtown Office Tower", date: "2024-01-15", recipients: 183, openRate: "78%" },
  { id: "comm_002", type: "Distribution Notice", deal: "Industrial Portfolio", date: "2024-01-10", recipients: 156, openRate: "92%" },
  { id: "comm_003", type: "New Opportunity", deal: "Medical Office Building", date: "2024-01-08", recipients: 342, openRate: "65%" },
  { id: "comm_004", type: "K-1 Notification", deal: "All Active Deals", date: "2024-01-05", recipients: 342, openRate: "88%" }
]

export default function InvestorRelationsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"investors" | "raises" | "communications" | "documents">("investors")
  const [investorFilter, setInvestorFilter] = useState("all")

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Construction", href: "/dashboard/sponsor/construction", icon: Hammer },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Draw Requests", href: "/dashboard/sponsor/draw-request", icon: FileText },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredInvestors = investorFilter === "all"
    ? MOCK_INVESTORS
    : MOCK_INVESTORS.filter(inv => inv.status === investorFilter)

  const totalAUM = MOCK_INVESTORS.reduce((sum, inv) => sum + inv.totalInvested, 0)
  const activeInvestors = MOCK_INVESTORS.filter(inv => inv.status === "active").length
  const pendingCommitments = MOCK_ACTIVE_RAISES.reduce((sum, r) => sum + r.softCircle, 0)

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development Group"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BackButton href="/dashboard/sponsor" />
              <div>
                <h1 className="text-3xl font-black">Investor Relations & Capital Raise</h1>
                <p className="text-muted-foreground">Manage investors, raise capital, and track communications</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-2">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
              <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                <Plus className="mr-2 h-4 w-4" />
                Add Investor
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total AUM</p>
                    <p className="text-2xl font-black">{formatCurrency(totalAUM)}</p>
                    <p className="text-xs text-green-600">+12% YoY</p>
                  </div>
                  <Wallet className="h-8 w-8 text-[#E07A47]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#56CCF2]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Investors</p>
                    <p className="text-2xl font-black">{activeInvestors}</p>
                    <p className="text-xs text-muted-foreground">of {MOCK_INVESTORS.length} total</p>
                  </div>
                  <Users className="h-8 w-8 text-[#56CCF2]" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Current Raise</p>
                    <p className="text-2xl font-black">{formatCurrency(14700000)}</p>
                    <p className="text-xs text-muted-foreground">of $18M target</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Soft Circle</p>
                    <p className="text-2xl font-black">{formatCurrency(pendingCommitments)}</p>
                    <p className="text-xs text-yellow-600">Pending close</p>
                  </div>
                  <HandshakeIcon className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Repeat Rate</p>
                    <p className="text-2xl font-black">72%</p>
                    <p className="text-xs text-green-600">Industry leading</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b-2 pb-4">
            {[
              { id: "investors", label: "Investor CRM", icon: Users },
              { id: "raises", label: "Active Raises", icon: TrendingUp },
              { id: "communications", label: "Communications", icon: Send },
              { id: "documents", label: "Documents & Reports", icon: FileText }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={activeTab === tab.id ? "bg-[#E07A47]" : "border-2"}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              )
            })}
          </div>

          {/* Investor CRM Tab */}
          {activeTab === "investors" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex gap-2">
                {["all", "active", "pending"].map(filter => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={investorFilter === filter ? "default" : "outline"}
                    onClick={() => setInvestorFilter(filter)}
                    className={investorFilter === filter ? "bg-[#56CCF2]" : "border-2"}
                  >
                    {filter === "all" ? "All Investors" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
                <div className="flex-1" />
                <Input placeholder="Search investors..." className="w-64 border-2" />
              </div>

              {/* Investor Cards */}
              <div className="space-y-4">
                {filteredInvestors.map(investor => (
                  <Card key={investor.id} className="border-4 border-slate-300 hover:border-[#E07A47] transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-[#E07A47]/10 flex items-center justify-center">
                              <Users className="h-6 w-6 text-[#E07A47]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-xl">{investor.name}</h3>
                                <Badge className={investor.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                  {investor.status}
                                </Badge>
                                <Badge variant="outline" className="border-2">{investor.type}</Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {investor.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {investor.phone}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {investor.tags.map((tag, idx) => (
                              <Badge key={idx} className="bg-purple-100 text-purple-700">{tag}</Badge>
                            ))}
                            <Badge className={
                              investor.relationship === "Strategic Partner" ? "bg-[#E07A47]/20 text-[#E07A47]" :
                              investor.relationship === "Strong" ? "bg-green-100 text-green-700" :
                              "bg-blue-100 text-blue-700"
                            }>
                              <Star className="h-3 w-3 mr-1" />
                              {investor.relationship}
                            </Badge>
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-5 gap-4 p-4 bg-[#6b7280]/10 rounded-xl">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Invested</p>
                              <p className="font-black text-lg text-[#56CCF2]">{formatCurrency(investor.totalInvested)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Active Deals</p>
                              <p className="font-black text-lg">{investor.activeDeals}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Avg Investment</p>
                              <p className="font-black text-lg">{investor.avgInvestment > 0 ? formatCurrency(investor.avgInvestment) : "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Member Since</p>
                              <p className="font-bold text-sm">{new Date(investor.joinDate).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Last Activity</p>
                              <p className="font-bold text-sm">{new Date(investor.lastActivity).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {/* Commitments */}
                          {investor.commitments.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-semibold mb-2">Active Commitments:</p>
                              <div className="flex flex-wrap gap-2">
                                {investor.commitments.map((c, idx) => (
                                  <Badge key={idx} variant="outline" className={`border-2 ${
                                    c.status === "funded" ? "border-green-500 text-green-700" :
                                    c.status === "committed" ? "border-blue-500 text-blue-700" :
                                    "border-yellow-500 text-yellow-700"
                                  }`}>
                                    {c.deal}: {formatCurrency(c.amount)} ({c.status})
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 ml-4">
                          <Button size="sm" className="bg-[#E07A47] hover:bg-[#D96835]">
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline" className="border-2">
                            <Mail className="mr-2 h-4 w-4" />
                            Email
                          </Button>
                          <Button size="sm" variant="outline" className="border-2">
                            <Phone className="mr-2 h-4 w-4" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline" className="border-2 border-[#56CCF2] text-[#56CCF2]">
                            <Plus className="mr-2 h-4 w-4" />
                            New Deal
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Active Raises Tab */}
          {activeTab === "raises" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">Active Capital Raises</h2>
                <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Raise
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {MOCK_ACTIVE_RAISES.map(raise => {
                  const progress = (raise.currentRaise / raise.targetRaise) * 100
                  return (
                    <Card key={raise.id} className="border-4 border-[#E07A47]">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-black">{raise.dealName}</h3>
                              <Badge className="bg-green-100 text-green-700 border-2 border-green-300">
                                Active Raise
                              </Badge>
                            </div>
                            <p className="text-muted-foreground flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {raise.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Hard Close Date</p>
                            <p className="font-bold text-lg text-[#E07A47]">{new Date(raise.hardClose).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {/* Progress */}
                        <div className="mb-6">
                          <div className="flex justify-between mb-2">
                            <span className="font-black text-2xl text-[#56CCF2]">{formatCurrency(raise.currentRaise)}</span>
                            <span className="text-muted-foreground">of {formatCurrency(raise.targetRaise)}</span>
                          </div>
                          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47]"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm">
                            <span className="text-green-600 font-semibold">{progress.toFixed(0)}% Funded</span>
                            <span className="text-yellow-600">Soft Circle: {formatCurrency(raise.softCircle)}</span>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-6 gap-4 p-4 bg-[#6b7280]/10 rounded-xl mb-4">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Investors</p>
                            <p className="font-black text-xl">{raise.investors}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Min Investment</p>
                            <p className="font-black text-xl">{formatCurrency(raise.minInvestment)}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Projected IRR</p>
                            <p className="font-black text-xl text-green-600">{raise.projectedIRR}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Equity Multiple</p>
                            <p className="font-black text-xl text-[#56CCF2]">{raise.equityMultiple}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Hold Period</p>
                            <p className="font-black text-xl">{raise.holdPeriod}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Remaining</p>
                            <p className="font-black text-xl text-[#E07A47]">{formatCurrency(raise.targetRaise - raise.currentRaise)}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="outline" className="border-2 border-[#E07A47]">
                            <Send className="mr-2 h-4 w-4" />
                            Send to Investors
                          </Button>
                          <Button variant="outline" className="border-2">
                            <FileText className="mr-2 h-4 w-4" />
                            Investment Memo
                          </Button>
                          <Button variant="outline" className="border-2">
                            <Video className="mr-2 h-4 w-4" />
                            Schedule Webinar
                          </Button>
                          <Button variant="outline" className="border-2">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Cap Table
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Raise Pipeline */}
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#56CCF2]" />
                    Raise Pipeline Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="text-center p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                      <p className="text-sm text-muted-foreground mb-1">In Preparation</p>
                      <p className="text-2xl font-black">2</p>
                      <p className="text-sm text-purple-600">$24M Total</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-yellow-50 border-2 border-yellow-200">
                      <p className="text-sm text-muted-foreground mb-1">Soft Launch</p>
                      <p className="text-2xl font-black">1</p>
                      <p className="text-sm text-yellow-600">$12M Total</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-green-50 border-2 border-green-200">
                      <p className="text-sm text-muted-foreground mb-1">Active Raise</p>
                      <p className="text-2xl font-black">2</p>
                      <p className="text-sm text-green-600">$18M Total</p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                      <p className="text-sm text-muted-foreground mb-1">Closing</p>
                      <p className="text-2xl font-black">1</p>
                      <p className="text-sm text-blue-600">$8M Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Communications Tab */}
          {activeTab === "communications" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">Investor Communications</h2>
                <div className="flex gap-3">
                  <Button variant="outline" className="border-2">
                    <Bell className="mr-2 h-4 w-4" />
                    Scheduled (3)
                  </Button>
                  <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                    <Megaphone className="mr-2 h-4 w-4" />
                    New Announcement
                  </Button>
                </div>
              </div>

              {/* Communication Templates */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { title: "Quarterly Update", icon: PieChart, color: "border-blue-500", desc: "Portfolio performance report" },
                  { title: "Distribution Notice", icon: DollarSign, color: "border-green-500", desc: "Notify investors of distributions" },
                  { title: "New Opportunity", icon: Building2, color: "border-[#E07A47]", desc: "Share new investment deal" },
                  { title: "K-1 / Tax Docs", icon: FileText, color: "border-purple-500", desc: "Tax document notifications" }
                ].map((template, i) => {
                  const Icon = template.icon
                  return (
                    <Card key={i} className={`border-4 ${template.color} hover:shadow-lg transition-all cursor-pointer`}>
                      <CardContent className="p-4 text-center">
                        <Icon className="h-8 w-8 mx-auto mb-2 text-slate-600" />
                        <h4 className="font-bold text-sm">{template.title}</h4>
                        <p className="text-xs text-muted-foreground">{template.desc}</p>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Recent Communications */}
              <Card className="border-4 border-slate-300">
                <CardHeader>
                  <CardTitle>Recent Communications</CardTitle>
                  <CardDescription>Track delivery and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {MOCK_COMMUNICATIONS.map(comm => (
                      <div key={comm.id} className="flex items-center justify-between p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-200 hover:border-[#E07A47] transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[#56CCF2]/10 flex items-center justify-center">
                            <Send className="h-5 w-5 text-[#56CCF2]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{comm.type}</span>
                              <Badge variant="outline">{comm.deal}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{new Date(comm.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Recipients</p>
                            <p className="font-bold">{comm.recipients}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Open Rate</p>
                            <p className="font-bold text-green-600">{comm.openRate}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-black">Documents & Reports</h2>
                <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {/* Document Categories */}
                {[
                  { title: "Investment Memos", count: 8, icon: FileText, color: "border-[#E07A47]" },
                  { title: "PPM Documents", count: 6, icon: Briefcase, color: "border-purple-500" },
                  { title: "Subscription Docs", count: 24, icon: CheckCircle2, color: "border-green-500" },
                  { title: "Quarterly Reports", count: 16, icon: PieChart, color: "border-blue-500" },
                  { title: "Tax Documents", count: 12, icon: FileSpreadsheet, color: "border-yellow-500" },
                  { title: "Legal Agreements", count: 18, icon: FileText, color: "border-slate-500" }
                ].map((category, i) => {
                  const Icon = category.icon
                  return (
                    <Card key={i} className={`border-4 ${category.color} hover:shadow-lg transition-all cursor-pointer`}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <Icon className="h-10 w-10 text-slate-600" />
                          <Badge className="bg-slate-100 text-slate-700">{category.count} files</Badge>
                        </div>
                        <h3 className="font-black text-lg">{category.title}</h3>
                        <Button size="sm" variant="outline" className="mt-4 w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          View All
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Data Room */}
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[#56CCF2]" />
                    Investor Data Room
                  </CardTitle>
                  <CardDescription>Secure document sharing portal for investors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-[#56CCF2]/10 rounded-xl">
                    <div>
                      <p className="font-bold">Active Data Rooms: 3</p>
                      <p className="text-sm text-muted-foreground">Sunset Apartments, Riverside Condos, Industrial Portfolio</p>
                    </div>
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-2">
                        <Settings className="mr-2 h-4 w-4" />
                        Manage Access
                      </Button>
                      <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Data Room
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

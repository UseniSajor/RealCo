"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import { useOfferings, useInvestors, useDistributions, type Offering, type Investment, type Distribution } from "@/lib/supabase-hooks"
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
  Megaphone,
  Loader2
} from "lucide-react"

export default function InvestorRelationsPage() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"investors" | "raises" | "communications" | "documents">("investors")
  const [investorFilter, setInvestorFilter] = useState("all")

  // Supabase hooks
  const { data: offerings, isLoading: offeringsLoading } = useOfferings()
  const [selectedOfferingId, setSelectedOfferingId] = useState<string | null>(null)
  const { data: investors, isLoading: investorsLoading } = useInvestors(selectedOfferingId || '')
  const { data: distributions, isLoading: distributionsLoading } = useDistributions(selectedOfferingId || '')

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

  // Filter investors based on status
  const filteredInvestors = investorFilter === "all"
    ? investors
    : investors.filter(inv => inv.status.toLowerCase() === investorFilter)

  // Calculate metrics from real data
  const totalAUM = investors.reduce((sum, inv) => sum + (inv.investment_amount || 0), 0)
  const activeInvestors = investors.filter(inv => inv.status === "ACTIVE").length
  const activeOfferings = offerings.filter(o => o.status === "active")
  const currentRaise = activeOfferings.reduce((sum, o) => sum + (o.current_raised || 0), 0)
  const targetRaise = activeOfferings.reduce((sum, o) => sum + (o.target_raise || 0), 0)
  const pendingCommitments = investors.filter(inv => inv.status === "PENDING").reduce((sum, inv) => sum + inv.investment_amount, 0)

  // Loading component
  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-[#E07A47]" />
      <span className="ml-2 text-muted-foreground">Loading...</span>
    </div>
  )

  // Empty state component
  const EmptyState = ({ message, icon: Icon }: { message: string; icon: React.ElementType }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  )

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
                    {offeringsLoading || investorsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#E07A47]" />
                    ) : (
                      <>
                        <p className="text-2xl font-black">{formatCurrency(totalAUM)}</p>
                        <p className="text-xs text-green-600">+12% YoY</p>
                      </>
                    )}
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
                    {investorsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-[#56CCF2]" />
                    ) : (
                      <>
                        <p className="text-2xl font-black">{activeInvestors}</p>
                        <p className="text-xs text-muted-foreground">of {investors.length} total</p>
                      </>
                    )}
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
                    {offeringsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                    ) : (
                      <>
                        <p className="text-2xl font-black">{formatCurrency(currentRaise)}</p>
                        <p className="text-xs text-muted-foreground">of {formatCurrency(targetRaise)} target</p>
                      </>
                    )}
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    {investorsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    ) : (
                      <>
                        <p className="text-2xl font-black">{formatCurrency(pendingCommitments)}</p>
                        <p className="text-xs text-yellow-600">Pending close</p>
                      </>
                    )}
                  </div>
                  <HandshakeIcon className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Offerings</p>
                    {offeringsLoading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                    ) : (
                      <>
                        <p className="text-2xl font-black">{activeOfferings.length}</p>
                        <p className="text-xs text-green-600">Raising capital</p>
                      </>
                    )}
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
              {/* Offering Selector */}
              <Card className="border-2 border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold">Select Offering:</label>
                    <select
                      className="flex-1 p-2 border-2 rounded-lg"
                      value={selectedOfferingId || ''}
                      onChange={(e) => setSelectedOfferingId(e.target.value || null)}
                    >
                      <option value="">-- Select an offering to view investors --</option>
                      {offerings.map((offering) => (
                        <option key={offering.id} value={offering.id}>
                          {offering.name} ({offering.status})
                        </option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>

              {/* Filters */}
              <div className="flex gap-2">
                {["all", "active", "pending", "completed"].map(filter => (
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
              {!selectedOfferingId ? (
                <EmptyState message="Select an offering to view its investors" icon={Users} />
              ) : investorsLoading ? (
                <LoadingSpinner />
              ) : filteredInvestors.length === 0 ? (
                <EmptyState message="No investors found for this offering" icon={Users} />
              ) : (
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
                                  <h3 className="font-black text-xl">Investor #{investor.investor_id.slice(0, 8)}</h3>
                                  <Badge className={
                                    investor.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                                    investor.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                                    investor.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                                    "bg-red-100 text-red-700"
                                  }>
                                    {investor.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Joined {new Date(investor.created_at).toLocaleDateString()}
                                  </span>
                                  {investor.funded_at && (
                                    <span className="flex items-center gap-1">
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                      Funded {new Date(investor.funded_at).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-5 gap-4 p-4 bg-[#6b7280]/10 rounded-xl">
                              <div>
                                <p className="text-xs text-muted-foreground">Investment Amount</p>
                                <p className="font-black text-lg text-[#56CCF2]">{formatCurrency(investor.investment_amount)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Current Balance</p>
                                <p className="font-black text-lg">{formatCurrency(investor.current_balance)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Returned Capital</p>
                                <p className="font-black text-lg">{formatCurrency(investor.returned_capital)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Preferred Return</p>
                                <p className="font-bold text-sm">{(investor.preferred_return_rate * 100).toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Ownership</p>
                                <p className="font-bold text-sm">{investor.ownership_percentage ? `${(investor.ownership_percentage * 100).toFixed(2)}%` : "N/A"}</p>
                              </div>
                            </div>

                            {/* Distribution Info */}
                            <div className="mt-4 grid grid-cols-3 gap-4">
                              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                                <p className="text-xs text-muted-foreground">Preferred Return Paid</p>
                                <p className="font-bold text-green-700">{formatCurrency(investor.preferred_return_paid)}</p>
                              </div>
                              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-xs text-muted-foreground">Preferred Return Owed</p>
                                <p className="font-bold text-yellow-700">{formatCurrency(investor.preferred_return_owed)}</p>
                              </div>
                              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-xs text-muted-foreground">Profits Paid</p>
                                <p className="font-bold text-blue-700">{formatCurrency(investor.profits_paid)}</p>
                              </div>
                            </div>
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
                              <FileText className="mr-2 h-4 w-4" />
                              Documents
                            </Button>
                            <Button size="sm" variant="outline" className="border-2 border-[#56CCF2] text-[#56CCF2]">
                              <DollarSign className="mr-2 h-4 w-4" />
                              Distribution
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
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

              {offeringsLoading ? (
                <LoadingSpinner />
              ) : activeOfferings.length === 0 ? (
                <EmptyState message="No active raises found. Create a new offering to start raising capital." icon={TrendingUp} />
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {activeOfferings.map(offering => {
                    const progress = offering.target_raise ? ((offering.current_raised || 0) / offering.target_raise) * 100 : 0
                    return (
                      <Card key={offering.id} className="border-4 border-[#E07A47]">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black">{offering.name}</h3>
                                <Badge className="bg-green-100 text-green-700 border-2 border-green-300">
                                  Active Raise
                                </Badge>
                                <Badge variant="outline" className="border-2">
                                  {offering.regulation_mode.toUpperCase()}
                                </Badge>
                              </div>
                              {offering.location && (
                                <p className="text-muted-foreground flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {offering.location}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Asset Type</p>
                              <p className="font-bold text-lg text-[#E07A47]">{offering.asset_type || "Real Estate"}</p>
                            </div>
                          </div>

                          {/* Progress */}
                          <div className="mb-6">
                            <div className="flex justify-between mb-2">
                              <span className="font-black text-2xl text-[#56CCF2]">{formatCurrency(offering.current_raised || 0)}</span>
                              <span className="text-muted-foreground">of {formatCurrency(offering.target_raise || 0)}</span>
                            </div>
                            <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47]"
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                              <span className="text-green-600 font-semibold">{progress.toFixed(0)}% Funded</span>
                              <span className="text-muted-foreground">
                                {formatCurrency((offering.target_raise || 0) - (offering.current_raised || 0))} remaining
                              </span>
                            </div>
                          </div>

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-5 gap-4 p-4 bg-[#6b7280]/10 rounded-xl mb-4">
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Investors</p>
                              <p className="font-black text-xl">{offering.investor_count || 0}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Min Investment</p>
                              <p className="font-black text-xl">{formatCurrency(offering.minimum_investment || 0)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Target Return</p>
                              <p className="font-black text-xl text-green-600">{offering.target_return || "N/A"}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Hold Period</p>
                              <p className="font-black text-xl">{offering.hold_period || "N/A"}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs text-muted-foreground">Remaining</p>
                              <p className="font-black text-xl text-[#E07A47]">{formatCurrency((offering.target_raise || 0) - (offering.current_raised || 0))}</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3">
                            <Button
                              className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                              onClick={() => setSelectedOfferingId(offering.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Investors
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
              )}

              {/* All Offerings Summary */}
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-[#56CCF2]" />
                    Raise Pipeline Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {offeringsLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <div className="grid grid-cols-4 gap-6">
                      <div className="text-center p-4 rounded-xl bg-purple-50 border-2 border-purple-200">
                        <p className="text-sm text-muted-foreground mb-1">Draft</p>
                        <p className="text-2xl font-black">{offerings.filter(o => o.status === "draft").length}</p>
                        <p className="text-sm text-purple-600">
                          {formatCurrency(offerings.filter(o => o.status === "draft").reduce((sum, o) => sum + (o.target_raise || 0), 0))}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-green-50 border-2 border-green-200">
                        <p className="text-sm text-muted-foreground mb-1">Active</p>
                        <p className="text-2xl font-black">{offerings.filter(o => o.status === "active").length}</p>
                        <p className="text-sm text-green-600">
                          {formatCurrency(offerings.filter(o => o.status === "active").reduce((sum, o) => sum + (o.target_raise || 0), 0))}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-blue-50 border-2 border-blue-200">
                        <p className="text-sm text-muted-foreground mb-1">Funded</p>
                        <p className="text-2xl font-black">{offerings.filter(o => o.status === "funded").length}</p>
                        <p className="text-sm text-blue-600">
                          {formatCurrency(offerings.filter(o => o.status === "funded").reduce((sum, o) => sum + (o.current_raised || 0), 0))}
                        </p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-50 border-2 border-slate-200">
                        <p className="text-sm text-muted-foreground mb-1">Closed</p>
                        <p className="text-2xl font-black">{offerings.filter(o => o.status === "closed").length}</p>
                        <p className="text-sm text-slate-600">
                          {formatCurrency(offerings.filter(o => o.status === "closed").reduce((sum, o) => sum + (o.current_raised || 0), 0))}
                        </p>
                      </div>
                    </div>
                  )}
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
                    Scheduled
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

              {/* Recent Distributions as Communications */}
              <Card className="border-4 border-slate-300">
                <CardHeader>
                  <CardTitle>Recent Distributions</CardTitle>
                  <CardDescription>Track distribution notices and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Offering Selector for Distributions */}
                  <div className="mb-4">
                    <select
                      className="w-full p-2 border-2 rounded-lg"
                      value={selectedOfferingId || ''}
                      onChange={(e) => setSelectedOfferingId(e.target.value || null)}
                    >
                      <option value="">-- Select an offering to view distributions --</option>
                      {offerings.map((offering) => (
                        <option key={offering.id} value={offering.id}>
                          {offering.name} ({offering.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedOfferingId ? (
                    <EmptyState message="Select an offering to view its distributions" icon={DollarSign} />
                  ) : distributionsLoading ? (
                    <LoadingSpinner />
                  ) : distributions.length === 0 ? (
                    <EmptyState message="No distributions found for this offering" icon={DollarSign} />
                  ) : (
                    <div className="space-y-3">
                      {distributions.map(dist => (
                        <div key={dist.id} className="flex items-center justify-between p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-200 hover:border-[#E07A47] transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#56CCF2]/10 flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{dist.distribution_type.replace(/_/g, ' ')}</span>
                                <Badge className={
                                  dist.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                  dist.status === "PROCESSING" ? "bg-blue-100 text-blue-700" :
                                  dist.status === "PENDING_APPROVAL" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-slate-100 text-slate-700"
                                }>
                                  {dist.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(dist.distribution_date).toLocaleDateString()}
                                {dist.period_start && dist.period_end && (
                                  <span className="ml-2">
                                    (Period: {new Date(dist.period_start).toLocaleDateString()} - {new Date(dist.period_end).toLocaleDateString()})
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Amount</p>
                              <p className="font-bold text-green-600">{formatCurrency(dist.total_amount)}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Notified</p>
                              <p className="font-bold">{dist.notification_sent ? "Yes" : "No"}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  { title: "Investment Memos", count: offerings.length, icon: FileText, color: "border-[#E07A47]" },
                  { title: "PPM Documents", count: offerings.filter(o => o.status !== "draft").length, icon: Briefcase, color: "border-purple-500" },
                  { title: "Subscription Docs", count: investors.length, icon: CheckCircle2, color: "border-green-500" },
                  { title: "Quarterly Reports", count: distributions.length, icon: PieChart, color: "border-blue-500" },
                  { title: "Tax Documents", count: Math.floor(investors.length / 2), icon: FileSpreadsheet, color: "border-yellow-500" },
                  { title: "Legal Agreements", count: offerings.length * 2, icon: FileText, color: "border-slate-500" }
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
                      <p className="font-bold">Active Data Rooms: {activeOfferings.length}</p>
                      <p className="text-sm text-muted-foreground">
                        {activeOfferings.map(o => o.name).join(", ") || "No active offerings"}
                      </p>
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

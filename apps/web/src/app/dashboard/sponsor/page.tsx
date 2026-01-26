"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { MediaViewer, MediaGallery } from "@/components/media/MediaViewer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Hammer,
  AlertTriangle,
  BarChart3,
  Calculator,
  Target,
  Search,
  UserPlus,
  MapPin,
  Home,
  Briefcase,
  MessageSquare,
  Settings,
  HardHat,
  Workflow,
  Zap,
  ArrowRight,
  Shield,
  LineChart,
  Loader2
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useDeals, useLeads, useOfferings, useProjects, useDashboardMetrics } from "@/lib/supabase-hooks"

// Helper function to format currency
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  }
  return `$${amount.toFixed(0)}`
}

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  return date.toLocaleDateString()
}

// Helper function to get status display for deal stage
function getDealStatusDisplay(stage: string): { label: string; colorClass: string } {
  const stageMap: Record<string, { label: string; colorClass: string }> = {
    'SOURCING': { label: 'Sourcing', colorClass: 'bg-slate-200 text-slate-700' },
    'INITIAL_REVIEW': { label: 'Initial Review', colorClass: 'bg-blue-100 text-blue-700' },
    'UNDERWRITING': { label: 'Underwriting', colorClass: 'bg-purple-100 text-purple-700' },
    'DUE_DILIGENCE': { label: 'Due Diligence', colorClass: 'bg-yellow-100 text-yellow-700' },
    'NEGOTIATION': { label: 'Negotiation', colorClass: 'bg-[#E07A47]/20 text-[#E07A47]' },
    'UNDER_CONTRACT': { label: 'Under Contract', colorClass: 'bg-[#56CCF2]/20 text-[#56CCF2]' },
    'CLOSING': { label: 'Closing', colorClass: 'bg-green-100 text-green-700' },
    'CLOSED': { label: 'Closed', colorClass: 'bg-green-200 text-green-800' },
    'PASSED': { label: 'Passed', colorClass: 'bg-red-100 text-red-700' },
  }
  return stageMap[stage] || { label: stage, colorClass: 'bg-slate-200 text-slate-700' }
}

// Loading skeleton component for cards
function StatCardSkeleton() {
  return (
    <Card className="border-4 border-slate-200 animate-pulse">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-10 w-20 bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-200 rounded"></div>
      </CardContent>
    </Card>
  )
}

// Loading skeleton for deal cards
function DealCardSkeleton() {
  return (
    <div className="p-5 rounded-xl border-2 border-slate-200 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 w-48 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
        <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-3 w-full bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-slate-200 rounded"></div>
      </div>
    </div>
  )
}

// Empty state component
function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{description}</p>
      {action && (
        <Button asChild>
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  )
}

export default function SponsorDashboardPage() {
  const { user, logout } = useAuth()

  // Fetch real data from Supabase
  const { data: deals, isLoading: dealsLoading } = useDeals()
  const { data: leads, isLoading: leadsLoading } = useLeads()
  const { data: offerings, isLoading: offeringsLoading } = useOfferings()
  const { data: projects, isLoading: projectsLoading } = useProjects()
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()

  // Derive computed values
  const totalInvestors = offerings?.reduce((sum, o) => sum + (o.investor_count || 0), 0) || 0
  const activeDeals = deals?.filter(d => !['CLOSED', 'PASSED'].includes(d.stage)) || []
  const urgentDeals = deals?.filter(d =>
    d.stage === 'CLOSING' ||
    d.stage === 'UNDER_CONTRACT' ||
    (d.expected_close_date && new Date(d.expected_close_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
  ) || []

  // Check if any data is still loading
  const isLoading = dealsLoading || leadsLoading || offeringsLoading || projectsLoading || metricsLoading

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: leads?.length ? String(leads.length) : undefined },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development Group"}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-20 bg-white">
        <div className="container max-w-6xl px-6 py-6 mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-2xl font-black mb-1">Welcome Back, Sponsor!</h1>
                <p className="text-sm text-muted-foreground">
                  Here's what's happening with your projects today
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/sponsor/deal-pipeline">
                    <Target className="mr-1.5 h-3.5 w-3.5" />
                    Pipeline
                  </Link>
                </Button>
                <Button size="sm" className="bg-[#E07A47] hover:bg-[#D96835]" asChild>
                  <Link href="/dashboard/sponsor/construction">
                    <HardHat className="mr-1.5 h-3.5 w-3.5" />
                    Construction Hub
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Workflow Actions */}
            <div className="bg-gradient-to-r from-[#56CCF2]/5 via-white to-[#E07A47]/5 border-2 border-[#E07A47] rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center">
                    <Workflow className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm">Automated Workflows Active</h3>
                    <p className="text-xs text-muted-foreground">
                      {activeDeals.length} deals in progress {urgentDeals.length > 0 && `• ${urgentDeals.length} need attention`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="automation-badge text-[10px] px-2 py-0.5">
                    <Zap className="h-2.5 w-2.5" />
                    Auto-Processing
                  </span>
                  <Button variant="outline" size="sm" className="text-xs h-7">
                    <Settings className="mr-1.5 h-3 w-3" />
                    Manage
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {metricsLoading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <Card className="border-2 border-[#E07A47] hover:shadow-lg transition-all stat-card">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Active Projects
                      </CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-[#E07A47]/10 flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-[#E07A47]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="text-2xl font-black mb-0.5">{metrics?.active_projects || 0}</div>
                    <p className="text-[10px] text-muted-foreground">
                      {offerings?.filter(o => o.status === 'active').length || 0} raising, {projects?.length || 0} in construction
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 status-dot"></div>
                        <span className="text-[10px] text-green-600 font-semibold">
                          {metrics?.active_projects ? 'Active' : 'No active projects'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#56CCF2] hover:shadow-lg transition-all stat-card">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Capital Raised
                      </CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-[#56CCF2]/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-[#56CCF2]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="text-2xl font-black mb-0.5">{formatCurrency(metrics?.total_invested || 0)}</div>
                    <p className="text-[10px] text-muted-foreground">
                      Target: {formatCurrency(offerings?.reduce((sum, o) => sum + (o.target_raise || 0), 0) || 0)}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      {(() => {
                        const totalTarget = offerings?.reduce((sum, o) => sum + (o.target_raise || 0), 0) || 0
                        const percentComplete = totalTarget > 0 ? Math.round((metrics?.total_invested || 0) / totalTarget * 100) : 0
                        const remaining = totalTarget - (metrics?.total_invested || 0)
                        return (
                          <>
                            <div className="flex justify-between items-center mb-0.5">
                              <span className="text-[10px] font-semibold">{percentComplete}% Complete</span>
                              <span className="text-[10px] text-muted-foreground">{formatCurrency(Math.max(0, remaining))} to go</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full progress-gradient" style={{ width: `${Math.min(100, percentComplete)}%` }} />
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#56CCF2] hover:shadow-lg transition-all stat-card">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Total Investors
                      </CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-[#56CCF2]/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-[#56CCF2]" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="text-2xl font-black mb-0.5">{totalInvestors}</div>
                    <p className="text-[10px] text-muted-foreground">
                      Across {offerings?.length || 0} offerings
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E07A47]"></div>
                        <span className="text-[10px] text-[#E07A47] font-semibold">
                          {totalInvestors > 0 && (metrics?.total_invested || 0) > 0
                            ? `Avg: ${formatCurrency((metrics?.total_invested || 0) / totalInvestors)}`
                            : 'No investments yet'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#E07A47] hover:shadow-lg transition-all stat-card">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-semibold text-muted-foreground">
                        Total Deals
                      </CardTitle>
                      <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                        <Target className="h-4 w-4 text-red-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="text-2xl font-black mb-0.5">{metrics?.active_deals || 0}</div>
                    <p className="text-[10px] text-muted-foreground">
                      {activeDeals.length} active, {(metrics?.active_deals || 0) - activeDeals.length} closed/passed
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200">
                      <Button size="sm" variant="outline" className="w-full h-6 text-[10px]" asChild>
                        <Link href="/dashboard/sponsor/deal-pipeline">
                          <Target className="mr-1 h-3 w-3" />
                          View Pipeline
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Active Deals */}
            <Card className="lg:col-span-2 border-2 border-[#E07A47]">
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-1.5 text-sm">
                      <Building2 className="h-4 w-4" />
                      Your Deals in Progress
                    </CardTitle>
                    <CardDescription className="text-xs">Capital raising and construction projects</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <Link href="/dashboard/sponsor/deal-pipeline">
                      View All
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {dealsLoading ? (
                  <div className="space-y-4">
                    <DealCardSkeleton />
                    <DealCardSkeleton />
                    <DealCardSkeleton />
                  </div>
                ) : activeDeals.length === 0 ? (
                  <EmptyState
                    icon={Target}
                    title="No active deals"
                    description="Start your first deal by sourcing properties and adding them to your pipeline."
                    action={{ label: "Start a Deal", href: "/dashboard/sponsor/deal-pipeline" }}
                  />
                ) : (
                  <div className="space-y-3">
                    {activeDeals.slice(0, 5).map((deal) => {
                      const statusDisplay = getDealStatusDisplay(deal.stage)
                      const probability = deal.probability || 0

                      return (
                        <div key={deal.id} className="p-3 rounded-lg border-2 border-[#56CCF2] hover:shadow-lg hover:border-[#E07A47] transition-all group cursor-pointer">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <h4 className="font-bold text-sm">{deal.name}</h4>
                                {deal.tags && deal.tags.length > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600">
                                    {deal.tags[0]}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {deal.expected_close_date
                                  ? `Close: ${new Date(deal.expected_close_date).toLocaleDateString()}`
                                  : 'No close date'}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusDisplay.colorClass}`}>
                              {statusDisplay.label}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-sm">
                                  {formatCurrency(deal.value)}
                                  <span className="text-[10px] text-muted-foreground font-normal"> value</span>
                                </span>
                                <span className="text-[#56CCF2] font-black text-sm">{probability}%</span>
                              </div>
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full progress-gradient transition-all"
                                  style={{ width: `${probability}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Target className="h-3 w-3" />
                                <span className="font-semibold">{probability}%</span> prob
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Clock className="h-2.5 w-2.5" />
                                {formatRelativeTime(deal.updated_at)}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-1">
                              <Button size="sm" className="flex-1 h-7 text-xs" variant="outline">
                                <FileText className="mr-1 h-3 w-3" />
                                Details
                              </Button>
                              <Button size="sm" className="flex-1 h-7 text-xs bg-[#E07A47] hover:bg-[#E07A47]/90">
                                <TrendingUp className="mr-1 h-3 w-3" />
                                Manage
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats & Info */}
            <div className="space-y-4">
              {/* Urgent Tasks / Deals needing attention */}
              <Card className="border-2 border-[#E07A47]">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="flex items-center gap-1.5 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Urgent Tasks
                  </CardTitle>
                  <CardDescription className="text-xs">Requires immediate attention</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {dealsLoading || leadsLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
                          <div className="w-10 h-10 rounded-xl bg-slate-200"></div>
                          <div className="flex-1">
                            <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-24 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : urgentDeals.length === 0 && (!leads || leads.filter(l => l.status === 'NEW').length === 0) ? (
                    <EmptyState
                      icon={CheckCircle2}
                      title="All caught up!"
                      description="No urgent tasks require your attention right now."
                    />
                  ) : (
                    <div className="space-y-3">
                      {/* Show deals in closing stage */}
                      {urgentDeals.slice(0, 2).map((deal) => (
                        <div key={deal.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer quick-action">
                          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-500">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">Review {deal.stage === 'CLOSING' ? 'closing docs' : 'contract'}</p>
                            <p className="text-xs text-muted-foreground">{deal.name}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}

                      {/* Show new leads that need follow-up */}
                      {leads?.filter(l => l.status === 'NEW').slice(0, 2).map((lead) => (
                        <div key={lead.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer quick-action">
                          <div className="w-10 h-10 rounded-xl bg-[#E07A47]/10 flex items-center justify-center flex-shrink-0 text-[#E07A47]">
                            <UserPlus className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">Follow up on new lead</p>
                            <p className="text-xs text-muted-foreground">{lead.property_name}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}

                      {/* Show offerings needing attention */}
                      {offerings?.filter(o => o.status === 'active' && (o.current_raised || 0) < (o.target_raise || 0) * 0.5).slice(0, 1).map((offering) => (
                        <div key={offering.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-all cursor-pointer quick-action">
                          <div className="w-10 h-10 rounded-xl bg-[#56CCF2]/10 flex items-center justify-center flex-shrink-0 text-[#56CCF2]">
                            <TrendingUp className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm">Boost capital raise</p>
                            <p className="text-xs text-muted-foreground">{offering.name}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-2 border-[#56CCF2]">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-xs">Last 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="px-4 pb-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-2 animate-pulse">
                          <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                          <div className="flex-1">
                            <div className="h-4 w-28 bg-slate-200 rounded mb-2"></div>
                            <div className="h-3 w-20 bg-slate-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Show recent deals activity */}
                      {deals?.slice(0, 2).map((deal) => (
                        <div key={`deal-${deal.id}`} className="flex items-start gap-3 p-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-green-500">
                            <Target className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">Deal updated</p>
                            <p className="text-xs text-muted-foreground">{deal.name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(deal.updated_at)}</span>
                        </div>
                      ))}

                      {/* Show recent leads activity */}
                      {leads?.slice(0, 1).map((lead) => (
                        <div key={`lead-${lead.id}`} className="flex items-start gap-3 p-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-blue-500">
                            <UserPlus className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">Lead {lead.status === 'NEW' ? 'added' : 'updated'}</p>
                            <p className="text-xs text-muted-foreground">{lead.property_name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(lead.updated_at)}</span>
                        </div>
                      ))}

                      {/* Show recent offerings activity */}
                      {offerings?.slice(0, 1).map((offering) => (
                        <div key={`offering-${offering.id}`} className="flex items-start gap-3 p-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 text-[#56CCF2]">
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">Offering {offering.status}</p>
                            <p className="text-xs text-muted-foreground">{offering.name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{formatRelativeTime(offering.updated_at)}</span>
                        </div>
                      ))}

                      {/* Empty state if no activity */}
                      {(!deals || deals.length === 0) && (!leads || leads.length === 0) && (!offerings || offerings.length === 0) && (
                        <EmptyState
                          icon={Clock}
                          title="No recent activity"
                          description="Activity will appear here as you work with deals, leads, and offerings."
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Service Offerings Section */}
          <div className="mb-6">
            <div className="section-header mb-4">
              <h2 className="text-lg font-black">Platform Services</h2>
              <p className="text-xs text-muted-foreground">Everything you need to succeed</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { title: "Capital Raise", description: "Streamlined fundraising with investor CRM", icon: TrendingUp, color: "text-[#56CCF2]", bgColor: "bg-[#56CCF2]/10", href: "/dashboard/sponsor/capital-raised" },
                { title: "Construction Mgmt", description: "Full project tracking & documentation", icon: HardHat, color: "text-[#E07A47]", bgColor: "bg-[#E07A47]/10", href: "/dashboard/sponsor/construction" },
                { title: "Investor Relations", description: "Automated updates & communications", icon: Users, color: "text-purple-500", bgColor: "bg-purple-100", href: "/dashboard/sponsor/team" },
                { title: "Compliance & Docs", description: "SEC-ready documentation & audit trail", icon: Shield, color: "text-green-500", bgColor: "bg-green-100", href: "/dashboard/sponsor/analytics" },
              ].map((service, i) => {
                const Icon = service.icon
                return (
                  <Link key={i} href={service.href}>
                    <Card className="service-card h-full hover:shadow-lg transition-all cursor-pointer border-2 border-[#E07A47] bg-gradient-to-br from-white to-slate-50">
                      <div className={`w-10 h-10 rounded-lg ${service.bgColor} flex items-center justify-center mb-3 ${service.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-bold text-sm mb-1 text-slate-800">{service.title}</h3>
                      <p className="text-[10px] text-slate-600 leading-tight">{service.description}</p>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2 border-[#56CCF2]">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Portfolio IRR</CardTitle>
                <CardDescription className="text-xs">Internal rate of return</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {metricsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-black metric-value-primary mb-1">
                      {offerings && offerings.length > 0
                        ? `${offerings.filter(o => o.target_return).length > 0
                            ? offerings.filter(o => o.target_return)[0]?.target_return || '--'
                            : '--'}`
                        : '--'}
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">Target: 12-15% annually</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-600 font-semibold">
                        {offerings && offerings.length > 0 ? 'On track' : 'No data yet'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-[#E07A47]">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Avg Hold Period</CardTitle>
                <CardDescription className="text-xs">Time to exit</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {metricsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl font-black metric-value-secondary mb-1">
                      {offerings && offerings.filter(o => o.hold_period).length > 0
                        ? offerings.filter(o => o.hold_period)[0]?.hold_period || '--'
                        : '--'}
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-2">Target: 3-5 years</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full bg-[#56CCF2]"></div>
                      <span className="text-[#56CCF2] font-semibold">
                        {offerings && offerings.length > 0 ? 'Within range' : 'No data yet'}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="border-2 border-[#56CCF2]">
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Success Rate</CardTitle>
                <CardDescription className="text-xs">Profitable exits</CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {metricsLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-16 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 w-24 bg-slate-200 rounded"></div>
                  </div>
                ) : (
                  <>
                    {(() => {
                      const closedDeals = deals?.filter(d => d.stage === 'CLOSED').length || 0
                      const passedDeals = deals?.filter(d => d.stage === 'PASSED').length || 0
                      const totalCompleted = closedDeals + passedDeals
                      const successRate = totalCompleted > 0 ? Math.round((closedDeals / totalCompleted) * 100) : 0

                      return (
                        <>
                          <div className="text-3xl font-black text-green-600 mb-1">
                            {totalCompleted > 0 ? `${successRate}%` : '--'}
                          </div>
                          <p className="text-[10px] text-muted-foreground mb-2">
                            {totalCompleted > 0
                              ? `${closedDeals}/${totalCompleted} successful`
                              : 'No completed deals'}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-green-600 font-semibold">
                              {successRate >= 90 ? 'Industry leading' : successRate >= 70 ? 'Above average' : totalCompleted > 0 ? 'Building' : 'No data'}
                            </span>
                          </div>
                        </>
                      )
                    })()}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

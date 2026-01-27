"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import { useDeals, useDealMutations, type Deal, type DealStage } from "@/lib/supabase-hooks"
import Link from "next/link"
import {
  Target,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  UserPlus,
  MapPin,
  Calculator,
  BarChart3,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Loader2,
  ChevronRight,
  AlertTriangle,
} from "lucide-react"

// Pipeline stage configuration
const PIPELINE_STAGES: { key: DealStage; label: string; color: string }[] = [
  { key: 'SOURCING', label: 'Sourcing', color: 'bg-yellow-500' },
  { key: 'DUE_DILIGENCE', label: 'Due Diligence', color: 'bg-purple-500' },
  { key: 'UNDER_CONTRACT', label: 'Under Contract', color: 'bg-blue-500' },
  { key: 'CLOSING', label: 'Closing', color: 'bg-orange-500' },
  { key: 'CLOSED', label: 'Closed', color: 'bg-green-500' },
]

type StageFilter = 'all' | DealStage

export default function DealPipelinePage() {
  const { user, logout } = useAuth()
  const { data: deals, isLoading, error, refetch } = useDeals()
  const { createDeal, updateDeal, updateDealStage, deleteDeal, isLoading: mutating } = useDealMutations()

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Draw Requests", href: "/dashboard/sponsor/draw-request", icon: FileText },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]

  const [stageFilter, setStageFilter] = useState<StageFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Group deals by stage
  const dealsByStage = useMemo(() => {
    const grouped: Record<DealStage, Deal[]> = {
      'SOURCING': [],
      'INITIAL_REVIEW': [],
      'UNDERWRITING': [],
      'DUE_DILIGENCE': [],
      'NEGOTIATION': [],
      'UNDER_CONTRACT': [],
      'CLOSING': [],
      'CLOSED': [],
      'PASSED': [],
    }

    if (deals) {
      deals.forEach(deal => {
        if (deal.stage && grouped[deal.stage]) {
          grouped[deal.stage].push(deal)
        }
      })
    }

    return grouped
  }, [deals])

  // Filter deals based on stage filter and search query
  const filteredDeals = useMemo(() => {
    let result = deals || []

    if (stageFilter !== 'all') {
      result = result.filter(d => d.stage === stageFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(query) ||
        (d.notes && d.notes.toLowerCase().includes(query)) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return result
  }, [deals, stageFilter, searchQuery])

  // Calculate metrics
  const metrics = useMemo(() => {
    const activeDeals = deals?.filter(d => d.stage !== 'CLOSED' && d.stage !== 'PASSED') || []
    return {
      totalDeals: activeDeals.length,
      totalPipelineValue: activeDeals.reduce((sum, d) => sum + (d.value || 0), 0),
      avgProbability: activeDeals.length > 0
        ? activeDeals.reduce((sum, d) => sum + (d.probability || 0), 0) / activeDeals.length
        : 0,
      totalWeightedValue: activeDeals.reduce((sum, d) => sum + ((d.value || 0) * (d.probability || 0) / 100), 0),
    }
  }, [deals])

  const getStageColor = (stage: DealStage) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.key === stage)
    return stageConfig?.color || 'bg-gray-500'
  }

  const getStageLabel = (stage: DealStage) => {
    const stageConfig = PIPELINE_STAGES.find(s => s.key === stage)
    return stageConfig?.label || stage
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600'
    if (probability >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDaysInPipeline = (createdAt: string) => {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - created.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const handleStageChange = async (dealId: string, newStage: DealStage) => {
    const result = await updateDealStage(dealId, newStage)
    if (result) {
      refetch()
    }
  }

  const getNextStage = (currentStage: DealStage): DealStage | null => {
    const stageOrder: DealStage[] = ['SOURCING', 'DUE_DILIGENCE', 'UNDER_CONTRACT', 'CLOSING', 'CLOSED']
    const currentIndex = stageOrder.indexOf(currentStage)
    if (currentIndex >= 0 && currentIndex < stageOrder.length - 1) {
      return stageOrder[currentIndex + 1]
    }
    return null
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
                  <p className="text-3xl font-black">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : metrics.totalDeals}
                  </p>
                </div>
                <Target className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Pipeline Value</p>
                  <p className="text-2xl font-black">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${(metrics.totalPipelineValue / 1000000).toFixed(1)}M`}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Probability</p>
                  <p className="text-3xl font-black">
                    {isLoading ? <Loader2 className="h-8 w-8 animate-spin" /> : `${metrics.avgProbability.toFixed(0)}%`}
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Weighted Value</p>
                  <p className="text-2xl font-black">
                    {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${(metrics.totalWeightedValue / 1000000).toFixed(1)}M`}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p className="font-semibold text-red-800">Error loading deals</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-auto border-red-500 text-red-600 hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search deals by name, notes, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={stageFilter === 'all' ? "default" : "outline"}
              size="sm"
              onClick={() => setStageFilter('all')}
              className={stageFilter === 'all' ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
            >
              All
            </Button>
            {PIPELINE_STAGES.map((stage) => (
              <Button
                key={stage.key}
                variant={stageFilter === stage.key ? "default" : "outline"}
                size="sm"
                onClick={() => setStageFilter(stage.key)}
                className={stageFilter === stage.key ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {stage.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-[#56CCF2] mx-auto mb-4" />
              <p className="text-muted-foreground">Loading deals...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredDeals.length === 0 && (
          <Card className="border-4 border-dashed border-slate-300 dark:border-slate-600">
            <CardContent className="py-12">
              <div className="text-center">
                <Target className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  {stageFilter === 'all' ? 'No deals yet' : `No deals in ${getStageLabel(stageFilter)}`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {stageFilter === 'all'
                    ? 'Start tracking your acquisition opportunities by adding your first deal.'
                    : `There are currently no deals in the ${getStageLabel(stageFilter)} stage.`
                  }
                </p>
                <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                  <Link href="/dashboard/sponsor/deal-pipeline/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Deal
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Deal Pipeline Grid */}
        {!isLoading && !error && filteredDeals.length > 0 && (
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
                          <p className="text-sm text-muted-foreground dark:text-white/70 mb-3">
                            Created {new Date(deal.created_at).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 flex-wrap mb-3">
                            <Badge className={`${getStageColor(deal.stage)} text-white`}>
                              {getStageLabel(deal.stage)}
                            </Badge>
                            {deal.tags && deal.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} className="bg-slate-600 text-white">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Deal Value:</span>
                          <span className="font-bold dark:text-white">
                            ${((deal.value || 0) / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Probability:</span>
                          <span className={`font-bold ${getProbabilityColor(deal.probability || 0)}`}>
                            {deal.probability || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Weighted Value:</span>
                          <span className="font-bold text-[#56CCF2]">
                            ${(((deal.value || 0) * (deal.probability || 0) / 100) / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Days in Pipeline:</span>
                          <span className="font-bold dark:text-white">{getDaysInPipeline(deal.created_at)} days</span>
                        </div>
                        {deal.expected_close_date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-white/70">Expected Close:</span>
                            <span className="font-bold dark:text-white">
                              {new Date(deal.expected_close_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Deal Metrics */}
                    <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                      <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Deal Value</p>
                        <p className="text-3xl font-black text-green-600">
                          ${((deal.value || 0) / 1000000).toFixed(1)}M
                        </p>
                      </div>

                      <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Probability</p>
                        <p className={`text-3xl font-black ${getProbabilityColor(deal.probability || 0)}`}>
                          {deal.probability || 0}%
                        </p>
                      </div>

                      <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Stage</p>
                        <p className="text-xl font-black dark:text-white">
                          {getStageLabel(deal.stage)}
                        </p>
                      </div>

                      <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                        <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Updated</p>
                        <p className="text-xl font-black dark:text-white">
                          {new Date(deal.updated_at).toLocaleDateString()}
                        </p>
                      </div>

                      {deal.notes && (
                        <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                                Notes
                              </p>
                              <p className="text-sm dark:text-white mt-1 line-clamp-2">{deal.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {!deal.notes && deal.expected_close_date && (
                        <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-3">
                          <div className="flex items-start gap-2 mb-1">
                            <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                                Expected Close Date
                              </p>
                              <p className="text-sm font-bold dark:text-white mt-1">
                                {new Date(deal.expected_close_date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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

                        {deal.stage === 'CLOSING' && (
                          <Button asChild variant="outline" className="w-full border-2 border-purple-500">
                            <Link href={`/dashboard/sponsor/deal-pipeline/${deal.id}/close`}>
                              Closing Checklist
                            </Link>
                          </Button>
                        )}

                        {/* Move to Next Stage Button */}
                        {getNextStage(deal.stage) && deal.stage !== 'CLOSED' && (
                          <Button
                            variant="outline"
                            className="w-full border-2 border-[#56CCF2] text-[#56CCF2] hover:bg-[#56CCF2]/10"
                            onClick={() => handleStageChange(deal.id, getNextStage(deal.stage)!)}
                            disabled={mutating}
                          >
                            {mutating ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2" />
                            )}
                            Move to {getStageLabel(getNextStage(deal.stage)!)}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pipeline Stages Explanation */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mt-8">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Deal Pipeline Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-6">
              {PIPELINE_STAGES.map((stage) => (
                <div key={stage.key}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                    <h4 className="font-bold dark:text-white">{stage.label}</h4>
                    <span className="text-xs text-muted-foreground dark:text-white/60">
                      ({dealsByStage[stage.key]?.length || 0})
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-white/70">
                    {stage.key === 'SOURCING' && 'Initial deal identification and preliminary review'}
                    {stage.key === 'DUE_DILIGENCE' && 'Property inspection, title review, and verification'}
                    {stage.key === 'UNDER_CONTRACT' && 'Contract signed, awaiting closing conditions'}
                    {stage.key === 'CLOSING' && 'Final negotiations and transaction completion'}
                    {stage.key === 'CLOSED' && 'Successfully completed acquisitions'}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  )
}

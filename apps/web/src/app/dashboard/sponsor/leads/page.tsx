"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import { useLeads, useLeadMutations, type Lead, type LeadStatus } from "@/lib/supabase-hooks"
import Link from "next/link"
import {
  Users,
  TrendingUp,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Building2,
  Plus,
  Search,
  Filter,
  Flame,
  Droplets,
  Snowflake,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  MessageSquare,
  FileText,
  BarChart3,
  Home,
  UserPlus,
  Target,
  Calculator,
  Hammer,
  DollarSign,
  Settings,
  Loader2,
  Trash2,
} from "lucide-react"

export default function LeadsPage() {
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualifying' | 'qualified' | 'cold'>('all')
  const [scoreFilter, setScoreFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

  // Supabase hooks for real data
  const { data: leads, isLoading, error, refetch } = useLeads()
  const { createLead, updateLead, deleteLead, convertToDeal, isLoading: mutating } = useLeadMutations()

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: leads?.length?.toString() || "0" },
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

  // Filter leads based on status and score
  const filteredLeads = (leads || []).filter(lead => {
    if (statusFilter !== 'all' && lead.status?.toLowerCase() !== statusFilter) return false
    if (scoreFilter !== 'all' && lead.score?.toLowerCase() !== scoreFilter) return false
    return true
  })

  // Calculate metrics from real data
  const totalLeads = leads?.length || 0
  const hotLeads = (leads || []).filter(l => l.score === 'HOT').length
  const qualifiedLeads = (leads || []).filter(l => l.status === 'QUALIFIED').length
  const avgProbability = totalLeads > 0
    ? Math.round((leads || []).reduce((sum, l) => sum + (l.probability || 0), 0) / totalLeads)
    : 0
  const totalPipeline = (leads || []).reduce((sum, l) => sum + (l.estimated_value || 0), 0)
  const weightedPipeline = (leads || []).reduce((sum, l) => sum + ((l.estimated_value || 0) * (l.probability || 0) / 100), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getScoreColor = (score: string | undefined) => {
    switch (score?.toUpperCase()) {
      case 'HOT': return 'bg-red-100 text-red-700 border-red-300'
      case 'WARM': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'COLD': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getScoreIcon = (score: string | undefined) => {
    switch (score?.toUpperCase()) {
      case 'HOT': return Flame
      case 'WARM': return Droplets
      case 'COLD': return Snowflake
      default: return Snowflake
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status?.toUpperCase()) {
      case 'NEW': return 'bg-purple-100 text-purple-700'
      case 'CONTACTED': return 'bg-blue-100 text-blue-700'
      case 'QUALIFYING': return 'bg-yellow-100 text-yellow-700'
      case 'QUALIFIED': return 'bg-green-100 text-green-700'
      case 'NEGOTIATING': return 'bg-indigo-100 text-indigo-700'
      case 'UNDER_CONTRACT': return 'bg-teal-100 text-teal-700'
      case 'CLOSED': return 'bg-emerald-100 text-emerald-700'
      case 'LOST': return 'bg-red-100 text-red-700'
      case 'COLD': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string | undefined) => {
    switch (status?.toUpperCase()) {
      case 'NEW': return Plus
      case 'CONTACTED': return Phone
      case 'QUALIFYING': return Search
      case 'QUALIFIED': return CheckCircle2
      case 'COLD': return XCircle
      default: return Clock
    }
  }

  // Handle status change
  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await updateLead(leadId, { status: newStatus })
    refetch()
  }

  // Handle convert to deal
  const handleConvertToDeal = async (lead: Lead) => {
    const primaryContact = lead.contacts?.find(c => c.is_primary) || lead.contacts?.[0]
    const dealData = {
      name: lead.property_name,
      property_id: lead.property_id || undefined,
      lead_id: lead.id,
      value: lead.estimated_value,
      probability: lead.probability || 50,
      expected_close_date: lead.expected_close_date,
      assigned_to_id: lead.assigned_to_id || undefined,
      notes: lead.notes || undefined,
      tags: lead.tags || [],
      created_by_id: user?.id || '',
    }
    const result = await convertToDeal(lead.id, dealData)
    if (result) {
      refetch()
    }
  }

  // Handle delete lead
  const handleDeleteLead = async (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const success = await deleteLead(leadId)
      if (success) {
        refetch()
      }
    }
  }

  // Get primary contact from lead
  const getPrimaryContact = (lead: Lead) => {
    return lead.contacts?.find(c => c.is_primary) || lead.contacts?.[0] || null
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

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton href="/dashboard/sponsor" />
            <div>
              <h1 className="text-4xl font-black mb-2">Lead Management</h1>
              <p className="text-muted-foreground">
                Track and convert deal opportunities into pipeline
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-2 border-[#56CCF2]">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Button>
            <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90" asChild>
              <Link href="/dashboard/sponsor/leads/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Link>
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-16 w-16 text-[#E07A47] mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-bold mb-2">Loading Leads...</h3>
              <p className="text-muted-foreground">
                Fetching your lead data from the database
              </p>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-4 border-red-500">
            <CardContent className="py-12 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Error Loading Leads</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => refetch()} className="bg-[#E07A47] hover:bg-[#E07A47]/90">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Content when loaded */}
        {!isLoading && !error && (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="border-4 border-[#E07A47]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-[#E07A47]" />
                  </div>
                  <p className="text-3xl font-black">{totalLeads}</p>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-red-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Flame className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-3xl font-black">{hotLeads}</p>
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-black">{qualifiedLeads}</p>
                  <p className="text-sm text-muted-foreground">Qualified</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="h-5 w-5 text-[#56CCF2]" />
                  </div>
                  <p className="text-3xl font-black">{avgProbability}%</p>
                  <p className="text-sm text-muted-foreground">Avg Probability</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Building2 className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-black">{formatCurrency(totalPipeline / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">Total Pipeline</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-yellow-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-2xl font-black">{formatCurrency(weightedPipeline / 1000000)}M</p>
                  <p className="text-sm text-muted-foreground">Weighted Value</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-3 items-center">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-bold">Status:</span>
                  {[
                    { value: 'all', label: 'All', icon: Users },
                    { value: 'new', label: 'New', icon: Plus },
                    { value: 'contacted', label: 'Contacted', icon: Phone },
                    { value: 'qualifying', label: 'Qualifying', icon: Search },
                    { value: 'qualified', label: 'Qualified', icon: CheckCircle2 },
                    { value: 'cold', label: 'Cold', icon: XCircle },
                  ].map(status => {
                    const StatusIcon = status.icon
                    return (
                      <Button
                        key={status.value}
                        size="sm"
                        variant={statusFilter === status.value ? 'default' : 'outline'}
                        onClick={() => setStatusFilter(status.value as any)}
                        className={statusFilter === status.value ? 'bg-[#56CCF2]' : ''}
                      >
                        <StatusIcon className="mr-2 h-3 w-3" />
                        {status.label}
                      </Button>
                    )
                  })}

                  <div className="border-l-2 border-slate-200 mx-2 h-6" />

                  <span className="text-sm font-bold">Score:</span>
                  {[
                    { value: 'all', label: 'All Scores' },
                    { value: 'hot', label: 'Hot', icon: Flame },
                    { value: 'warm', label: 'Warm', icon: Droplets },
                    { value: 'cold', label: 'Cold', icon: Snowflake },
                  ].map(score => {
                    const ScoreIcon = score.icon || Users
                    return (
                      <Button
                        key={score.value}
                        size="sm"
                        variant={scoreFilter === score.value ? 'default' : 'outline'}
                        onClick={() => setScoreFilter(score.value as any)}
                        className={scoreFilter === score.value ? 'bg-[#E07A47]' : ''}
                      >
                        {score.icon && <ScoreIcon className="mr-2 h-3 w-3" />}
                        {score.label}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Empty State - No leads at all */}
            {totalLeads === 0 && (
              <Card className="border-4 border-[#E07A47]">
                <CardContent className="py-12 text-center">
                  <UserPlus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Leads Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your pipeline by adding your first lead
                  </p>
                  <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90" asChild>
                    <Link href="/dashboard/sponsor/leads/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Lead
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Leads List */}
            {totalLeads > 0 && (
              <div className="space-y-3">
                {filteredLeads.map(lead => {
                  const ScoreIcon = getScoreIcon(lead.score)
                  const StatusIcon = getStatusIcon(lead.status)
                  const primaryContact = getPrimaryContact(lead)
                  const daysOld = lead.created_at
                    ? Math.floor((new Date().getTime() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24))
                    : 0

                  return (
                    <Card key={lead.id} className="border-4 border-[#E07A47] hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          {/* Lead Score Indicator */}
                          <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getScoreColor(lead.score)} border-2`}>
                            <ScoreIcon className="h-8 w-8" />
                          </div>

                          {/* Lead Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black">{lead.property_name}</h3>
                                  <Badge className={getStatusColor(lead.status)}>
                                    <StatusIcon className="mr-1 h-3 w-3" />
                                    {lead.status?.toLowerCase().replace('_', ' ')}
                                  </Badge>
                                  <Badge variant="outline" className="border-2">
                                    {lead.source?.toLowerCase().replace('_', ' ')}
                                  </Badge>
                                  <Badge className="bg-[#56CCF2]/10 text-[#56CCF2] border-2 border-[#56CCF2]">
                                    {lead.probability || 0}% probability
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {lead.property_address}, {lead.property_city}, {lead.property_state} {lead.property_zip}
                                  </div>
                                  <div className="flex items-center">
                                    <Building2 className="h-4 w-4 mr-1" />
                                    {lead.property_type}
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {(lead.tags || []).map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="bg-purple-100 text-purple-700">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Contact & Metrics Grid */}
                            <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Contact</p>
                                <p className="font-bold text-sm">{primaryContact?.name || 'No contact'}</p>
                                <p className="text-xs text-muted-foreground">{primaryContact?.phone || '-'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Est. Value</p>
                                <p className="font-black text-lg text-[#56CCF2]">{formatCurrency(lead.estimated_value || 0)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Days in Stage</p>
                                <p className="font-bold text-sm">{lead.days_in_stage || 0} days</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Expected Close</p>
                                <p className="font-bold text-sm">
                                  {lead.expected_close_date
                                    ? new Date(lead.expected_close_date).toLocaleDateString()
                                    : 'Not set'}
                                </p>
                              </div>
                            </div>

                            {/* Activity Timeline */}
                            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200 mb-4">
                              <div className="flex items-center gap-4">
                                <Clock className="h-5 w-5 text-yellow-600" />
                                <div>
                                  <p className="font-bold text-sm">Next Action: {lead.next_action || 'No action set'}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {lead.next_action_due_date
                                      ? `Due: ${new Date(lead.next_action_due_date).toLocaleDateString()}`
                                      : 'No due date'} ({daysOld} days old)
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {lead.last_contact_date
                                      ? `Last contact: ${new Date(lead.last_contact_date).toLocaleDateString()}`
                                      : 'No contact yet'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                              <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              {primaryContact?.phone && (
                                <Button variant="outline" className="border-2 border-[#E07A47]">
                                  <Phone className="mr-2 h-4 w-4" />
                                  Call Contact
                                </Button>
                              )}
                              {primaryContact?.email && (
                                <Button variant="outline">
                                  <Mail className="mr-2 h-4 w-4" />
                                  Send Email
                                </Button>
                              )}
                              <Button variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Add Note
                              </Button>
                              <Button
                                variant="outline"
                                className="border-2 border-green-500 text-green-600"
                                onClick={() => handleConvertToDeal(lead)}
                                disabled={mutating}
                              >
                                {mutating ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Plus className="mr-2 h-4 w-4" />
                                )}
                                Convert to Deal
                              </Button>
                              <Button
                                variant="outline"
                                className="border-2 border-red-500 text-red-600"
                                onClick={() => handleDeleteLead(lead.id)}
                                disabled={mutating}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}

            {/* Empty State - Filtered results */}
            {totalLeads > 0 && filteredLeads.length === 0 && (
              <Card className="border-4 border-[#E07A47]">
                <CardContent className="py-12 text-center">
                  <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Leads Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or add a new lead
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter('all')
                        setScoreFilter('all')
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90" asChild>
                      <Link href="/dashboard/sponsor/leads/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Lead
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
        </div>
      </main>
    </div>
  )
}

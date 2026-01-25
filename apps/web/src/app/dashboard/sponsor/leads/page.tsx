"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
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
} from "lucide-react"

export default function LeadsPage() {
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualifying' | 'qualified' | 'cold'>('all')
  const [scoreFilter, setScoreFilter] = useState<'all' | 'hot' | 'warm' | 'cold'>('all')

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

  // Mock leads data with CRM features
  const leads = [
    {
      id: 1,
      propertyName: "Lakeside Apartments",
      address: "4200 Lake Drive, Austin, TX",
      contactName: "Sarah Johnson",
      contactEmail: "sarah.johnson@lakesideproperties.com",
      contactPhone: "(512) 555-0123",
      source: "Broker Referral",
      status: "qualified",
      score: "hot",
      submittedDate: "2024-01-20",
      lastContact: "2024-01-22",
      nextAction: "Schedule site visit",
      nextActionDate: "2024-01-25",
      estimatedValue: 24500000,
      units: 186,
      type: "Multifamily",
      notes: 3,
      activities: 5,
      assignedTo: "John Smith",
      probability: 75,
      expectedCloseDate: "2024-03-15",
      tags: ["High Priority", "Off-Market", "Value-Add"],
    },
    {
      id: 2,
      propertyName: "Downtown Office Tower",
      address: "1800 Main Street, Dallas, TX",
      contactName: "Michael Chen",
      contactEmail: "mchen@commercialre.com",
      contactPhone: "(214) 555-0456",
      source: "LoopNet Inquiry",
      status: "qualifying",
      score: "warm",
      submittedDate: "2024-01-18",
      lastContact: "2024-01-21",
      nextAction: "Send investment criteria",
      nextActionDate: "2024-01-24",
      estimatedValue: 48000000,
      units: 0,
      type: "Commercial Office",
      notes: 2,
      activities: 3,
      assignedTo: "Emily Davis",
      probability: 45,
      expectedCloseDate: "2024-04-30",
      tags: ["Core Plus", "Trophy Asset"],
    },
    {
      id: 3,
      propertyName: "Industrial Warehouse Complex",
      address: "9500 Logistics Parkway, Houston, TX",
      contactName: "David Martinez",
      contactEmail: "d.martinez@industrialgroup.com",
      contactPhone: "(713) 555-0789",
      source: "Direct Seller",
      status: "contacted",
      score: "hot",
      submittedDate: "2024-01-22",
      lastContact: "2024-01-22",
      nextAction: "Review financial package",
      nextActionDate: "2024-01-26",
      estimatedValue: 32000000,
      units: 0,
      type: "Industrial",
      notes: 1,
      activities: 2,
      assignedTo: "John Smith",
      probability: 60,
      expectedCloseDate: "2024-02-28",
      tags: ["Amazon Tenant", "Triple Net"],
    },
    {
      id: 4,
      propertyName: "Retail Shopping Center",
      address: "6700 Commerce Street, San Antonio, TX",
      contactName: "Jennifer Williams",
      contactEmail: "jwilliams@retailproperties.com",
      contactPhone: "(210) 555-0321",
      source: "CoStar",
      status: "new",
      score: "warm",
      submittedDate: "2024-01-23",
      lastContact: null,
      nextAction: "Initial outreach",
      nextActionDate: "2024-01-24",
      estimatedValue: 15800000,
      units: 0,
      type: "Retail",
      notes: 0,
      activities: 1,
      assignedTo: "Emily Davis",
      probability: 30,
      expectedCloseDate: "2024-05-15",
      tags: ["Grocery Anchored", "Stable"],
    },
    {
      id: 5,
      propertyName: "Medical Office Building",
      address: "3300 Medical Drive, Fort Worth, TX",
      contactName: "Robert Taylor",
      contactEmail: "rtaylor@medicalrealestate.com",
      contactPhone: "(817) 555-0654",
      source: "Website Form",
      status: "cold",
      score: "cold",
      submittedDate: "2024-01-10",
      lastContact: "2024-01-15",
      nextAction: "Follow-up email",
      nextActionDate: "2024-01-27",
      estimatedValue: 18500000,
      units: 0,
      type: "Medical Office",
      notes: 4,
      activities: 6,
      assignedTo: "John Smith",
      probability: 15,
      expectedCloseDate: "2024-06-30",
      tags: ["Healthcare", "Long-term Hold"],
    },
    {
      id: 6,
      propertyName: "Student Housing Community",
      address: "1500 University Avenue, College Station, TX",
      contactName: "Amanda Rodriguez",
      contactEmail: "arodriguez@studenthousing.com",
      contactPhone: "(979) 555-0987",
      source: "Broker (CBRE)",
      status: "qualified",
      score: "hot",
      submittedDate: "2024-01-19",
      lastContact: "2024-01-23",
      nextAction: "Investment committee presentation",
      nextActionDate: "2024-01-29",
      estimatedValue: 29000000,
      units: 224,
      type: "Student Housing",
      notes: 5,
      activities: 8,
      assignedTo: "Emily Davis",
      probability: 80,
      expectedCloseDate: "2024-03-01",
      tags: ["Purpose Built", "Individual Leases", "Premium"],
    },
  ]

  const filteredLeads = leads.filter(lead => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false
    if (scoreFilter !== 'all' && lead.score !== scoreFilter) return false
    return true
  })

  // Calculate metrics
  const totalLeads = leads.length
  const hotLeads = leads.filter(l => l.score === 'hot').length
  const qualifiedLeads = leads.filter(l => l.status === 'qualified').length
  const avgProbability = Math.round(leads.reduce((sum, l) => sum + l.probability, 0) / leads.length)
  const totalPipeline = leads.reduce((sum, l) => sum + l.estimatedValue, 0)
  const weightedPipeline = leads.reduce((sum, l) => sum + (l.estimatedValue * l.probability / 100), 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getScoreColor = (score: string) => {
    switch (score) {
      case 'hot': return 'bg-red-100 text-red-700 border-red-300'
      case 'warm': return 'bg-orange-100 text-orange-700 border-orange-300'
      case 'cold': return 'bg-blue-100 text-blue-700 border-blue-300'
      default: return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getScoreIcon = (score: string) => {
    switch (score) {
      case 'hot': return Flame
      case 'warm': return Droplets
      case 'cold': return Snowflake
      default: return Snowflake
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-purple-100 text-purple-700'
      case 'contacted': return 'bg-blue-100 text-blue-700'
      case 'qualifying': return 'bg-yellow-100 text-yellow-700'
      case 'qualified': return 'bg-green-100 text-green-700'
      case 'cold': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return Plus
      case 'contacted': return Phone
      case 'qualifying': return Search
      case 'qualified': return CheckCircle2
      case 'cold': return XCircle
      default: return Clock
    }
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

        {/* Leads Table */}
        <div className="space-y-3">
          {filteredLeads.map(lead => {
            const ScoreIcon = getScoreIcon(lead.score)
            const StatusIcon = getStatusIcon(lead.status)
            const daysOld = Math.floor((new Date().getTime() - new Date(lead.submittedDate).getTime()) / (1000 * 60 * 60 * 24))

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
                            <h3 className="text-2xl font-black">{lead.propertyName}</h3>
                            <Badge className={getStatusColor(lead.status)}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {lead.status}
                            </Badge>
                            <Badge variant="outline" className="border-2">
                              {lead.source}
                            </Badge>
                            <Badge className="bg-[#56CCF2]/10 text-[#56CCF2] border-2 border-[#56CCF2]">
                              {lead.probability}% probability
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {lead.address}
                            </div>
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-1" />
                              {lead.type}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {lead.tags.map((tag, idx) => (
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
                          <p className="font-bold text-sm">{lead.contactName}</p>
                          <p className="text-xs text-muted-foreground">{lead.contactPhone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Est. Value</p>
                          <p className="font-black text-lg text-[#56CCF2]">{formatCurrency(lead.estimatedValue)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                          <p className="font-bold text-sm">{lead.assignedTo}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Expected Close</p>
                          <p className="font-bold text-sm">{new Date(lead.expectedCloseDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {/* Activity Timeline */}
                      <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-2 border-yellow-200 mb-4">
                        <div className="flex items-center gap-4">
                          <Clock className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-bold text-sm">Next Action: {lead.nextAction}</p>
                            <p className="text-xs text-muted-foreground">
                              Due: {new Date(lead.nextActionDate).toLocaleDateString()} ({daysOld} days old)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{lead.notes} notes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{lead.activities} activities</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" className="border-2 border-[#E07A47]">
                          <Phone className="mr-2 h-4 w-4" />
                          Call Contact
                        </Button>
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                        <Button variant="outline">
                          <FileText className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                        <Button variant="outline" className="border-2 border-green-500 text-green-600">
                          <Plus className="mr-2 h-4 w-4" />
                          Move to Pipeline
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredLeads.length === 0 && (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Leads Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or add a new lead
              </p>
              <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Lead
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </main>
    </div>
  )
}

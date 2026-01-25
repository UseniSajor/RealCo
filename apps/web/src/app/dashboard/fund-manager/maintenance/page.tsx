"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Wrench,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  Calendar,
  ArrowLeft,
  Plus,
  Search,
  TrendingUp,
  Home,
  Zap,
  Building2,
  Users,
  Receipt,
  Calculator,
  BarChart3,
  FileText,
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

export default function MaintenancePage() {
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState<'all' | 'submitted' | 'in_progress' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'emergency' | 'high' | 'normal'>('all')

  // Mock maintenance requests
  const requests = [
    {
      id: 1,
      property: "Riverside Apartments",
      unit: "302",
      category: "HVAC",
      title: "Air conditioning not cooling",
      description: "AC unit running but not producing cold air. Temperature reading 78°F.",
      priority: "high",
      status: "in_progress",
      requestedBy: "Sarah Johnson (Tenant)",
      contactPhone: "(512) 555-0123",
      assignedTo: "Cool Air HVAC Services",
      estimatedCost: 450,
      actualCost: null,
      scheduledDate: "2024-01-24",
      submittedDate: "2024-01-22",
      completedDate: null,
      photoCount: 2,
    },
    {
      id: 2,
      property: "Downtown Lofts",
      unit: "801",
      category: "PLUMBING",
      title: "Kitchen sink leak",
      description: "Slow leak under kitchen sink, water pooling in cabinet.",
      priority: "normal",
      status: "submitted",
      requestedBy: "Emily Rodriguez (Tenant)",
      contactPhone: "(512) 555-0789",
      assignedTo: null,
      estimatedCost: 200,
      actualCost: null,
      scheduledDate: null,
      submittedDate: "2024-01-23",
      completedDate: null,
      photoCount: 3,
    },
    {
      id: 3,
      property: "Parkside Townhomes",
      unit: "Common Area",
      category: "ELECTRICAL",
      title: "Parking lot lights out",
      description: "6 light fixtures not working in north parking lot.",
      priority: "high",
      status: "in_progress",
      requestedBy: "Property Manager",
      contactPhone: "(214) 555-0234",
      assignedTo: "Bright Electric Co.",
      estimatedCost: 850,
      actualCost: null,
      scheduledDate: "2024-01-23",
      submittedDate: "2024-01-21",
      completedDate: null,
      photoCount: 4,
    },
    {
      id: 4,
      property: "Riverside Apartments",
      unit: "105",
      category: "APPLIANCE",
      title: "Refrigerator not cooling",
      description: "Refrigerator temperature rising, freezer working normally.",
      priority: "emergency",
      status: "in_progress",
      requestedBy: "James Martinez (Tenant)",
      contactPhone: "(512) 555-0890",
      assignedTo: "Appliance Pros",
      estimatedCost: 320,
      actualCost: null,
      scheduledDate: "2024-01-23",
      submittedDate: "2024-01-23",
      completedDate: null,
      photoCount: 1,
    },
    {
      id: 5,
      property: "Tech Center Plaza",
      unit: "Suite 200",
      category: "HVAC",
      title: "Thermostat malfunction",
      description: "Digital thermostat not responding, HVAC not turning on.",
      priority: "normal",
      status: "completed",
      requestedBy: "TechStart Inc (Tenant)",
      contactPhone: "(713) 555-0456",
      assignedTo: "Cool Air HVAC Services",
      estimatedCost: 180,
      actualCost: 165,
      scheduledDate: "2024-01-20",
      submittedDate: "2024-01-19",
      completedDate: "2024-01-20",
      photoCount: 2,
    },
    {
      id: 6,
      property: "Downtown Lofts",
      unit: "304",
      category: "GENERAL",
      title: "Paint touch-up needed",
      description: "Scuff marks on walls in living room from moving furniture.",
      priority: "normal",
      status: "submitted",
      requestedBy: "Amanda Foster (Tenant)",
      contactPhone: "(512) 555-0567",
      assignedTo: null,
      estimatedCost: 150,
      actualCost: null,
      scheduledDate: null,
      submittedDate: "2024-01-22",
      completedDate: null,
      photoCount: 2,
    },
  ]

  const filteredRequests = requests.filter(r => 
    (statusFilter === 'all' || r.status === statusFilter) &&
    (priorityFilter === 'all' || r.priority === priorityFilter)
  )

  const metrics = {
    totalRequests: requests.length,
    open: requests.filter(r => r.status !== 'completed').length,
    inProgress: requests.filter(r => r.status === 'in_progress').length,
    avgCompletionTime: 1.8, // days
    totalCosts: requests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0),
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'emergency': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'normal': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'submitted': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'in_progress': return <Wrench className="h-5 w-5 text-blue-600" />
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      default: return <AlertCircle className="h-5 w-5 text-gray-600" />
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
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Maintenance Management</h1>
                <p className="text-white/80">Track and manage work orders across all properties</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/fund-manager/maintenance/new">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Requests</p>
                  <p className="text-3xl font-black">{metrics.totalRequests}</p>
                </div>
                <Wrench className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Open</p>
                  <p className="text-3xl font-black">{metrics.open}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">In Progress</p>
                  <p className="text-3xl font-black">{metrics.inProgress}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Time</p>
                  <p className="text-2xl font-black">{metrics.avgCompletionTime}d</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Costs</p>
                  <p className="text-2xl font-black">${(metrics.totalCosts / 1000).toFixed(1)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
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
              placeholder="Search by property, unit, or category..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white bg-white text-slate-900"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold mb-2">Status:</p>
            <div className="flex gap-2">
              {(['all', 'submitted', 'in_progress', 'completed'] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
                >
                  {status === 'all' ? 'All' : status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold mb-2">Priority:</p>
            <div className="flex gap-2">
              {(['all', 'emergency', 'high', 'normal'] as const).map((priority) => (
                <Button
                  key={priority}
                  variant={priorityFilter === priority ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPriorityFilter(priority)}
                  className={priorityFilter === priority ? "bg-[#E07A47] hover:bg-[#E07A47]/90" : "border-2 border-[#E07A47]"}
                >
                  {priority === 'all' ? 'All' : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance Requests Grid */}
        <div className="grid gap-6">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="border-4 border-[#E07A47] bg-white hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Request Info */}
                  <div className="lg:col-span-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {request.priority === 'emergency' && <Zap className="h-5 w-5 text-red-600" />}
                          <h3 className="text-xl font-black text-slate-900">{request.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground text-slate-900/70 mb-2">
                          <Home className="h-4 w-4" />
                          {request.property} {request.unit !== 'Common Area' && `- Unit ${request.unit}`}
                        </div>
                        <p className="text-sm text-muted-foreground text-slate-900/70 mb-3">
                          {request.description}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                            {request.priority.toUpperCase()}
                          </Badge>
                          <Badge className="bg-slate-500 text-white">
                            {request.category}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-slate-900/70">Requested by:</span>
                        <span className="font-bold text-slate-900">{request.requestedBy}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-slate-900/70">Contact:</span>
                        <span className="font-bold text-slate-900">{request.contactPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-slate-900/70">Photos:</span>
                        <span className="font-bold text-slate-900">{request.photoCount} attached</span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Schedule */}
                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 bg-slate-50 rounded-lg p-4 col-span-2">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(request.status)}
                        <p className="text-sm font-bold text-slate-900">
                          {request.status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </p>
                      </div>
                      {request.assignedTo && (
                        <p className="text-xs text-muted-foreground text-slate-900/70">
                          Assigned to: {request.assignedTo}
                        </p>
                      )}
                    </div>

                    <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">Submitted</p>
                      <p className="text-sm font-bold text-slate-900">
                        {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">
                        {request.completedDate ? 'Completed' : request.scheduledDate ? 'Scheduled' : 'Not Scheduled'}
                      </p>
                      <p className="text-sm font-bold text-slate-900">
                        {request.completedDate 
                          ? new Date(request.completedDate).toLocaleDateString()
                          : request.scheduledDate
                          ? new Date(request.scheduledDate).toLocaleDateString()
                          : 'TBD'}
                      </p>
                    </div>

                    <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">Estimated Cost</p>
                      <p className="text-lg font-black text-[#E07A47]">${request.estimatedCost}</p>
                    </div>

                    <div className="bg-muted/50 bg-slate-50 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground text-slate-900/70 mb-1">Actual Cost</p>
                      <p className="text-lg font-black text-slate-900">
                        {request.actualCost ? `$${request.actualCost}` : 'Pending'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/fund-manager/maintenance/${request.id}`}>
                          View Details
                        </Link>
                      </Button>
                      
                      {request.status === 'submitted' && (
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/maintenance/${request.id}/assign`}>
                            Assign Vendor
                          </Link>
                        </Button>
                      )}

                      {request.status === 'in_progress' && (
                        <Button asChild variant="outline" className="w-full border-2 border-green-500">
                          <Link href={`/dashboard/fund-manager/maintenance/${request.id}/complete`}>
                            Mark Complete
                          </Link>
                        </Button>
                      )}

                      <Button variant="outline" className="w-full border-2 border-slate-300 border-slate-200">
                        View Photos
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

"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import {
  Wrench,
  Home,
  HardHat,
  Upload,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Receipt,
  Calendar,
  Clock,
  User,
  Building2,
  XCircle,
  AlertCircle,
  Eye
} from "lucide-react"

// Mock inspections
const MOCK_INSPECTIONS = [
  {
    id: "insp_001",
    type: "Electrical Rough-In",
    project: "Sunset Apartments Phase 2",
    building: "Building A",
    scheduledDate: "2024-01-25",
    scheduledTime: "9:00 AM",
    inspector: "City Building Dept.",
    status: "scheduled",
    notes: "Ensure all junction boxes are accessible"
  },
  {
    id: "insp_002",
    type: "Plumbing Rough-In",
    project: "Sunset Apartments Phase 2",
    building: "Building A",
    scheduledDate: "2024-01-23",
    scheduledTime: "10:00 AM",
    inspector: "City Building Dept.",
    status: "passed",
    result: "Passed with no comments",
    completedDate: "2024-01-23"
  },
  {
    id: "insp_003",
    type: "Foundation",
    project: "Sunset Apartments Phase 2",
    building: "Building B",
    scheduledDate: "2024-01-20",
    scheduledTime: "2:00 PM",
    inspector: "City Building Dept.",
    status: "passed",
    result: "Approved - concrete pour may proceed",
    completedDate: "2024-01-20"
  },
  {
    id: "insp_004",
    type: "Fire Safety",
    project: "Sunset Apartments Phase 2",
    building: "Building A",
    scheduledDate: "2024-01-18",
    scheduledTime: "11:00 AM",
    inspector: "Fire Marshal",
    status: "failed",
    result: "Fire extinguisher placement needs correction",
    completedDate: "2024-01-18",
    reinspectionDate: "2024-01-26"
  }
]

export default function ProviderInspectionsPage() {
  const { user, logout } = useAuth()
  const [statusFilter, setStatusFilter] = useState("all")

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/provider", icon: Home },
    { title: "Work Orders", href: "/dashboard/provider/vendor-portal", icon: HardHat, badge: "3" },
    { title: "Submit Invoice", href: "/dashboard/provider/submit-invoice", icon: Upload },
    { title: "Daily Logs", href: "/dashboard/provider/daily-logs", icon: ClipboardList },
    { title: "Inspections", href: "/dashboard/provider/inspections", icon: CheckCircle2 },
    { title: "Transactions", href: "/dashboard/provider/transactions", icon: Receipt },
    { title: "Safety Reports", href: "/dashboard/provider/safety", icon: AlertTriangle },
    { title: "Documents", href: "/dashboard/provider/vendor-portal", icon: FileText },
    { title: "Messages", href: "/dashboard/provider/vendor-portal", icon: MessageSquare, badge: "2" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-300">Scheduled</Badge>
      case 'passed': return <Badge className="bg-green-100 text-green-700 border-2 border-green-300">Passed</Badge>
      case 'failed': return <Badge className="bg-red-100 text-red-700 border-2 border-red-300">Failed</Badge>
      case 'in_progress': return <Badge className="bg-yellow-100 text-yellow-700 border-2 border-yellow-300">In Progress</Badge>
      default: return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-5 w-5 text-blue-500" />
      case 'passed': return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />
      default: return <AlertCircle className="h-5 w-5" />
    }
  }

  const filteredInspections = statusFilter === 'all'
    ? MOCK_INSPECTIONS
    : MOCK_INSPECTIONS.filter(i => i.status === statusFilter)

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Service Provider"
        roleIcon={Wrench}
        userName={user?.name || "BuildRight Construction"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BackButton href="/dashboard/provider" />
              <div>
                <h1 className="text-3xl font-black">Inspections</h1>
                <p className="text-muted-foreground">Schedule and track inspections</p>
              </div>
            </div>
            <Button className="bg-[#E07A47] hover:bg-[#D96835]">
              <Calendar className="mr-2 h-4 w-4" />
              Request Inspection
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="border-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-3xl font-black">1</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Passed</p>
                    <p className="text-3xl font-black">2</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-3xl font-black">1</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pass Rate</p>
                    <p className="text-3xl font-black">67%</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-[#E07A47]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'scheduled', 'passed', 'failed'].map(status => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? 'default' : 'outline'}
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-[#E07A47]' : 'border-2'}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Inspections List */}
          <div className="space-y-4">
            {filteredInspections.map(inspection => (
              <Card key={inspection.id} className={`border-4 ${
                inspection.status === 'failed' ? 'border-red-500' :
                inspection.status === 'passed' ? 'border-green-500' :
                'border-blue-500'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        inspection.status === 'failed' ? 'bg-red-100' :
                        inspection.status === 'passed' ? 'bg-green-100' :
                        'bg-blue-100'
                      }`}>
                        {getStatusIcon(inspection.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-xl">{inspection.type}</h3>
                          {getStatusBadge(inspection.status)}
                        </div>
                        <p className="text-muted-foreground mb-2">{inspection.project} - {inspection.building}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(inspection.scheduledDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {inspection.scheduledTime}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {inspection.inspector}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-2">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </div>

                  {inspection.status !== 'scheduled' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="font-semibold">Result: </span>
                        {inspection.result}
                      </p>
                      {inspection.status === 'failed' && inspection.reinspectionDate && (
                        <p className="text-sm text-red-600 mt-2">
                          <span className="font-semibold">Re-inspection: </span>
                          {new Date(inspection.reinspectionDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {inspection.notes && inspection.status === 'scheduled' && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold">Notes: </span>
                        {inspection.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

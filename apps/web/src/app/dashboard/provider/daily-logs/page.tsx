"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Plus,
  Calendar,
  Cloud,
  Sun,
  CloudRain,
  Users,
  Clock,
  Camera,
  Save
} from "lucide-react"

// Mock daily logs
const MOCK_LOGS = [
  {
    id: "log_001",
    date: "2024-01-22",
    project: "Sunset Apartments Phase 2",
    weather: "Clear",
    temperature: "72°F",
    crewSize: 18,
    hoursWorked: 8,
    workCompleted: "Completed framing on units 15-20. Started electrical rough-in on building B.",
    materials: "Lumber delivery (2x4, 2x6), electrical wire",
    equipment: "Crane, forklift, scaffolding",
    issues: "None",
    safetyIncidents: 0,
    status: "submitted"
  },
  {
    id: "log_002",
    date: "2024-01-21",
    project: "Sunset Apartments Phase 2",
    weather: "Cloudy",
    temperature: "68°F",
    crewSize: 15,
    hoursWorked: 8,
    workCompleted: "Continued framing on units 10-14. Plumbing rough-in on building A.",
    materials: "PVC pipes, copper fittings",
    equipment: "Crane, forklift",
    issues: "Minor delay due to material delivery",
    safetyIncidents: 0,
    status: "approved"
  },
  {
    id: "log_003",
    date: "2024-01-20",
    project: "Sunset Apartments Phase 2",
    weather: "Rain",
    temperature: "55°F",
    crewSize: 8,
    hoursWorked: 4,
    workCompleted: "Interior work only - drywall installation on building A ground floor.",
    materials: "Drywall sheets, joint compound",
    equipment: "Drywall lift",
    issues: "Weather delay - outdoor work suspended",
    safetyIncidents: 0,
    status: "approved"
  }
]

export default function ProviderDailyLogsPage() {
  const { user, logout } = useAuth()
  const [showNewLog, setShowNewLog] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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

  const getWeatherIcon = (weather: string) => {
    switch (weather.toLowerCase()) {
      case 'clear': return <Sun className="h-4 w-4 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-4 w-4 text-slate-500" />
      case 'rain': return <CloudRain className="h-4 w-4 text-blue-500" />
      default: return <Sun className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted': return <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>
      case 'approved': return <Badge className="bg-green-100 text-green-700">Approved</Badge>
      case 'rejected': return <Badge className="bg-red-100 text-red-700">Needs Revision</Badge>
      default: return <Badge>Draft</Badge>
    }
  }

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
                <h1 className="text-3xl font-black">Daily Logs</h1>
                <p className="text-muted-foreground">Document daily construction activities</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewLog(true)}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Daily Log
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-3xl font-black">5</p>
                    <p className="text-xs text-muted-foreground">logs submitted</p>
                  </div>
                  <ClipboardList className="h-8 w-8 text-[#E07A47]" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="text-3xl font-black">156</p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                  <Clock className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Crew Size</p>
                    <p className="text-3xl font-black">14</p>
                    <p className="text-xs text-muted-foreground">workers/day</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Safety Record</p>
                    <p className="text-3xl font-black">0</p>
                    <p className="text-xs text-muted-foreground">incidents</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* New Log Form */}
          {showNewLog && (
            <Card className="border-4 border-[#E07A47] mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-[#E07A47]" />
                  New Daily Log
                </CardTitle>
                <CardDescription>Record today's construction activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Weather</label>
                    <select className="w-full h-10 px-3 rounded-md border-2 border-input bg-background">
                      <option>Clear</option>
                      <option>Cloudy</option>
                      <option>Rain</option>
                      <option>Snow</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Temperature</label>
                    <Input placeholder="72°F" className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Crew Size</label>
                    <Input type="number" placeholder="15" className="border-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Work Completed</label>
                  <textarea
                    rows={3}
                    placeholder="Describe work completed today..."
                    className="w-full px-3 py-2 rounded-md border-2 border-input bg-background resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Materials Used</label>
                    <Input placeholder="List materials received/used" className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Equipment</label>
                    <Input placeholder="List equipment used" className="border-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Issues/Delays</label>
                  <Input placeholder="Note any issues or delays" className="border-2" />
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" className="border-2">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Photos
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNewLog(false)} className="border-2">Cancel</Button>
                    <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                      <Save className="mr-2 h-4 w-4" />
                      Submit Log
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Log History */}
          <Card className="border-4 border-slate-300">
            <CardHeader>
              <CardTitle>Recent Daily Logs</CardTitle>
              <CardDescription>View and manage submitted logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_LOGS.map(log => (
                  <div key={log.id} className="p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:border-[#E07A47] transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-bold">{new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {getWeatherIcon(log.weather)}
                          <span className="text-sm text-muted-foreground">{log.temperature}</span>
                        </div>
                      </div>
                      {getStatusBadge(log.status)}
                    </div>
                    <p className="text-sm mb-3">{log.workCompleted}</p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {log.crewSize} workers
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {log.hoursWorked} hours
                      </span>
                      {log.issues !== "None" && (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="h-4 w-4" />
                          {log.issues}
                        </span>
                      )}
                    </div>
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

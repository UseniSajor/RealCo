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
  Shield,
  Calendar,
  User,
  MapPin,
  Camera,
  Save,
  AlertCircle,
  Clock,
  Activity
} from "lucide-react"

// Mock safety data
const MOCK_INCIDENTS = [
  {
    id: "inc_001",
    date: "2024-01-15",
    type: "Near Miss",
    description: "Worker nearly struck by falling debris. Hard hat prevented injury.",
    location: "Building A, Floor 3",
    reportedBy: "John Smith",
    severity: "low",
    status: "resolved",
    correctiveAction: "Additional netting installed, toolbox talk conducted"
  },
  {
    id: "inc_002",
    date: "2024-01-08",
    type: "Minor Injury",
    description: "Small cut on hand from sharp edge. First aid administered on site.",
    location: "Building B, Ground Floor",
    reportedBy: "Mike Johnson",
    severity: "low",
    status: "resolved",
    correctiveAction: "Cut-resistant gloves now required for all workers handling sheet metal"
  }
]

const MOCK_TOOLBOX_TALKS = [
  { id: "tt_001", date: "2024-01-22", topic: "Fall Protection", attendees: 18, duration: "15 min" },
  { id: "tt_002", date: "2024-01-19", topic: "Electrical Safety", attendees: 15, duration: "20 min" },
  { id: "tt_003", date: "2024-01-15", topic: "PPE Requirements", attendees: 20, duration: "15 min" },
  { id: "tt_004", date: "2024-01-12", topic: "Scaffold Safety", attendees: 12, duration: "25 min" }
]

export default function ProviderSafetyPage() {
  const { user, logout } = useAuth()
  const [showNewIncident, setShowNewIncident] = useState(false)

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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return <Badge className="bg-yellow-100 text-yellow-700">Low</Badge>
      case 'medium': return <Badge className="bg-orange-100 text-orange-700">Medium</Badge>
      case 'high': return <Badge className="bg-red-100 text-red-700">High</Badge>
      default: return <Badge>Unknown</Badge>
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
                <h1 className="text-3xl font-black">Safety Management</h1>
                <p className="text-muted-foreground">Track safety incidents and compliance</p>
              </div>
            </div>
            <Button
              onClick={() => setShowNewIncident(true)}
              className="bg-red-600 hover:bg-red-700"
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Report Incident
            </Button>
          </div>

          {/* Safety Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <Card className="border-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Days Without Incident</p>
                    <p className="text-3xl font-black text-green-600">7</p>
                  </div>
                  <Shield className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Toolbox Talks</p>
                    <p className="text-3xl font-black">4</p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-yellow-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Near Misses</p>
                    <p className="text-3xl font-black">1</p>
                    <p className="text-xs text-muted-foreground">this month</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">OSHA Recordable</p>
                    <p className="text-3xl font-black">0</p>
                    <p className="text-xs text-muted-foreground">this year</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-[#E07A47]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Incident Form */}
          {showNewIncident && (
            <Card className="border-4 border-red-500 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Report Safety Incident
                </CardTitle>
                <CardDescription>Document safety incidents immediately</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date</label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time</label>
                    <Input type="time" className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Incident Type</label>
                    <select className="w-full h-10 px-3 rounded-md border-2 border-input bg-background">
                      <option>Near Miss</option>
                      <option>Minor Injury</option>
                      <option>Major Injury</option>
                      <option>Property Damage</option>
                      <option>Environmental</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Location</label>
                    <Input placeholder="Building, floor, area" className="border-2" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Person(s) Involved</label>
                    <Input placeholder="Names of people involved" className="border-2" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe what happened..."
                    className="w-full px-3 py-2 rounded-md border-2 border-input bg-background resize-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Immediate Action Taken</label>
                  <textarea
                    rows={2}
                    placeholder="What was done immediately after the incident?"
                    className="w-full px-3 py-2 rounded-md border-2 border-input bg-background resize-none"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <Button variant="outline" className="border-2">
                    <Camera className="mr-2 h-4 w-4" />
                    Add Photos
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowNewIncident(false)} className="border-2">Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Save className="mr-2 h-4 w-4" />
                      Submit Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-6">
            {/* Recent Incidents */}
            <Card className="border-4 border-slate-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>Safety incidents reported</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {MOCK_INCIDENTS.map(incident => (
                    <div key={incident.id} className="p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-200">{incident.type}</Badge>
                          {getSeverityBadge(incident.severity)}
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(incident.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm mb-2">{incident.description}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {incident.reportedBy}
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                          {incident.correctiveAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Toolbox Talks */}
            <Card className="border-4 border-blue-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardHat className="h-5 w-5 text-blue-500" />
                  Toolbox Talks
                </CardTitle>
                <CardDescription>Safety training sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {MOCK_TOOLBOX_TALKS.map(talk => (
                    <div key={talk.id} className="p-3 rounded-xl bg-blue-50 border-2 border-blue-200 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{talk.topic}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(talk.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {talk.attendees} attendees
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {talk.duration}
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-2 border-blue-500 text-blue-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Toolbox Talk
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

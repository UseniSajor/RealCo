"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Hammer,
  Calendar,
  AlertTriangle,
  DollarSign,
  Users,
  FileText,
  Image as ImageIcon,
  List,
  Home,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SponsorConstructionPage() {
  const { logout } = useAuth()

  // Page-specific sidebar for construction tools
  const constructionSidebarItems = [
    { title: "Overview", href: "#overview", icon: Home },
    { title: "Timeline", href: "#timeline", icon: Calendar },
    { title: "Budget", href: "#budget", icon: DollarSign },
    { title: "Tasks", href: "#tasks", icon: List },
    { title: "Documents", href: "#documents", icon: FileText },
    { title: "Photos", href: "#photos", icon: ImageIcon },
    { title: "Issues", href: "#issues", icon: AlertTriangle },
    { title: "Team", href: "#team", icon: Users },
  ]

  const projectOverview = {
    name: 'Sunset Apartments',
    budget: 8000000,
    spent: 3200000,
    percentComplete: 42,
    status: 'ON_TRACK',
  }

  const phases = [
    { name: 'Site Preparation', status: 'COMPLETED', percent: 100, budget: 450000, spent: 445000 },
    { name: 'Foundation', status: 'COMPLETED', percent: 100, budget: 980000, spent: 995000 },
    { name: 'Framing & Structure', status: 'IN_PROGRESS', percent: 68, budget: 1800000, spent: 1220000 },
    { name: 'MEP Systems', status: 'IN_PROGRESS', percent: 25, budget: 1500000, spent: 375000 },
    { name: 'Interior Finishes', status: 'NOT_STARTED', percent: 0, budget: 1800000, spent: 0 },
    { name: 'Landscaping', status: 'NOT_STARTED', percent: 0, budget: 620000, spent: 0 },
  ]

  return (
    <div className="flex min-h-screen bg-white">
      {/* Page-Specific Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#56CCF2] border-r border-[#56CCF2] flex flex-col overflow-y-auto">
        {/* Header with Return to Dashboard */}
        <div className="p-6 border-b border-white/20">
          <Button asChild className="w-full mb-4 bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-full">
            <Link href="/dashboard/sponsor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg">Construction</h2>
              <p className="text-xs text-white/70">Sunset Apartments</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {constructionSidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <a key={item.href} href={item.href} className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-white hover:bg-white/20 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.title}</span>
                </Button>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/20">
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-white/20 hover:text-white"
            size="sm"
            onClick={logout}
          >
            Exit Demo
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          {/* Overview Section */}
          <div id="overview" className="mb-12">
            <h1 className="text-4xl font-black mb-2">{projectOverview.name}</h1>
            <p className="text-lg text-muted-foreground mb-8">Construction Progress & Management</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">${(projectOverview.budget / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">Approved budget</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Spent to Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">${(projectOverview.spent / 1000000).toFixed(1)}M</div>
                  <p className="text-xs text-muted-foreground">{Math.round((projectOverview.spent / projectOverview.budget) * 100)}% of budget</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">% Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">{projectOverview.percentComplete}%</div>
                  <p className="text-xs text-green-600">On schedule</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-500">On Track</Badge>
                  <p className="text-xs text-muted-foreground mt-2">No delays</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Timeline Section */}
          <div id="timeline" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Construction Timeline</h2>
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {phases.map((phase, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white border-2 border-slate-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{phase.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>${(phase.spent / 1000).toFixed(0)}K / ${(phase.budget / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                        <Badge className={
                          phase.status === 'COMPLETED' ? 'bg-green-500' :
                          phase.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                          'bg-slate-400'
                        }>
                          {phase.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">{phase.percent}% Complete</span>
                          <span className="text-muted-foreground">
                            {phase.status === 'COMPLETED' ? '✓ Done' :
                             phase.status === 'IN_PROGRESS' ? 'In Progress' : 'Upcoming'}
                          </span>
                        </div>
                        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47]"
                            style={{ width: `${phase.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Section */}
          <div id="budget" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Budget Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader>
                  <CardTitle>Budget by Phase</CardTitle>
                  <CardDescription>Allocated vs. Spent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phases.map((phase, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white">
                        <span className="font-semibold text-sm">{phase.name}</span>
                        <div className="text-right">
                          <div className="font-bold">${(phase.spent / 1000).toFixed(0)}K</div>
                          <div className="text-xs text-muted-foreground">of ${(phase.budget / 1000).toFixed(0)}K</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader>
                  <CardTitle>Remaining Budget</CardTitle>
                  <CardDescription>Available funds</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-[#56CCF2] mb-2">
                      ${((projectOverview.budget - projectOverview.spent) / 1000000).toFixed(1)}M
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(((projectOverview.budget - projectOverview.spent) / projectOverview.budget) * 100)}% of total budget remaining
                    </p>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47]"
                      style={{ width: `${(projectOverview.spent / projectOverview.budget) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Spent: ${(projectOverview.spent / 1000000).toFixed(1)}M</span>
                    <span>Budget: ${(projectOverview.budget / 1000000).toFixed(1)}M</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tasks Section */}
          <div id="tasks" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Active Tasks</h2>
            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    { task: 'Complete 3rd floor framing', phase: 'Framing', assignee: 'ABC Construction', priority: 'HIGH' },
                    { task: 'Install HVAC rough-in', phase: 'MEP', assignee: 'Climate Systems', priority: 'HIGH' },
                    { task: 'Foundation inspection', phase: 'Foundation', assignee: 'City Inspector', priority: 'MEDIUM' },
                    { task: 'Electrical panel delivery', phase: 'MEP', assignee: 'Electrical Supply Co', priority: 'LOW' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-slate-200">
                      <div className="w-10 h-10 rounded-full bg-[#E07A47]/10 flex items-center justify-center">
                        <List className="h-5 w-5 text-[#E07A47]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{item.task}</h4>
                        <p className="text-sm text-muted-foreground">{item.phase} • {item.assignee}</p>
                      </div>
                      <Badge className={
                        item.priority === 'HIGH' ? 'bg-red-500' :
                        item.priority === 'MEDIUM' ? 'bg-yellow-500' :
                        'bg-blue-500'
                      }>
                        {item.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents & Photos placeholder sections */}
          <div id="documents" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Documents</h2>
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Project documents and drawings</p>
              </CardContent>
            </Card>
          </div>

          <div id="photos" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Progress Photos</h2>
            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground">Site photos and visual progress tracking</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

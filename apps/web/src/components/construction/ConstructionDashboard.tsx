"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Hammer, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react"

export function ConstructionDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock project overview
  const projectOverview = {
    name: 'Sunset Apartments',
    startDate: '2025-03-01',
    targetCompletion: '2026-08-31',
    actualCompletion: null,
    budget: 8000000,
    spent: 3200000,
    percentComplete: 42,
    daysRemaining: 485,
    status: 'ON_TRACK',
  }

  // Mock construction phases with Gantt-like data
  const phases = [
    {
      id: '1',
      name: 'Site Preparation',
      startDate: '2025-03-01',
      endDate: '2025-04-15',
      status: 'COMPLETED',
      percentComplete: 100,
      budget: 450000,
      spent: 445000,
      daysTotal: 45,
      daysElapsed: 45,
    },
    {
      id: '2',
      name: 'Foundation',
      startDate: '2025-04-16',
      endDate: '2025-06-30',
      status: 'COMPLETED',
      percentComplete: 100,
      budget: 980000,
      spent: 995000,
      daysTotal: 75,
      daysElapsed: 75,
    },
    {
      id: '3',
      name: 'Framing & Structure',
      startDate: '2025-07-01',
      endDate: '2025-10-15',
      status: 'IN_PROGRESS',
      percentComplete: 68,
      budget: 1800000,
      spent: 1220000,
      daysTotal: 107,
      daysElapsed: 73,
    },
    {
      id: '4',
      name: 'MEP (Mechanical, Electrical, Plumbing)',
      startDate: '2025-10-01',
      endDate: '2026-02-28',
      status: 'IN_PROGRESS',
      percentComplete: 25,
      budget: 1500000,
      spent: 375000,
      daysTotal: 150,
      daysElapsed: 38,
    },
    {
      id: '5',
      name: 'Interior Finishes',
      startDate: '2026-01-15',
      endDate: '2026-06-30',
      status: 'NOT_STARTED',
      percentComplete: 0,
      budget: 1800000,
      spent: 0,
      daysTotal: 167,
      daysElapsed: 0,
    },
    {
      id: '6',
      name: 'Exterior & Landscaping',
      startDate: '2026-05-01',
      endDate: '2026-07-31',
      status: 'NOT_STARTED',
      percentComplete: 0,
      budget: 620000,
      spent: 0,
      daysTotal: 92,
      daysElapsed: 0,
    },
    {
      id: '7',
      name: 'Final Inspections & Closeout',
      startDate: '2026-08-01',
      endDate: '2026-08-31',
      status: 'NOT_STARTED',
      percentComplete: 0,
      budget: 120000,
      spent: 0,
      daysTotal: 31,
      daysElapsed: 0,
    },
  ]

  // Mock active tasks
  const activeTasks = [
    {
      id: '1',
      title: 'Complete 3rd floor framing',
      phase: 'Framing & Structure',
      assignee: 'ABC Construction',
      dueDate: '2026-01-30',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      id: '2',
      title: 'Install HVAC units - Building A',
      phase: 'MEP',
      assignee: 'XYZ Mechanical',
      dueDate: '2026-02-05',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      title: 'Electrical rough-in inspection',
      phase: 'MEP',
      assignee: 'Power Systems Inc',
      dueDate: '2026-01-28',
      priority: 'HIGH',
      status: 'PENDING',
    },
  ]

  // Mock issues/alerts
  const issues = [
    {
      id: '1',
      title: 'Material delivery delay - Steel beams',
      severity: 'MEDIUM',
      phase: 'Framing & Structure',
      dateReported: '2026-01-20',
      status: 'OPEN',
    },
    {
      id: '2',
      title: 'Foundation budget overrun',
      severity: 'LOW',
      phase: 'Foundation',
      dateReported: '2025-06-25',
      status: 'RESOLVED',
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-500 text-white'
      case 'IN_PROGRESS': return 'bg-[#56CCF2] text-white'
      case 'NOT_STARTED': return 'bg-slate-400 text-white'
      case 'DELAYED': return 'bg-red-500 text-white'
      case 'ON_TRACK': return 'bg-green-500 text-white'
      case 'AT_RISK': return 'bg-yellow-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-500 text-white'
      case 'MEDIUM': return 'bg-yellow-500 text-white'
      case 'LOW': return 'bg-green-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'HIGH': return 'text-red-600 bg-red-50 dark:bg-red-950'
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'LOW': return 'text-green-600 bg-green-50 dark:bg-green-950'
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-950'
    }
  }

  const filteredPhases = selectedPhase === 'ALL' 
    ? phases 
    : phases.filter(p => p.status === selectedPhase)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Construction Dashboard</h2>
        <p className="text-base text-muted-foreground">
          Real-time project tracking and construction management
        </p>
      </div>

      {/* Project Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Overall Progress</p>
              <TrendingUp className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {projectOverview.percentComplete}%
            </p>
            <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#56CCF2]"
                style={{ width: `${projectOverview.percentComplete}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Budget Spent</p>
              <Hammer className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {((projectOverview.spent / projectOverview.budget) * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(projectOverview.spent)} of {formatCurrency(projectOverview.budget)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Project Status</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-2xl font-black text-green-600">
              ON TRACK
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {projectOverview.daysRemaining} days remaining
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Active Tasks</p>
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {activeTasks.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {activeTasks.filter(t => t.priority === 'HIGH').length} high priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Timeline Info */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-[#56CCF2]" />
              <div>
                <p className="text-sm text-muted-foreground">Project Start</p>
                <p className="font-bold text-lg">{formatDate(projectOverview.startDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-[#E07A47]" />
              <div>
                <p className="text-sm text-muted-foreground">Target Completion</p>
                <p className="font-bold text-lg">{formatDate(projectOverview.targetCompletion)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hammer className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="font-bold text-lg text-green-600">{projectOverview.daysRemaining} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'IN_PROGRESS', 'COMPLETED', 'NOT_STARTED'].map((status) => (
          <Button
            key={status}
            variant={selectedPhase === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPhase(status)}
            className={selectedPhase === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {/* Gantt Chart (Simplified Visual Timeline) */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
        <CardHeader>
          <CardTitle>Construction Timeline</CardTitle>
          <CardDescription>Phase-by-phase progress tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPhases.map((phase, index) => (
              <div key={phase.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E07A47] text-white flex items-center justify-center font-black text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-bold">{phase.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(phase.startDate)} → {formatDate(phase.endDate)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status.replace('_', ' ')}
                  </Badge>
                </div>

                <div className="ml-11">
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <p className="text-muted-foreground">Progress</p>
                      <p className="font-bold">{phase.percentComplete}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-bold">{formatCurrency(phase.budget)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Spent</p>
                      <p className="font-bold">{formatCurrency(phase.spent)}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg overflow-hidden flex">
                    <div 
                      className={`flex items-center justify-center text-xs font-bold ${
                        phase.status === 'COMPLETED' ? 'bg-green-500' : 
                        phase.status === 'IN_PROGRESS' ? 'bg-[#56CCF2]' : 
                        'bg-slate-400'
                      } text-white`}
                      style={{ width: `${phase.percentComplete}%` }}
                    >
                      {phase.percentComplete > 15 && `${phase.percentComplete}%`}
                    </div>
                  </div>

                  {/* Time Progress */}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Day {phase.daysElapsed} of {phase.daysTotal} 
                    {phase.status === 'IN_PROGRESS' && ` (${phase.daysTotal - phase.daysElapsed} days remaining)`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tasks */}
        <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#56CCF2]" />
              Active Tasks
            </CardTitle>
            <CardDescription>Current work items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold">{task.title}</h4>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{task.phase}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Issues & Alerts */}
        <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Issues & Alerts
            </CardTitle>
            <CardDescription>Items requiring attention or resolution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold">{issue.title}</h4>
                    <Badge variant="outline">
                      {issue.status}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{issue.phase}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>Reported {formatDate(issue.dateReported)}</span>
                    <Badge className={
                      issue.severity === 'HIGH' ? 'bg-red-500 text-white' :
                      issue.severity === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                      'bg-green-500 text-white'
                    }>
                      {issue.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button className="w-full" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View All Issues
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-[#56CCF2] bg-[#56CCF2]/5">
        <CardContent className="pt-6">
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/daily-logs">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Daily Log</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <ImageIcon className="h-6 w-6" />
              <span className="text-sm">Upload Photos</span>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/rfis">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">RFI Tracker</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4">
              <Users className="h-6 w-6" />
              <span className="text-sm">Team Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

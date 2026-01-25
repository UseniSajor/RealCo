"use client"
import { useState, useEffect } from "react"
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
  AlertCircle,
  DollarSign,
  List
} from "lucide-react"
import { constructionAPI, type ConstructionProject, type Task } from "@/lib/api/construction.api"

export function ConstructionDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<string>('ALL')
  const [project, setProject] = useState<ConstructionProject | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const { projects } = await constructionAPI.getProjects()
        if (projects.length === 0) {
          setProject(null)
          setTasks([])
          setLoading(false)
          return
        }
        const firstProject = projects[0]
        setProject(firstProject)
        const { tasks: projectTasks } = await constructionAPI.getTasks(firstProject.id)
        setTasks(projectTasks)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load construction data')
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading construction data...</div>
  }
  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }
  if (!project) {
    return <div className="p-8 text-center text-muted-foreground">No construction projects found.</div>
  }

  // Example: Calculate phases from tasks (if available)
  const phases = project.tasks
    ? Array.from(new Set(project.tasks.map(t => t.status))).map((status, idx) => ({
        id: String(idx + 1),
        name: status,
        startDate: '',
        endDate: '',
        status,
        percentComplete: 0,
        budget: 0,
        spent: 0,
        daysTotal: 0,
        daysElapsed: 0,
      }))
    : []

  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS')
  const issues: { id: string; title: string; severity: string; phase: string; dateReported: string; status: string }[] = [] // TODO: Fetch issues from API if available

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
              {project.percentComplete}%
            </p>
            <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#56CCF2]"
                style={{ width: `${project.percentComplete}%` }}
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
              {project.totalBudget ? ((project.spentToDate / project.totalBudget) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatCurrency(project.spentToDate)} of {formatCurrency(project.totalBudget || 0)}
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
              {project.phase || 'IN PROGRESS'}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {project.plannedEndDate ? Math.max(0, Math.ceil((new Date(project.plannedEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '-'} days remaining
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
                <p className="font-bold text-lg">{formatDate(project.actualStartDate || project.plannedStartDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-[#E07A47]" />
              <div>
                <p className="text-sm text-muted-foreground">Target Completion</p>
                <p className="font-bold text-lg">{formatDate(project.plannedEndDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hammer className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Days Remaining</p>
                <p className="font-bold text-lg text-green-600">{project.plannedEndDate ? Math.max(0, Math.ceil((new Date(project.plannedEndDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : '-'} days</p>
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
                  <p className="text-sm text-muted-foreground mb-2">{task.status}</p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{task.assignedToId || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Due {formatDate(task.plannedEndDate)}</span>
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
          <h3 className="font-bold text-lg mb-4">Project Management Tools</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/daily-logs">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Daily Logs</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/photos">
                <ImageIcon className="h-6 w-6" />
                <span className="text-sm">Photos</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/rfis">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">RFIs</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/submittals">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Submittals</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/change-orders">
                <DollarSign className="h-6 w-6" />
                <span className="text-sm">Change Orders</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/punch-list">
                <List className="h-6 w-6" />
                <span className="text-sm">Punch List</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/team">
                <Users className="h-6 w-6" />
                <span className="text-sm">Team</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 py-4" asChild>
              <Link href="/dashboard/sponsor/issues">
                <AlertTriangle className="h-6 w-6" />
                <span className="text-sm">Issues</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

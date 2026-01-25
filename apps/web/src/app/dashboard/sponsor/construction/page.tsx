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
  Plus,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { constructionAPI, type ConstructionProject, type Task } from "@/lib/api/construction.api"
import { useEffect, useState } from "react"
import { TaskModal } from "@/components/construction/TaskModal"
import { DailyLogModal } from "@/components/construction/DailyLogModal"
import { RFIModal } from "@/components/construction/RFIModal"
import { SubmittalModal } from "@/components/construction/SubmittalModal"
import { InspectionModal } from "@/components/construction/InspectionModal"
import { SafetyIncidentModal } from "@/components/construction/SafetyIncidentModal"

export default function SponsorConstructionPage() {
  const { logout } = useAuth()
  const [project, setProject] = useState<ConstructionProject | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [dailyLogModalOpen, setDailyLogModalOpen] = useState(false)
  const [rfiModalOpen, setRFIModalOpen] = useState(false)
  const [submittalModalOpen, setSubmittalModalOpen] = useState(false)
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false)
  const [safetyIncidentModalOpen, setSafetyIncidentModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Fetch project data
  const fetchProjectData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all projects for the organization
      const { projects } = await constructionAPI.getProjects()

      if (projects.length === 0) {
        // No projects yet - show empty state
        setLoading(false)
        return
      }

      // Use the first project (or we could add project selection later)
      const firstProject = projects[0]
      setProject(firstProject)

      // Fetch tasks for this project
      const { tasks: projectTasks } = await constructionAPI.getTasks(firstProject.id)
      setTasks(projectTasks)

      setLoading(false)
    } catch (err) {
      console.error('Failed to fetch construction data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load construction data')
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchProjectData()
  }, [])

  // Handler for modal success - refresh data
  const handleModalSuccess = () => {
    fetchProjectData()
  }

  // Handler for task edit
  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task)
    setTaskModalOpen(true)
  }

  // Handler for new task
  const handleNewTask = () => {
    setSelectedTask(null)
    setTaskModalOpen(true)
  }

  // Page-specific sidebar for construction tools
  const constructionSidebarItems = [
    { title: "Overview", href: "#overview", icon: Home },
    { title: "Timeline", href: "#timeline", icon: Calendar },
    { title: "Budget", href: "#budget", icon: DollarSign },
    { title: "Tasks", href: "#tasks", icon: List },
    { title: "Documents", href: "#documents", icon: FileText },
    { title: "Photos", href: "#photos", icon: ImageIcon },
    { title: "Inspections", href: "#inspections", icon: CheckCircle },
    { title: "Issues", href: "#issues", icon: AlertTriangle },
    { title: "Team", href: "#team", icon: Users },
  ]

  // Helper function to get phase display name
  const getPhaseDisplay = (phase: string) => {
    return phase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Helper function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'ON_HOLD':
        return 'bg-yellow-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-slate-400'
    }
  }

  // Helper function to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-600'
      case 'HIGH':
        return 'bg-red-500'
      case 'MEDIUM':
        return 'bg-yellow-500'
      case 'LOW':
        return 'bg-blue-500'
      default:
        return 'bg-slate-400'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-screen bg-white items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Hammer className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-semibold text-muted-foreground">Loading construction data...</p>
        </div>
      </div>
    )
  }

  // Error state - show demo not available message
  if (error) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="fixed left-0 top-0 h-screen w-24 bg-slate-900 border-r-4 border-[#E07A47] flex flex-col items-center py-6">
          <Button asChild size="icon" className="w-12 h-12 bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-xl">
            <Link href="/dashboard/sponsor">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </aside>
        <main className="flex-1 ml-24 bg-white flex items-center justify-center">
          <Card className="max-w-md border-4 border-[#56CCF2]">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-10 w-10 text-[#56CCF2]" />
              </div>
              <CardTitle>Construction Hub</CardTitle>
              <CardDescription>
                Not available in demo mode
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                The Construction Hub requires an active project with construction data. In the live portal, you'll be able to track progress, manage budgets, and coordinate with your team.
              </p>
              <Button className="w-full bg-[#E07A47] hover:bg-[#D96835]" asChild>
                <Link href="/dashboard/sponsor">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Empty state - no projects (demo mode)
  if (!project) {
    return (
      <div className="flex min-h-screen bg-white">
        <aside className="fixed left-0 top-0 h-screen w-24 bg-slate-900 border-r-4 border-[#E07A47] flex flex-col items-center py-6 gap-4">
          <Button asChild size="icon" className="w-12 h-12 bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-xl">
            <Link href="/dashboard/sponsor">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center">
            <Hammer className="h-6 w-6 text-white" />
          </div>
        </aside>
        <main className="flex-1 ml-24 bg-white flex items-center justify-center">
          <Card className="max-w-md border-4 border-[#56CCF2]">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-10 w-10 text-[#56CCF2]" />
              </div>
              <CardTitle>Construction Hub</CardTitle>
              <CardDescription>
                Not available in demo mode
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                The Construction Hub requires an active construction project. In the live portal, you'll manage daily logs, draw requests, RFIs, inspections, and more.
              </p>
              <Button className="w-full bg-[#E07A47] hover:bg-[#D96835]" asChild>
                <Link href="/dashboard/sponsor">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Return to Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  // Calculate project stats
  const totalBudget = project.totalBudget || 0
  const spentToDate = project.spentToDate || 0
  const percentComplete = project.percentComplete || 0
  const remainingBudget = totalBudget - spentToDate

  return (
    <div className="flex min-h-screen bg-white">
      {/* Page-Specific Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r-4 border-[#E07A47] flex flex-col overflow-hidden">
        {/* Header with Return to Dashboard */}
        <div className="p-6 border-b border-slate-700">
          <Button asChild className="w-full mb-4 bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-full">
            <Link href="/dashboard/sponsor">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E07A47] to-[#D96835] flex items-center justify-center">
              <Hammer className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-white text-lg">Construction</h2>
              <p className="text-xs text-slate-400">{project.developmentProject?.name || project.projectCode}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {constructionSidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <a key={item.href} href={item.href} className="block">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.title}</span>
                </Button>
              </a>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:bg-red-600 hover:text-white"
            size="sm"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          {/* Overview Section */}
          <div id="overview" className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-black">
                {project.developmentProject?.name || project.projectCode}
              </h1>
              <Badge className="bg-[#56CCF2] text-white text-sm px-4 py-1">
                {getPhaseDisplay(project.phase)}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              {project.developmentProject?.address || 'Construction Progress & Management'}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">
                    ${totalBudget > 0 ? (totalBudget / 1000000).toFixed(1) : '0.0'}M
                  </div>
                  <p className="text-xs text-muted-foreground">Approved budget</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Spent to Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">
                    ${(spentToDate / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalBudget > 0 ? Math.round((spentToDate / totalBudget) * 100) : 0}% of budget
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500 bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">% Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black mb-1">{Math.round(percentComplete)}%</div>
                  <p className="text-xs text-green-600">
                    {percentComplete >= 90 ? 'Nearly complete' : 'In progress'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Project Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-black mb-1">{project.projectCode}</div>
                  <p className="text-xs text-muted-foreground">
                    Started {project.actualStartDate ? new Date(project.actualStartDate).toLocaleDateString() : 'TBD'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Budget Section */}
          <div id="budget" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Budget Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-4 border-[#56CCF2] bg-slate-50">
                <CardHeader>
                  <CardTitle>Budget Status</CardTitle>
                  <CardDescription>Spent vs. Remaining</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-5xl font-black text-[#56CCF2] mb-2">
                      ${totalBudget > 0 ? (remainingBudget / 1000000).toFixed(1) : '0.0'}M
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {totalBudget > 0 ? Math.round((remainingBudget / totalBudget) * 100) : 0}% of budget remaining
                    </p>
                  </div>
                  <div className="h-4 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47]"
                      style={{ width: `${totalBudget > 0 ? (spentToDate / totalBudget) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Spent: ${(spentToDate / 1000000).toFixed(1)}M</span>
                    <span>Budget: ${(totalBudget / 1000000).toFixed(1)}M</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47] bg-slate-50">
                <CardHeader>
                  <CardTitle>Cost Variance</CardTitle>
                  <CardDescription>Budget performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className={`text-5xl font-black mb-2 ${project.costVariance && project.costVariance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {project.costVariance ? (project.costVariance > 0 ? '+' : '') + (project.costVariance / 1000).toFixed(0) + 'K' : '$0'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.costVariance && project.costVariance < 0 ? 'Under budget' : project.costVariance && project.costVariance > 0 ? 'Over budget' : 'On budget'}
                    </p>
                  </div>
                  {project.scheduleVarianceDays !== null && (
                    <div className="mt-4 p-4 rounded-lg bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Schedule Variance:</span>
                        <span className={`font-bold ${project.scheduleVarianceDays > 0 ? 'text-green-600' : project.scheduleVarianceDays < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                          {project.scheduleVarianceDays > 0 ? '+' : ''}{project.scheduleVarianceDays} days
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tasks Section */}
          <div id="tasks" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Active Tasks</h2>
              <Button
                className="bg-[#E07A47] hover:bg-[#D96835]"
                onClick={handleNewTask}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardContent className="p-6">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <List className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks yet. Create your first task to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 10).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-[#6b7280]/10 border-2 border-slate-300 hover:shadow-md transition-all cursor-pointer"
                        onClick={() => handleTaskEdit(task)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          task.status === 'COMPLETED' ? 'bg-green-100' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-100' :
                          task.status === 'ON_HOLD' ? 'bg-yellow-100' :
                          'bg-slate-100'
                        }`}>
                          {task.status === 'COMPLETED' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : task.status === 'IN_PROGRESS' ? (
                            <Clock className="h-5 w-5 text-blue-600" />
                          ) : (
                            <List className="h-5 w-5 text-slate-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{task.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {task.percentComplete}% Complete
                            {task.assignedTo && ` • ${task.assignedTo.email}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(task.status)}>
                            {task.status.replace(/_/g, ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Timeline Section */}
          <div id="timeline" className="mb-12">
            <h2 className="text-2xl font-black mb-6">Project Timeline</h2>
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Planned Start</div>
                      <div className="font-bold">
                        {project.plannedStartDate ? new Date(project.plannedStartDate).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Actual Start</div>
                      <div className="font-bold">
                        {project.actualStartDate ? new Date(project.actualStartDate).toLocaleDateString() : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Planned End</div>
                      <div className="font-bold">
                        {project.plannedEndDate ? new Date(project.plannedEndDate).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Actual End</div>
                      <div className="font-bold">
                        {project.actualEndDate ? new Date(project.actualEndDate).toLocaleDateString() : 'In progress'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documents & Submittals Section */}
          <div id="documents" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Documents & Submittals</h2>
              <Badge className="bg-[#56CCF2]">
                {project._count?.submittals || 0} Submittals
              </Badge>
            </div>
            <Card className="border-4 border-[#56CCF2] bg-slate-50">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Shop drawings, specs, and submittal packages</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    className="bg-[#E07A47] hover:bg-[#D96835]"
                    onClick={() => setSubmittalModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Submittal
                  </Button>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div id="photos" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Progress Photos</h2>
              <Badge className="bg-[#56CCF2]">
                {project._count?.dailyLogs || 0} Daily Logs
              </Badge>
            </div>
            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardContent className="p-12 text-center">
                <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Site photos and visual progress tracking</p>
                <Button
                  className="bg-[#E07A47] hover:bg-[#D96835]"
                  onClick={() => setDailyLogModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Daily Log
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Inspections Section */}
          <div id="inspections" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Inspections</h2>
              <Badge className="bg-green-500">
                {project._count?.inspections || 0} Scheduled
              </Badge>
            </div>
            <Card className="border-4 border-green-500 bg-slate-50">
              <CardContent className="p-12 text-center">
                <CheckCircle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Schedule and track building inspections</p>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setInspectionModalOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Schedule Inspection
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Issues & Safety Section */}
          <div id="issues" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Issues & Safety</h2>
              <div className="flex gap-2">
                <Badge className="bg-yellow-500">
                  {project._count?.rfis || 0} RFIs
                </Badge>
                <Badge className="bg-red-500">
                  {project._count?.safetyIncidents || 0} Safety Reports
                </Badge>
              </div>
            </div>
            <Card className="border-4 border-red-500 bg-slate-50">
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Track RFIs, safety incidents, and issues</p>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setRFIModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create RFI
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => setSafetyIncidentModalOpen(true)}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Report Safety Incident
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modals */}
      {project && (
        <>
          <TaskModal
            projectId={project.id}
            task={selectedTask}
            open={taskModalOpen}
            onOpenChange={setTaskModalOpen}
            onSuccess={handleModalSuccess}
          />

          <DailyLogModal
            projectId={project.id}
            open={dailyLogModalOpen}
            onOpenChange={setDailyLogModalOpen}
            onSuccess={handleModalSuccess}
          />

          <RFIModal
            projectId={project.id}
            open={rfiModalOpen}
            onOpenChange={setRFIModalOpen}
            onSuccess={handleModalSuccess}
          />

          <SubmittalModal
            projectId={project.id}
            open={submittalModalOpen}
            onOpenChange={setSubmittalModalOpen}
            onSuccess={handleModalSuccess}
          />

          <InspectionModal
            projectId={project.id}
            open={inspectionModalOpen}
            onOpenChange={setInspectionModalOpen}
            onSuccess={handleModalSuccess}
          />

          <SafetyIncidentModal
            projectId={project.id}
            open={safetyIncidentModalOpen}
            onOpenChange={setSafetyIncidentModalOpen}
            onSuccess={handleModalSuccess}
          />
        </>
      )}
    </div>
  )
}

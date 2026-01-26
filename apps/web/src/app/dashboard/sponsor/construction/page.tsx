"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
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
  Building2,
  Search,
  UserPlus,
  MapPin,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useProjects, useTasks, useDailyLogs, type Project, type Task, type DailyLog } from "@/lib/supabase-hooks"
import { useState } from "react"
import { TaskModal } from "@/components/construction/TaskModal"
import { DailyLogModal } from "@/components/construction/DailyLogModal"
import { RFIModal } from "@/components/construction/RFIModal"
import { SubmittalModal } from "@/components/construction/SubmittalModal"
import { InspectionModal } from "@/components/construction/InspectionModal"
import { SafetyIncidentModal } from "@/components/construction/SafetyIncidentModal"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
  { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
  { title: "Leads", href: "/dashboard/sponsor/leads", icon: UserPlus },
  { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
  { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
  { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
  { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
  { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
  { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
]

export default function SponsorConstructionPage() {
  const { user, logout } = useAuth()

  // Fetch projects using Supabase hook
  const { data: projects, isLoading: projectsLoading, error: projectsError } = useProjects()

  // State for selected project
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Get the currently selected project or the first one
  const currentProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : projects[0]

  // Fetch tasks and daily logs for the selected project
  const { data: tasks, isLoading: tasksLoading } = useTasks(currentProject?.id || '')
  const { data: dailyLogs, isLoading: logsLoading } = useDailyLogs(currentProject?.id || '')

  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false)
  const [dailyLogModalOpen, setDailyLogModalOpen] = useState(false)
  const [rfiModalOpen, setRFIModalOpen] = useState(false)
  const [submittalModalOpen, setSubmittalModalOpen] = useState(false)
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false)
  const [safetyIncidentModalOpen, setSafetyIncidentModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // Handler for modal success - refetch data
  const handleModalSuccess = () => {
    // The hooks will automatically refetch when their dependencies change
    // For manual refetch, we would need to add refetch to the hooks
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
  if (projectsLoading) {
    return (
      <div className="flex min-h-screen bg-white">
        <DashboardSidebar
          items={sidebarItems}
          role="Sponsor"
          roleIcon={Building2}
          userName={user?.email || "Sponsor User"}
          onLogout={logout}
        />
        <main className="flex-1 ml-24 bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E07A47] to-[#56CCF2] flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Hammer className="h-8 w-8 text-white" />
            </div>
            <p className="text-lg font-semibold text-muted-foreground">Loading construction data...</p>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (projectsError) {
    return (
      <div className="flex min-h-screen bg-white">
        <DashboardSidebar
          items={sidebarItems}
          role="Sponsor"
          roleIcon={Building2}
          userName={user?.email || "Sponsor User"}
          onLogout={logout}
        />
        <main className="flex-1 ml-24 bg-white flex items-center justify-center">
          <Card className="max-w-md border-4 border-[#56CCF2]">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-10 w-10 text-[#56CCF2]" />
              </div>
              <CardTitle>Construction Hub</CardTitle>
              <CardDescription>
                Unable to load data
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                {projectsError}
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

  // Empty state - no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="flex min-h-screen bg-white">
        <DashboardSidebar
          items={sidebarItems}
          role="Sponsor"
          roleIcon={Building2}
          userName={user?.email || "Sponsor User"}
          onLogout={logout}
        />
        <main className="flex-1 ml-24 bg-white flex items-center justify-center">
          <Card className="max-w-md border-4 border-[#56CCF2]">
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
                <Hammer className="h-10 w-10 text-[#56CCF2]" />
              </div>
              <CardTitle>Construction Hub</CardTitle>
              <CardDescription>
                No active projects
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground mb-6">
                You don't have any construction projects yet. Create a development project to get started with construction management.
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

  // Use the current project
  const project = currentProject!

  // Calculate project stats using snake_case field names from Supabase
  const totalBudget = project.total_budget || 0
  const spentToDate = project.spent_to_date || 0
  const percentComplete = project.percent_complete || 0
  const remainingBudget = totalBudget - spentToDate

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName={user?.email || "Sponsor User"}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-7xl px-8 py-8 mx-auto">
          {/* Project Selector (if multiple projects) */}
          {projects.length > 1 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Select Project
              </label>
              <select
                value={selectedProjectId || project.id}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full max-w-md px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-[#E07A47] focus:outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.development_project?.name || p.project_code}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Overview Section */}
          <div id="overview" className="mb-12">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Button asChild variant="outline" size="sm" className="border-2 border-[#E07A47]">
                  <Link href="/dashboard/sponsor">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
                <h1 className="text-4xl font-black">
                  {project.development_project?.name || project.project_code}
                </h1>
              </div>
              <Badge className="bg-[#56CCF2] text-white text-sm px-4 py-1">
                {getPhaseDisplay(project.phase)}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              {project.development_project?.address || 'Construction Progress & Management'}
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
                  <div className="text-2xl font-black mb-1">{project.project_code}</div>
                  <p className="text-xs text-muted-foreground">
                    Started {project.actual_start_date ? new Date(project.actual_start_date).toLocaleDateString() : 'TBD'}
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
                    <div className={`text-5xl font-black mb-2 ${project.cost_variance && project.cost_variance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {project.cost_variance ? (project.cost_variance > 0 ? '+' : '') + (project.cost_variance / 1000).toFixed(0) + 'K' : '$0'}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.cost_variance && project.cost_variance < 0 ? 'Under budget' : project.cost_variance && project.cost_variance > 0 ? 'Over budget' : 'On budget'}
                    </p>
                  </div>
                  {project.schedule_variance_days !== null && project.schedule_variance_days !== undefined && (
                    <div className="mt-4 p-4 rounded-lg bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Schedule Variance:</span>
                        <span className={`font-bold ${project.schedule_variance_days > 0 ? 'text-green-600' : project.schedule_variance_days < 0 ? 'text-red-600' : 'text-slate-600'}`}>
                          {project.schedule_variance_days > 0 ? '+' : ''}{project.schedule_variance_days} days
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
                {tasksLoading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <List className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-muted-foreground">Loading tasks...</p>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <List className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-muted-foreground">No tasks yet. Create your first task to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.slice(0, 10).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-slate-100 border-2 border-slate-300 hover:shadow-md transition-all cursor-pointer"
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
                            {task.percent_complete}% Complete
                            {task.description && ` - ${task.description.slice(0, 50)}${task.description.length > 50 ? '...' : ''}`}
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
                        {project.planned_start_date ? new Date(project.planned_start_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Actual Start</div>
                      <div className="font-bold">
                        {project.actual_start_date ? new Date(project.actual_start_date).toLocaleDateString() : 'Not started'}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Planned End</div>
                      <div className="font-bold">
                        {project.planned_end_date ? new Date(project.planned_end_date).toLocaleDateString() : 'Not set'}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white">
                      <div className="text-sm text-muted-foreground mb-1">Actual End</div>
                      <div className="font-bold">
                        {project.actual_end_date ? new Date(project.actual_end_date).toLocaleDateString() : 'In progress'}
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
                {dailyLogs.length} Daily Logs
              </Badge>
            </div>
            <Card className="border-4 border-[#E07A47] bg-slate-50">
              <CardContent className="p-12 text-center">
                {logsLoading ? (
                  <div>
                    <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center mx-auto mb-4 animate-pulse">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-muted-foreground">Loading daily logs...</p>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Site photos and visual progress tracking</p>
                    <Button
                      className="bg-[#E07A47] hover:bg-[#D96835]"
                      onClick={() => setDailyLogModalOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Daily Log
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Inspections Section */}
          <div id="inspections" className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black">Inspections</h2>
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

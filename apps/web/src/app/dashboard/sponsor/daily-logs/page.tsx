"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { useProjects, useDailyLogs, useDailyLogMutations, type DailyLog } from "@/lib/supabase-hooks"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Home,
  Search,
  UserPlus,
  MapPin,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  CloudRain,
  Sun,
  Cloud,
  Snowflake,
  Image as ImageIcon,
  FileText,
  Plus,
  Download,
  Loader2,
  FolderOpen,
} from "lucide-react"

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

export default function SponsorDailyLogsPage() {
  const { user, logout } = useAuth()

  // Supabase hooks
  const { data: projects } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const { data: logs, isLoading, refetch } = useDailyLogs(selectedProjectId || '')
  const { createDailyLog, updateDailyLog, isLoading: mutating } = useDailyLogMutations()

  const [showNewLogForm, setShowNewLogForm] = useState(false)
  const [editingLog, setEditingLog] = useState<DailyLog | null>(null)
  const [newLog, setNewLog] = useState({
    date: new Date().toISOString().split('T')[0],
    weather: 'SUNNY' as 'SUNNY' | 'CLOUDY' | 'RAINY' | 'SNOWY' | 'PARTLY_CLOUDY' | 'WINDY',
    temperature: 72,
    crewSize: 0,
    workPerformed: '',
    materials: '',
    equipment: '',
    issues: '',
    visitors: '',
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getWeatherIcon = (weather: string | null | undefined) => {
    switch(weather) {
      case 'SUNNY': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'CLOUDY': return <Cloud className="h-5 w-5 text-slate-500" />
      case 'RAINY': return <CloudRain className="h-5 w-5 text-blue-500" />
      case 'SNOWY': return <Snowflake className="h-5 w-5 text-blue-300" />
      default: return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  const getWeatherColor = (weather: string | null | undefined) => {
    switch(weather) {
      case 'SUNNY': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'CLOUDY': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
      case 'RAINY': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      case 'SNOWY': return 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  // Calculate crew size from labor_count
  const getCrewSize = (log: DailyLog) => {
    if (!log.labor_count || !Array.isArray(log.labor_count)) return 0
    return log.labor_count.reduce((sum, entry) => sum + (entry.count || 0), 0)
  }

  // Parse text fields that might contain line-separated items
  const parseListField = (value: string | null | undefined): string[] => {
    if (!value) return []
    return value.split('\n').filter(item => item.trim())
  }

  const handleSubmitLog = async () => {
    if (!selectedProjectId) return

    const logData = {
      project_id: selectedProjectId,
      log_date: newLog.date,
      weather: newLog.weather,
      temperature: newLog.temperature,
      labor_count: newLog.crewSize > 0 ? [{ trade: 'General', count: newLog.crewSize }] : [],
      work_completed: newLog.workPerformed || null,
      materials_delivered: newLog.materials || null,
      equipment_used: newLog.equipment ? newLog.equipment.split('\n').filter(e => e.trim()) : [],
      issues_delays: newLog.issues || null,
      visitor_log: newLog.visitors || null,
    }

    if (editingLog) {
      await updateDailyLog(editingLog.id, logData)
    } else {
      await createDailyLog(logData)
    }

    setShowNewLogForm(false)
    setEditingLog(null)
    setNewLog({
      date: new Date().toISOString().split('T')[0],
      weather: 'SUNNY',
      temperature: 72,
      crewSize: 0,
      workPerformed: '',
      materials: '',
      equipment: '',
      issues: '',
      visitors: '',
    })
    refetch()
  }

  const handleEditLog = (log: DailyLog) => {
    setEditingLog(log)
    setNewLog({
      date: log.log_date,
      weather: (log.weather as any) || 'SUNNY',
      temperature: log.temperature || 72,
      crewSize: getCrewSize(log),
      workPerformed: log.work_completed || '',
      materials: log.materials_delivered || '',
      equipment: log.equipment_used?.join('\n') || '',
      issues: log.issues_delays || '',
      visitors: log.visitor_log || '',
    })
    setShowNewLogForm(true)
  }

  // Calculate stats
  const totalLogs = logs?.length || 0
  const avgCrewSize = totalLogs > 0
    ? Math.round(logs!.reduce((sum, log) => sum + getCrewSize(log), 0) / totalLogs)
    : 0
  const totalPhotos = logs?.reduce((sum, log) => sum + (log.photo_urls?.length || 0), 0) || 0
  const latestLog = logs?.[0]

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName={user?.email || "Sponsor User"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-6xl px-6 py-12 mx-auto">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black mb-2">Daily Construction Logs</h2>
                <p className="text-base text-muted-foreground">
                  Document daily activities, progress, and site conditions
                </p>
              </div>
              <Button
                className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                onClick={() => {
                  setEditingLog(null)
                  setShowNewLogForm(!showNewLogForm)
                }}
                disabled={!selectedProjectId}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Log Entry
              </Button>
            </div>

            {/* Project Selector */}
            <Card className="border-2 border-slate-200">
              <CardContent className="pt-6">
                <label className="block text-sm font-bold mb-2">Select Project</label>
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => setSelectedProjectId(e.target.value || null)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="">-- Select a project --</option>
                  {projects?.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && selectedProjectId && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2]" />
                <span className="ml-3 text-muted-foreground">Loading daily logs...</span>
              </div>
            )}

            {/* Empty State - No Project Selected */}
            {!selectedProjectId && (
              <Card className="border-2 border-dashed border-slate-300">
                <CardContent className="pt-12 pb-12 text-center">
                  <FolderOpen className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
                  <p className="text-muted-foreground">
                    Select a project above to view and manage its daily logs.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Empty State - No Logs */}
            {selectedProjectId && !isLoading && logs?.length === 0 && (
              <Card className="border-2 border-dashed border-slate-300">
                <CardContent className="pt-12 pb-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Daily Logs Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start documenting your construction progress by creating your first daily log.
                  </p>
                  <Button
                    className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                    onClick={() => setShowNewLogForm(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Log
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stats - Only show when logs exist */}
            {selectedProjectId && !isLoading && logs && logs.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-4 border-[#56CCF2]">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Total Logs</p>
                      <FileText className="h-5 w-5 text-[#56CCF2]" />
                    </div>
                    <p className="text-3xl font-black text-[#56CCF2]">
                      {totalLogs}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      All time
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-[#E07A47]">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Avg Crew Size</p>
                      <Users className="h-5 w-5 text-[#E07A47]" />
                    </div>
                    <p className="text-3xl font-black text-[#E07A47]">
                      {avgCrewSize}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      workers per day
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Photos</p>
                      <ImageIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-black text-green-600">
                      {totalPhotos}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      total uploaded
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-4 border-purple-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-muted-foreground">Weather</p>
                      {getWeatherIcon(latestLog?.weather)}
                    </div>
                    <p className="text-2xl font-black text-purple-600">
                      {latestLog?.temperature || '--'}°F
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Latest conditions
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* New/Edit Log Form */}
            {showNewLogForm && selectedProjectId && (
              <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
                <CardHeader>
                  <CardTitle>{editingLog ? 'Edit Daily Log' : 'New Daily Log Entry'}</CardTitle>
                  <CardDescription>Document today's construction activities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Date</label>
                      <input
                        type="date"
                        value={newLog.date}
                        onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Weather</label>
                      <select
                        value={newLog.weather}
                        onChange={(e) => setNewLog({...newLog, weather: e.target.value as any})}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                      >
                        <option value="SUNNY">Sunny</option>
                        <option value="CLOUDY">Cloudy</option>
                        <option value="PARTLY_CLOUDY">Partly Cloudy</option>
                        <option value="RAINY">Rainy</option>
                        <option value="SNOWY">Snowy</option>
                        <option value="WINDY">Windy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Temperature (°F)</label>
                      <input
                        type="number"
                        value={newLog.temperature}
                        onChange={(e) => setNewLog({...newLog, temperature: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Crew Size</label>
                    <input
                      type="number"
                      value={newLog.crewSize}
                      onChange={(e) => setNewLog({...newLog, crewSize: parseInt(e.target.value) || 0})}
                      placeholder="Number of workers on site"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Work Performed</label>
                    <textarea
                      value={newLog.workPerformed}
                      onChange={(e) => setNewLog({...newLog, workPerformed: e.target.value})}
                      placeholder="Describe work completed today (one item per line)"
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Materials Delivered/Used</label>
                      <textarea
                        value={newLog.materials}
                        onChange={(e) => setNewLog({...newLog, materials: e.target.value})}
                        placeholder="List materials (one per line)"
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Equipment Used</label>
                      <textarea
                        value={newLog.equipment}
                        onChange={(e) => setNewLog({...newLog, equipment: e.target.value})}
                        placeholder="List equipment (one per line)"
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Issues/Delays</label>
                    <textarea
                      value={newLog.issues}
                      onChange={(e) => setNewLog({...newLog, issues: e.target.value})}
                      placeholder="Describe any issues or delays (or enter 'None')"
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2">Visitors</label>
                    <input
                      type="text"
                      value={newLog.visitors}
                      onChange={(e) => setNewLog({...newLog, visitors: e.target.value})}
                      placeholder="List any site visitors (inspectors, clients, etc.)"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                      onClick={handleSubmitLog}
                      disabled={mutating}
                    >
                      {mutating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editingLog ? 'Update Log' : 'Submit Log'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewLogForm(false)
                        setEditingLog(null)
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Export Button - Only show when logs exist */}
            {selectedProjectId && !isLoading && logs && logs.length > 0 && (
              <div className="flex justify-end">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs to PDF
                </Button>
              </div>
            )}

            {/* Daily Logs List */}
            {selectedProjectId && !isLoading && logs && logs.length > 0 && (
              <div className="space-y-4">
                {logs.map((log) => {
                  const crewSize = getCrewSize(log)
                  const workItems = parseListField(log.work_completed)
                  const materialItems = parseListField(log.materials_delivered)
                  const equipmentItems = log.equipment_used || []
                  const photoCount = log.photo_urls?.length || 0

                  return (
                    <Card key={log.id} className="border-2 border-slate-200 dark:border-[#E07A47]">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-[#56CCF2]" />
                              {formatDate(log.log_date)}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              Created {new Date(log.created_at).toLocaleString()}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getWeatherColor(log.weather)}>
                              {getWeatherIcon(log.weather)}
                              <span className="ml-2">{log.weather || 'N/A'} {log.temperature ? `• ${log.temperature}°F` : ''}</span>
                            </Badge>
                            {crewSize > 0 && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {crewSize} workers
                              </Badge>
                            )}
                            {photoCount > 0 && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <ImageIcon className="h-3 w-3" />
                                {photoCount} photos
                              </Badge>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditLog(log)}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {workItems.length > 0 && (
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-[#56CCF2]">Work Performed:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              {workItems.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {(materialItems.length > 0 || equipmentItems.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {materialItems.length > 0 && (
                              <div>
                                <h4 className="font-bold text-sm mb-2 text-[#E07A47]">Materials:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {materialItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {equipmentItems.length > 0 && (
                              <div>
                                <h4 className="font-bold text-sm mb-2 text-purple-600">Equipment:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm">
                                  {equipmentItems.map((item, idx) => (
                                    <li key={idx}>{item}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {log.issues_delays && log.issues_delays !== 'None' && (
                          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800">
                            <h4 className="font-bold text-sm mb-1 text-yellow-800 dark:text-yellow-200">Issues/Delays:</h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">{log.issues_delays}</p>
                          </div>
                        )}

                        {log.visitor_log && log.visitor_log !== 'None' && (
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
                            <h4 className="font-bold text-sm mb-1 text-blue-800 dark:text-blue-200">Visitors:</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-300">{log.visitor_log}</p>
                          </div>
                        )}

                        {log.safety_observations && (
                          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800">
                            <h4 className="font-bold text-sm mb-1 text-green-800 dark:text-green-200">Safety Observations:</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">{log.safety_observations}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

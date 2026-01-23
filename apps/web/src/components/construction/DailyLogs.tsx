"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  CloudRain, 
  Sun,
  Cloud,
  Snowflake,
  Image as ImageIcon,
  FileText,
  Plus,
  Download
} from "lucide-react"

export function DailyLogs() {
  const [showNewLogForm, setShowNewLogForm] = useState(false)
  const [newLog, setNewLog] = useState({
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Mock daily logs
  const dailyLogs = [
    {
      id: '1',
      date: '2026-01-22',
      weather: 'SUNNY',
      temperature: 68,
      crewSize: 24,
      superintendent: 'John Smith',
      workPerformed: [
        'Completed 3rd floor framing on Building A',
        'Started electrical rough-in on 2nd floor',
        'Poured concrete for elevator shaft',
      ],
      materials: [
        '2x6 lumber (800 linear feet)',
        'Electrical conduit (250 feet)',
        'Concrete (15 cubic yards)',
      ],
      equipment: [
        'Crane (8 hours)',
        'Concrete pump truck (4 hours)',
        'Forklift (all day)',
      ],
      issues: 'None',
      visitors: 'City building inspector - framing inspection passed',
      photos: 3,
      submittedBy: 'John Smith',
      submittedAt: '2026-01-22T17:30:00',
    },
    {
      id: '2',
      date: '2026-01-21',
      weather: 'CLOUDY',
      temperature: 65,
      crewSize: 22,
      superintendent: 'John Smith',
      workPerformed: [
        'Installed HVAC ductwork on 1st floor',
        'Continued framing on 3rd floor',
        'Plumbing rough-in in west wing',
      ],
      materials: [
        'HVAC ductwork (200 linear feet)',
        'PEX piping (150 feet)',
        '2x4 lumber (500 linear feet)',
      ],
      equipment: [
        'Scissor lift (all day)',
        'Air compressor (all day)',
      ],
      issues: 'Minor delay due to late material delivery (HVAC parts)',
      visitors: 'None',
      photos: 5,
      submittedBy: 'John Smith',
      submittedAt: '2026-01-21T16:45:00',
    },
    {
      id: '3',
      date: '2026-01-20',
      weather: 'RAINY',
      temperature: 58,
      crewSize: 18,
      superintendent: 'John Smith',
      workPerformed: [
        'Indoor work only due to rain',
        'Electrical panel installation',
        'Interior wall framing on 1st floor',
      ],
      materials: [
        'Electrical panels (4 units)',
        '2x4 lumber (400 linear feet)',
        'Drywall (50 sheets)',
      ],
      equipment: [
        'Generator (all day)',
        'Work lights (all day)',
      ],
      issues: 'Reduced crew due to weather. Outdoor work postponed.',
      visitors: 'Electrical subcontractor supervisor',
      photos: 2,
      submittedBy: 'John Smith',
      submittedAt: '2026-01-20T15:30:00',
    },
  ]

  const getWeatherIcon = (weather: string) => {
    switch(weather) {
      case 'SUNNY': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'CLOUDY': return <Cloud className="h-5 w-5 text-slate-500" />
      case 'RAINY': return <CloudRain className="h-5 w-5 text-blue-500" />
      case 'SNOWY': return <Snowflake className="h-5 w-5 text-blue-300" />
      default: return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  const getWeatherColor = (weather: string) => {
    switch(weather) {
      case 'SUNNY': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'CLOUDY': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
      case 'RAINY': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
      case 'SNOWY': return 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const handleSubmitLog = () => {
    console.log('New log submitted:', newLog)
    setShowNewLogForm(false)
    // Reset form
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
  }

  return (
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
          onClick={() => setShowNewLogForm(!showNewLogForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Log Entry
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Logs</p>
              <FileText className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {dailyLogs.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Last 7 days
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
              {Math.round(dailyLogs.reduce((sum, log) => sum + log.crewSize, 0) / dailyLogs.length)}
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
              {dailyLogs.reduce((sum, log) => sum + log.photos, 0)}
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
              {getWeatherIcon(dailyLogs[0]?.weather || 'SUNNY')}
            </div>
            <p className="text-2xl font-black text-purple-600">
              {dailyLogs[0]?.temperature}°F
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Current conditions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Log Form */}
      {showNewLogForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>New Daily Log Entry</CardTitle>
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
                  onChange={(e) => setNewLog({...newLog, weather: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="SUNNY">Sunny</option>
                  <option value="CLOUDY">Cloudy</option>
                  <option value="RAINY">Rainy</option>
                  <option value="SNOWY">Snowy</option>
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
                onChange={(e) => setNewLog({...newLog, crewSize: parseInt(e.target.value)})}
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
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitLog}>
                Submit Log
              </Button>
              <Button variant="outline" onClick={() => setShowNewLogForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Button */}
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs to PDF
        </Button>
      </div>

      {/* Daily Logs List */}
      <div className="space-y-4">
        {dailyLogs.map((log) => (
          <Card key={log.id} className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-[#56CCF2]" />
                    {formatDate(log.date)}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Submitted by {log.submittedBy} at {new Date(log.submittedAt).toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getWeatherColor(log.weather)}>
                    {getWeatherIcon(log.weather)}
                    <span className="ml-2">{log.weather} • {log.temperature}°F</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {log.crewSize} workers
                  </Badge>
                  {log.photos > 0 && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {log.photos} photos
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2 text-[#56CCF2]">Work Performed:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {log.workPerformed.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-sm mb-2 text-[#E07A47]">Materials:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {log.materials.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-sm mb-2 text-purple-600">Equipment:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {log.equipment.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {log.issues !== 'None' && (
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border-2 border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-bold text-sm mb-1 text-yellow-800 dark:text-yellow-200">Issues/Delays:</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{log.issues}</p>
                </div>
              )}

              {log.visitors !== 'None' && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-sm mb-1 text-blue-800 dark:text-blue-200">Visitors:</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">{log.visitors}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

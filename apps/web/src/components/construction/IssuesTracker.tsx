"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  AlertCircle
} from "lucide-react"

export function IssuesTracker() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showNewIssueForm, setShowNewIssueForm] = useState(false)
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'MEDIUM',
    category: 'QUALITY',
    location: '',
    reportedBy: '',
    assignedTo: '',
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock issues data
  const issues = [
    {
      id: 'ISS-001',
      number: 'ISS-001',
      title: 'Foundation crack discovered during inspection',
      description: 'Small crack found in foundation wall section B-3. Requires engineering review and potential repair.',
      severity: 'HIGH',
      category: 'STRUCTURAL',
      status: 'OPEN',
      location: 'Foundation - Section B-3',
      reportedBy: 'John Smith',
      reportedDate: '2026-01-20',
      assignedTo: 'DEF Engineering',
      dueDate: '2026-01-25',
      resolution: null,
      resolvedDate: null,
      daysOpen: 3,
    },
    {
      id: 'ISS-002',
      number: 'ISS-002',
      title: 'HVAC ductwork not per specifications',
      description: 'Ductwork in units 102-105 installed with wrong gauge material. Needs replacement.',
      severity: 'MEDIUM',
      category: 'QUALITY',
      status: 'IN_PROGRESS',
      location: 'Units 102-105 - HVAC',
      reportedBy: 'John Smith',
      reportedDate: '2026-01-18',
      assignedTo: 'XYZ Mechanical',
      dueDate: '2026-01-28',
      resolution: 'Contractor ordered correct materials. Replacement scheduled for 1/24.',
      resolvedDate: null,
      daysOpen: 5,
    },
    {
      id: 'ISS-003',
      number: 'ISS-003',
      title: 'Water intrusion in parking garage',
      description: 'Standing water discovered in northeast corner of parking garage level P1.',
      severity: 'HIGH',
      category: 'SAFETY',
      status: 'OPEN',
      location: 'Parking Garage P1 - NE Corner',
      reportedBy: 'John Smith',
      reportedDate: '2026-01-22',
      assignedTo: 'ABC Construction',
      dueDate: '2026-01-24',
      resolution: null,
      resolvedDate: null,
      daysOpen: 1,
    },
    {
      id: 'ISS-004',
      number: 'ISS-004',
      title: 'Electrical panel location conflicts with plumbing',
      description: 'Unit 108 electrical panel placement interferes with plumbing chase. Coordination issue.',
      severity: 'LOW',
      category: 'COORDINATION',
      status: 'RESOLVED',
      location: 'Unit 108',
      reportedBy: 'John Smith',
      reportedDate: '2026-01-10',
      assignedTo: 'Power Systems Inc',
      dueDate: '2026-01-20',
      resolution: 'Panel relocated 18 inches to the west. Approved by architect and engineer.',
      resolvedDate: '2026-01-19',
      daysOpen: 0,
    },
    {
      id: 'ISS-005',
      number: 'ISS-005',
      title: 'Paint color mismatch in common areas',
      description: 'Paint in lobby does not match approved sample. Requires repainting.',
      severity: 'LOW',
      category: 'QUALITY',
      status: 'CLOSED',
      location: 'Common Area - Lobby',
      reportedBy: 'Owner',
      reportedDate: '2025-01-05',
      assignedTo: 'Premium Painters LLC',
      dueDate: '2026-01-15',
      resolution: 'Lobby repainted with correct color. Owner approved.',
      resolvedDate: '2026-01-14',
      daysOpen: 0,
    },
    {
      id: 'ISS-006',
      number: 'ISS-006',
      title: 'Missing fire stopping in penetrations',
      description: 'Inspector noted several penetrations without proper fire stopping on floor 3.',
      severity: 'HIGH',
      category: 'CODE_COMPLIANCE',
      status: 'IN_PROGRESS',
      location: 'Floor 3 - All Units',
      reportedBy: 'Building Inspector',
      reportedDate: '2026-01-21',
      assignedTo: 'ABC Construction',
      dueDate: '2026-01-26',
      resolution: 'Fire stopping materials on order. Installation starts 1/25.',
      resolvedDate: null,
      daysOpen: 2,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-red-600 text-white'
      case 'HIGH': return 'bg-red-500 text-white'
      case 'MEDIUM': return 'bg-yellow-500 text-white'
      case 'LOW': return 'bg-blue-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'RESOLVED': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      case 'CLOSED': return 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'SAFETY': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'STRUCTURAL': return <AlertCircle className="h-5 w-5 text-orange-600" />
      case 'QUALITY': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'CODE_COMPLIANCE': return <AlertCircle className="h-5 w-5 text-purple-600" />
      default: return <AlertCircle className="h-5 w-5" />
    }
  }

  const filteredIssues = selectedStatus === 'ALL' 
    ? issues 
    : issues.filter(issue => issue.status === selectedStatus)

  const openIssues = issues.filter(i => i.status === 'OPEN' || i.status === 'IN_PROGRESS')
  const criticalIssues = issues.filter(i => (i.severity === 'CRITICAL' || i.severity === 'HIGH') && i.status !== 'CLOSED' && i.status !== 'RESOLVED')
  const avgResolutionTime = 4.5 // days

  const handleSubmitIssue = () => {
    console.log('New issue submitted:', newIssue)
    setShowNewIssueForm(false)
    setNewIssue({
      title: '',
      description: '',
      severity: 'MEDIUM',
      category: 'QUALITY',
      location: '',
      reportedBy: '',
      assignedTo: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Issues & Problems Tracker</h2>
          <p className="text-base text-muted-foreground">
            Track and resolve construction issues and problems
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowNewIssueForm(!showNewIssueForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Issues</p>
              <AlertCircle className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {issues.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Open Issues</p>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">
              {openIssues.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Critical</p>
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600">
              {criticalIssues.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              High priority
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Resolution</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {avgResolutionTime}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              days average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Issue Form */}
      {showNewIssueForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>Report New Issue</CardTitle>
            <CardDescription>Document a problem or concern that needs attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Issue Title</label>
              <input
                type="text"
                value={newIssue.title}
                onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                placeholder="Brief description of the issue"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Detailed Description</label>
              <textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({...newIssue, description: e.target.value})}
                placeholder="Provide full details about the issue..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Severity</label>
                <select
                  value={newIssue.severity}
                  onChange={(e) => setNewIssue({...newIssue, severity: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={newIssue.category}
                  onChange={(e) => setNewIssue({...newIssue, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="SAFETY">Safety</option>
                  <option value="STRUCTURAL">Structural</option>
                  <option value="QUALITY">Quality</option>
                  <option value="CODE_COMPLIANCE">Code Compliance</option>
                  <option value="COORDINATION">Coordination</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Location</label>
                <input
                  type="text"
                  value={newIssue.location}
                  onChange={(e) => setNewIssue({...newIssue, location: e.target.value})}
                  placeholder="Unit 102 - Kitchen"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Reported By</label>
                <input
                  type="text"
                  value={newIssue.reportedBy}
                  onChange={(e) => setNewIssue({...newIssue, reportedBy: e.target.value})}
                  placeholder="Your name"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Assign To</label>
                <input
                  type="text"
                  value={newIssue.assignedTo}
                  onChange={(e) => setNewIssue({...newIssue, assignedTo: e.target.value})}
                  placeholder="Responsible party"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitIssue}>
                Submit Issue
              </Button>
              <Button variant="outline" onClick={() => setShowNewIssueForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace(/_/g, ' ')} ({issues.filter(i => status === 'ALL' || i.status === status).length})
          </Button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className={`border-2 ${
            issue.severity === 'CRITICAL' || issue.severity === 'HIGH' 
              ? 'border-red-500' 
              : 'border-slate-200 dark:border-[#E07A47]'
          }`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {issue.number}
                    </Badge>
                    <Badge className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status.replace(/_/g, ' ')}
                    </Badge>
                    <div className="flex items-center gap-1">
                      {getCategoryIcon(issue.category)}
                      <span className="text-xs font-semibold">{issue.category.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">{issue.title}</CardTitle>
                  <CardDescription>{issue.location}</CardDescription>
                </div>
                {issue.daysOpen > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Days Open</p>
                    <p className="text-2xl font-black text-[#E07A47]">{issue.daysOpen}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{issue.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Reported By:</p>
                  <p className="font-semibold">{issue.reportedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Reported Date:</p>
                  <p className="font-semibold">{formatDate(issue.reportedDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Assigned To:</p>
                  <p className="font-semibold">{issue.assignedTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Due Date:</p>
                  <p className="font-semibold">{formatDate(issue.dueDate)}</p>
                </div>
              </div>

              {issue.resolution && (
                <div className={`p-4 rounded-lg ${
                  issue.status === 'RESOLVED' || issue.status === 'CLOSED'
                    ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800'
                    : 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800'
                }`}>
                  <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                    {issue.status === 'RESOLVED' || issue.status === 'CLOSED' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-blue-600" />
                    )}
                    Resolution Update:
                  </h4>
                  <p className="text-sm">{issue.resolution}</p>
                  {issue.resolvedDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Resolved on {formatDate(issue.resolvedDate)}
                    </p>
                  )}
                </div>
              )}

              {issue.status !== 'CLOSED' && issue.status !== 'RESOLVED' && (
                <div className="flex gap-2">
                  {issue.status === 'OPEN' && (
                    <Button size="sm" variant="outline">
                      Start Working
                    </Button>
                  )}
                  {issue.status === 'IN_PROGRESS' && (
                    <Button size="sm" className="bg-green-500 hover:bg-green-600">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Resolved
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    Add Update
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIssues.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No issues found</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different status filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Users, 
  Calendar, 
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send
} from "lucide-react"

export function RFITracker() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showNewRFIForm, setShowNewRFIForm] = useState(false)
  const [newRFI, setNewRFI] = useState({
    title: '',
    category: 'DESIGN',
    phase: 'Framing & Structure',
    priority: 'MEDIUM',
    description: '',
    requestedBy: '',
    assignedTo: '',
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock RFI data
  const rfis = [
    {
      id: 'RFI-001',
      title: 'Clarification on mechanical room dimensions',
      category: 'DESIGN',
      phase: 'MEP',
      priority: 'HIGH',
      status: 'OPEN',
      requestedBy: 'John Smith (Superintendent)',
      assignedTo: 'ABC Architecture',
      dateSubmitted: '2026-01-20',
      dueDate: '2026-01-27',
      responseDate: null,
      description: 'Need confirmation on mechanical room dimensions shown on sheet M-101. Current dimensions conflict with structural drawings S-205.',
      response: null,
      daysOpen: 3,
    },
    {
      id: 'RFI-002',
      title: 'Window framing detail at corner units',
      category: 'DESIGN',
      phase: 'Framing & Structure',
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      requestedBy: 'ABC Construction',
      assignedTo: 'ABC Architecture',
      dateSubmitted: '2026-01-18',
      dueDate: '2026-01-25',
      responseDate: null,
      description: 'Detail A-305 shows conflicting information for window framing at corner units. Please clarify proper framing method.',
      response: 'Reviewing with structural engineer. Response expected by 1/24.',
      daysOpen: 5,
    },
    {
      id: 'RFI-003',
      title: 'HVAC equipment substitution approval',
      category: 'SPECIFICATION',
      phase: 'MEP',
      priority: 'MEDIUM',
      status: 'ANSWERED',
      requestedBy: 'XYZ Mechanical',
      assignedTo: 'ABC Architecture',
      dateSubmitted: '2026-01-15',
      dueDate: '2026-01-22',
      responseDate: '2026-01-19',
      description: 'Proposed equipment from specified manufacturer is on backorder for 12 weeks. Request approval for equal substitute from alternate manufacturer.',
      response: 'Approved. Submit product data sheet for alternate equipment for final review.',
      daysOpen: 0,
    },
    {
      id: 'RFI-004',
      title: 'Site drainage clarification',
      category: 'COORDINATION',
      phase: 'Site Preparation',
      priority: 'LOW',
      status: 'CLOSED',
      requestedBy: 'John Smith (Superintendent)',
      assignedTo: 'DEF Engineering',
      dateSubmitted: '2026-01-10',
      dueDate: '2026-01-17',
      responseDate: '2026-01-16',
      description: 'Clarify drainage flow direction at northwest corner of site. Civil drawings show conflicting slopes.',
      response: 'Revised civil drawings issued. See sheet C-103 revision 2 for corrected drainage plan.',
      daysOpen: 0,
    },
    {
      id: 'RFI-005',
      title: 'Exterior finish material color selection',
      category: 'SPECIFICATION',
      phase: 'Exterior & Landscaping',
      priority: 'LOW',
      status: 'OPEN',
      requestedBy: 'John Smith (Superintendent)',
      assignedTo: 'Owner/Architect',
      dateSubmitted: '2026-01-21',
      dueDate: '2026-02-04',
      responseDate: null,
      description: 'Specification calls out "color to be selected" for exterior siding. Need final color selection before ordering materials.',
      response: null,
      daysOpen: 2,
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return 'bg-red-500 text-white'
      case 'IN_REVIEW': return 'bg-yellow-500 text-white'
      case 'ANSWERED': return 'bg-green-500 text-white'
      case 'CLOSED': return 'bg-slate-500 text-white'
      default: return 'bg-slate-500 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200 border-red-300 dark:border-red-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 border-yellow-300 dark:border-yellow-800'
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200 border-green-300 dark:border-green-800'
      default: return 'bg-slate-100 text-slate-800 border-slate-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'DESIGN': return <FileText className="h-4 w-4" />
      case 'SPECIFICATION': return <FileText className="h-4 w-4" />
      case 'COORDINATION': return <Users className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  const filteredRFIs = selectedStatus === 'ALL' 
    ? rfis 
    : rfis.filter(rfi => rfi.status === selectedStatus)

  const handleSubmitRFI = () => {
    console.log('New RFI submitted:', newRFI)
    setShowNewRFIForm(false)
    // Reset form
    setNewRFI({
      title: '',
      category: 'DESIGN',
      phase: 'Framing & Structure',
      priority: 'MEDIUM',
      description: '',
      requestedBy: '',
      assignedTo: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">RFI Tracker</h2>
          <p className="text-base text-muted-foreground">
            Manage Requests for Information and track responses
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowNewRFIForm(!showNewRFIForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New RFI
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total RFIs</p>
              <MessageCircle className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {rfis.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Open</p>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600">
              {rfis.filter(r => r.status === 'OPEN').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">In Review</p>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">
              {rfis.filter(r => r.status === 'IN_REVIEW').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Being processed
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              4.2
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              days average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New RFI Form */}
      {showNewRFIForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>Submit New RFI</CardTitle>
            <CardDescription>Create a new Request for Information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">RFI Title</label>
              <input
                type="text"
                value={newRFI.title}
                onChange={(e) => setNewRFI({...newRFI, title: e.target.value})}
                placeholder="Brief description of the question or issue"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Category</label>
                <select
                  value={newRFI.category}
                  onChange={(e) => setNewRFI({...newRFI, category: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="DESIGN">Design</option>
                  <option value="SPECIFICATION">Specification</option>
                  <option value="COORDINATION">Coordination</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phase</label>
                <select
                  value={newRFI.phase}
                  onChange={(e) => setNewRFI({...newRFI, phase: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option>Site Preparation</option>
                  <option>Foundation</option>
                  <option>Framing & Structure</option>
                  <option>MEP</option>
                  <option>Interior Finishes</option>
                  <option>Exterior & Landscaping</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Priority</label>
                <select
                  value={newRFI.priority}
                  onChange={(e) => setNewRFI({...newRFI, priority: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Detailed Description</label>
              <textarea
                value={newRFI.description}
                onChange={(e) => setNewRFI({...newRFI, description: e.target.value})}
                placeholder="Provide detailed information about your question or issue"
                rows={4}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Requested By</label>
                <input
                  type="text"
                  value={newRFI.requestedBy}
                  onChange={(e) => setNewRFI({...newRFI, requestedBy: e.target.value})}
                  placeholder="Your name and role"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Assign To</label>
                <select
                  value={newRFI.assignedTo}
                  onChange={(e) => setNewRFI({...newRFI, assignedTo: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="">Select recipient...</option>
                  <option value="ABC Architecture">ABC Architecture</option>
                  <option value="DEF Engineering">DEF Engineering</option>
                  <option value="XYZ Mechanical">XYZ Mechanical</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitRFI}>
                <Send className="mr-2 h-4 w-4" />
                Submit RFI
              </Button>
              <Button variant="outline" onClick={() => setShowNewRFIForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'IN_REVIEW', 'ANSWERED', 'CLOSED'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace('_', ' ')} ({rfis.filter(r => status === 'ALL' || r.status === status).length})
          </Button>
        ))}
      </div>

      {/* RFI List */}
      <div className="space-y-4">
        {filteredRFIs.map((rfi) => (
          <Card key={rfi.id} className={`border-2 ${getPriorityColor(rfi.priority)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {rfi.id}
                    </Badge>
                    <Badge className={getStatusColor(rfi.status)}>
                      {rfi.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getCategoryIcon(rfi.category)}
                      {rfi.category}
                    </Badge>
                    <Badge variant="outline" className={
                      rfi.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-950' :
                      rfi.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950' :
                      'bg-green-100 text-green-800 dark:bg-green-950'
                    }>
                      {rfi.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{rfi.title}</CardTitle>
                  <CardDescription className="text-sm">{rfi.phase}</CardDescription>
                </div>
                {rfi.daysOpen > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Days Open</p>
                    <p className="text-2xl font-black text-[#E07A47]">{rfi.daysOpen}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2">Description:</h4>
                <p className="text-sm text-muted-foreground">{rfi.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Requested By:</p>
                  <p className="font-semibold">{rfi.requestedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Assigned To:</p>
                  <p className="font-semibold">{rfi.assignedTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Date Submitted:</p>
                  <p className="font-semibold">{formatDate(rfi.dateSubmitted)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Due Date:</p>
                  <p className="font-semibold">{formatDate(rfi.dueDate)}</p>
                </div>
              </div>

              {rfi.response && (
                <div className={`p-4 rounded-lg ${
                  rfi.status === 'ANSWERED' || rfi.status === 'CLOSED' 
                    ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800' 
                    : 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {rfi.status === 'ANSWERED' || rfi.status === 'CLOSED' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-blue-600" />
                    )}
                    <h4 className="font-bold text-sm">
                      {rfi.status === 'ANSWERED' || rfi.status === 'CLOSED' ? 'Response:' : 'Update:'}
                    </h4>
                    {rfi.responseDate && (
                      <span className="text-xs text-muted-foreground ml-auto">
                        {formatDate(rfi.responseDate)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{rfi.response}</p>
                </div>
              )}

              {rfi.status === 'OPEN' && !rfi.response && (
                <Button variant="outline" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Follow-Up
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRFIs.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No RFIs found</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different status filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

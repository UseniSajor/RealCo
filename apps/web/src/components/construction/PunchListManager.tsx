"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle2, 
  Circle,
  AlertCircle,
  Clock,
  Plus,
  User,
  Calendar
} from "lucide-react"

export function PunchListManager() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showNewItemForm, setShowNewItemForm] = useState(false)
  const [newItem, setNewItem] = useState({
    location: '',
    issue: '',
    trade: 'GENERAL',
    priority: 'MEDIUM',
    assignedTo: '',
    dueDate: '',
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock punch list items
  const punchItems = [
    {
      id: 'PL-001',
      number: 'PL-001',
      location: 'Unit 102 - Kitchen',
      issue: 'Cabinet door misaligned',
      trade: 'CARPENTRY',
      priority: 'LOW',
      status: 'COMPLETED',
      assignedTo: 'Premium Cabinets Inc',
      dateReported: '2026-08-15',
      dueDate: '2026-08-20',
      completedDate: '2026-08-19',
      reportedBy: 'John Smith',
      notes: 'Door adjusted and aligned. Verified by owner.',
    },
    {
      id: 'PL-002',
      number: 'PL-002',
      location: 'Common Area - Lobby',
      issue: 'Paint touch-up needed around door frames',
      trade: 'PAINTING',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: 'Premium Painters LLC',
      dateReported: '2026-08-16',
      dueDate: '2026-08-22',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: 'Scheduled for 8/21',
    },
    {
      id: 'PL-003',
      number: 'PL-003',
      location: 'Unit 105 - Bathroom',
      issue: 'Shower tile grout cracked',
      trade: 'TILE',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: 'Tile Masters',
      dateReported: '2026-08-17',
      dueDate: '2026-08-23',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: 'Owner requested immediate attention',
    },
    {
      id: 'PL-004',
      number: 'PL-004',
      location: 'Unit 103 - Living Room',
      issue: 'Light switch not functioning',
      trade: 'ELECTRICAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'Power Systems Inc',
      dateReported: '2026-08-16',
      dueDate: '2026-08-21',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: 'Electrician on site 8/20',
    },
    {
      id: 'PL-005',
      number: 'PL-005',
      location: 'Exterior - Front Entry',
      issue: 'Concrete walkway minor crack',
      trade: 'CONCRETE',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: 'ReadyMix Concrete Co',
      dateReported: '2026-08-18',
      dueDate: '2026-08-25',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: null,
    },
    {
      id: 'PL-006',
      number: 'PL-006',
      location: 'Unit 104 - Master Bedroom',
      issue: 'Baseboard gap needs caulking',
      trade: 'CARPENTRY',
      priority: 'LOW',
      status: 'COMPLETED',
      assignedTo: 'ABC Construction',
      dateReported: '2026-08-14',
      dueDate: '2026-08-20',
      completedDate: '2026-08-18',
      reportedBy: 'John Smith',
      notes: 'Completed and verified',
    },
    {
      id: 'PL-007',
      number: 'PL-007',
      location: 'Common Area - Hallway',
      issue: 'HVAC vent cover loose',
      trade: 'HVAC',
      priority: 'LOW',
      status: 'OPEN',
      assignedTo: 'XYZ Mechanical',
      dateReported: '2026-08-17',
      dueDate: '2026-08-24',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: null,
    },
    {
      id: 'PL-008',
      number: 'PL-008',
      location: 'Unit 106 - Kitchen',
      issue: 'Faucet dripping',
      trade: 'PLUMBING',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      assignedTo: 'Reliable Plumbing',
      dateReported: '2026-08-18',
      dueDate: '2026-08-23',
      completedDate: null,
      reportedBy: 'John Smith',
      notes: 'Parts ordered, install scheduled 8/22',
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-500 text-white'
      case 'IN_PROGRESS': return 'bg-blue-500 text-white'
      case 'OPEN': return 'bg-yellow-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200'
      case 'LOW': return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'COMPLETED': return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case 'IN_PROGRESS': return <Clock className="h-5 w-5 text-blue-600" />
      case 'OPEN': return <Circle className="h-5 w-5 text-yellow-600" />
      default: return <Circle className="h-5 w-5" />
    }
  }

  const filteredItems = selectedStatus === 'ALL' 
    ? punchItems 
    : punchItems.filter(item => item.status === selectedStatus)

  const completionRate = (punchItems.filter(item => item.status === 'COMPLETED').length / punchItems.length) * 100

  const handleSubmitItem = () => {
    console.log('New punch item submitted:', newItem)
    setShowNewItemForm(false)
    setNewItem({
      location: '',
      issue: '',
      trade: 'GENERAL',
      priority: 'MEDIUM',
      assignedTo: '',
      dueDate: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Punch List Manager</h2>
          <p className="text-base text-muted-foreground">
            Track final completion items before project closeout
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowNewItemForm(!showNewItemForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completion</p>
              <CheckCircle2 className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {completionRate.toFixed(0)}%
            </p>
            <div className="mt-3 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#56CCF2]"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Open</p>
              <Circle className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">
              {punchItems.filter(item => item.status === 'OPEN').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Not started
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">In Progress</p>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-black text-blue-600">
              {punchItems.filter(item => item.status === 'IN_PROGRESS').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Being worked
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Completed</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {punchItems.filter(item => item.status === 'COMPLETED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Verified done
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">High Priority</p>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600">
              {punchItems.filter(item => item.priority === 'HIGH' && item.status !== 'COMPLETED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Item Form */}
      {showNewItemForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>Add Punch List Item</CardTitle>
            <CardDescription>Report a new item requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Location</label>
              <input
                type="text"
                value={newItem.location}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                placeholder="e.g., Unit 102 - Kitchen"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Issue Description</label>
              <textarea
                value={newItem.issue}
                onChange={(e) => setNewItem({...newItem, issue: e.target.value})}
                placeholder="Describe the issue that needs to be addressed..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Trade</label>
                <select
                  value={newItem.trade}
                  onChange={(e) => setNewItem({...newItem, trade: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="GENERAL">General</option>
                  <option value="CARPENTRY">Carpentry</option>
                  <option value="ELECTRICAL">Electrical</option>
                  <option value="PLUMBING">Plumbing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="PAINTING">Painting</option>
                  <option value="TILE">Tile</option>
                  <option value="CONCRETE">Concrete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Priority</label>
                <select
                  value={newItem.priority}
                  onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Due Date</label>
                <input
                  type="date"
                  value={newItem.dueDate}
                  onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Assign To</label>
              <input
                type="text"
                value={newItem.assignedTo}
                onChange={(e) => setNewItem({...newItem, assignedTo: e.target.value})}
                placeholder="Company or person responsible"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitItem}>
                Add to Punch List
              </Button>
              <Button variant="outline" onClick={() => setShowNewItemForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'OPEN', 'IN_PROGRESS', 'COMPLETED'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace(/_/g, ' ')} ({punchItems.filter(item => status === 'ALL' || item.status === status).length})
          </Button>
        ))}
      </div>

      {/* Punch List Items */}
      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className={`border-2 ${getPriorityColor(item.priority)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <Badge variant="outline" className="font-mono">
                          {item.number}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {item.trade}
                        </Badge>
                        <Badge className={
                          item.priority === 'HIGH' ? 'bg-red-500 text-white' :
                          item.priority === 'MEDIUM' ? 'bg-yellow-500 text-white' :
                          'bg-green-500 text-white'
                        }>
                          {item.priority}
                        </Badge>
                      </div>
                      <h4 className="font-bold text-lg">{item.location}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{item.issue}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-3">
                    <div>
                      <p className="text-muted-foreground mb-1">Assigned To:</p>
                      <p className="font-semibold">{item.assignedTo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Reported:</p>
                      <p className="font-semibold">{formatDate(item.dateReported)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Due Date:</p>
                      <p className="font-semibold">{formatDate(item.dueDate)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">
                        {item.completedDate ? 'Completed:' : 'Status:'}
                      </p>
                      <p className="font-semibold">
                        {item.completedDate ? formatDate(item.completedDate) : item.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="mt-3 p-3 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm">{item.notes}</p>
                    </div>
                  )}

                  {item.status !== 'COMPLETED' && (
                    <div className="flex gap-2 mt-3">
                      {item.status === 'OPEN' && (
                        <Button size="sm" variant="outline">
                          Mark In Progress
                        </Button>
                      )}
                      {item.status === 'IN_PROGRESS' && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No items found</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different status filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DollarSign, 
  Calendar, 
  FileText,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react"

export function ChangeOrderManager() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showNewCOForm, setShowNewCOForm] = useState(false)
  const [newCO, setNewCO] = useState({
    number: '',
    title: '',
    reason: 'DESIGN_CHANGE',
    phase: 'Framing & Structure',
    costImpact: 0,
    timeImpact: 0,
    description: '',
    requestedBy: '',
  })

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

  // Mock change order data
  const changeOrders = [
    {
      id: 'CO-001',
      number: 'PCO-2026-001',
      title: 'Additional Steel Reinforcement',
      reason: 'DESIGN_CHANGE',
      phase: 'Framing & Structure',
      requestDate: '2026-01-10',
      approvalDate: '2026-01-15',
      status: 'APPROVED',
      costImpact: 45000,
      timeImpact: 5, // days
      requestedBy: 'ABC Architecture',
      description: 'Engineer requested additional steel beams for increased load capacity in areas 3A and 3B.',
      budgetCategory: 'Structural',
      originalBudget: 1800000,
      revisedBudget: 1845000,
    },
    {
      id: 'CO-002',
      number: 'PCO-2026-002',
      title: 'HVAC Equipment Upgrade',
      reason: 'OWNER_REQUEST',
      phase: 'MEP',
      requestDate: '2026-01-18',
      approvalDate: null,
      status: 'PENDING_APPROVAL',
      costImpact: 38000,
      timeImpact: 0,
      requestedBy: 'Owner',
      description: 'Owner requested upgrade to high-efficiency HVAC units for long-term energy savings.',
      budgetCategory: 'MEP',
      originalBudget: 1500000,
      revisedBudget: 1538000,
    },
    {
      id: 'CO-003',
      number: 'PCO-2026-003',
      title: 'Foundation Repair - Unforeseen Soil Conditions',
      reason: 'SITE_CONDITIONS',
      phase: 'Foundation',
      requestDate: '2025-05-15',
      approvalDate: '2025-05-17',
      status: 'APPROVED',
      costImpact: 85000,
      timeImpact: 12,
      requestedBy: 'John Smith (Superintendent)',
      description: 'Unexpected rock layer encountered. Requires additional excavation and reinforcement.',
      budgetCategory: 'Foundation',
      originalBudget: 980000,
      revisedBudget: 1065000,
    },
    {
      id: 'CO-004',
      number: 'PCO-2026-004',
      title: 'Upgrade Interior Finishes',
      reason: 'OWNER_REQUEST',
      phase: 'Interior Finishes',
      requestDate: '2026-01-20',
      approvalDate: null,
      status: 'UNDER_REVIEW',
      costImpact: 125000,
      timeImpact: 8,
      requestedBy: 'Owner',
      description: 'Owner requested upgraded flooring and fixtures in all units.',
      budgetCategory: 'Interior Finishes',
      originalBudget: 1800000,
      revisedBudget: 1925000,
    },
    {
      id: 'CO-005',
      number: 'PCO-2026-005',
      title: 'Electrical Panel Relocation',
      reason: 'CODE_REQUIREMENT',
      phase: 'MEP',
      requestDate: '2026-01-12',
      approvalDate: '2026-01-16',
      status: 'REJECTED',
      costImpact: 22000,
      timeImpact: 3,
      requestedBy: 'Power Systems Inc',
      description: 'Proposed electrical panel relocation. Rejected - alternative solution found.',
      budgetCategory: 'MEP',
      originalBudget: 1500000,
      revisedBudget: 1500000,
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-500 text-white'
      case 'PENDING_APPROVAL': return 'bg-yellow-500 text-white'
      case 'UNDER_REVIEW': return 'bg-blue-500 text-white'
      case 'REJECTED': return 'bg-red-500 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getReasonColor = (reason: string) => {
    switch(reason) {
      case 'DESIGN_CHANGE': return 'text-purple-600 bg-purple-50 dark:bg-purple-950'
      case 'OWNER_REQUEST': return 'text-blue-600 bg-blue-50 dark:bg-blue-950'
      case 'SITE_CONDITIONS': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950'
      case 'CODE_REQUIREMENT': return 'text-red-600 bg-red-50 dark:bg-red-950'
      default: return 'text-slate-600 bg-slate-50 dark:bg-slate-950'
    }
  }

  const filteredCOs = selectedStatus === 'ALL' 
    ? changeOrders 
    : changeOrders.filter(co => co.status === selectedStatus)

  const totalCostImpact = changeOrders
    .filter(co => co.status === 'APPROVED')
    .reduce((sum, co) => sum + co.costImpact, 0)

  const totalTimeImpact = changeOrders
    .filter(co => co.status === 'APPROVED')
    .reduce((sum, co) => sum + co.timeImpact, 0)

  const handleSubmitCO = () => {
    console.log('New change order submitted:', newCO)
    setShowNewCOForm(false)
    setNewCO({
      number: '',
      title: '',
      reason: 'DESIGN_CHANGE',
      phase: 'Framing & Structure',
      costImpact: 0,
      timeImpact: 0,
      description: '',
      requestedBy: '',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Change Order Management</h2>
          <p className="text-base text-muted-foreground">
            Track scope changes and budget impacts
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowNewCOForm(!showNewCOForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Change Order
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Cost Impact</p>
              <DollarSign className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {formatCurrency(totalCostImpact)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Approved changes
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Time Impact</p>
              <Calendar className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              {totalTimeImpact}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              days added
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending</p>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">
              {changeOrders.filter(co => co.status === 'PENDING_APPROVAL' || co.status === 'UNDER_REVIEW').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting decision
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Approved</p>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {changeOrders.filter(co => co.status === 'APPROVED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Total approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New CO Form */}
      {showNewCOForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>Request Change Order</CardTitle>
            <CardDescription>Submit a potential change order for review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">CO Number</label>
                <input
                  type="text"
                  value={newCO.number}
                  onChange={(e) => setNewCO({...newCO, number: e.target.value})}
                  placeholder="e.g., PCO-2026-006"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Requested By</label>
                <input
                  type="text"
                  value={newCO.requestedBy}
                  onChange={(e) => setNewCO({...newCO, requestedBy: e.target.value})}
                  placeholder="Your name/company"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={newCO.title}
                onChange={(e) => setNewCO({...newCO, title: e.target.value})}
                placeholder="Brief description of the change"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Reason</label>
                <select
                  value={newCO.reason}
                  onChange={(e) => setNewCO({...newCO, reason: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="DESIGN_CHANGE">Design Change</option>
                  <option value="OWNER_REQUEST">Owner Request</option>
                  <option value="SITE_CONDITIONS">Site Conditions</option>
                  <option value="CODE_REQUIREMENT">Code Requirement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phase</label>
                <select
                  value={newCO.phase}
                  onChange={(e) => setNewCO({...newCO, phase: e.target.value})}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Cost Impact ($)</label>
                <input
                  type="number"
                  value={newCO.costImpact}
                  onChange={(e) => setNewCO({...newCO, costImpact: parseFloat(e.target.value)})}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Time Impact (days)</label>
                <input
                  type="number"
                  value={newCO.timeImpact}
                  onChange={(e) => setNewCO({...newCO, timeImpact: parseInt(e.target.value)})}
                  placeholder="0"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Detailed Description</label>
              <textarea
                value={newCO.description}
                onChange={(e) => setNewCO({...newCO, description: e.target.value})}
                placeholder="Explain the change and justification..."
                rows={4}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitCO}>
                Submit Change Order
              </Button>
              <Button variant="outline" onClick={() => setShowNewCOForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'PENDING_APPROVAL', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace(/_/g, ' ')} ({changeOrders.filter(co => status === 'ALL' || co.status === status).length})
          </Button>
        ))}
      </div>

      {/* Change Orders List */}
      <div className="space-y-4">
        {filteredCOs.map((co) => (
          <Card key={co.id} className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {co.number}
                    </Badge>
                    <Badge className={getStatusColor(co.status)}>
                      {co.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={getReasonColor(co.reason)}>
                      {co.reason.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{co.title}</CardTitle>
                  <CardDescription>{co.phase}</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Cost Impact</p>
                  <p className={`text-2xl font-black ${co.costImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {co.costImpact > 0 ? '+' : ''}{formatCurrency(co.costImpact)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">{co.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Requested By:</p>
                  <p className="font-semibold">{co.requestedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Request Date:</p>
                  <p className="font-semibold">{formatDate(co.requestDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Time Impact:</p>
                  <p className="font-semibold">{co.timeImpact > 0 ? `+${co.timeImpact}` : co.timeImpact} days</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">
                    {co.approvalDate ? 'Approval Date:' : 'Status:'}
                  </p>
                  <p className="font-semibold">
                    {co.approvalDate ? formatDate(co.approvalDate) : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-bold text-sm mb-2">Budget Impact</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Original</p>
                    <p className="font-bold">{formatCurrency(co.originalBudget)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Change</p>
                    <p className={`font-bold ${co.costImpact > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {co.costImpact > 0 ? '+' : ''}{formatCurrency(co.costImpact)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revised</p>
                    <p className="font-bold">{formatCurrency(co.revisedBudget)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCOs.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No change orders found</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different status filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

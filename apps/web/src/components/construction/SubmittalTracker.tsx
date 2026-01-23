"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Calendar, 
  Users,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Plus
} from "lucide-react"

export function SubmittalTracker() {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL')
  const [showNewSubmittalForm, setShowNewSubmittalForm] = useState(false)
  const [newSubmittal, setNewSubmittal] = useState({
    number: '',
    title: '',
    spec: '',
    phase: 'Framing & Structure',
    submittedBy: '',
    reviewedBy: '',
    type: 'PRODUCT_DATA',
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock submittal data
  const submittals = [
    {
      id: 'SUB-001',
      number: '03-100-001',
      title: 'Structural Steel Shop Drawings',
      spec: '05120 - Structural Steel',
      phase: 'Framing & Structure',
      type: 'SHOP_DRAWINGS',
      submittedBy: 'ABC Steel Fabrication',
      submittedDate: '2026-01-15',
      reviewedBy: 'ABC Architecture',
      reviewDate: '2026-01-20',
      dueDate: '2026-01-25',
      status: 'APPROVED',
      revision: 'A',
      daysOpen: 0,
      notes: 'Approved as submitted. Proceed with fabrication.',
    },
    {
      id: 'SUB-002',
      number: '15-500-001',
      title: 'HVAC Equipment Submittals',
      spec: '23810 - HVAC Equipment',
      phase: 'MEP',
      type: 'PRODUCT_DATA',
      submittedBy: 'XYZ Mechanical',
      submittedDate: '2026-01-18',
      reviewedBy: 'ABC Architecture',
      reviewDate: null,
      dueDate: '2026-01-28',
      status: 'UNDER_REVIEW',
      revision: '0',
      daysOpen: 5,
      notes: null,
    },
    {
      id: 'SUB-003',
      number: '09-900-001',
      title: 'Interior Paint Color Samples',
      spec: '09900 - Painting',
      phase: 'Interior Finishes',
      type: 'SAMPLES',
      submittedBy: 'Premium Painters LLC',
      submittedDate: '2026-01-20',
      reviewedBy: 'Owner',
      reviewDate: null,
      dueDate: '2026-02-05',
      status: 'PENDING_SUBMISSION',
      revision: '0',
      daysOpen: 3,
      notes: null,
    },
    {
      id: 'SUB-004',
      number: '03-300-001',
      title: 'Concrete Mix Design',
      spec: '03300 - Cast-in-Place Concrete',
      phase: 'Foundation',
      type: 'PRODUCT_DATA',
      submittedBy: 'ReadyMix Concrete Co',
      submittedDate: '2025-04-10',
      reviewedBy: 'DEF Engineering',
      reviewDate: '2025-04-15',
      dueDate: '2025-04-20',
      status: 'APPROVED_AS_NOTED',
      revision: 'B',
      daysOpen: 0,
      notes: 'Approved with minor notes. See marked up drawings.',
    },
    {
      id: 'SUB-005',
      number: '08-100-001',
      title: 'Window and Door Schedule',
      spec: '08100 - Metal Doors and Frames',
      phase: 'Framing & Structure',
      type: 'SHOP_DRAWINGS',
      submittedBy: 'Window & Door Specialists',
      submittedDate: '2026-01-12',
      reviewedBy: 'ABC Architecture',
      reviewDate: '2026-01-18',
      dueDate: '2026-01-22',
      status: 'REVISE_AND_RESUBMIT',
      revision: 'A',
      daysOpen: 0,
      notes: 'Dimensions incorrect on units 102-105. Revise and resubmit.',
    },
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return 'bg-green-500 text-white'
      case 'APPROVED_AS_NOTED': return 'bg-blue-500 text-white'
      case 'REVISE_AND_RESUBMIT': return 'bg-red-500 text-white'
      case 'UNDER_REVIEW': return 'bg-yellow-500 text-white'
      case 'PENDING_SUBMISSION': return 'bg-slate-400 text-white'
      default: return 'bg-slate-400 text-white'
    }
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'SHOP_DRAWINGS': return <FileText className="h-4 w-4" />
      case 'PRODUCT_DATA': return <FileText className="h-4 w-4" />
      case 'SAMPLES': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const filteredSubmittals = selectedStatus === 'ALL' 
    ? submittals 
    : submittals.filter(s => s.status === selectedStatus)

  const handleSubmitSubmittal = () => {
    console.log('New submittal submitted:', newSubmittal)
    setShowNewSubmittalForm(false)
    setNewSubmittal({
      number: '',
      title: '',
      spec: '',
      phase: 'Framing & Structure',
      submittedBy: '',
      reviewedBy: '',
      type: 'PRODUCT_DATA',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Submittal Tracker</h2>
          <p className="text-base text-muted-foreground">
            Manage shop drawings, product data, and samples
          </p>
        </div>
        <Button 
          className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
          onClick={() => setShowNewSubmittalForm(!showNewSubmittalForm)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Submittal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total</p>
              <FileText className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <p className="text-3xl font-black text-[#56CCF2]">
              {submittals.length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              All submittals
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
              {submittals.filter(s => s.status === 'APPROVED').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Ready to proceed
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-yellow-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Under Review</p>
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <p className="text-3xl font-black text-yellow-600">
              {submittals.filter(s => s.status === 'UNDER_REVIEW').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Revisions</p>
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-3xl font-black text-red-600">
              {submittals.filter(s => s.status === 'REVISE_AND_RESUBMIT').length}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Need rework
            </p>
          </CardContent>
        </Card>

        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Avg Review</p>
              <Calendar className="h-5 w-5 text-[#E07A47]" />
            </div>
            <p className="text-3xl font-black text-[#E07A47]">
              5.2
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              days average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Submittal Form */}
      {showNewSubmittalForm && (
        <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
          <CardHeader>
            <CardTitle>New Submittal</CardTitle>
            <CardDescription>Create a new submittal package</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Submittal Number</label>
                <input
                  type="text"
                  value={newSubmittal.number}
                  onChange={(e) => setNewSubmittal({...newSubmittal, number: e.target.value})}
                  placeholder="e.g., 03-100-001"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Specification Section</label>
                <input
                  type="text"
                  value={newSubmittal.spec}
                  onChange={(e) => setNewSubmittal({...newSubmittal, spec: e.target.value})}
                  placeholder="e.g., 05120 - Structural Steel"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Submittal Title</label>
              <input
                type="text"
                value={newSubmittal.title}
                onChange={(e) => setNewSubmittal({...newSubmittal, title: e.target.value})}
                placeholder="Brief description of submittal"
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Type</label>
                <select
                  value={newSubmittal.type}
                  onChange={(e) => setNewSubmittal({...newSubmittal, type: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                >
                  <option value="SHOP_DRAWINGS">Shop Drawings</option>
                  <option value="PRODUCT_DATA">Product Data</option>
                  <option value="SAMPLES">Samples</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Phase</label>
                <select
                  value={newSubmittal.phase}
                  onChange={(e) => setNewSubmittal({...newSubmittal, phase: e.target.value})}
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
                <label className="block text-sm font-bold mb-2">Submitted By</label>
                <input
                  type="text"
                  value={newSubmittal.submittedBy}
                  onChange={(e) => setNewSubmittal({...newSubmittal, submittedBy: e.target.value})}
                  placeholder="Company name"
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Upload Documents</label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center hover:border-[#56CCF2] transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm font-semibold mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DWG, or image files (max 50MB)</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button className="flex-1 bg-[#56CCF2] hover:bg-[#56CCF2]/90" onClick={handleSubmitSubmittal}>
                Submit for Review
              </Button>
              <Button variant="outline" onClick={() => setShowNewSubmittalForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['ALL', 'APPROVED', 'APPROVED_AS_NOTED', 'UNDER_REVIEW', 'REVISE_AND_RESUBMIT', 'PENDING_SUBMISSION'].map((status) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedStatus(status)}
            className={selectedStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
          >
            {status.replace(/_/g, ' ')} ({submittals.filter(s => status === 'ALL' || s.status === status).length})
          </Button>
        ))}
      </div>

      {/* Submittals List */}
      <div className="space-y-4">
        {filteredSubmittals.map((submittal) => (
          <Card key={submittal.id} className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {submittal.number}
                    </Badge>
                    <Badge className={getStatusColor(submittal.status)}>
                      {submittal.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getTypeIcon(submittal.type)}
                      {submittal.type.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant="outline">
                      Rev {submittal.revision}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2">{submittal.title}</CardTitle>
                  <CardDescription>
                    {submittal.spec} • {submittal.phase}
                  </CardDescription>
                </div>
                {submittal.daysOpen > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Days Open</p>
                    <p className="text-2xl font-black text-[#E07A47]">{submittal.daysOpen}</p>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Submitted By:</p>
                  <p className="font-semibold">{submittal.submittedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Submitted Date:</p>
                  <p className="font-semibold">{formatDate(submittal.submittedDate)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Reviewed By:</p>
                  <p className="font-semibold">{submittal.reviewedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Due Date:</p>
                  <p className="font-semibold">{formatDate(submittal.dueDate)}</p>
                </div>
              </div>

              {submittal.notes && (
                <div className={`p-4 rounded-lg ${
                  submittal.status === 'APPROVED' || submittal.status === 'APPROVED_AS_NOTED'
                    ? 'bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800'
                    : submittal.status === 'REVISE_AND_RESUBMIT'
                    ? 'bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800'
                    : 'bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800'
                }`}>
                  <h4 className="font-bold text-sm mb-1">Review Notes:</h4>
                  <p className="text-sm">{submittal.notes}</p>
                  {submittal.reviewDate && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Reviewed on {formatDate(submittal.reviewDate)}
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {submittal.status === 'REVISE_AND_RESUBMIT' && (
                  <Button size="sm" className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Revision
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubmittals.length === 0 && (
        <Card className="border-2 border-slate-200 dark:border-slate-700">
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold mb-2">No submittals found</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different status filter
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

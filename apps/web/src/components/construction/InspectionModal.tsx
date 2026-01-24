"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructionAPI, type Inspection, type InspectionStatus } from "@/lib/api/construction.api"
import { Loader2, AlertCircle, Upload, X, Image as ImageIcon, CheckCircle, XCircle, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface InspectionModalProps {
  projectId: string
  inspection?: Inspection | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InspectionModal({ projectId, inspection, open, onOpenChange, onSuccess }: InspectionModalProps) {
  const isEditing = !!inspection

  // Form state
  const [formData, setFormData] = useState({
    inspectionType: "",
    scheduledDate: "",
    status: "SCHEDULED" as InspectionStatus,
    result: "" as "" | "PASSED" | "FAILED" | "DEFERRED",
    notes: "",
    completedDate: "",
  })

  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Common inspection types
  const commonInspectionTypes = [
    "Foundation",
    "Framing",
    "Rough-In MEP",
    "Insulation",
    "Drywall",
    "Final MEP",
    "Fire Safety",
    "Building Code Compliance",
    "Certificate of Occupancy",
  ]

  // Reset form when inspection changes or modal opens
  useEffect(() => {
    if (inspection) {
      setFormData({
        inspectionType: inspection.inspectionType,
        scheduledDate: inspection.scheduledDate ? inspection.scheduledDate.split('T')[0] : "",
        status: inspection.status,
        result: (inspection.result as "" | "PASSED" | "FAILED" | "DEFERRED") || "",
        notes: inspection.notes || "",
        completedDate: inspection.completedDate ? inspection.completedDate.split('T')[0] : "",
      })
      setPhotoUrls(inspection.photoUrls || [])
    } else {
      setFormData({
        inspectionType: "",
        scheduledDate: "",
        status: "SCHEDULED",
        result: "",
        notes: "",
        completedDate: "",
      })
      setPhotoUrls([])
    }
    setError(null)
  }, [inspection, open])

  const handlePhotoUrlAdd = () => {
    const url = prompt("Enter inspection photo URL:")
    if (url) {
      setPhotoUrls([...photoUrls, url])
    }
  }

  const removePhotoUrl = (index: number) => {
    setPhotoUrls(photoUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && inspection) {
        // Update existing inspection
        await constructionAPI.updateInspection(inspection.id, {
          status: formData.status,
          result: formData.result || undefined,
          notes: formData.notes || undefined,
          photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
          completedDate: formData.completedDate ? new Date(formData.completedDate).toISOString() : undefined,
        })
      } else {
        // Create new inspection
        await constructionAPI.createInspection(projectId, {
          inspectionType: formData.inspectionType,
          scheduledDate: new Date(formData.scheduledDate).toISOString(),
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save inspection:', err)
      setError(err instanceof Error ? err.message : 'Failed to save inspection')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: InspectionStatus) => {
    switch (status) {
      case 'PASSED':
        return 'bg-green-500'
      case 'FAILED':
        return 'bg-red-500'
      case 'IN_PROGRESS':
        return 'bg-blue-500'
      case 'DEFERRED':
        return 'bg-yellow-500'
      case 'CANCELLED':
        return 'bg-slate-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getResultBadgeColor = (result: string) => {
    switch (result) {
      case 'PASSED':
        return 'bg-green-500'
      case 'FAILED':
        return 'bg-red-500'
      case 'DEFERRED':
        return 'bg-yellow-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case 'PASSED':
        return <CheckCircle className="h-4 w-4" />
      case 'FAILED':
        return <XCircle className="h-4 w-4" />
      case 'DEFERRED':
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {isEditing ? 'Update Inspection' : 'Schedule Inspection'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Record inspection results and upload photos' : 'Schedule a building inspection'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isEditing && inspection && (
              <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Inspection Type</div>
                    <div className="font-bold text-lg">{inspection.inspectionType}</div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusBadgeColor(inspection.status)}>
                      {inspection.status.replace(/_/g, ' ')}
                    </Badge>
                    {inspection.result && (
                      <Badge className={getResultBadgeColor(inspection.result)}>
                        <span className="flex items-center gap-2">
                          {getResultIcon(inspection.result)}
                          {inspection.result}
                        </span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {inspection.scheduledDate && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Scheduled Date</div>
                      <div className="text-sm">{new Date(inspection.scheduledDate).toLocaleDateString()}</div>
                    </div>
                  )}
                  {inspection.completedDate && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Completed Date</div>
                      <div className="text-sm">{new Date(inspection.completedDate).toLocaleDateString()}</div>
                    </div>
                  )}
                  {inspection.leadInspector && (
                    <div className="col-span-2">
                      <div className="text-sm font-semibold text-muted-foreground">Lead Inspector</div>
                      <div className="text-sm">{inspection.leadInspector.email}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                {/* Inspection Type */}
                <div className="space-y-2">
                  <Label htmlFor="inspectionType" className="text-sm font-semibold">
                    Inspection Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.inspectionType}
                    onValueChange={(value) => setFormData({ ...formData, inspectionType: value })}
                    disabled={loading}
                  >
                    <SelectTrigger id="inspectionType">
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonInspectionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.inspectionType === "Other" && (
                    <Input
                      placeholder="Enter custom inspection type"
                      value={formData.inspectionType !== "Other" ? formData.inspectionType : ""}
                      onChange={(e) => setFormData({ ...formData, inspectionType: e.target.value })}
                      disabled={loading}
                      className="mt-2"
                    />
                  )}
                </div>

                {/* Scheduled Date */}
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate" className="text-sm font-semibold">
                    Scheduled Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {isEditing && (
              <>
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Inspection Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as InspectionStatus })}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="PASSED">Passed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="DEFERRED">Deferred</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Result */}
                <div className="space-y-2">
                  <Label htmlFor="result" className="text-sm font-semibold">
                    Inspection Result
                  </Label>
                  <Select
                    value={formData.result}
                    onValueChange={(value) => setFormData({ ...formData, result: value as "" | "PASSED" | "FAILED" | "DEFERRED" })}
                    disabled={loading}
                  >
                    <SelectTrigger id="result">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PASSED">Passed</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="DEFERRED">Deferred</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Completed Date */}
                <div className="space-y-2">
                  <Label htmlFor="completedDate" className="text-sm font-semibold">
                    Completed Date
                  </Label>
                  <Input
                    id="completedDate"
                    type="date"
                    value={formData.completedDate}
                    onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                    disabled={loading}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-sm font-semibold">
                    Inspector Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Record inspection findings, deficiencies, or requirements..."
                    rows={6}
                    disabled={loading}
                  />
                </div>

                {/* Photo URLs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Inspection Photos</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePhotoUrlAdd}
                      disabled={loading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Photo
                    </Button>
                  </div>
                  {photoUrls.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="relative p-2 border-2 border-slate-200 rounded-lg bg-white">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="text-xs truncate flex-1">{url.split('/').pop()}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 flex-shrink-0"
                              onClick={() => removePhotoUrl(index)}
                              disabled={loading}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                      <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No photos added yet</p>
                      <p className="text-xs text-muted-foreground mt-1">Add photos of deficiencies or completed work</p>
                    </div>
                  )}
                </div>

                {inspection?.notes && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-900 mb-2">Previous Notes:</div>
                    <div className="text-sm text-blue-800">{inspection.notes}</div>
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || (!isEditing && (!formData.inspectionType || !formData.scheduledDate))}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Scheduling...'}
                </>
              ) : (
                <>{isEditing ? 'Update Inspection' : 'Schedule Inspection'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

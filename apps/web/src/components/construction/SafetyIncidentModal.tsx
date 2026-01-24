"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { constructionAPI } from "@/lib/api/construction.api"
import { Loader2, AlertCircle, Upload, X, Image as ImageIcon, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SafetyIncidentModalProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SafetyIncidentModal({ projectId, open, onOpenChange, onSuccess }: SafetyIncidentModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    incidentType: "",
    description: "",
    incidentDate: new Date().toISOString().split('T')[0],
    location: "",
    oshaReportable: false,
    correctiveActions: "",
  })

  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Common incident types
  const incidentTypes = [
    "NEAR_MISS",
    "FIRST_AID",
    "RECORDABLE",
    "LOST_TIME",
    "PROPERTY_DAMAGE",
    "ENVIRONMENTAL",
  ]

  const getIncidentTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        incidentType: "",
        description: "",
        incidentDate: new Date().toISOString().split('T')[0],
        location: "",
        oshaReportable: false,
        correctiveActions: "",
      })
      setPhotoUrls([])
      setError(null)
    }
  }, [open])

  const handlePhotoUrlAdd = () => {
    const url = prompt("Enter incident photo URL:")
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
      await constructionAPI.createSafetyIncident(projectId, {
        incidentType: formData.incidentType,
        description: formData.description,
        incidentDate: new Date(formData.incidentDate).toISOString(),
        location: formData.location || undefined,
        oshaReportable: formData.oshaReportable,
        correctiveActions: formData.correctiveActions || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      })

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to report safety incident:', err)
      setError(err instanceof Error ? err.message : 'Failed to report safety incident')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Report Safety Incident
          </DialogTitle>
          <DialogDescription>
            Document safety incidents, near misses, and corrective actions taken
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

            {/* Safety Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                All safety incidents must be reported immediately. OSHA reportable incidents require additional documentation and reporting within 24 hours.
              </AlertDescription>
            </Alert>

            {/* Incident Type */}
            <div className="space-y-2">
              <Label htmlFor="incidentType" className="text-sm font-semibold">
                Incident Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.incidentType}
                onValueChange={(value) => setFormData({ ...formData, incidentType: value })}
                disabled={loading}
              >
                <SelectTrigger id="incidentType">
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getIncidentTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                <strong>Near Miss:</strong> No injury occurred<br />
                <strong>First Aid:</strong> Minor treatment only<br />
                <strong>Recordable:</strong> Medical treatment required<br />
                <strong>Lost Time:</strong> Resulted in time away from work
              </p>
            </div>

            {/* Incident Date and Location Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incidentDate" className="text-sm font-semibold">
                  Incident Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="incidentDate"
                  type="date"
                  value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-semibold">
                  Location on Site
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., 2nd Floor East Wing"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-semibold">
                Incident Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Provide detailed description of what happened, who was involved, and any injuries sustained..."
                rows={6}
                required
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Include: What happened, who was involved, equipment/materials involved, injuries sustained
              </p>
            </div>

            {/* OSHA Reportable Checkbox */}
            <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-red-200 bg-red-50">
              <Checkbox
                id="oshaReportable"
                checked={formData.oshaReportable}
                onCheckedChange={(checked) => setFormData({ ...formData, oshaReportable: checked as boolean })}
                disabled={loading}
              />
              <div className="space-y-1">
                <Label
                  htmlFor="oshaReportable"
                  className="text-sm font-semibold cursor-pointer"
                >
                  OSHA Reportable Incident
                </Label>
                <p className="text-xs text-muted-foreground">
                  Check if incident resulted in: Death, days away from work, restricted work activity, medical treatment beyond first aid, loss of consciousness, or significant injury/illness diagnosed by healthcare professional.
                </p>
              </div>
            </div>

            {/* Corrective Actions */}
            <div className="space-y-2">
              <Label htmlFor="correctiveActions" className="text-sm font-semibold">
                Immediate Corrective Actions Taken
              </Label>
              <Textarea
                id="correctiveActions"
                value={formData.correctiveActions}
                onChange={(e) => setFormData({ ...formData, correctiveActions: e.target.value })}
                placeholder="Document what actions were taken immediately following the incident to prevent recurrence..."
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Include: Hazard mitigation, safety measures implemented, equipment taken out of service, training provided
              </p>
            </div>

            {/* Photo Evidence */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Photo Evidence</Label>
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
                  <p className="text-xs text-muted-foreground mt-1">Add photos of the incident scene, hazards, or injuries</p>
                </div>
              )}
            </div>
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
              disabled={loading || !formData.incidentType || !formData.description}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reporting...
                </>
              ) : (
                'Report Incident'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

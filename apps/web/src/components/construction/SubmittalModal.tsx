"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructionAPI, type Submittal, type SubmittalStatus } from "@/lib/api/construction.api"
import { Loader2, AlertCircle, Upload, X, FileText, CheckCircle, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface SubmittalModalProps {
  projectId: string
  submittal?: Submittal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SubmittalModal({ projectId, submittal, open, onOpenChange, onSuccess }: SubmittalModalProps) {
  const isEditing = !!submittal

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specSection: "",
    status: "DRAFT" as SubmittalStatus,
    reviewerNotes: "",
  })

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when submittal changes or modal opens
  useEffect(() => {
    if (submittal) {
      setFormData({
        name: submittal.name,
        description: submittal.description || "",
        specSection: submittal.specSection || "",
        status: submittal.status,
        reviewerNotes: submittal.reviewerNotes || "",
      })
      setAttachmentUrls(submittal.attachmentUrls || [])
    } else {
      setFormData({
        name: "",
        description: "",
        specSection: "",
        status: "DRAFT",
        reviewerNotes: "",
      })
      setAttachmentUrls([])
    }
    setError(null)
  }, [submittal, open])

  const handleAttachmentAdd = () => {
    const url = prompt("Enter shop drawing or data sheet URL:")
    if (url) {
      setAttachmentUrls([...attachmentUrls, url])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachmentUrls(attachmentUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isEditing && submittal) {
        // Update existing submittal (status and reviewer notes)
        await constructionAPI.updateSubmittal(submittal.id, {
          status: formData.status,
          reviewerNotes: formData.reviewerNotes || undefined,
        })
      } else {
        // Create new submittal
        await constructionAPI.createSubmittal(projectId, {
          name: formData.name,
          description: formData.description || undefined,
          specSection: formData.specSection || undefined,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save submittal:', err)
      setError(err instanceof Error ? err.message : 'Failed to save submittal')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: SubmittalStatus) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500'
      case 'REJECTED':
        return 'bg-red-500'
      case 'UNDER_REVIEW':
        return 'bg-blue-500'
      case 'SUBMITTED':
        return 'bg-yellow-500'
      case 'REVISED':
        return 'bg-orange-500'
      default:
        return 'bg-slate-400'
    }
  }

  const getStatusIcon = (status: SubmittalStatus) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4" />
      case 'UNDER_REVIEW':
      case 'SUBMITTED':
        return <Clock className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {isEditing ? `Submittal ${submittal?.submittalNumber}` : 'Create New Submittal'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Review and approve shop drawings and product data' : 'Submit shop drawings, product data sheets, or samples for review'}
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

            {isEditing && submittal && (
              <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Submittal Number</div>
                    <div className="font-bold text-lg">{submittal.submittalNumber}</div>
                  </div>
                  <Badge className={getStatusBadgeColor(submittal.status)}>
                    <span className="flex items-center gap-2">
                      {getStatusIcon(submittal.status)}
                      {submittal.status.replace(/_/g, ' ')}
                    </span>
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground">Name</div>
                    <div className="font-medium">{submittal.name}</div>
                  </div>
                  {submittal.description && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Description</div>
                      <div className="text-sm">{submittal.description}</div>
                    </div>
                  )}
                  {submittal.specSection && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Specification Section</div>
                      <div className="text-sm font-mono">{submittal.specSection}</div>
                    </div>
                  )}
                  {submittal.submittedAt && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Submitted</div>
                      <div className="text-sm">{new Date(submittal.submittedAt).toLocaleString()}</div>
                    </div>
                  )}
                  {submittal.reviewedAt && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Reviewed</div>
                      <div className="text-sm">{new Date(submittal.reviewedAt).toLocaleString()}</div>
                    </div>
                  )}
                  {submittal.attachmentUrls && submittal.attachmentUrls.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2">Attachments</div>
                      <div className="space-y-1">
                        {submittal.attachmentUrls.map((url, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm p-2 bg-white rounded border">
                            <FileText className="h-3 w-3 text-slate-400" />
                            <span className="truncate">{url.split('/').pop()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    Submittal Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., HVAC Equipment Schedule"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of what is being submitted..."
                    rows={4}
                    disabled={loading}
                  />
                </div>

                {/* Spec Section */}
                <div className="space-y-2">
                  <Label htmlFor="specSection" className="text-sm font-semibold">
                    Specification Section
                  </Label>
                  <Input
                    id="specSection"
                    value={formData.specSection}
                    onChange={(e) => setFormData({ ...formData, specSection: e.target.value })}
                    placeholder="e.g., 23 05 00 - Common Work Results for HVAC"
                    disabled={loading}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Shop Drawings / Data Sheets</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAttachmentAdd}
                      disabled={loading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Document
                    </Button>
                  </div>
                  {attachmentUrls.length > 0 ? (
                    <div className="space-y-2">
                      {attachmentUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 border-2 border-slate-200 rounded-lg bg-white">
                          <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span className="text-sm truncate flex-1">{url.split('/').pop()}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0"
                            onClick={() => removeAttachment(index)}
                            disabled={loading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg">
                      <FileText className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No documents attached</p>
                      <p className="text-xs text-muted-foreground mt-1">Add shop drawings or product data sheets</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {isEditing && (
              <>
                {/* Status */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="text-sm font-semibold">
                    Review Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as SubmittalStatus })}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRAFT">Draft</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="REVISED">Revised - Resubmit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reviewer Notes */}
                <div className="space-y-2">
                  <Label htmlFor="reviewerNotes" className="text-sm font-semibold">
                    Reviewer Notes
                  </Label>
                  <Textarea
                    id="reviewerNotes"
                    value={formData.reviewerNotes}
                    onChange={(e) => setFormData({ ...formData, reviewerNotes: e.target.value })}
                    placeholder="Add review comments, required revisions, or approval notes..."
                    rows={6}
                    disabled={loading}
                  />
                </div>

                {submittal?.reviewerNotes && (
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-900 mb-2">Previous Review Notes:</div>
                    <div className="text-sm text-blue-800">{submittal.reviewerNotes}</div>
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
              disabled={loading || (!isEditing && !formData.name)}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditing ? 'Update Review' : 'Submit for Review'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

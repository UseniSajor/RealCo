"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructionAPI, type RFI, type RfiStatus } from "@/lib/api/construction.api"
import { Loader2, AlertCircle, Upload, X, FileText } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface RFIModalProps {
  projectId: string
  rfi?: RFI | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RFIModal({ projectId, rfi, open, onOpenChange, onSuccess }: RFIModalProps) {
  const isEditing = !!rfi

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    dueDate: "",
    status: "OPEN" as RfiStatus,
    response: "",
  })

  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when RFI changes or modal opens
  useEffect(() => {
    if (rfi) {
      setFormData({
        subject: rfi.subject,
        description: rfi.description,
        dueDate: rfi.dueDate ? rfi.dueDate.split('T')[0] : "",
        status: rfi.status,
        response: rfi.response || "",
      })
      setAttachmentUrls(rfi.attachmentUrls || [])
    } else {
      setFormData({
        subject: "",
        description: "",
        dueDate: "",
        status: "OPEN",
        response: "",
      })
      setAttachmentUrls([])
    }
    setError(null)
  }, [rfi, open])

  const handleAttachmentAdd = () => {
    const url = prompt("Enter attachment URL (drawing, specification, etc.):")
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
      if (isEditing && rfi) {
        // Update existing RFI (status and response only)
        await constructionAPI.updateRFI(rfi.id, {
          status: formData.status,
          response: formData.response || undefined,
        })
      } else {
        // Create new RFI
        await constructionAPI.createRFI(projectId, {
          subject: formData.subject,
          description: formData.description,
          dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
          attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save RFI:', err)
      setError(err instanceof Error ? err.message : 'Failed to save RFI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {isEditing ? `RFI ${rfi?.rfiNumber}` : 'Create New RFI'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update RFI status and provide response' : 'Request for Information - Submit questions or clarifications'}
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

            {isEditing && rfi && (
              <div className="p-4 rounded-lg bg-slate-50 border-2 border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">RFI Number</div>
                    <div className="font-bold text-lg">{rfi.rfiNumber}</div>
                  </div>
                  <Badge className={
                    rfi.status === 'CLOSED' ? 'bg-green-500' :
                    rfi.status === 'ANSWERED' ? 'bg-blue-500' :
                    rfi.status === 'PENDING_RESPONSE' ? 'bg-yellow-500' :
                    'bg-slate-500'
                  }>
                    {rfi.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground">Subject</div>
                    <div className="font-medium">{rfi.subject}</div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-muted-foreground">Description</div>
                    <div className="text-sm">{rfi.description}</div>
                  </div>
                  {rfi.dueDate && (
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground">Due Date</div>
                      <div className="text-sm">{new Date(rfi.dueDate).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isEditing && (
              <>
                {/* Subject */}
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-sm font-semibold">
                    Subject <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Clarification on HVAC duct routing"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed description of the question or clarification needed..."
                    rows={6}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate" className="text-sm font-semibold">
                    Response Needed By
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    disabled={loading}
                  />
                </div>

                {/* Attachments */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Attachments</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAttachmentAdd}
                      disabled={loading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Attachment
                    </Button>
                  </div>
                  {attachmentUrls.length > 0 ? (
                    <div className="space-y-2">
                      {attachmentUrls.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 border-2 border-slate-200 rounded-lg">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="text-sm truncate flex-1">{url.split('/').pop()}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeAttachment(index)}
                            disabled={loading}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-lg">
                      <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No attachments added</p>
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
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as RfiStatus })}
                    disabled={loading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="PENDING_RESPONSE">Pending Response</SelectItem>
                      <SelectItem value="ANSWERED">Answered</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Response */}
                <div className="space-y-2">
                  <Label htmlFor="response" className="text-sm font-semibold">
                    Response
                  </Label>
                  <Textarea
                    id="response"
                    value={formData.response}
                    onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                    placeholder="Provide response to the RFI..."
                    rows={6}
                    disabled={loading}
                  />
                </div>

                {rfi?.respondedAt && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="text-sm text-blue-900">
                      <strong>Previous Response:</strong> Responded on {new Date(rfi.respondedAt).toLocaleString()}
                      {rfi.respondedBy && ` by ${rfi.respondedBy.email}`}
                    </div>
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
              disabled={loading || (!isEditing && !formData.subject)}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{isEditing ? 'Update RFI' : 'Submit RFI'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

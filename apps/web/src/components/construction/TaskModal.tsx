"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructionAPI, type Task, type TaskStatus, type TaskPriority } from "@/lib/api/construction.api"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TaskModalProps {
  projectId: string
  task?: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TaskModal({ projectId, task, open, onOpenChange, onSuccess }: TaskModalProps) {
  const isEditing = !!task

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "NOT_STARTED" as TaskStatus,
    priority: "MEDIUM" as TaskPriority,
    percentComplete: 0,
    plannedStartDate: "",
    plannedEndDate: "",
    durationDays: "",
    budgetAmount: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        percentComplete: task.percentComplete,
        plannedStartDate: task.plannedStartDate ? task.plannedStartDate.split('T')[0] : "",
        plannedEndDate: task.plannedEndDate ? task.plannedEndDate.split('T')[0] : "",
        durationDays: task.durationDays?.toString() || "",
        budgetAmount: task.budgetAmount?.toString() || "",
      })
    } else {
      setFormData({
        title: "",
        description: "",
        status: "NOT_STARTED",
        priority: "MEDIUM",
        percentComplete: 0,
        plannedStartDate: "",
        plannedEndDate: "",
        durationDays: "",
        budgetAmount: "",
      })
    }
    setError(null)
  }, [task, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status,
        priority: formData.priority,
        percentComplete: formData.percentComplete,
        plannedStartDate: formData.plannedStartDate ? new Date(formData.plannedStartDate).toISOString() : undefined,
        plannedEndDate: formData.plannedEndDate ? new Date(formData.plannedEndDate).toISOString() : undefined,
        durationDays: formData.durationDays ? parseInt(formData.durationDays) : undefined,
        budgetAmount: formData.budgetAmount ? parseFloat(formData.budgetAmount) : undefined,
      }

      if (isEditing && task) {
        await constructionAPI.updateTask(task.id, payload)
      } else {
        await constructionAPI.createTask(projectId, payload)
      }

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to save task:', err)
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update task details and progress' : 'Add a new task to the construction project'}
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

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Task Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Install HVAC rough-in on 2nd floor"
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
                placeholder="Detailed task description..."
                rows={4}
                disabled={loading}
              />
            </div>

            {/* Status and Priority Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as TaskStatus })}
                  disabled={loading}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="ON_HOLD">On Hold</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-semibold">
                  Priority
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value as TaskPriority })}
                  disabled={loading}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Percent Complete */}
            {isEditing && (
              <div className="space-y-2">
                <Label htmlFor="percentComplete" className="text-sm font-semibold">
                  Percent Complete: {formData.percentComplete}%
                </Label>
                <input
                  type="range"
                  id="percentComplete"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.percentComplete}
                  onChange={(e) => setFormData({ ...formData, percentComplete: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  disabled={loading}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            )}

            {/* Dates Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plannedStartDate" className="text-sm font-semibold">
                  Planned Start Date
                </Label>
                <Input
                  id="plannedStartDate"
                  type="date"
                  value={formData.plannedStartDate}
                  onChange={(e) => setFormData({ ...formData, plannedStartDate: e.target.value })}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="plannedEndDate" className="text-sm font-semibold">
                  Planned End Date
                </Label>
                <Input
                  id="plannedEndDate"
                  type="date"
                  value={formData.plannedEndDate}
                  onChange={(e) => setFormData({ ...formData, plannedEndDate: e.target.value })}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Duration and Budget Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="durationDays" className="text-sm font-semibold">
                  Duration (days)
                </Label>
                <Input
                  id="durationDays"
                  type="number"
                  min="1"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="e.g., 7"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetAmount" className="text-sm font-semibold">
                  Budget ($)
                </Label>
                <Input
                  id="budgetAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budgetAmount}
                  onChange={(e) => setFormData({ ...formData, budgetAmount: e.target.value })}
                  placeholder="e.g., 15000"
                  disabled={loading}
                />
              </div>
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
              disabled={loading || !formData.title}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{isEditing ? 'Update Task' : 'Create Task'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

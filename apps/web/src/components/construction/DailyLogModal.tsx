"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { constructionAPI, type WeatherCondition } from "@/lib/api/construction.api"
import { Loader2, AlertCircle, Upload, X, Image as ImageIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DailyLogModalProps {
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DailyLogModal({ projectId, open, onOpenChange, onSuccess }: DailyLogModalProps) {
  // Form state
  const [formData, setFormData] = useState({
    logDate: new Date().toISOString().split('T')[0],
    weather: "" as WeatherCondition | "",
    temperature: "",
    workCompleted: "",
    materialsDelivered: "",
    equipmentUsed: "",
    issuesDelays: "",
    visitorLog: "",
    safetyObservations: "",
  })

  const [laborCrew, setLaborCrew] = useState<{ trade: string; count: string }[]>([
    { trade: "", count: "" }
  ])

  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        logDate: new Date().toISOString().split('T')[0],
        weather: "",
        temperature: "",
        workCompleted: "",
        materialsDelivered: "",
        equipmentUsed: "",
        issuesDelays: "",
        visitorLog: "",
        safetyObservations: "",
      })
      setLaborCrew([{ trade: "", count: "" }])
      setPhotoUrls([])
      setError(null)
    }
  }, [open])

  const addLaborRow = () => {
    setLaborCrew([...laborCrew, { trade: "", count: "" }])
  }

  const removeLaborRow = (index: number) => {
    setLaborCrew(laborCrew.filter((_, i) => i !== index))
  }

  const updateLaborRow = (index: number, field: 'trade' | 'count', value: string) => {
    const updated = [...laborCrew]
    updated[index][field] = value
    setLaborCrew(updated)
  }

  const handlePhotoUrlAdd = () => {
    const url = prompt("Enter photo URL (S3 or image hosting URL):")
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
      // Build labor count JSON
      const laborCount = laborCrew
        .filter(crew => crew.trade && crew.count)
        .map(crew => ({
          trade: crew.trade,
          count: parseInt(crew.count)
        }))

      // Build equipment array
      const equipmentArray = formData.equipmentUsed
        .split(',')
        .map(e => e.trim())
        .filter(e => e.length > 0)

      const payload = {
        logDate: new Date(formData.logDate).toISOString(),
        weather: formData.weather || undefined,
        temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
        laborCount: laborCount.length > 0 ? laborCount : undefined,
        equipmentUsed: equipmentArray.length > 0 ? equipmentArray : undefined,
        materialsDelivered: formData.materialsDelivered || undefined,
        workCompleted: formData.workCompleted || undefined,
        issuesDelays: formData.issuesDelays || undefined,
        visitorLog: formData.visitorLog || undefined,
        safetyObservations: formData.safetyObservations || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
      }

      await constructionAPI.createDailyLog(projectId, payload)

      onSuccess()
      onOpenChange(false)
    } catch (err) {
      console.error('Failed to create daily log:', err)
      setError(err instanceof Error ? err.message : 'Failed to create daily log')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">
            Create Daily Log
          </DialogTitle>
          <DialogDescription>
            Document daily construction progress, labor, and site conditions
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

            {/* Date and Weather Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="logDate" className="text-sm font-semibold">
                  Log Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="logDate"
                  type="date"
                  value={formData.logDate}
                  onChange={(e) => setFormData({ ...formData, logDate: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weather" className="text-sm font-semibold">
                  Weather
                </Label>
                <Select
                  value={formData.weather}
                  onValueChange={(value) => setFormData({ ...formData, weather: value as WeatherCondition })}
                  disabled={loading}
                >
                  <SelectTrigger id="weather">
                    <SelectValue placeholder="Select weather" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLEAR">Clear</SelectItem>
                    <SelectItem value="CLOUDY">Cloudy</SelectItem>
                    <SelectItem value="RAIN">Rain</SelectItem>
                    <SelectItem value="SNOW">Snow</SelectItem>
                    <SelectItem value="WIND">Windy</SelectItem>
                    <SelectItem value="EXTREME_HEAT">Extreme Heat</SelectItem>
                    <SelectItem value="EXTREME_COLD">Extreme Cold</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature" className="text-sm font-semibold">
                  Temperature (°F)
                </Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="e.g., 72"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Labor Crew */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Labor Crew</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLaborRow}
                  disabled={loading}
                >
                  + Add Trade
                </Button>
              </div>
              <div className="space-y-2">
                {laborCrew.map((crew, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Trade (e.g., Carpenter)"
                      value={crew.trade}
                      onChange={(e) => updateLaborRow(index, 'trade', e.target.value)}
                      disabled={loading}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="1"
                      placeholder="Count"
                      value={crew.count}
                      onChange={(e) => updateLaborRow(index, 'count', e.target.value)}
                      disabled={loading}
                      className="w-24"
                    />
                    {laborCrew.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLaborRow(index)}
                        disabled={loading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Used */}
            <div className="space-y-2">
              <Label htmlFor="equipmentUsed" className="text-sm font-semibold">
                Equipment Used
              </Label>
              <Input
                id="equipmentUsed"
                value={formData.equipmentUsed}
                onChange={(e) => setFormData({ ...formData, equipmentUsed: e.target.value })}
                placeholder="Comma-separated: Crane, Excavator, Forklift"
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">Separate multiple items with commas</p>
            </div>

            {/* Work Completed */}
            <div className="space-y-2">
              <Label htmlFor="workCompleted" className="text-sm font-semibold">
                Work Completed Today
              </Label>
              <Textarea
                id="workCompleted"
                value={formData.workCompleted}
                onChange={(e) => setFormData({ ...formData, workCompleted: e.target.value })}
                placeholder="Describe the work completed during this shift..."
                rows={3}
                disabled={loading}
              />
            </div>

            {/* Materials Delivered */}
            <div className="space-y-2">
              <Label htmlFor="materialsDelivered" className="text-sm font-semibold">
                Materials Delivered
              </Label>
              <Textarea
                id="materialsDelivered"
                value={formData.materialsDelivered}
                onChange={(e) => setFormData({ ...formData, materialsDelivered: e.target.value })}
                placeholder="List materials received on site..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Issues and Delays */}
            <div className="space-y-2">
              <Label htmlFor="issuesDelays" className="text-sm font-semibold">
                Issues & Delays
              </Label>
              <Textarea
                id="issuesDelays"
                value={formData.issuesDelays}
                onChange={(e) => setFormData({ ...formData, issuesDelays: e.target.value })}
                placeholder="Document any issues, delays, or problems encountered..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Visitor Log */}
            <div className="space-y-2">
              <Label htmlFor="visitorLog" className="text-sm font-semibold">
                Visitor Log
              </Label>
              <Input
                id="visitorLog"
                value={formData.visitorLog}
                onChange={(e) => setFormData({ ...formData, visitorLog: e.target.value })}
                placeholder="List any site visitors (inspectors, clients, etc.)"
                disabled={loading}
              />
            </div>

            {/* Safety Observations */}
            <div className="space-y-2">
              <Label htmlFor="safetyObservations" className="text-sm font-semibold">
                Safety Observations
              </Label>
              <Textarea
                id="safetyObservations"
                value={formData.safetyObservations}
                onChange={(e) => setFormData({ ...formData, safetyObservations: e.target.value })}
                placeholder="Note any safety concerns or observations..."
                rows={2}
                disabled={loading}
              />
            </div>

            {/* Photo URLs */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Progress Photos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePhotoUrlAdd}
                  disabled={loading}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Add Photo URL
                </Button>
              </div>
              {photoUrls.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="relative p-2 border-2 border-slate-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-slate-400" />
                        <span className="text-xs truncate flex-1">{url.split('/').pop()}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
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
              disabled={loading}
              className="bg-[#E07A47] hover:bg-[#D96835]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Log...
                </>
              ) : (
                'Create Daily Log'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

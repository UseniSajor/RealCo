"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Upload, FileText, DollarSign, Calendar, AlertCircle } from "lucide-react"

interface DrawRequestProps {
  projectName?: string
  totalBudget?: number
  drawnToDate?: number
}

export function DrawRequest({ 
  projectName = "Sunset Apartments",
  totalBudget = 12000000,
  drawnToDate = 4500000
}: DrawRequestProps) {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")

  const availableToDraw = totalBudget - drawnToDate
  const percentDrawn = (drawnToDate / totalBudget) * 100

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Draw Request Submitted!\n\nProject: ${projectName}\nAmount: ${formatCurrency(parseInt(amount))}\nCategory: ${category}\nDescription: ${description}`)
    // Reset form
    setAmount("")
    setDescription("")
    setCategory("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Request Construction Draw</h2>
        <p className="text-base text-muted-foreground">
          Submit a draw request for construction expenses
        </p>
      </div>

      {/* Project Budget Overview */}
      <Card className="border-4 border-[#56CCF2]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#56CCF2]" />
            {projectName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-2xl font-black">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Drawn to Date</p>
              <p className="text-2xl font-black text-[#E07A47]">{formatCurrency(drawnToDate)}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Available</p>
              <p className="text-2xl font-black text-green-600">{formatCurrency(availableToDraw)}</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold">Budget Utilization</span>
              <span className="text-muted-foreground">{percentDrawn.toFixed(1)}% drawn</span>
            </div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E07A47]" 
                style={{ width: `${percentDrawn}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Draw Request Form */}
      <Card className="border-4 border-[#E07A47]">
        <CardHeader>
          <CardTitle>Submit Draw Request</CardTitle>
          <CardDescription>
            Provide details for your construction draw request
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Draw Category */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Draw Category <span className="text-red-500">*</span>
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                required
              >
                <option value="">Select category...</option>
                <option value="SITE_WORK">Site Work & Preparation</option>
                <option value="FOUNDATION">Foundation</option>
                <option value="FRAMING">Framing & Structure</option>
                <option value="MECHANICAL">Mechanical Systems</option>
                <option value="ELECTRICAL">Electrical</option>
                <option value="PLUMBING">Plumbing</option>
                <option value="FINISHES">Interior Finishes</option>
                <option value="LANDSCAPING">Landscaping</option>
                <option value="SOFT_COSTS">Soft Costs</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Draw Amount */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Draw Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-muted-foreground">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-3 pl-8 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-xl font-bold"
                  placeholder="0"
                  required
                  max={availableToDraw}
                />
              </div>
              {parseInt(amount) > availableToDraw && (
                <div className="mt-2 p-2 rounded bg-red-100 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-xs text-red-600">
                    Amount exceeds available budget ({formatCurrency(availableToDraw)})
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Description / Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm min-h-[100px]"
                placeholder="Describe the work completed or expenses incurred..."
                required
              />
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Supporting Documents
              </label>
              <Card className="border-2 border-dashed border-slate-300 dark:border-[#E07A47] bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="py-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">
                    Invoices, receipts, lien waivers, photos (PDF, JPG, PNG up to 10MB)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Required Documents Checklist */}
            <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-[#56CCF2]/5">
              <CardContent className="pt-6">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#56CCF2]" />
                  Required Documents
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="invoice" />
                    <label htmlFor="invoice">Contractor invoices</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="lien" />
                    <label htmlFor="lien">Conditional lien waivers</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="photos" />
                    <label htmlFor="photos">Progress photos</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="schedule" />
                    <label htmlFor="schedule">Updated schedule (if applicable)</label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                size="lg"
                disabled={!amount || !category || !description || parseInt(amount) > availableToDraw}
              >
                Submit Draw Request
                <DollarSign className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setAmount("")
                  setDescription("")
                  setCategory("")
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Draw Requests */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Recent Draw Requests</h3>
        <div className="space-y-3">
          {[
            { id: "DR-003", date: "2026-01-15", amount: 450000, category: "Foundation", status: "Approved" },
            { id: "DR-002", date: "2026-01-08", amount: 325000, category: "Site Work", status: "Paid" },
            { id: "DR-001", date: "2026-01-01", amount: 180000, category: "Soft Costs", status: "Paid" },
          ].map((draw) => (
            <Card key={draw.id} className="border-4 border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-lg">{draw.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        draw.status === "Paid" 
                          ? "bg-green-500/20 text-green-600" 
                          : "bg-[#56CCF2]/20 text-[#56CCF2]"
                      }`}>
                        {draw.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {draw.date}
                      </span>
                      <span>•</span>
                      <span>{draw.category}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#56CCF2]">
                    {formatCurrency(draw.amount)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

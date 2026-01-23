"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export function InvoiceSubmission() {
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [workDate, setWorkDate] = useState("")

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
    alert(`Invoice Submitted!\n\nInvoice #: ${invoiceNumber}\nAmount: ${formatCurrency(parseInt(amount))}\nWork Date: ${workDate}\nDescription: ${description}`)
    // Reset form
    setInvoiceNumber("")
    setAmount("")
    setDescription("")
    setWorkDate("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Submit Invoice</h2>
        <p className="text-base text-muted-foreground">
          Submit invoices for work completed and track payment status
        </p>
      </div>

      {/* Submit Invoice Form */}
      <Card className="border-4 border-[#E07A47]">
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>
            Fill out the invoice details and upload supporting documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Invoice Number */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Invoice Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                  placeholder="INV-2026-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Work Completion Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={workDate}
                  onChange={(e) => setWorkDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            {/* Project Selection */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Project <span className="text-red-500">*</span>
              </label>
              <select 
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                required
              >
                <option value="">Select project...</option>
                <option value="sunset">Sunset Apartments - Foundation Work</option>
                <option value="marina">Marina Bay - Electrical</option>
                <option value="downtown">Downtown Office - HVAC Install</option>
              </select>
            </div>

            {/* Invoice Amount */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Invoice Amount <span className="text-red-500">*</span>
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
                />
              </div>
            </div>

            {/* Description / Line Items */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Description / Line Items <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm min-h-[120px]"
                placeholder="List all work performed, materials used, labor hours, etc."
                required
              />
            </div>

            {/* Upload Invoice & Supporting Docs */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Invoice Document & Photos <span className="text-red-500">*</span>
              </label>
              <Card className="border-2 border-dashed border-slate-300 dark:border-[#E07A47] bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="py-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-semibold mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">
                    Invoice PDF, progress photos, receipts (up to 10MB each)
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Lien Waiver */}
            <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-[#56CCF2]/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#56CCF2] mt-0.5" />
                  <div>
                    <h4 className="font-bold mb-1">Conditional Lien Waiver Required</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      A conditional lien waiver will be automatically generated for this invoice. 
                      Payment will be released upon approval and waiver execution.
                    </p>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="lien-agreement" required />
                      <label htmlFor="lien-agreement" className="text-sm">
                        I agree to execute a conditional lien waiver for this invoice amount
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                size="lg"
                disabled={!invoiceNumber || !amount || !description || !workDate}
              >
                Submit Invoice
                <FileText className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setInvoiceNumber("")
                  setAmount("")
                  setDescription("")
                  setWorkDate("")
                }}
              >
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Recent Invoices */}
      <div>
        <h3 className="text-2xl font-bold mb-4">Recent Invoices</h3>
        <div className="space-y-3">
          {[
            { 
              id: "INV-2026-003", 
              project: "Sunset Apartments",
              date: "2026-01-20", 
              amount: 45000, 
              status: "Approved",
              statusColor: "bg-green-500/20 text-green-600"
            },
            { 
              id: "INV-2026-002", 
              project: "Marina Bay",
              date: "2026-01-18", 
              amount: 32500, 
              status: "Under Review",
              statusColor: "bg-[#56CCF2]/20 text-[#56CCF2]"
            },
            { 
              id: "INV-2026-001", 
              project: "Downtown Office",
              date: "2026-01-15", 
              amount: 28750, 
              status: "Paid",
              statusColor: "bg-green-600/20 text-green-700"
            },
          ].map((invoice) => (
            <Card key={invoice.id} className="border-4 border-[#E07A47] hover:shadow-lg transition-all cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg">{invoice.id}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${invoice.statusColor}`}>
                        {invoice.status === "Paid" && <CheckCircle2 className="h-3 w-3" />}
                        {invoice.status === "Under Review" && <Clock className="h-3 w-3" />}
                        {invoice.status === "Approved" && <CheckCircle2 className="h-3 w-3" />}
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{invoice.project}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {invoice.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#56CCF2]">
                    {formatCurrency(invoice.amount)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invoiced (2026)</p>
              <p className="text-2xl font-black text-[#56CCF2]">
                {formatCurrency(106250)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Paid This Month</p>
              <p className="text-2xl font-black text-green-600">
                {formatCurrency(28750)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Payment</p>
              <p className="text-2xl font-black text-[#E07A47]">
                {formatCurrency(77500)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

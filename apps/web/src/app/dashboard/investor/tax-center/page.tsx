"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  Download,
  Calendar,
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function TaxCenterPage() {
  const [selectedYear, setSelectedYear] = useState<string>('2023')

  // Mock tax documents
  const taxDocuments = [
    {
      id: 1,
      year: 2023,
      property: "Riverside Apartments",
      documentType: "K-1",
      status: "available",
      issuedDate: "2024-01-15",
      taxableIncome: 14250,
      distributions: 18500,
      depreciation: 8750,
      fileSize: "248 KB",
    },
    {
      id: 2,
      year: 2023,
      property: "Tech Center Plaza",
      documentType: "K-1",
      status: "available",
      issuedDate: "2024-01-18",
      taxableIncome: 8920,
      distributions: 12400,
      depreciation: 5600,
      fileSize: "235 KB",
    },
    {
      id: 3,
      year: 2023,
      property: "Gateway Industrial",
      documentType: "K-1",
      status: "available",
      issuedDate: "2024-01-20",
      taxableIncome: 6750,
      distributions: 9500,
      depreciation: 4200,
      fileSize: "228 KB",
    },
    {
      id: 4,
      year: 2023,
      property: "All Properties",
      documentType: "Annual Summary",
      status: "available",
      issuedDate: "2024-01-25",
      taxableIncome: 29920,
      distributions: 40400,
      depreciation: 18550,
      fileSize: "156 KB",
    },
    {
      id: 5,
      year: 2022,
      property: "Riverside Apartments",
      documentType: "K-1",
      status: "available",
      issuedDate: "2023-01-12",
      taxableIncome: 13100,
      distributions: 16800,
      depreciation: 8200,
      fileSize: "242 KB",
    },
    {
      id: 6,
      year: 2022,
      property: "All Properties",
      documentType: "Annual Summary",
      status: "available",
      issuedDate: "2023-01-20",
      taxableIncome: 26450,
      distributions: 35600,
      depreciation: 16800,
      fileSize: "148 KB",
    },
  ]

  const filteredDocs = taxDocuments.filter(d => d.year.toString() === selectedYear)

  const taxSummary = {
    year: parseInt(selectedYear),
    totalTaxableIncome: filteredDocs.reduce((sum, d) => sum + d.taxableIncome, 0),
    totalDistributions: filteredDocs.reduce((sum, d) => sum + d.distributions, 0),
    totalDepreciation: filteredDocs.reduce((sum, d) => sum + d.depreciation, 0),
    documentsAvailable: filteredDocs.filter(d => d.status === 'available').length,
  }

  const taxDeadlines = [
    { date: "2024-04-15", description: "Federal Tax Return Deadline", status: "upcoming" },
    { date: "2024-03-15", description: "K-1 Distribution Target", status: "completed" },
    { date: "2024-10-15", description: "Extended Filing Deadline", status: "upcoming" },
  ]

  const years = ['2023', '2022', '2021']

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/investor">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Tax Center</h1>
                <p className="text-white/80">Access K-1s and tax documents</p>
              </div>
            </div>
          </div>

          {/* Tax Summary */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Taxable Income</p>
                  <p className="text-2xl font-black">${(taxSummary.totalTaxableIncome / 1000).toFixed(1)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Distributions</p>
                  <p className="text-2xl font-black">${(taxSummary.totalDistributions / 1000).toFixed(1)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Depreciation</p>
                  <p className="text-2xl font-black">${(taxSummary.totalDepreciation / 1000).toFixed(1)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Documents</p>
                  <p className="text-3xl font-black">{taxSummary.documentsAvailable}</p>
                </div>
                <FileText className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Year Filter */}
        <div className="flex items-center gap-4 mb-6">
          <p className="text-sm font-semibold">Tax Year:</p>
          <div className="flex gap-2">
            {years.map((year) => (
              <Button
                key={year}
                variant={selectedYear === year ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(year)}
                className={selectedYear === year ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>

        {/* Tax Documents */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mb-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Tax Documents - {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <FileText className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold dark:text-white">{doc.property}</h4>
                          <Badge className="bg-[#56CCF2] text-white">{doc.documentType}</Badge>
                          {doc.status === 'available' ? (
                            <Badge className="bg-green-500 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500 text-white">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground dark:text-white/70 text-xs mb-1">Taxable Income</p>
                            <p className="font-bold dark:text-white">${doc.taxableIncome.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground dark:text-white/70 text-xs mb-1">Distributions</p>
                            <p className="font-bold text-green-600">${doc.distributions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground dark:text-white/70 text-xs mb-1">Depreciation</p>
                            <p className="font-bold text-blue-600">${doc.depreciation.toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground dark:text-white/70">
                          <span>Issued: {new Date(doc.issuedDate).toLocaleDateString()}</span>
                          <span>Size: {doc.fileSize}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" className="border-2 border-[#E07A47]">
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Deadlines */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280]">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Important Tax Deadlines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {taxDeadlines.map((deadline, index) => (
                <div key={index} className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-[#56CCF2]" />
                      <div>
                        <p className="font-bold dark:text-white">{deadline.description}</p>
                        <p className="text-sm text-muted-foreground dark:text-white/70">
                          {new Date(deadline.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge className={deadline.status === 'completed' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'}>
                      {deadline.status === 'completed' ? 'Completed' : 'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tax Resources */}
        <Card className="border-4 border-[#E07A47] dark:bg-[#6b7280] mt-6">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Tax Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47] hover:bg-muted/50">
                <Link href="/dashboard/investor/tax-center/guide">
                  <FileText className="h-6 w-6 text-[#56CCF2] mb-2" />
                  <span className="font-bold text-left dark:text-white">K-1 Guide</span>
                  <span className="text-xs text-muted-foreground dark:text-white/70 text-left mt-1">
                    Understanding your K-1
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47] hover:bg-muted/50">
                <Link href="/dashboard/investor/tax-center/faq">
                  <AlertCircle className="h-6 w-6 text-[#56CCF2] mb-2" />
                  <span className="font-bold text-left dark:text-white">Tax FAQ</span>
                  <span className="text-xs text-muted-foreground dark:text-white/70 text-left mt-1">
                    Common questions
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47] hover:bg-muted/50">
                <Link href="/dashboard/investor/tax-center/cpa-finder">
                  <FileText className="h-6 w-6 text-[#56CCF2] mb-2" />
                  <span className="font-bold text-left dark:text-white">Find a CPA</span>
                  <span className="text-xs text-muted-foreground dark:text-white/70 text-left mt-1">
                    CPA directory
                  </span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  Calendar,
  Users,
  ArrowLeft,
  Plus,
  Download,
  Send,
  Eye,
  CheckCircle2,
} from "lucide-react"

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'quarterly' | 'annual'>('all')

  // Mock investor reports
  const reports = [
    {
      id: 1,
      offering: "Riverside Apartments Fund",
      reportType: "Quarterly",
      period: "Q4 2023",
      quarterEnd: "2023-12-31",
      distributionDate: "2024-01-15",
      investorCount: 24,
      status: "sent",
      sentDate: "2024-01-10",
      openRate: 95.8,
      performance: {
        periodReturn: 3.2,
        inceptionIRR: 14.2,
        occupancy: 98.2,
        noi: 204724,
      },
      highlights: [
        "Strong occupancy maintained at 98.2%",
        "Completed roof replacement under budget",
        "Distributed $425K to investors",
      ],
    },
    {
      id: 2,
      offering: "Downtown Lofts Fund",
      reportType: "Quarterly",
      period: "Q4 2023",
      quarterEnd: "2023-12-31",
      distributionDate: "2024-01-20",
      investorCount: 18,
      status: "draft",
      sentDate: null,
      openRate: 0,
      performance: {
        periodReturn: 2.8,
        inceptionIRR: 11.8,
        occupancy: 97.5,
        noi: 133915,
      },
      highlights: [
        "Leased 2 units above market rate",
        "HVAC upgrades completed",
        "Upcoming distribution: $312K",
      ],
    },
    {
      id: 3,
      offering: "Parkside Townhomes Fund",
      reportType: "Annual",
      period: "Year 2023",
      quarterEnd: "2023-12-31",
      distributionDate: "2024-02-01",
      investorCount: 12,
      status: "draft",
      sentDate: null,
      openRate: 0,
      performance: {
        periodReturn: 10.5,
        inceptionIRR: 10.5,
        occupancy: 95.8,
        noi: 87036,
      },
      highlights: [
        "Successful value-add renovations",
        "Increased market rents by 8%",
        "Strong tenant retention at 85%",
      ],
    },
    {
      id: 4,
      offering: "Riverside Apartments Fund",
      reportType: "Quarterly",
      period: "Q3 2023",
      quarterEnd: "2023-09-30",
      distributionDate: "2023-10-15",
      investorCount: 24,
      status: "sent",
      sentDate: "2023-10-10",
      openRate: 91.7,
      performance: {
        periodReturn: 3.1,
        inceptionIRR: 14.0,
        occupancy: 97.8,
        noi: 198450,
      },
      highlights: [
        "Maintained high occupancy",
        "Installed EV charging stations",
        "Distributed $398K to investors",
      ],
    },
  ]

  const filteredReports = reports.filter(r => 
    typeFilter === 'all' || r.reportType.toLowerCase() === typeFilter
  )

  const metrics = {
    totalReports: reports.length,
    pendingReports: reports.filter(r => r.status === 'draft').length,
    sentReports: reports.filter(r => r.status === 'sent').length,
    avgOpenRate: reports.filter(r => r.status === 'sent').reduce((sum, r) => sum + r.openRate, 0) / reports.filter(r => r.status === 'sent').length,
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Investor Reports</h1>
                <p className="text-white/80">Generate and distribute quarterly and annual reports</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/fund-manager/reports/new">
                <Plus className="h-4 w-4 mr-2" />
                New Report
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Reports</p>
                  <p className="text-3xl font-black">{metrics.totalReports}</p>
                </div>
                <FileText className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Pending</p>
                  <p className="text-3xl font-black">{metrics.pendingReports}</p>
                </div>
                <Calendar className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Sent</p>
                  <p className="text-3xl font-black">{metrics.sentReports}</p>
                </div>
                <Send className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Open Rate</p>
                  <p className="text-3xl font-black">{metrics.avgOpenRate.toFixed(1)}%</p>
                </div>
                <Eye className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'quarterly', 'annual'] as const).map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className={typeFilter === type ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {type === 'all' ? 'All Reports' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Report Info */}
                  <div className="lg:col-span-4">
                    <div className="mb-4">
                      <h3 className="text-2xl font-black mb-2 dark:text-white">{report.offering}</h3>
                      <div className="flex gap-2 mb-3">
                        <Badge className="bg-[#56CCF2] text-white">
                          {report.reportType} Report
                        </Badge>
                        <Badge className={`${report.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {report.status.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-lg font-bold text-[#E07A47] mb-2">{report.period}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Period End:</span>
                        <span className="font-bold dark:text-white">{new Date(report.quarterEnd).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Investors:</span>
                        <span className="font-bold dark:text-white">{report.investorCount}</span>
                      </div>
                      {report.sentDate && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-white/70">Sent Date:</span>
                            <span className="font-bold text-green-600">{new Date(report.sentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-white/70">Open Rate:</span>
                            <span className="font-bold text-blue-600">{report.openRate}%</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Period Return</p>
                      <p className="text-2xl font-black text-[#56CCF2]">{report.performance.periodReturn}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Inception IRR</p>
                      <p className="text-2xl font-black text-green-600">{report.performance.inceptionIRR}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Occupancy</p>
                      <p className="text-2xl font-black dark:text-white">{report.performance.occupancy}%</p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Period NOI</p>
                      <p className="text-xl font-black text-[#E07A47]">${(report.performance.noi / 1000).toFixed(0)}K</p>
                    </div>

                    <div className="col-span-2 bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                      <p className="text-xs font-bold text-muted-foreground dark:text-white/70 mb-2">Report Highlights:</p>
                      <ul className="space-y-1">
                        {report.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-xs dark:text-white">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-4 flex flex-col justify-between">
                    {report.status === 'draft' && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                          📝 Draft report ready for review
                        </p>
                      </div>
                    )}

                    {report.status === 'sent' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <p className="text-xs font-semibold text-green-800 dark:text-green-200">
                            Sent to {report.investorCount} investors
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3 text-blue-600" />
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            {Math.round((report.openRate / 100) * report.investorCount)} opened ({report.openRate}%)
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/fund-manager/reports/${report.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Report
                        </Link>
                      </Button>

                      <Button variant="outline" className="w-full border-2 border-slate-300 dark:border-slate-600">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>

                      {report.status === 'draft' && (
                        <>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/fund-manager/reports/${report.id}/edit`}>
                              Edit Report
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                            <Link href={`/dashboard/fund-manager/reports/${report.id}/send`}>
                              <Send className="h-4 w-4 mr-2" />
                              Send to Investors
                            </Link>
                          </Button>
                        </>
                      )}

                      {report.status === 'sent' && (
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/reports/${report.id}/analytics`}>
                            View Analytics
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Template Info */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mt-8">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Quarterly Report Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Performance Summary</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Period & inception returns</li>
                  <li>• Occupancy trends</li>
                  <li>• NOI performance</li>
                  <li>• Capital account summary</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Property Updates</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Leasing activity</li>
                  <li>• Capital improvements</li>
                  <li>• Maintenance highlights</li>
                  <li>• Market commentary</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 dark:text-white">Financial Details</h4>
                <ul className="text-sm text-muted-foreground dark:text-white/70 space-y-1">
                  <li>• Operating statement</li>
                  <li>• Distribution details</li>
                  <li>• Budget variance analysis</li>
                  <li>• Next quarter outlook</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

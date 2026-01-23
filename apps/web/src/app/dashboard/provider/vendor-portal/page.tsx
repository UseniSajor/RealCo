"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Briefcase,
  DollarSign,
  FileText,
  Star,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react"

export default function VendorPortalPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')

  // Mock vendor contracts
  const contracts = [
    {
      id: 1,
      propertyName: "Riverside Apartments",
      contractType: "HVAC Maintenance",
      status: "active",
      startDate: "2023-01-01",
      endDate: "2024-12-31",
      monthlyValue: 2850,
      ytdRevenue: 31350,
      servicesCovered: ["Quarterly inspections", "Emergency repairs", "Filter replacements"],
      nextService: "2024-02-15",
      rating: 4.8,
    },
    {
      id: 2,
      propertyName: "Downtown Lofts",
      contractType: "Landscaping Services",
      status: "active",
      startDate: "2023-03-01",
      endDate: "2024-02-29",
      monthlyValue: 1950,
      ytdRevenue: 21450,
      servicesCovered: ["Weekly lawn care", "Seasonal flowers", "Tree trimming"],
      nextService: "2024-01-29",
      rating: 4.9,
    },
    {
      id: 3,
      propertyName: "Parkside Townhomes",
      contractType: "Plumbing Services",
      status: "active",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      monthlyValue: 1200,
      ytdRevenue: 9600,
      servicesCovered: ["Emergency calls", "Preventive maintenance", "Inspections"],
      nextService: "2024-02-01",
      rating: 4.7,
    },
    {
      id: 4,
      propertyName: "Tech Center Plaza",
      contractType: "Electrical Services",
      status: "pending",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      monthlyValue: 3200,
      ytdRevenue: 0,
      servicesCovered: ["Monthly inspections", "Emergency repairs", "Lighting upgrades"],
      nextService: null,
      rating: null,
    },
  ]

  const filteredContracts = contracts.filter(c => statusFilter === 'all' || c.status === statusFilter)

  const metrics = {
    activeContracts: contracts.filter(c => c.status === 'active').length,
    ytdRevenue: contracts.reduce((sum, c) => sum + c.ytdRevenue, 0),
    avgRating: contracts.filter(c => c.rating).reduce((sum, c) => sum + (c.rating || 0), 0) / contracts.filter(c => c.rating).length,
    upcomingServices: contracts.filter(c => c.nextService).length,
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/provider">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Vendor Portal</h1>
                <p className="text-white/80">Manage contracts and service agreements</p>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Active Contracts</p>
                  <p className="text-3xl font-black">{metrics.activeContracts}</p>
                </div>
                <Briefcase className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">YTD Revenue</p>
                  <p className="text-2xl font-black">${(metrics.ytdRevenue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Rating</p>
                  <p className="text-3xl font-black">{metrics.avgRating.toFixed(1)}</p>
                </div>
                <Star className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Upcoming Services</p>
                  <p className="text-3xl font-black">{metrics.upcomingServices}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'active', 'pending', 'completed'] as const).map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="grid gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Contract Info */}
                  <div className="lg:col-span-5">
                    <div className="flex items-start gap-3 mb-4">
                      <Briefcase className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-2xl font-black mb-1 dark:text-white">{contract.propertyName}</h3>
                        <p className="text-lg font-semibold text-[#56CCF2] mb-3">{contract.contractType}</p>
                        <Badge className={`${
                          contract.status === 'active' ? 'bg-green-500' :
                          contract.status === 'pending' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        } text-white`}>
                          {contract.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Contract Period:</span>
                        <span className="font-bold dark:text-white">
                          {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Monthly Value:</span>
                        <span className="font-bold text-[#56CCF2]">${contract.monthlyValue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">YTD Revenue:</span>
                        <span className="font-bold text-green-600">${contract.ytdRevenue.toLocaleString()}</span>
                      </div>
                      {contract.rating && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Performance Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                            <span className="font-bold dark:text-white">{contract.rating}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="lg:col-span-4">
                    <h4 className="font-bold text-sm mb-3 dark:text-white">Services Covered</h4>
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <ul className="space-y-2">
                        {contract.servicesCovered.map((service, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm dark:text-white">{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {contract.nextService && (
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                              Next Scheduled Service
                            </p>
                            <p className="text-sm font-bold dark:text-white mt-1">
                              {new Date(contract.nextService).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/provider/vendor-portal/${contract.id}`}>
                          View Contract
                        </Link>
                      </Button>

                      {contract.status === 'active' && (
                        <>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/provider/work-orders?contract=${contract.id}`}>
                              View Work Orders
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full border-2 border-green-500">
                            <FileText className="h-4 w-4 mr-2" />
                            Submit Invoice
                          </Button>
                        </>
                      )}

                      {contract.status === 'pending' && (
                        <Button variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Accept Contract
                        </Button>
                      )}
                    </div>
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

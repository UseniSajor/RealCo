"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  FileText,
  Calendar,
  DollarSign,
  User,
  Home,
  ArrowLeft,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function LeasesPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring' | 'pending'>('all')

  // Mock lease data
  const leases = [
    {
      id: 1,
      property: "Riverside Apartments",
      unit: "302",
      tenantName: "Sarah Johnson",
      tenantEmail: "sarah.j@email.com",
      tenantPhone: "(512) 555-0123",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      monthlyRent: 1850,
      securityDeposit: 1850,
      status: "expiring",
      daysUntilExpiration: 45,
      renewalOffered: true,
      rentPaidOnTime: true,
      leaseViolations: 0,
    },
    {
      id: 2,
      property: "Riverside Apartments",
      unit: "405",
      tenantName: "Michael Chen",
      tenantEmail: "m.chen@email.com",
      tenantPhone: "(512) 555-0456",
      startDate: "2023-08-15",
      endDate: "2024-08-14",
      monthlyRent: 1920,
      securityDeposit: 1920,
      status: "active",
      daysUntilExpiration: 135,
      renewalOffered: false,
      rentPaidOnTime: true,
      leaseViolations: 0,
    },
    {
      id: 3,
      property: "Downtown Lofts",
      unit: "801",
      tenantName: "Emily Rodriguez",
      tenantEmail: "emily.r@email.com",
      tenantPhone: "(512) 555-0789",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      monthlyRent: 2450,
      securityDeposit: 2450,
      status: "active",
      daysUntilExpiration: 315,
      renewalOffered: false,
      rentPaidOnTime: true,
      leaseViolations: 0,
    },
    {
      id: 4,
      property: "Parkside Townhomes",
      unit: "12B",
      tenantName: "David Kim",
      tenantEmail: "d.kim@email.com",
      tenantPhone: "(214) 555-0234",
      startDate: "2023-03-15",
      endDate: "2024-03-14",
      monthlyRent: 2200,
      securityDeposit: 2200,
      status: "expiring",
      daysUntilExpiration: 15,
      renewalOffered: true,
      rentPaidOnTime: false,
      leaseViolations: 1,
    },
    {
      id: 5,
      property: "Downtown Lofts",
      unit: "304",
      tenantName: "Amanda Foster",
      tenantEmail: "a.foster@email.com",
      tenantPhone: "(512) 555-0567",
      startDate: "2024-02-01",
      endDate: "2025-01-31",
      monthlyRent: 2380,
      securityDeposit: 2380,
      status: "active",
      daysUntilExpiration: 345,
      renewalOffered: false,
      rentPaidOnTime: true,
      leaseViolations: 0,
    },
    {
      id: 6,
      property: "Riverside Apartments",
      unit: "105",
      tenantName: "James Martinez",
      tenantEmail: "j.martinez@email.com",
      tenantPhone: "(512) 555-0890",
      startDate: "2024-03-01",
      endDate: "2025-02-28",
      monthlyRent: 1795,
      securityDeposit: 1795,
      status: "pending",
      daysUntilExpiration: 0,
      renewalOffered: false,
      rentPaidOnTime: true,
      leaseViolations: 0,
    },
  ]

  const filteredLeases = leases.filter(l => statusFilter === 'all' || l.status === statusFilter)

  const metrics = {
    totalLeases: leases.length,
    activeLeases: leases.filter(l => l.status === 'active').length,
    expiringLeases: leases.filter(l => l.status === 'expiring').length,
    avgRent: Math.round(leases.reduce((sum, l) => sum + l.monthlyRent, 0) / leases.length),
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
                <h1 className="text-4xl font-black">Lease Management</h1>
                <p className="text-white/80">Track and manage all property leases</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/fund-manager/leases/new">
                <Plus className="h-4 w-4 mr-2" />
                New Lease
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Leases</p>
                  <p className="text-3xl font-black">{metrics.totalLeases}</p>
                </div>
                <FileText className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Active</p>
                  <p className="text-3xl font-black">{metrics.activeLeases}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Expiring Soon</p>
                  <p className="text-3xl font-black">{metrics.expiringLeases}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Rent</p>
                  <p className="text-2xl font-black">${metrics.avgRent}</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leases by tenant, unit, or property..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'expiring', 'pending'] as const).map((status) => (
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

        {/* Leases Grid */}
        <div className="grid gap-6">
          {filteredLeases.map((lease) => (
            <Card key={lease.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Tenant & Property Info */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-[#E07A47]" />
                          <h3 className="text-xl font-black dark:text-white">{lease.tenantName}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/70 mb-1">
                          <Home className="h-4 w-4" />
                          {lease.property} - Unit {lease.unit}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-white/70 mb-1">
                          {lease.tenantEmail}
                        </div>
                        <div className="text-sm text-muted-foreground dark:text-white/70">
                          {lease.tenantPhone}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${
                      lease.status === 'active' ? 'bg-green-500' :
                      lease.status === 'expiring' ? 'bg-yellow-500' :
                      lease.status === 'pending' ? 'bg-blue-500' :
                      'bg-gray-500'
                    } text-white`}>
                      {lease.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Lease Details */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Lease Period</p>
                      <p className="text-sm font-bold dark:text-white">
                        {new Date(lease.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground dark:text-white/70">to</p>
                      <p className="text-sm font-bold dark:text-white">
                        {new Date(lease.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Monthly Rent</p>
                      <p className="text-2xl font-black dark:text-white">${lease.monthlyRent}</p>
                      <p className="text-xs text-muted-foreground dark:text-white/70">
                        Deposit: ${lease.securityDeposit}
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Days Until Expiration</p>
                      <p className={`text-2xl font-black ${
                        lease.daysUntilExpiration <= 30 ? 'text-red-600' :
                        lease.daysUntilExpiration <= 60 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {lease.daysUntilExpiration > 0 ? lease.daysUntilExpiration : 'Pending'}
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Payment Status</p>
                      <div className="flex items-center gap-2">
                        {lease.rentPaidOnTime ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-bold text-green-600">On Time</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-sm font-bold text-red-600">Late</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Alerts */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      {lease.status === 'expiring' && lease.daysUntilExpiration <= 60 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-2">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                                Expiring in {lease.daysUntilExpiration} days
                              </p>
                              {lease.renewalOffered && (
                                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                                  Renewal offer sent
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {lease.leaseViolations > 0 && (
                        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-400 rounded-lg p-2">
                          <p className="text-xs font-semibold text-red-800 dark:text-red-200">
                            {lease.leaseViolations} lease violation(s)
                          </p>
                        </div>
                      )}

                      {lease.status === 'pending' && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 rounded-lg p-2">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                            Application pending review
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/fund-manager/leases/${lease.id}`}>
                          View Lease
                        </Link>
                      </Button>
                      
                      {lease.status === 'expiring' && (
                        <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                          <Link href={`/dashboard/fund-manager/leases/${lease.id}/renew`}>
                            Offer Renewal
                          </Link>
                        </Button>
                      )}

                      {lease.status === 'pending' && (
                        <Button asChild variant="outline" className="w-full border-2 border-green-500">
                          <Link href={`/dashboard/fund-manager/leases/${lease.id}/approve`}>
                            Approve Lease
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
      </div>
    </div>
  )
}

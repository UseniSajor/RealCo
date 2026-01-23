"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, TrendingUp, Users, CheckCircle2, Clock, AlertCircle, Send } from "lucide-react"

export function DistributionPlanning() {
  const [selectedProject, setSelectedProject] = useState<string>("1")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Mock projects
  const projects = [
    {
      id: '1',
      name: 'Sunset Apartments',
      status: 'ACTIVE',
      totalRaised: 8000000,
      totalDistributed: 450000,
      investors: 32,
      nextDistribution: '2026-03-15',
      distributionSchedule: 'Quarterly',
    },
    {
      id: '2',
      name: 'Marina Bay Development',
      status: 'ACTIVE',
      totalRaised: 8500000,
      totalDistributed: 180000,
      investors: 17,
      nextDistribution: '2026-04-01',
      distributionSchedule: 'Quarterly',
    },
  ]

  // Mock distribution history
  const distributionHistory = [
    {
      id: '1',
      projectId: '1',
      date: '2025-12-15',
      amount: 150000,
      type: 'OPERATING_INCOME',
      investors: 32,
      status: 'COMPLETED',
      perInvestorAvg: 4687.50,
    },
    {
      id: '2',
      projectId: '1',
      date: '2025-09-15',
      amount: 145000,
      type: 'OPERATING_INCOME',
      investors: 32,
      status: 'COMPLETED',
      perInvestorAvg: 4531.25,
    },
    {
      id: '3',
      projectId: '1',
      date: '2025-06-15',
      amount: 155000,
      type: 'OPERATING_INCOME',
      investors: 32,
      status: 'COMPLETED',
      perInvestorAvg: 4843.75,
    },
  ]

  // Mock upcoming distribution
  const upcomingDistribution = {
    projectId: '1',
    scheduledDate: '2026-03-15',
    estimatedAmount: 160000,
    investors: 32,
    type: 'OPERATING_INCOME',
    status: 'SCHEDULED',
  }

  // Mock waterfall structure
  const waterfallStructure = [
    {
      tier: 1,
      name: 'Return of Capital',
      priority: 'First',
      allocation: '100% to investors',
      status: 'IN_PROGRESS',
      returned: 1200000,
      remaining: 6800000,
    },
    {
      tier: 2,
      name: 'Preferred Return (8% IRR)',
      priority: 'Second',
      allocation: '100% to investors',
      status: 'PENDING',
      returned: 0,
      target: 640000,
    },
    {
      tier: 3,
      name: 'Catch-Up (Sponsor)',
      priority: 'Third',
      allocation: '100% to sponsor until 20/80 split',
      status: 'PENDING',
      returned: 0,
      target: 160000,
    },
    {
      tier: 4,
      name: 'Residual Split',
      priority: 'Fourth',
      allocation: '80% investors / 20% sponsor',
      status: 'PENDING',
      returned: 0,
    },
  ]

  const selectedProjectData = projects.find(p => p.id === selectedProject)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Distribution Planning</h2>
        <p className="text-base text-muted-foreground">
          Manage investor distributions and waterfall calculations
        </p>
      </div>

      {/* Project Selector */}
      <Card className="border-2 border-[#E07A47]">
        <CardHeader>
          <CardTitle>Select Project</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`p-4 rounded-lg border-4 text-left transition-all ${
                  selectedProject === project.id
                    ? 'border-[#56CCF2] bg-[#56CCF2]/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-[#E07A47]'
                }`}
              >
                <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    Total Raised: <span className="font-bold text-foreground">{formatCurrency(project.totalRaised)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Distributed: <span className="font-bold text-foreground">{formatCurrency(project.totalDistributed)}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Next: <span className="font-bold text-foreground">{formatDate(project.nextDistribution)}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedProjectData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-4 border-[#56CCF2]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Distributed</p>
                  <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                </div>
                <p className="text-3xl font-black text-[#56CCF2]">
                  {formatCurrency(selectedProjectData.totalDistributed)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {((selectedProjectData.totalDistributed / selectedProjectData.totalRaised) * 100).toFixed(1)}% of capital
                </p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Total Investors</p>
                  <Users className="h-5 w-5 text-[#E07A47]" />
                </div>
                <p className="text-3xl font-black text-[#E07A47]">
                  {selectedProjectData.investors}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Receiving distributions
                </p>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Schedule</p>
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-black text-green-600">
                  {selectedProjectData.distributionSchedule}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Next: {formatDate(selectedProjectData.nextDistribution)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Avg Distribution</p>
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-3xl font-black text-purple-600">
                  {formatCurrency(selectedProjectData.totalDistributed / selectedProjectData.investors)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  per investor
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Distribution */}
          <Card className="border-4 border-[#56CCF2] bg-[#56CCF2]/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#56CCF2]" />
                    Upcoming Distribution
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Scheduled for {formatDate(upcomingDistribution.scheduledDate)}
                  </CardDescription>
                </div>
                <Badge className="bg-[#56CCF2] text-white">SCHEDULED</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Amount</p>
                  <p className="text-2xl font-black text-[#56CCF2]">
                    {formatCurrency(upcomingDistribution.estimatedAmount)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                  <p className="text-sm text-muted-foreground mb-1">Recipients</p>
                  <p className="text-2xl font-black">{upcomingDistribution.investors}</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                  <p className="text-sm text-muted-foreground mb-1">Per Investor</p>
                  <p className="text-2xl font-black">
                    {formatCurrency(upcomingDistribution.estimatedAmount / upcomingDistribution.investors)}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-white dark:bg-slate-800">
                  <p className="text-sm text-muted-foreground mb-1">Type</p>
                  <p className="text-sm font-bold">{upcomingDistribution.type.replace('_', ' ')}</p>
                </div>
              </div>
              <Button className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <Send className="mr-2 h-4 w-4" />
                Execute Distribution
              </Button>
            </CardContent>
          </Card>

          {/* Waterfall Structure */}
          <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardHeader>
              <CardTitle>Waterfall Structure</CardTitle>
              <CardDescription>Distribution priority and allocation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waterfallStructure.map((tier, index) => {
                  const getStatusColor = (status: string) => {
                    switch(status) {
                      case 'IN_PROGRESS': return 'bg-[#56CCF2] text-white'
                      case 'COMPLETED': return 'bg-green-500 text-white'
                      case 'PENDING': return 'bg-slate-400 text-white'
                      default: return 'bg-slate-400 text-white'
                    }
                  }

                  return (
                    <div key={index} className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-muted/30">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E07A47] text-white flex items-center justify-center font-black">
                            {tier.tier}
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{tier.name}</h4>
                            <p className="text-sm text-muted-foreground">{tier.priority} priority</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(tier.status)}>
                          {tier.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm mb-3 text-muted-foreground">{tier.allocation}</p>
                      {tier.tier === 1 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Returned:</span>
                            <span className="font-bold">{formatCurrency(tier.returned)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Remaining:</span>
                            <span className="font-bold text-[#E07A47]">{formatCurrency(tier.remaining)}</span>
                          </div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#56CCF2]"
                              style={{ width: `${(tier.returned / (tier.returned + tier.remaining)) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {tier.target && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Target: </span>
                          <span className="font-bold">{formatCurrency(tier.target)}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Distribution History */}
          <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
            <CardHeader>
              <CardTitle>Distribution History</CardTitle>
              <CardDescription>Past distributions for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {distributionHistory.map((dist) => (
                  <div
                    key={dist.id}
                    className="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-bold">{formatDate(dist.date)}</span>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        {dist.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-lg">{formatCurrency(dist.amount)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Investors</p>
                        <p className="font-bold text-lg">{dist.investors}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Avg Per Investor</p>
                        <p className="font-bold text-lg">{formatCurrency(dist.perInvestorAvg)}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Type: {dist.type.replace('_', ' ')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

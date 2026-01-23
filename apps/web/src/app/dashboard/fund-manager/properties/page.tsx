"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Home,
  MapPin,
  Calendar,
  BarChart3,
  ArrowLeft,
  Plus,
  Search,
  Filter,
} from "lucide-react"

export default function PropertiesPage() {
  const [filter, setFilter] = useState<'all' | 'multifamily' | 'commercial' | 'industrial'>('all')
  const [sortBy, setSortBy] = useState<'noi' | 'occupancy' | 'name'>('noi')

  // Mock property data
  const properties = [
    {
      id: 1,
      name: "Riverside Apartments",
      type: "multifamily",
      address: "1234 River Rd, Austin, TX",
      units: 156,
      occupancy: 98.2,
      occupancyChange: 2.1,
      marketRent: 1850,
      currentRent: 1795,
      mtdNOI: 125000,
      ytdNOI: 845000,
      budgetVariance: 12.4,
      leaseExpirations: 8,
      maintenanceOpen: 3,
      status: "stabilized",
      acquisitionDate: "2021-03-15",
    },
    {
      id: 2,
      name: "Downtown Lofts",
      type: "multifamily",
      address: "555 Main St, Austin, TX",
      units: 84,
      occupancy: 97.5,
      occupancyChange: -1.2,
      marketRent: 2400,
      currentRent: 2350,
      mtdNOI: 98000,
      ytdNOI: 720000,
      budgetVariance: 8.3,
      leaseExpirations: 5,
      maintenanceOpen: 2,
      status: "stabilized",
      acquisitionDate: "2020-11-22",
    },
    {
      id: 3,
      name: "Parkside Townhomes",
      type: "multifamily",
      address: "789 Park Ave, Dallas, TX",
      units: 64,
      occupancy: 95.8,
      occupancyChange: 4.5,
      marketRent: 2200,
      currentRent: 2100,
      mtdNOI: 72000,
      ytdNOI: 580000,
      budgetVariance: 6.7,
      leaseExpirations: 12,
      maintenanceOpen: 5,
      status: "value-add",
      acquisitionDate: "2022-06-10",
    },
    {
      id: 4,
      name: "Tech Center Plaza",
      type: "commercial",
      address: "2000 Innovation Dr, Houston, TX",
      units: 12,
      occupancy: 91.7,
      occupancyChange: -3.5,
      marketRent: 35,
      currentRent: 32,
      mtdNOI: 145000,
      ytdNOI: 1100000,
      budgetVariance: -2.1,
      leaseExpirations: 2,
      maintenanceOpen: 1,
      status: "stabilized",
      acquisitionDate: "2019-08-30",
    },
    {
      id: 5,
      name: "Westside Storage",
      type: "industrial",
      address: "4500 Industrial Blvd, San Antonio, TX",
      units: 280,
      occupancy: 88.5,
      occupancyChange: 1.8,
      marketRent: 120,
      currentRent: 115,
      mtdNOI: 58000,
      ytdNOI: 420000,
      budgetVariance: 3.2,
      leaseExpirations: 0,
      maintenanceOpen: 1,
      status: "stabilizing",
      acquisitionDate: "2023-01-15",
    },
  ]

  const filteredProperties = properties.filter(p => filter === 'all' || p.type === filter)
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === 'noi') return b.ytdNOI - a.ytdNOI
    if (sortBy === 'occupancy') return b.occupancy - a.occupancy
    return a.name.localeCompare(b.name)
  })

  const totalMetrics = {
    properties: properties.length,
    units: properties.reduce((sum, p) => sum + p.units, 0),
    avgOccupancy: (properties.reduce((sum, p) => sum + p.occupancy, 0) / properties.length).toFixed(1),
    totalNOI: properties.reduce((sum, p) => sum + p.ytdNOI, 0),
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
                <h1 className="text-4xl font-black">Portfolio Properties</h1>
                <p className="text-white/80">Manage all assets in your portfolio</p>
              </div>
            </div>
            <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
              <Link href="/dashboard/fund-manager/properties/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </Button>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Properties</p>
                  <p className="text-3xl font-black">{totalMetrics.properties}</p>
                </div>
                <Building2 className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Units</p>
                  <p className="text-3xl font-black">{totalMetrics.units}</p>
                </div>
                <Home className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Occupancy</p>
                  <p className="text-3xl font-black">{totalMetrics.avgOccupancy}%</p>
                </div>
                <Users className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">YTD NOI</p>
                  <p className="text-2xl font-black">${(totalMetrics.totalNOI / 1000000).toFixed(2)}M</p>
                </div>
                <DollarSign className="h-10 w-10 text-white/50" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters and Search */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'multifamily', 'commercial', 'industrial'] as const).map((type) => (
              <Button
                key={type}
                variant={filter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type)}
                className={filter === type ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="border-2 border-[#E07A47]">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm font-semibold">Sort by:</span>
          {(['noi', 'occupancy', 'name'] as const).map((sort) => (
            <Button
              key={sort}
              variant={sortBy === sort ? "default" : "ghost"}
              size="sm"
              onClick={() => setSortBy(sort)}
              className={sortBy === sort ? "bg-[#E07A47] hover:bg-[#E07A47]/90" : ""}
            >
              {sort === 'noi' ? 'NOI' : sort.charAt(0).toUpperCase() + sort.slice(1)}
            </Button>
          ))}
        </div>

        {/* Properties Grid */}
        <div className="grid gap-6">
          {sortedProperties.map((property) => (
            <Card key={property.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Property Info (Left) */}
                  <div className="lg:col-span-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-black mb-2 dark:text-white">{property.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-white/70 mb-2">
                          <MapPin className="h-4 w-4" />
                          {property.address}
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-[#56CCF2] text-white">
                            {property.type.toUpperCase()}
                          </Badge>
                          <Badge className={`${
                            property.status === 'stabilized' ? 'bg-green-500' :
                            property.status === 'value-add' ? 'bg-yellow-500' :
                            'bg-blue-500'
                          } text-white`}>
                            {property.status.toUpperCase().replace('-', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Units:</span>
                        <span className="font-bold dark:text-white">{property.units}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Acquired:</span>
                        <span className="font-bold dark:text-white">{new Date(property.acquisitionDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics (Middle) */}
                  <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Occupancy</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-black dark:text-white">{property.occupancy}%</p>
                        <div className={`flex items-center text-xs ${property.occupancyChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {property.occupancyChange > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          <span className="ml-1">{Math.abs(property.occupancyChange)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">YTD NOI</p>
                      <p className="text-2xl font-black dark:text-white">${(property.ytdNOI / 1000).toFixed(0)}K</p>
                      <p className={`text-xs ${property.budgetVariance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {property.budgetVariance > 0 ? '+' : ''}{property.budgetVariance}% vs budget
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Avg Rent</p>
                      <p className="text-2xl font-black dark:text-white">${property.currentRent}</p>
                      <p className="text-xs text-muted-foreground dark:text-white/70">
                        Market: ${property.marketRent}
                      </p>
                    </div>

                    <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">MTD NOI</p>
                      <p className="text-2xl font-black dark:text-white">${(property.mtdNOI / 1000).toFixed(0)}K</p>
                    </div>
                  </div>

                  {/* Actions & Alerts (Right) */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      {property.leaseExpirations > 0 && (
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-2">
                          <p className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                            {property.leaseExpirations} leases expiring soon
                          </p>
                        </div>
                      )}
                      {property.maintenanceOpen > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 rounded-lg p-2">
                          <p className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                            {property.maintenanceOpen} open maintenance requests
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        <Link href={`/dashboard/fund-manager/properties/${property.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                        <Link href={`/dashboard/fund-manager/properties/${property.id}/analytics`}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics
                        </Link>
                      </Button>
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

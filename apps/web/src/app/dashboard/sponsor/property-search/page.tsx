"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Search,
  Filter,
  MapPin,
  Building2,
  Home,
  Warehouse,
  Store,
  TrendingUp,
  DollarSign,
  Square,
  Users,
  ArrowLeft,
  Plus,
  Heart,
  ExternalLink,
  Map,
  List,
  SlidersHorizontal,
} from "lucide-react"

export default function PropertySearchPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [propertyType, setPropertyType] = useState<'all' | 'multifamily' | 'commercial' | 'industrial' | 'retail'>('all')
  const [priceRange, setPriceRange] = useState<'all' | 'under10' | '10to25' | '25to50' | 'over50'>('all')
  const [searchQuery, setSearchQuery] = useState("")

  // Mock property search results
  const properties = [
    {
      id: 1,
      name: "Riverside Apartments",
      address: "2400 River Road, Austin, TX 78701",
      type: "multifamily",
      price: 18500000,
      units: 124,
      squareFeet: 142000,
      yearBuilt: 2018,
      occupancy: 96.8,
      capRate: 5.8,
      noi: 1073000,
      pricePerUnit: 149194,
      pricePerSF: 130.28,
      photos: 24,
      daysOnMarket: 12,
      broker: "CBRE",
      description: "Class A multifamily asset in prime Austin location. Recently renovated units, strong rent growth trajectory.",
      highlights: ["Renovated 2018", "High Occupancy", "Prime Location", "Rent Upside"],
      favorite: false,
      source: "LoopNet",
    },
    {
      id: 2,
      name: "Tech Center Business Park",
      address: "8900 Innovation Drive, Dallas, TX 75201",
      type: "commercial",
      price: 42000000,
      units: 0,
      squareFeet: 285000,
      yearBuilt: 2020,
      occupancy: 92.5,
      capRate: 6.5,
      noi: 2730000,
      pricePerUnit: 0,
      pricePerSF: 147.37,
      photos: 36,
      daysOnMarket: 8,
      broker: "JLL",
      description: "Modern office campus in Dallas tech corridor. Major tenants include Fortune 500 tech companies.",
      highlights: ["New Construction", "Tech Tenants", "Long Leases", "Parking 3:1000"],
      favorite: true,
      source: "CoStar",
    },
    {
      id: 3,
      name: "Gateway Industrial Complex",
      address: "15600 Logistics Way, Houston, TX 77040",
      type: "industrial",
      price: 28900000,
      units: 0,
      squareFeet: 425000,
      yearBuilt: 2019,
      occupancy: 100,
      capRate: 7.2,
      noi: 2080800,
      pricePerUnit: 0,
      pricePerSF: 68.00,
      photos: 18,
      daysOnMarket: 5,
      broker: "Cushman & Wakefield",
      description: "Institutional-grade logistics facility with 36' clear heights. Direct access to major highways.",
      highlights: ["100% Leased", "Amazon Tenant", "Class A", "Rail Access"],
      favorite: false,
      source: "Crexi",
    },
    {
      id: 4,
      name: "Parkside Student Housing",
      address: "1200 University Blvd, College Station, TX 77840",
      type: "multifamily",
      price: 22400000,
      units: 168,
      squareFeet: 156000,
      yearBuilt: 2017,
      occupancy: 98.2,
      capRate: 6.2,
      noi: 1388800,
      pricePerUnit: 133333,
      pricePerSF: 143.59,
      photos: 28,
      daysOnMarket: 18,
      broker: "Marcus & Millichap",
      description: "Purpose-built student housing near Texas A&M. Individual leases, strong demand.",
      highlights: ["Student Housing", "Individual Leases", "Amenity Rich", "Stable Income"],
      favorite: false,
      source: "Marcus & Millichap",
    },
    {
      id: 5,
      name: "Main Street Retail Center",
      address: "4500 Main Street, Fort Worth, TX 76102",
      type: "retail",
      price: 12800000,
      units: 0,
      squareFeet: 48000,
      yearBuilt: 2015,
      occupancy: 95.0,
      capRate: 6.8,
      noi: 870400,
      pricePerUnit: 0,
      pricePerSF: 266.67,
      photos: 22,
      daysOnMarket: 25,
      broker: "Berkadia",
      description: "Neighborhood retail center with grocery anchor. Strong demographics, stable tenant mix.",
      highlights: ["Grocery Anchor", "NNN Leases", "High Traffic", "Stable Cash Flow"],
      favorite: true,
      source: "LoopNet",
    },
    {
      id: 6,
      name: "Sunset Self Storage",
      address: "7800 West Avenue, San Antonio, TX 78201",
      type: "industrial",
      price: 8900000,
      units: 0,
      squareFeet: 72000,
      yearBuilt: 2016,
      occupancy: 91.5,
      capRate: 7.8,
      noi: 694200,
      pricePerUnit: 0,
      pricePerSF: 123.61,
      photos: 15,
      daysOnMarket: 31,
      broker: "Direct",
      description: "Climate-controlled self-storage facility. Strong local market demand, expansion potential.",
      highlights: ["Climate Control", "Expansion Land", "Good Demographics", "Online Rental"],
      favorite: false,
      source: "Direct Seller",
    },
  ]

  const filteredProperties = properties.filter(prop => {
    if (propertyType !== 'all' && prop.type !== propertyType) return false
    if (priceRange === 'under10' && prop.price >= 10000000) return false
    if (priceRange === '10to25' && (prop.price < 10000000 || prop.price >= 25000000)) return false
    if (priceRange === '25to50' && (prop.price < 25000000 || prop.price >= 50000000)) return false
    if (priceRange === 'over50' && prop.price < 50000000) return false
    if (searchQuery && !prop.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !prop.address.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'multifamily': return Home
      case 'commercial': return Building2
      case 'industrial': return Warehouse
      case 'retail': return Store
      default: return Building2
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'multifamily': return 'bg-blue-100 text-blue-700'
      case 'commercial': return 'bg-purple-100 text-purple-700'
      case 'industrial': return 'bg-orange-100 text-orange-700'
      case 'retail': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" asChild className="mb-2">
              <Link href="/dashboard/sponsor">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-4xl font-black mb-2">Property Search</h1>
            <p className="text-muted-foreground">
              Discover investment opportunities from multiple sources
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-2 border-[#56CCF2]">
              <Heart className="mr-2 h-4 w-4" />
              Saved ({properties.filter(p => p.favorite).length})
            </Button>
            <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90">
              <Plus className="mr-2 h-4 w-4" />
              Manual Entry
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by property name, location, or address..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg focus:border-[#56CCF2] focus:outline-none"
                  />
                </div>
                <Button variant="outline" size="lg" className="border-2 border-[#56CCF2]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">Type:</span>
                </div>
                {[
                  { value: 'all', label: 'All Types', icon: Building2 },
                  { value: 'multifamily', label: 'Multifamily', icon: Home },
                  { value: 'commercial', label: 'Commercial', icon: Building2 },
                  { value: 'industrial', label: 'Industrial', icon: Warehouse },
                  { value: 'retail', label: 'Retail', icon: Store },
                ].map(type => (
                  <Button
                    key={type.value}
                    size="sm"
                    variant={propertyType === type.value ? 'default' : 'outline'}
                    onClick={() => setPropertyType(type.value as any)}
                    className={propertyType === type.value ? 'bg-[#56CCF2] hover:bg-[#56CCF2]/90' : ''}
                  >
                    <type.icon className="mr-2 h-3 w-3" />
                    {type.label}
                  </Button>
                ))}

                <div className="border-l-2 border-slate-200 mx-2" />

                <span className="text-sm font-semibold">Price:</span>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'under10', label: 'Under $10M' },
                  { value: '10to25', label: '$10M-$25M' },
                  { value: '25to50', label: '$25M-$50M' },
                  { value: 'over50', label: '$50M+' },
                ].map(range => (
                  <Button
                    key={range.value}
                    size="sm"
                    variant={priceRange === range.value ? 'default' : 'outline'}
                    onClick={() => setPriceRange(range.value as any)}
                    className={priceRange === range.value ? 'bg-[#E07A47] hover:bg-[#E07A47]/90' : ''}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold">{filteredProperties.length}</span> properties found
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-[#56CCF2]' : ''}
                  >
                    <List className="mr-2 h-4 w-4" />
                    List
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === 'map' ? 'default' : 'outline'}
                    onClick={() => setViewMode('map')}
                    className={viewMode === 'map' ? 'bg-[#56CCF2]' : ''}
                  >
                    <Map className="mr-2 h-4 w-4" />
                    Map
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {viewMode === 'list' ? (
          <div className="grid gap-4">
            {filteredProperties.map(property => {
              const TypeIcon = getTypeIcon(property.type)
              return (
                <Card key={property.id} className="border-4 border-[#E07A47] hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Property Image Placeholder */}
                      <div className="w-64 h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-center">
                          <TypeIcon className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">{property.photos} photos</p>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-black">{property.name}</h3>
                              <Badge className={getTypeColor(property.type)}>
                                {property.type}
                              </Badge>
                              <Badge variant="outline" className="border-2">
                                {property.source}
                              </Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{property.address}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{property.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {property.highlights.map((highlight, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-[#56CCF2]/10 text-[#56CCF2]">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={property.favorite ? 'text-red-500' : 'text-muted-foreground'}
                          >
                            <Heart className={`h-5 w-5 ${property.favorite ? 'fill-current' : ''}`} />
                          </Button>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Price</p>
                            <p className="font-black text-lg text-[#56CCF2]">{formatCurrency(property.price)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                            <p className="font-black text-lg">{property.capRate}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {property.units > 0 ? 'Units' : 'SF'}
                            </p>
                            <p className="font-black text-lg">
                              {property.units > 0 ? formatNumber(property.units) : formatNumber(property.squareFeet)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                            <p className="font-black text-lg">{property.occupancy}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">NOI</p>
                            <p className="font-bold text-sm">{formatCurrency(property.noi)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {property.units > 0 ? 'Price/Unit' : 'Price/SF'}
                            </p>
                            <p className="font-bold text-sm">
                              {property.units > 0 
                                ? formatCurrency(property.pricePerUnit)
                                : `$${property.pricePerSF.toFixed(2)}`
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Year Built</p>
                            <p className="font-bold text-sm">{property.yearBuilt}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Days on Market</p>
                            <p className="font-bold text-sm">{property.daysOnMarket} days</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add to Pipeline
                          </Button>
                          <Button variant="outline" className="border-2 border-[#E07A47]">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Quick Analysis
                          </Button>
                          <Button variant="outline">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Listing
                          </Button>
                          <Button variant="outline">
                            Contact Broker
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card className="border-4 border-[#56CCF2] h-[600px]">
            <CardContent className="p-6 h-full">
              <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Map View</h3>
                  <p className="text-muted-foreground mb-4">
                    Interactive map integration coming soon
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {filteredProperties.length} properties will be displayed on map
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredProperties.length === 0 && (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button onClick={() => {
                setPropertyType('all')
                setPriceRange('all')
                setSearchQuery('')
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

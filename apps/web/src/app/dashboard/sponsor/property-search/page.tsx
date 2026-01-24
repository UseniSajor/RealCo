"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { MediaOverlay } from "@/components/media/MediaOverlay"
import { Card, CardContent } from "@/components/ui/card"
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
  Heart,
  BarChart3,
  Plus,
  Eye,
  X,
  Map,
  List,
  SlidersHorizontal,
  CheckCircle2,
  Camera,
  UserPlus,
  Calculator,
  Target,
  Hammer,
  MessageSquare,
  Settings as SettingsIcon
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function PropertySearchPage() {
  const { user, logout } = useAuth()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [propertyType, setPropertyType] = useState<'all' | 'multifamily' | 'commercial' | 'industrial' | 'retail'>('all')
  const [showFilters, setShowFilters] = useState(true)
  const [selectedProperties, setSelectedProperties] = useState<number[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [mediaOverlay, setMediaOverlay] = useState<{
    isOpen: boolean
    src: string
    type: 'image' | 'video'
    title?: string
  }>({ isOpen: false, src: '', type: 'image' })

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raised", href: "/dashboard/sponsor/capital-raised", icon: TrendingUp },
    { title: "Construction", href: "/dashboard/sponsor/construction", icon: Hammer },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: SettingsIcon },
  ]

  // Mock properties data
  const properties = [
    {
      id: 1,
      name: "Riverside Luxury Apartments",
      address: "2400 River Road, Portland, OR 97201",
      type: "multifamily",
      price: 12500000,
      units: 120,
      squareFeet: 105000,
      yearBuilt: 2018,
      occupancy: 95,
      capRate: 6.2,
      noi: 775000,
      pricePerUnit: 104167,
      pricePerSF: 119.05,
      photos: 24,
      matchScore: 92,
      broker: "CBRE",
      tags: ["Value-Add", "Off-Market"],
      favorite: false,
    },
    {
      id: 2,
      name: "Downtown Mixed-Use Development",
      address: "500 Congress Avenue, Austin, TX 78701",
      type: "commercial",
      price: 28000000,
      units: 0,
      squareFeet: 85000,
      yearBuilt: 2015,
      occupancy: 92,
      capRate: 7.5,
      noi: 2100000,
      pricePerUnit: 0,
      pricePerSF: 329.41,
      photos: 18,
      matchScore: 88,
      broker: "JLL",
      tags: ["Stabilized Asset"],
      favorite: true,
    },
    {
      id: 3,
      name: "Tech Park Industrial",
      address: "8900 Innovation Drive, Denver, CO 80202",
      type: "industrial",
      price: 18750000,
      units: 0,
      squareFeet: 125000,
      yearBuilt: 2020,
      occupancy: 100,
      capRate: 6.8,
      noi: 1275000,
      pricePerUnit: 0,
      pricePerSF: 150.00,
      photos: 15,
      matchScore: 85,
      broker: "Cushman & Wakefield",
      tags: ["New Construction", "Tech Tenant"],
      favorite: false,
    },
  ]

  const togglePropertySelection = (id: number) => {
    setSelectedProperties(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

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

  return (
    <div className="flex min-h-screen bg-white dark:bg-realco-gray">
      {/* Sidebar */}
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development"}
        onLogout={logout}
      />

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div className="container max-w-full px-8 py-8 mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black mb-2">Property Search</h1>
                <p className="text-lg text-muted-foreground">
                  Discover investment opportunities nationwide
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="shape-oval">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved ({properties.filter(p => p.favorite).length})
                </Button>
                <Button className="shape-oval bg-realco-orange hover:bg-realco-orange/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Manual Entry
                </Button>
              </div>
            </div>

            {/* Search Bar - Oval Shape */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by location, address, or MLS number..."
                  className="w-full h-14 pl-14 pr-6 shape-circle border-2 border-gray-200 dark:border-white/10 focus:border-realco-blue focus:ring-2 focus:ring-realco-blue/20 outline-none text-lg bg-white dark:bg-realco-gray-dark"
                />
              </div>
            </div>

            {/* Property Type Pills - Circular */}
            <div className="flex items-center gap-3 flex-wrap">
              {[
                { value: 'all', label: 'All Types', icon: Building2 },
                { value: 'multifamily', label: 'Multifamily', icon: Home },
                { value: 'commercial', label: 'Commercial', icon: Building2 },
                { value: 'industrial', label: 'Industrial', icon: Warehouse },
                { value: 'retail', label: 'Retail', icon: Store },
              ].map((type) => {
                const Icon = type.icon
                const isActive = propertyType === type.value
                return (
                  <button
                    key={type.value}
                    onClick={() => setPropertyType(type.value as any)}
                    className={`
                      flex items-center gap-2 px-6 py-3 shape-circle font-semibold transition-all
                      ${isActive 
                        ? 'bg-realco-orange text-white shadow-lg scale-105' 
                        : 'bg-gray-100 dark:bg-realco-gray-dark text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-realco-gray-dark/80'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters */}
            {showFilters && (
              <div className="lg:col-span-1">
                <Card className="shape-oval-lg border-2 border-realco-blue sticky top-8">
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-black text-lg flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-realco-blue" />
                        Filters
                      </h3>
                      <button className="text-sm text-realco-orange hover:underline font-semibold">
                        Clear All
                      </button>
                    </div>

                    {/* Price Range - Circular Slider */}
                    <div>
                      <label className="font-bold text-sm mb-3 block">Price Range</label>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="500000"
                          max="50000000"
                          step="500000"
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-5
                            [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-realco-orange
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-moz-range-thumb]:w-5
                            [&::-moz-range-thumb]:h-5
                            [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:bg-realco-orange
                            [&::-moz-range-thumb]:cursor-pointer
                            [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-sm">
                          <span className="px-3 py-1 shape-circle bg-gray-100 dark:bg-realco-gray-dark font-semibold">
                            $500K
                          </span>
                          <span className="px-3 py-1 shape-circle bg-gray-100 dark:bg-realco-gray-dark font-semibold">
                            $50M
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Cap Rate - Circular Slider */}
                    <div>
                      <label className="font-bold text-sm mb-3 block">Cap Rate</label>
                      <div className="space-y-3">
                        <input
                          type="range"
                          min="4"
                          max="12"
                          step="0.5"
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none
                            [&::-webkit-slider-thumb]:w-5
                            [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full
                            [&::-webkit-slider-thumb]:bg-realco-blue
                            [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:shadow-lg
                            [&::-moz-range-thumb]:w-5
                            [&::-moz-range-thumb]:h-5
                            [&::-moz-range-thumb]:rounded-full
                            [&::-moz-range-thumb]:bg-realco-blue
                            [&::-moz-range-thumb]:cursor-pointer
                            [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-sm">
                          <span className="px-3 py-1 shape-circle bg-gray-100 dark:bg-realco-gray-dark font-semibold">
                            4%
                          </span>
                          <span className="px-3 py-1 shape-circle bg-gray-100 dark:bg-realco-gray-dark font-semibold">
                            12%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Occupancy */}
                    <div>
                      <label className="font-bold text-sm mb-3 block">Minimum Occupancy</label>
                      <input
                        type="range"
                        min="70"
                        max="100"
                        step="5"
                        defaultValue="90"
                        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer
                          [&::-webkit-slider-thumb]:appearance-none
                          [&::-webkit-slider-thumb]:w-5
                          [&::-webkit-slider-thumb]:h-5
                          [&::-webkit-slider-thumb]:rounded-full
                          [&::-webkit-slider-thumb]:bg-realco-navy
                          [&::-webkit-slider-thumb]:cursor-pointer
                          [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="text-center mt-2">
                        <span className="px-4 py-2 shape-circle bg-realco-navy text-white font-bold text-sm">
                          90%+
                        </span>
                      </div>
                    </div>

                    {/* Checkboxes - Circular */}
                    <div>
                      <label className="font-bold text-sm mb-3 block">Property Features</label>
                      <div className="space-y-2">
                        {[
                          'Off-market opportunities',
                          'Value-add potential',
                          'Stabilized assets',
                          'Distressed properties',
                          'Recent renovation',
                        ].map((feature) => (
                          <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 shape-circle border-2 border-gray-300 dark:border-white/30 group-hover:border-realco-blue flex items-center justify-center">
                              <div className="w-3 h-3 shape-circle bg-realco-orange opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-sm group-hover:text-realco-blue transition-colors">{feature}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Apply Button - Oval */}
                    <Button className="w-full shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-bold py-6">
                      Apply Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content Area */}
            <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
              {/* View Toggle & Results */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 shape-oval border-2 border-gray-200 dark:border-white/20 hover:border-realco-blue flex items-center gap-2 font-semibold"
                  >
                    <Filter className="h-4 w-4" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>
                  <p className="text-sm">
                    <span className="font-black text-lg">{properties.length}</span> properties found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 shape-circle transition-all ${
                      viewMode === 'list'
                        ? 'bg-realco-orange text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-realco-gray-dark hover:bg-gray-200'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-3 shape-circle transition-all ${
                      viewMode === 'map'
                        ? 'bg-realco-orange text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-realco-gray-dark hover:bg-gray-200'
                    }`}
                  >
                    <Map className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Map View Placeholder */}
              {viewMode === 'map' && (
                <Card className="shape-oval-lg border-2 border-realco-blue mb-6">
                  <CardContent className="p-0">
                    <div className="h-96 bg-gradient-to-br from-realco-blue/10 to-realco-orange/10 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 shape-circle bg-realco-blue/20 flex items-center justify-center mx-auto mb-4">
                          <MapPin className="h-10 w-10 text-realco-blue" />
                        </div>
                        <h3 className="font-black text-2xl mb-2">Interactive Map View</h3>
                        <p className="text-muted-foreground mb-4">
                          Real map integration coming in live version
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          {properties.map((prop, idx) => (
                            <div
                              key={prop.id}
                              className="w-12 h-12 shape-circle bg-realco-orange text-white flex items-center justify-center font-bold shadow-lg cursor-pointer hover:scale-110 transition-transform"
                              title={prop.name}
                            >
                              {idx + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Property Cards */}
              <div className="space-y-6">
                {properties.map((property) => {
                  const TypeIcon = getTypeIcon(property.type)
                  const isSelected = selectedProperties.includes(property.id)

                  return (
                    <Card key={property.id} className={`shape-oval-lg border-2 transition-all ${
                      isSelected
                        ? 'border-realco-orange shadow-2xl scale-102'
                        : 'border-gray-200 dark:border-white/10 hover:border-realco-blue hover:shadow-xl'
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          {/* Property Image - Circular Thumbnail */}
                          <div className="flex-shrink-0">
                            <div 
                              className="w-48 h-48 shape-oval bg-gradient-to-br from-realco-blue/20 to-realco-orange/20 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform relative overflow-hidden group"
                              onClick={() => setMediaOverlay({
                                isOpen: true,
                                src: '/property-placeholder.jpg',
                                type: 'image',
                                title: property.name
                              })}
                            >
                              <div className="absolute inset-0 flex items-center justify-center">
                                <TypeIcon className="h-16 w-16 text-realco-blue opacity-50" />
                              </div>
                              <div className="absolute bottom-3 right-3 px-3 py-1 shape-circle bg-black/70 text-white text-xs font-bold flex items-center gap-1">
                                <Camera className="h-3 w-3" />
                                {property.photos}
                              </div>
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="h-8 w-8 text-white" />
                              </div>
                            </div>
                            {/* Compare Checkbox - Circular */}
                            <div className="mt-3 flex justify-center">
                              <button
                                onClick={() => togglePropertySelection(property.id)}
                                className={`w-8 h-8 shape-circle border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? 'bg-realco-orange border-realco-orange'
                                    : 'border-gray-300 dark:border-white/30 hover:border-realco-blue'
                                }`}
                              >
                                {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
                              </button>
                            </div>
                          </div>

                          {/* Property Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-2xl font-black mb-1">{property.name}</h3>
                                <p className="text-muted-foreground flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  {property.address}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {property.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    className="shape-circle bg-realco-blue text-white px-4 py-1"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                <button className="w-10 h-10 shape-circle bg-gray-100 dark:bg-realco-gray-dark hover:bg-red-100 dark:hover:bg-red-900/20 flex items-center justify-center transition-all">
                                  <Heart className={`h-5 w-5 ${property.favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                </button>
                              </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-5 gap-4 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Price</p>
                                <p className="font-black text-lg text-realco-orange">{formatCurrency(property.price)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                                <p className="font-black text-lg text-realco-blue">{property.capRate}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">NOI</p>
                                <p className="font-black text-lg">{formatCurrency(property.noi)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                                <p className="font-black text-lg">{property.occupancy}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Match Score</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-10 h-10 shape-circle bg-gradient-realco text-white flex items-center justify-center font-black text-sm">
                                    {property.matchScore}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                              {property.units > 0 && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-4 w-4" />
                                  {formatNumber(property.units)} units
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Square className="h-4 w-4" />
                                {formatNumber(property.squareFeet)} SF
                              </span>
                              <span>Built: {property.yearBuilt}</span>
                              <span>Broker: {property.broker}</span>
                            </div>

                            {/* Action Buttons - Circular/Oval */}
                            <div className="flex items-center gap-3">
                              <Button className="shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-semibold">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              <Button variant="outline" className="shape-oval border-2 border-realco-blue text-realco-blue hover:bg-realco-blue hover:text-white font-semibold">
                                <BarChart3 className="h-4 w-4 mr-2" />
                                Quick Analysis
                              </Button>
                              <Button variant="outline" className="shape-oval border-2 font-semibold">
                                <Plus className="h-4 w-4 mr-2" />
                                Add to Pipeline
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Compare Properties Floating Bar */}
      {selectedProperties.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <Card className="shape-oval-lg border-4 border-realco-blue bg-white dark:bg-realco-gray shadow-2xl">
            <CardContent className="px-8 py-4 flex items-center gap-6">
              <div className="flex items-center gap-3">
                {selectedProperties.map((id) => {
                  const prop = properties.find(p => p.id === id)
                  if (!prop) return null
                  const TypeIcon = getTypeIcon(prop.type)
                  return (
                    <div key={id} className="relative">
                      <div className="w-12 h-12 shape-circle bg-gradient-to-br from-realco-blue/20 to-realco-orange/20 flex items-center justify-center">
                        <TypeIcon className="h-6 w-6 text-realco-blue" />
                      </div>
                      <button
                        onClick={() => togglePropertySelection(id)}
                        className="absolute -top-1 -right-1 w-5 h-5 shape-circle bg-realco-orange text-white flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )
                })}
              </div>
              <div className="border-l-2 border-gray-200 dark:border-white/20 h-12" />
              <div>
                <p className="text-sm text-muted-foreground">Selected Properties</p>
                <p className="font-black text-lg">{selectedProperties.length} of 3</p>
              </div>
              <Button
                onClick={() => setShowCompare(true)}
                disabled={selectedProperties.length < 2}
                className="shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white font-bold px-8 py-6"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Compare Properties
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compare Modal */}
      {showCompare && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <Card className="shape-oval-lg w-full max-w-6xl max-h-[90vh] overflow-auto bg-white dark:bg-realco-gray">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-black">Compare Properties</h2>
                <button
                  onClick={() => setShowCompare(false)}
                  className="w-12 h-12 shape-circle bg-realco-orange hover:bg-realco-orange/90 text-white flex items-center justify-center"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6">
                {selectedProperties.map((id) => {
                  const prop = properties.find(p => p.id === id)
                  if (!prop) return null
                  const TypeIcon = getTypeIcon(prop.type)

                  return (
                    <Card key={id} className="shape-oval border-2 border-realco-blue">
                      <CardContent className="p-6">
                        <div className="w-full aspect-video shape-oval bg-gradient-to-br from-realco-blue/20 to-realco-orange/20 flex items-center justify-center mb-4">
                          <TypeIcon className="h-16 w-16 text-realco-blue opacity-50" />
                        </div>
                        <h3 className="font-black text-lg mb-2">{prop.name}</h3>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Price</span>
                            <span className="font-bold text-realco-orange">{formatCurrency(prop.price)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Cap Rate</span>
                            <span className="font-bold text-realco-blue">{prop.capRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">NOI</span>
                            <span className="font-bold">{formatCurrency(prop.noi)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Occupancy</span>
                            <span className="font-bold">{prop.occupancy}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Match Score</span>
                            <span className="font-bold">{prop.matchScore}/100</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => togglePropertySelection(id)}
                          variant="outline"
                          className="w-full mt-4 shape-oval"
                        >
                          Remove
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                <Button className="shape-oval bg-realco-blue hover:bg-realco-blue/90 text-white px-8">
                  Export PDF
                </Button>
                <Button className="shape-oval bg-realco-orange hover:bg-realco-orange/90 text-white px-8">
                  Add Selected to Pipeline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Media Overlay */}
      <MediaOverlay
        isOpen={mediaOverlay.isOpen}
        onClose={() => setMediaOverlay({ ...mediaOverlay, isOpen: false })}
        type={mediaOverlay.type}
        src={mediaOverlay.src}
        title={mediaOverlay.title}
      />
    </div>
  )
}

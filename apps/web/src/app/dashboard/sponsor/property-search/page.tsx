"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
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
  Sparkles,
  Brain,
  Target,
  Phone,
  Mail,
  FileText,
  Send,
  Zap,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Star,
  Clock,
  Calculator,
  User,
  Building,
  Loader2,
  BarChart3,
  TrendingDown,
  MessageSquare,
  Calendar,
  Briefcase,
  Eye,
  Download,
  RefreshCw,
  Settings2,
  LogOut
} from "lucide-react"
import { useProperties, usePropertyMutations, type Property, type PropertyStatus, type PropertyType } from "@/lib/supabase-hooks"

// Sidebar items for sponsor
const sidebarItems = [
  { icon: BarChart3, title: "Dashboard", href: "/dashboard/sponsor" },
  { icon: Search, title: "Property Search", href: "/dashboard/sponsor/property-search" },
  { icon: Users, title: "Leads", href: "/dashboard/sponsor/leads" },
  { icon: Briefcase, title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline" },
  { icon: Calculator, title: "Underwriting", href: "/dashboard/sponsor/underwriting" },
  { icon: Building2, title: "Construction", href: "/dashboard/sponsor/construction" },
  { icon: DollarSign, title: "Capital Raised", href: "/dashboard/sponsor/capital-raised" },
  { icon: FileText, title: "Distributions", href: "/dashboard/sponsor/distributions" },
]

export default function PropertySearchPage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [propertyType, setPropertyType] = useState<string>('all')
  const [priceRange, setPriceRange] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState("")
  const [aiSearchQuery, setAiSearchQuery] = useState("")
  const [isAISearching, setIsAISearching] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showOwnerLookup, setShowOwnerLookup] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Advanced filter states
  const [minCapRate, setMinCapRate] = useState("")
  const [maxCapRate, setMaxCapRate] = useState("")
  const [minUnits, setMinUnits] = useState("")
  const [maxUnits, setMaxUnits] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [minNOI, setMinNOI] = useState("")
  const [yearBuiltMin, setYearBuiltMin] = useState("")

  // Supabase hooks for real data
  const [filters, setFilters] = useState<{ status?: PropertyStatus; type?: PropertyType; search?: string }>({
    status: undefined,
    type: undefined,
    search: ''
  })
  const { data: properties, isLoading, error, refetch } = useProperties(filters)
  const { updateProperty, isLoading: mutating } = usePropertyMutations()

  // Update filters when filter UI changes
  useEffect(() => {
    const newFilters: { status?: PropertyStatus; type?: PropertyType; search?: string } = {}

    if (propertyType !== 'all') {
      newFilters.type = propertyType.toUpperCase() as PropertyType
    }

    if (searchQuery) {
      newFilters.search = searchQuery
    }

    setFilters(newFilters)
  }, [propertyType, searchQuery])

  // Client-side filtering for additional criteria not supported by the hook
  const filteredProperties = useMemo(() => {
    if (!properties) return []

    return properties.filter(prop => {
      // Price range filter
      if (priceRange === 'under10' && prop.asking_price >= 10000000) return false
      if (priceRange === '10to25' && (prop.asking_price < 10000000 || prop.asking_price >= 25000000)) return false
      if (priceRange === '25to50' && (prop.asking_price < 25000000 || prop.asking_price >= 50000000)) return false
      if (priceRange === 'over50' && prop.asking_price < 50000000) return false

      // Cap rate filters
      if (minCapRate && prop.cap_rate && prop.cap_rate < parseFloat(minCapRate)) return false
      if (maxCapRate && prop.cap_rate && prop.cap_rate > parseFloat(maxCapRate)) return false

      // Location filters
      if (city && !prop.city.toLowerCase().includes(city.toLowerCase())) return false
      if (state && !prop.state.toLowerCase().includes(state.toLowerCase())) return false

      // Units filter
      if (minUnits && prop.units && prop.units < parseInt(minUnits)) return false
      if (maxUnits && prop.units && prop.units > parseInt(maxUnits)) return false

      // NOI filter
      if (minNOI && prop.noi && prop.noi < parseFloat(minNOI)) return false

      // Year built filter
      if (yearBuiltMin && prop.year_built && prop.year_built < parseInt(yearBuiltMin)) return false

      return true
    })
  }, [properties, priceRange, minCapRate, maxCapRate, city, state, minUnits, maxUnits, minNOI, yearBuiltMin])

  const savedCount = useMemo(() => {
    return properties?.filter(p => p.is_saved).length || 0
  }, [properties])

  const handleAISearch = async () => {
    if (!aiSearchQuery.trim()) return
    setIsAISearching(true)
    setShowAIPanel(true)

    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock AI response
    setAiInsights([
      `Found ${filteredProperties.length} properties matching "${aiSearchQuery}"`,
      "Market analysis: Austin multifamily showing 4.2% YoY rent growth",
      "Recommendation: Focus on Class B value-add opportunities for best risk-adjusted returns",
      "Off-market opportunity identified: 156-unit property in East Austin, owner may be motivated"
    ])

    setIsAISearching(false)
  }

  const handleQuickAnalysis = async (property: Property) => {
    setSelectedProperty(property)
    setIsAnalyzing(true)

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsAnalyzing(false)
  }

  const handleSaveProperty = async (property: Property) => {
    const result = await updateProperty(property.id, { is_saved: !property.is_saved })
    if (result) {
      refetch()
    }
  }

  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A'
    return new Intl.NumberFormat('en-US').format(value)
  }

  const getTypeIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MULTIFAMILY': return Home
      case 'OFFICE':
      case 'COMMERCIAL': return Building2
      case 'INDUSTRIAL': return Warehouse
      case 'RETAIL': return Store
      default: return Building2
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MULTIFAMILY': return 'bg-blue-100 text-blue-700'
      case 'OFFICE':
      case 'COMMERCIAL': return 'bg-purple-100 text-purple-700'
      case 'INDUSTRIAL': return 'bg-orange-100 text-orange-700'
      case 'RETAIL': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAIScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY': return 'bg-green-600 text-white'
      case 'BUY': return 'bg-green-500 text-white'
      case 'HOLD': return 'bg-yellow-500 text-white'
      case 'PASS': return 'bg-red-500 text-white'
      case 'STRONG_PASS': return 'bg-red-600 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const clearAllFilters = () => {
    setPropertyType('all')
    setPriceRange('all')
    setSearchQuery('')
    setMinCapRate('')
    setMaxCapRate('')
    setMinUnits('')
    setMaxUnits('')
    setCity('')
    setState('')
    setMinNOI('')
    setYearBuiltMin('')
  }

  const handleLogout = () => {
    localStorage.removeItem('realco_user')
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName="Sponsor User"
        onLogout={handleLogout}
      />

      {/* Main Content - between two sidebars */}
      <main className="flex-1 ml-24 mr-80 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">AI Property Finder</h1>
              <p className="text-muted-foreground">
                Discover investment opportunities with AI-powered search and analysis
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-2 border-[#56CCF2]">
                <Heart className="mr-2 h-4 w-4" />
                Saved ({savedCount})
              </Button>
              <Button variant="outline" className="border-2 border-purple-500">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>
          </div>

          {/* AI Search Section */}
          <Card className="border-4 border-[#56CCF2] bg-[#6b7280]/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI-Powered Property Search</h3>
                  <p className="text-sm text-muted-foreground">Describe what you&apos;re looking for in natural language</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Brain className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#56CCF2]" />
                  <Input
                    type="text"
                    placeholder="e.g., 'Find multifamily properties in Austin under $30M with 6%+ cap rate and value-add potential'"
                    value={aiSearchQuery}
                    onChange={(e) => setAiSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                    className="pl-10 h-12 border-2 border-[#56CCF2]/50 focus:border-[#56CCF2]"
                  />
                </div>
                <Button
                  onClick={handleAISearch}
                  disabled={isAISearching}
                  className="h-12 px-6 bg-gradient-to-r from-[#56CCF2] to-[#E07A47] hover:opacity-90"
                >
                  {isAISearching ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      AI Search
                    </>
                  )}
                </Button>
              </div>

              {/* AI Insights Panel */}
              {showAIPanel && aiInsights.length > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-[#56CCF2]/30">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold flex items-center gap-2">
                      <Brain className="h-4 w-4 text-[#56CCF2]" />
                      AI Insights
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowAIPanel(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ul className="space-y-2">
                    {aiInsights.map((insight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Zap className="h-4 w-4 text-[#E07A47] mt-0.5 flex-shrink-0" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by property name, address, or market..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 border-2 border-[#E07A47]"
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="lg"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-[#56CCF2]' : 'border-2'}
              >
                <List className="mr-2 h-4 w-4" />
                List
              </Button>
              <Button
                size="lg"
                variant={viewMode === 'map' ? 'default' : 'outline'}
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-[#56CCF2]' : 'border-2'}
              >
                <Map className="mr-2 h-4 w-4" />
                Map
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-foreground">{filteredProperties.length}</span> properties found
              {isLoading && <Loader2 className="inline ml-2 h-4 w-4 animate-spin" />}
            </p>
            <p className="text-sm text-muted-foreground">Use the filter panel on the right to refine results</p>
          </div>

          {/* Error State */}
          {error && (
            <Card className="border-4 border-red-500">
              <CardContent className="py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Error Loading Properties</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {isLoading && !error && (
            <Card className="border-4 border-[#56CCF2]">
              <CardContent className="py-12 text-center">
                <Loader2 className="h-12 w-12 text-[#56CCF2] mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-bold mb-2">Loading Properties</h3>
                <p className="text-muted-foreground">Fetching the latest investment opportunities...</p>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {!isLoading && !error && viewMode === 'list' && filteredProperties.length > 0 && (
            <div className="grid gap-4">
              {filteredProperties.map(property => {
                const TypeIcon = getTypeIcon(property.type)
                return (
                  <Card key={property.id} className="border-4 border-[#E07A47] hover:shadow-xl hover:shadow-[#E07A47]/20 transition-all">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Property Image */}
                        <div className="w-72 flex-shrink-0">
                          <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <TypeIcon className="h-16 w-16 text-slate-400" />

                            {/* Source Badge */}
                            <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 rounded text-xs font-medium">
                              {property.source || 'Direct'}
                            </div>

                            {/* Save Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveProperty(property)}
                              disabled={mutating}
                              className={`absolute bottom-2 right-2 ${property.is_saved ? 'text-red-500' : 'text-white bg-black/30 hover:bg-black/50'}`}
                            >
                              <Heart className={`h-5 w-5 ${property.is_saved ? 'fill-current' : ''}`} />
                            </Button>
                          </div>
                        </div>

                        {/* Property Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black">{property.name}</h3>
                                <Badge className={getTypeColor(property.type)}>
                                  {property.type}
                                </Badge>
                                {property.status === 'OFF_MARKET' && (
                                  <Badge className="bg-purple-600 text-white">
                                    <Star className="mr-1 h-3 w-3" />
                                    Off-Market
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span className="text-sm">{property.address}, {property.city}, {property.state} {property.zip_code}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-3xl font-black text-[#56CCF2]">{formatCurrency(property.asking_price)}</p>
                              {property.days_on_market && (
                                <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                                  <Clock className="h-3 w-3" />
                                  {property.days_on_market} days on market
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Tags */}
                          {property.tags && property.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {property.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary" className="bg-[#56CCF2]/10 text-[#56CCF2]">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Metrics Grid */}
                          <div className="grid grid-cols-5 gap-4 mb-4 p-3 bg-muted/30 rounded-lg">
                            <div>
                              <p className="text-xs text-muted-foreground">Cap Rate</p>
                              <p className="font-black text-lg text-[#E07A47]">
                                {property.cap_rate ? `${property.cap_rate}%` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">NOI</p>
                              <p className="font-bold">{formatCurrency(property.noi)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{property.units ? 'Units' : 'Sq Ft'}</p>
                              <p className="font-bold">{formatNumber(property.units || property.sqft)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Occupancy</p>
                              <p className="font-bold">
                                {property.occupancy ? `${property.occupancy}%` : 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">{property.units ? '$/Unit' : '$/SF'}</p>
                              <p className="font-bold">
                                {property.units
                                  ? formatCurrency(property.price_per_unit)
                                  : property.price_per_sqft ? `$${property.price_per_sqft.toFixed(0)}` : 'N/A'
                                }
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                              <Plus className="mr-2 h-4 w-4" />
                              Add to Pipeline
                            </Button>
                            <Button
                              variant="outline"
                              className="border-2 border-[#E07A47]"
                              onClick={() => handleQuickAnalysis(property)}
                            >
                              <Brain className="mr-2 h-4 w-4" />
                              AI Analysis
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedProperty(property)
                                setShowOwnerLookup(true)
                              }}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Find Owner
                            </Button>
                            <Button variant="outline">
                              <Calculator className="mr-2 h-4 w-4" />
                              Underwrite
                            </Button>
                            {property.source_url && (
                              <Button variant="outline" asChild>
                                <a href={property.source_url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Listing
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Map View */}
          {!isLoading && !error && viewMode === 'map' && (
            <Card className="border-4 border-[#56CCF2] h-[600px]">
              <CardContent className="p-6 h-full">
                <div className="h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Map className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Interactive Map View</h3>
                    <p className="text-muted-foreground mb-4">
                      Map integration with property markers and heat maps
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {filteredProperties.length} properties will be displayed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && filteredProperties.length === 0 && (
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="py-12 text-center">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-4">
                  {properties && properties.length === 0
                    ? "No properties have been added yet. Add your first property to get started."
                    : "Try adjusting your filters or use AI search for better results"
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                  <Button variant="outline" onClick={() => document.querySelector('input')?.focus()}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Try AI Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Right Filter Sidebar */}
      <aside className="fixed right-0 top-0 h-screen w-80 bg-[#56CCF2] border-l-4 border-[#E07A47] p-4 overflow-y-auto z-40">
        <div className="space-y-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#3BB5E0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-white" />
              <h3 className="font-black text-lg text-white">Filters</h3>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAllFilters}
              className="text-white hover:text-white hover:bg-[#3BB5E0]"
            >
              <RefreshCw className="mr-1 h-3 w-3" />
              Reset
            </Button>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <Building2 className="h-4 w-4" />
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'All', icon: Building2 },
                { value: 'multifamily', label: 'Multifamily', icon: Home },
                { value: 'office', label: 'Office', icon: Building2 },
                { value: 'industrial', label: 'Industrial', icon: Warehouse },
                { value: 'retail', label: 'Retail', icon: Store },
              ].map(type => (
                <Button
                  key={type.value}
                  size="sm"
                  variant={propertyType === type.value ? 'default' : 'outline'}
                  onClick={() => setPropertyType(type.value)}
                  className={`justify-start ${propertyType === type.value ? 'bg-[#E07A47] hover:bg-[#E07A47]/90' : 'border-2 bg-white'}`}
                >
                  <type.icon className="mr-2 h-3 w-3" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <DollarSign className="h-4 w-4" />
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'all', label: 'All Prices' },
                { value: 'under10', label: 'Under $10M' },
                { value: '10to25', label: '$10M - $25M' },
                { value: '25to50', label: '$25M - $50M' },
                { value: 'over50', label: '$50M+' },
              ].map(range => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={priceRange === range.value ? 'default' : 'outline'}
                  onClick={() => setPriceRange(range.value)}
                  className={`justify-start ${priceRange === range.value ? 'bg-[#E07A47] hover:bg-[#E07A47]/90' : 'border-2 bg-white'}`}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Cap Rate */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <TrendingUp className="h-4 w-4" />
              Cap Rate (%)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minCapRate}
                onChange={(e) => setMinCapRate(e.target.value)}
                className="border-2 bg-white"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxCapRate}
                onChange={(e) => setMaxCapRate(e.target.value)}
                className="border-2 bg-white"
              />
            </div>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <Users className="h-4 w-4" />
              Units
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={minUnits}
                onChange={(e) => setMinUnits(e.target.value)}
                className="border-2 bg-white"
              />
              <Input
                type="number"
                placeholder="Max"
                value={maxUnits}
                onChange={(e) => setMaxUnits(e.target.value)}
                className="border-2 bg-white"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <MapPin className="h-4 w-4" />
              Location
            </label>
            <Input
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border-2 bg-white"
            />
            <Input
              placeholder="State (e.g., TX)"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border-2 bg-white"
            />
          </div>

          {/* Min NOI */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <DollarSign className="h-4 w-4" />
              Minimum NOI
            </label>
            <Input
              type="number"
              placeholder="e.g., 500000"
              value={minNOI}
              onChange={(e) => setMinNOI(e.target.value)}
              className="border-2 bg-white"
            />
          </div>

          {/* Year Built */}
          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 text-white">
              <Calendar className="h-4 w-4" />
              Year Built After
            </label>
            <Input
              type="number"
              placeholder="e.g., 2010"
              value={yearBuiltMin}
              onChange={(e) => setYearBuiltMin(e.target.value)}
              className="border-2 bg-white"
            />
          </div>

          {/* Apply Filters Button */}
          <div className="pt-4 border-t-2 border-[#3BB5E0]">
            <p className="text-xs text-white/80 mb-3 text-center">
              Filters apply automatically
            </p>
            <Button className="w-full bg-[#E07A47] hover:bg-[#D96835]">
              <Search className="mr-2 h-4 w-4" />
              {filteredProperties.length} Results
            </Button>
          </div>

          {/* Saved Searches */}
          <div className="pt-4 border-t-2 border-[#3BB5E0]">
            <label className="text-sm font-bold flex items-center gap-2 mb-3 text-white">
              <Heart className="h-4 w-4" />
              Saved Searches
            </label>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start border-2 text-sm bg-white">
                Austin Multifamily &lt;$25M
              </Button>
              <Button variant="outline" className="w-full justify-start border-2 text-sm bg-white">
                TX Industrial 6%+ Cap
              </Button>
            </div>
            <Button variant="ghost" className="w-full mt-2 text-white hover:bg-[#3BB5E0]" size="sm">
              <Plus className="mr-2 h-3 w-3" />
              Save Current Search
            </Button>
          </div>
        </div>
      </aside>

      {/* Owner Lookup Modal */}
      {showOwnerLookup && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl border-4 border-[#56CCF2]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#56CCF2]" />
                    Owner Lookup
                  </CardTitle>
                  <CardDescription>{selectedProperty.name}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowOwnerLookup(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No owner information on file</p>
                <Button className="bg-[#56CCF2]">
                  <Search className="mr-2 h-4 w-4" />
                  Run AI Owner Search
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-bold mb-3">Quick Actions</h4>
                <div className="grid grid-cols-3 gap-3">
                  <Button variant="outline" className="border-2">
                    <Phone className="mr-2 h-4 w-4" />
                    Log Call
                  </Button>
                  <Button variant="outline" className="border-2">
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button variant="outline" className="border-2">
                    <FileText className="mr-2 h-4 w-4" />
                    Draft LOI
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analysis Modal */}
      {selectedProperty && isAnalyzing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg border-4 border-[#56CCF2]">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center animate-pulse">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Analyzing Property</h3>
              <p className="text-muted-foreground">{selectedProperty.name}</p>
              <div className="mt-4 flex justify-center gap-1">
                <div className="w-2 h-2 bg-[#56CCF2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#56CCF2] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#56CCF2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full AI Analysis Modal - shown after analysis completes */}
      {selectedProperty && !isAnalyzing && !showOwnerLookup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <Card className="w-full max-w-4xl border-4 border-[#56CCF2] my-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-[#56CCF2]" />
                    AI Investment Analysis
                  </CardTitle>
                  <CardDescription>{selectedProperty.name}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProperty(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score & Recommendation */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-muted/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Deal Score</p>
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-4xl font-black ${getAIScoreColor(75)}`}>
                    75
                  </div>
                </div>
                <div className="text-center p-6 bg-muted/30 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-2">Recommendation</p>
                  <Badge className={`${getRecommendationColor('BUY')} text-lg px-6 py-2`}>
                    BUY
                  </Badge>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Strong market fundamentals
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Below replacement cost
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Value-add potential
                    </li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                  <h4 className="font-bold text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Risk Factors
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Interest rate sensitivity
                    </li>
                    <li className="text-sm flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      Economic cycle exposure
                    </li>
                  </ul>
                </div>
              </div>

              {/* Market Insights */}
              <div className="p-4 bg-[#56CCF2]/10 rounded-lg border-2 border-[#56CCF2]/30">
                <h4 className="font-bold text-[#56CCF2] mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Market Insights
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm flex items-start gap-2">
                    <Zap className="h-4 w-4 text-[#56CCF2] mt-0.5 flex-shrink-0" />
                    Population growth trending positive
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <Zap className="h-4 w-4 text-[#56CCF2] mt-0.5 flex-shrink-0" />
                    Limited new supply in submarket
                  </li>
                </ul>
              </div>

              {/* Investment Highlights */}
              <div className="p-4 bg-[#E07A47]/10 rounded-lg border-2 border-[#E07A47]/30">
                <h4 className="font-bold text-[#E07A47] mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Investment Highlights
                </h4>
                <ul className="space-y-2">
                  <li className="text-sm flex items-start gap-2">
                    <Star className="h-4 w-4 text-[#E07A47] mt-0.5 flex-shrink-0" />
                    Strong tenant demand
                  </li>
                  <li className="text-sm flex items-start gap-2">
                    <Star className="h-4 w-4 text-[#E07A47] mt-0.5 flex-shrink-0" />
                    Exit cap rate compression opportunity
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button className="bg-[#56CCF2] hover:bg-[#56CCF2]/90 flex-1">
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Pipeline
                </Button>
                <Button variant="outline" className="border-2 border-[#E07A47] flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Full Underwriting
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

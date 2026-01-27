"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Search,
  Filter,
  Building2,
  Home,
  Warehouse,
  Store,
  SlidersHorizontal,
  List,
  Map,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface PropertyFilterSidebarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  propertyType: string
  onPropertyTypeChange: (value: string) => void
  priceRange: string
  onPriceRangeChange: (value: string) => void
  viewMode: 'list' | 'map'
  onViewModeChange: (value: 'list' | 'map') => void
  resultsCount: number
  showAdvancedFilters: boolean
  onToggleAdvancedFilters: () => void
  // Advanced filters
  minCapRate: string
  onMinCapRateChange: (value: string) => void
  maxCapRate: string
  onMaxCapRateChange: (value: string) => void
  city: string
  onCityChange: (value: string) => void
  state: string
  onStateChange: (value: string) => void
  onClearFilters: () => void
}

export function PropertyFilterSidebar({
  searchQuery,
  onSearchChange,
  propertyType,
  onPropertyTypeChange,
  priceRange,
  onPriceRangeChange,
  viewMode,
  onViewModeChange,
  resultsCount,
  showAdvancedFilters,
  onToggleAdvancedFilters,
  minCapRate,
  onMinCapRateChange,
  maxCapRate,
  onMaxCapRateChange,
  city,
  onCityChange,
  state,
  onStateChange,
  onClearFilters
}: PropertyFilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const propertyTypes = [
    { value: 'all', label: 'All Types', icon: Building2 },
    { value: 'multifamily', label: 'Multifamily', icon: Home },
    { value: 'office', label: 'Office', icon: Building2 },
    { value: 'industrial', label: 'Industrial', icon: Warehouse },
    { value: 'retail', label: 'Retail', icon: Store },
  ]

  const priceRanges = [
    { value: 'all', label: 'All' },
    { value: 'under10', label: '<$10M' },
    { value: '10to25', label: '$10-25M' },
    { value: '25to50', label: '$25-50M' },
    { value: 'over50', label: '$50M+' },
  ]

  const hasActiveFilters = propertyType !== 'all' || priceRange !== 'all' || searchQuery || minCapRate || maxCapRate || city || state

  return (
    <aside className={cn(
      "fixed right-0 top-0 h-screen bg-slate-800 border-l-4 border-[#E07A47] flex flex-col z-40 transition-all duration-300 shadow-xl",
      isCollapsed ? "w-12" : "w-80"
    )}>
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 border-2 border-[#E07A47] rounded-full flex items-center justify-center text-white hover:bg-slate-700 transition-colors z-50"
      >
        {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isCollapsed ? (
        // Collapsed state - just icons
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#E07A47] flex items-center justify-center">
            <Filter className="h-4 w-4 text-white" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300">
            <Search className="h-4 w-4" />
          </div>
          {hasActiveFilters && (
            <Badge className="bg-[#E07A47] text-white text-xs px-1.5 py-0.5 min-w-0">
              !
            </Badge>
          )}
        </div>
      ) : (
        // Expanded state
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#E07A47]" />
                Filters
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-slate-400 hover:text-white h-7 px-2"
                >
                  Clear All
                </Button>
              )}
            </div>
            <p className="text-sm text-slate-400">
              <span className="font-bold text-white">{resultsCount}</span> properties found
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
            {/* Search */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="text"
                  placeholder="Name, address, market..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-9 h-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus:border-[#E07A47]"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {propertyTypes.map(type => {
                  const Icon = type.icon
                  const isActive = propertyType === type.value
                  return (
                    <button
                      key={type.value}
                      onClick={() => onPropertyTypeChange(type.value)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#E07A47] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {type.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                Price Range
              </label>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map(range => {
                  const isActive = priceRange === range.value
                  return (
                    <button
                      key={range.value}
                      onClick={() => onPriceRangeChange(range.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#E07A47] text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                      )}
                    >
                      {range.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div>
              <button
                onClick={onToggleAdvancedFilters}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border-2",
                  showAdvancedFilters
                    ? "border-[#E07A47] bg-[#E07A47]/10 text-[#E07A47]"
                    : "border-slate-600 text-slate-400 hover:border-slate-500 hover:text-white"
                )}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </button>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="space-y-4 p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Min Cap Rate</label>
                    <Input
                      type="number"
                      placeholder="5.0"
                      value={minCapRate}
                      onChange={(e) => onMinCapRateChange(e.target.value)}
                      className="h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Max Cap Rate</label>
                    <Input
                      type="number"
                      placeholder="8.0"
                      value={maxCapRate}
                      onChange={(e) => onMaxCapRateChange(e.target.value)}
                      className="h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">City</label>
                    <Input
                      placeholder="Austin"
                      value={city}
                      onChange={(e) => onCityChange(e.target.value)}
                      className="h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">State</label>
                    <Input
                      placeholder="TX"
                      value={state}
                      onChange={(e) => onStateChange(e.target.value)}
                      className="h-8 bg-slate-600 border-slate-500 text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* View Mode */}
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
                View Mode
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    viewMode === 'list'
                      ? "bg-[#E07A47] text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
                <button
                  onClick={() => onViewModeChange('map')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    viewMode === 'map'
                      ? "bg-[#E07A47] text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  )}
                >
                  <Map className="h-4 w-4" />
                  Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Building2,
  Home,
  DollarSign,
  Percent,
  Users,
  ArrowLeft,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Target,
  Activity,
} from "lucide-react"

export default function MarketResearchPage() {
  const [selectedMarket, setSelectedMarket] = useState('Austin')
  const [selectedAssetType, setSelectedAssetType] = useState<'all' | 'multifamily' | 'office' | 'industrial' | 'retail'>('all')

  // Mock market data
  const markets = [
    {
      name: "Austin",
      state: "TX",
      population: 2350000,
      populationGrowth: 2.8,
      medianIncome: 87500,
      incomeGrowth: 4.2,
      employmentRate: 96.8,
      majorEmployers: ["Tesla", "Apple", "Dell", "Oracle", "Indeed"],
      multifamily: {
        avgRent: 1685,
        rentGrowth: 6.5,
        occupancy: 94.2,
        avgCapRate: 5.2,
        inventory: 245000,
        underConstruction: 18500,
        absorption: 12500,
      },
      office: {
        avgRent: 42.50,
        rentGrowth: 3.8,
        occupancy: 87.5,
        avgCapRate: 6.8,
        inventory: 85000000,
        underConstruction: 3200000,
        absorption: 1800000,
      },
      industrial: {
        avgRent: 8.75,
        rentGrowth: 12.5,
        occupancy: 96.8,
        avgCapRate: 5.8,
        inventory: 125000000,
        underConstruction: 8500000,
        absorption: 6200000,
      },
      retail: {
        avgRent: 28.50,
        rentGrowth: 2.1,
        occupancy: 92.3,
        avgCapRate: 6.5,
        inventory: 42000000,
        underConstruction: 850000,
        absorption: 520000,
      },
    },
    {
      name: "Dallas",
      state: "TX",
      population: 7640000,
      populationGrowth: 2.2,
      medianIncome: 72500,
      incomeGrowth: 3.5,
      employmentRate: 95.2,
      majorEmployers: ["American Airlines", "AT&T", "ExxonMobil", "Southwest Airlines", "Texas Instruments"],
      multifamily: {
        avgRent: 1520,
        rentGrowth: 5.2,
        occupancy: 93.8,
        avgCapRate: 5.5,
        inventory: 580000,
        underConstruction: 32000,
        absorption: 24000,
      },
      office: {
        avgRent: 38.25,
        rentGrowth: 2.5,
        occupancy: 83.2,
        avgCapRate: 7.2,
        inventory: 250000000,
        underConstruction: 5500000,
        absorption: 2200000,
      },
      industrial: {
        avgRent: 7.50,
        rentGrowth: 11.2,
        occupancy: 97.5,
        avgCapRate: 6.2,
        inventory: 450000000,
        underConstruction: 28000000,
        absorption: 22000000,
      },
      retail: {
        avgRent: 25.75,
        rentGrowth: 1.8,
        occupancy: 91.5,
        avgCapRate: 6.8,
        inventory: 165000000,
        underConstruction: 2800000,
        absorption: 1500000,
      },
    },
    {
      name: "Houston",
      state: "TX",
      population: 7120000,
      populationGrowth: 1.8,
      medianIncome: 68500,
      incomeGrowth: 2.9,
      employmentRate: 94.5,
      majorEmployers: ["ExxonMobil", "Chevron", "Shell", "MD Anderson", "United Airlines"],
      multifamily: {
        avgRent: 1385,
        rentGrowth: 4.8,
        occupancy: 92.5,
        avgCapRate: 5.8,
        inventory: 720000,
        underConstruction: 28000,
        absorption: 19000,
      },
      office: {
        avgRent: 32.50,
        rentGrowth: 1.5,
        occupancy: 81.8,
        avgCapRate: 7.5,
        inventory: 320000000,
        underConstruction: 4200000,
        absorption: 1200000,
      },
      industrial: {
        avgRent: 6.85,
        rentGrowth: 10.5,
        occupancy: 95.2,
        avgCapRate: 6.5,
        inventory: 580000000,
        underConstruction: 38000000,
        absorption: 28000000,
      },
      retail: {
        avgRent: 23.25,
        rentGrowth: 1.2,
        occupancy: 90.2,
        avgCapRate: 7.2,
        inventory: 185000000,
        underConstruction: 1950000,
        absorption: 980000,
      },
    },
  ]

  const currentMarket = markets.find(m => m.name === selectedMarket) || markets[0]

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

  const formatPercent = (value: number) => {
    return value.toFixed(1) + '%'
  }

  const getAssetData = () => {
    switch (selectedAssetType) {
      case 'multifamily': return currentMarket.multifamily
      case 'office': return currentMarket.office
      case 'industrial': return currentMarket.industrial
      case 'retail': return currentMarket.retail
      default: return currentMarket.multifamily
    }
  }

  const assetData = selectedAssetType !== 'all' ? getAssetData() : null

  return (
    <div className="min-h-screen bg-white p-6">
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
            <h1 className="text-4xl font-black mb-2">Market Research</h1>
            <p className="text-muted-foreground">
              Real-time market data and comparable analysis
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-2 border-[#56CCF2]">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button className="bg-[#E07A47] hover:bg-[#E07A47]/90">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Market & Asset Type Selectors */}
        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[#E07A47]" />
                <span className="text-sm font-bold">Market:</span>
              </div>
              {markets.map(market => (
                <Button
                  key={market.name}
                  size="sm"
                  variant={selectedMarket === market.name ? 'default' : 'outline'}
                  onClick={() => setSelectedMarket(market.name)}
                  className={selectedMarket === market.name ? 'bg-[#56CCF2]' : ''}
                >
                  {market.name}, {market.state}
                </Button>
              ))}

              <div className="border-l-2 border-slate-200 mx-2 h-6" />

              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#56CCF2]" />
                <span className="text-sm font-bold">Asset Type:</span>
              </div>
              {[
                { value: 'all', label: 'Overview' },
                { value: 'multifamily', label: 'Multifamily' },
                { value: 'office', label: 'Office' },
                { value: 'industrial', label: 'Industrial' },
                { value: 'retail', label: 'Retail' },
              ].map(type => (
                <Button
                  key={type.value}
                  size="sm"
                  variant={selectedAssetType === type.value ? 'default' : 'outline'}
                  onClick={() => setSelectedAssetType(type.value as any)}
                  className={selectedAssetType === type.value ? 'bg-[#E07A47]' : ''}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Overview */}
        <div>
          <h2 className="text-2xl font-black mb-4">{currentMarket.name} Market Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-4 border-[#56CCF2]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-[#56CCF2]" />
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatPercent(currentMarket.populationGrowth)}
                  </Badge>
                </div>
                <p className="text-3xl font-black">{(currentMarket.population / 1000000).toFixed(2)}M</p>
                <p className="text-sm text-muted-foreground">Population</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-[#E07A47]" />
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {formatPercent(currentMarket.incomeGrowth)}
                  </Badge>
                </div>
                <p className="text-3xl font-black">{formatCurrency(currentMarket.medianIncome)}</p>
                <p className="text-sm text-muted-foreground">Median Income</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="h-5 w-5 text-green-500" />
                </div>
                <p className="text-3xl font-black">{formatPercent(currentMarket.employmentRate)}</p>
                <p className="text-sm text-muted-foreground">Employment Rate</p>
              </CardContent>
            </Card>

            <Card className="border-4 border-purple-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-3xl font-black">{currentMarket.majorEmployers.length}</p>
                <p className="text-sm text-muted-foreground">Major Employers</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Major Employers */}
        <Card className="border-4 border-[#56CCF2]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-[#56CCF2]" />
              Major Employers in {currentMarket.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {currentMarket.majorEmployers.map((employer, idx) => (
                <Badge key={idx} variant="outline" className="border-2 border-[#56CCF2] text-base py-2 px-4">
                  {employer}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Asset Type Details */}
        {selectedAssetType !== 'all' && assetData && (
          <>
            <h2 className="text-2xl font-black mt-8 mb-4 flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-[#E07A47]" />
              {selectedAssetType.charAt(0).toUpperCase() + selectedAssetType.slice(1)} Market Data
            </h2>

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-4 border-[#56CCF2]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="h-5 w-5 text-[#56CCF2]" />
                    <Badge className="bg-green-100 text-green-700">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {formatPercent(assetData.rentGrowth)}
                    </Badge>
                  </div>
                  <p className="text-3xl font-black">
                    {selectedAssetType === 'multifamily' 
                      ? formatCurrency(assetData.avgRent)
                      : `$${assetData.avgRent.toFixed(2)}/SF`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Avg {selectedAssetType === 'multifamily' ? 'Rent' : 'Asking Rent'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47]">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Percent className="h-5 w-5 text-[#E07A47]" />
                  </div>
                  <p className="text-3xl font-black">{formatPercent(assetData.occupancy)}</p>
                  <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-3xl font-black">{formatPercent(assetData.avgCapRate)}</p>
                  <p className="text-sm text-muted-foreground">Avg Cap Rate</p>
                </CardContent>
              </Card>

              <Card className="border-4 border-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <Home className="h-5 w-5 text-purple-500" />
                  </div>
                  <p className="text-2xl font-black">
                    {selectedAssetType === 'multifamily'
                      ? formatNumber(assetData.inventory)
                      : `${(assetData.inventory / 1000000).toFixed(1)}M SF`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">Total Inventory</p>
                </CardContent>
              </Card>
            </div>

            {/* Supply & Demand */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-4 border-[#56CCF2]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#56CCF2]" />
                    Under Construction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-[#56CCF2]">
                    {selectedAssetType === 'multifamily'
                      ? formatNumber(assetData.underConstruction)
                      : `${(assetData.underConstruction / 1000000).toFixed(1)}M SF`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {((assetData.underConstruction / assetData.inventory) * 100).toFixed(1)}% of inventory
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-[#E07A47]">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#E07A47]" />
                    Net Absorption (YTD)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-[#E07A47]">
                    {selectedAssetType === 'multifamily'
                      ? formatNumber(assetData.absorption)
                      : `${(assetData.absorption / 1000000).toFixed(1)}M SF`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {((assetData.absorption / assetData.inventory) * 100).toFixed(1)}% of inventory
                  </p>
                </CardContent>
              </Card>

              <Card className="border-4 border-green-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    Market Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-green-600">
                    {assetData.absorption > assetData.underConstruction ? 'Tight' : 'Balanced'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Absorption {assetData.absorption > assetData.underConstruction ? 'exceeds' : 'trails'} new supply
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Market Insights */}
            <Card className="border-4 border-[#56CCF2]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-6 w-6 text-[#56CCF2]" />
                  Market Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-green-800 dark:text-green-200 mb-1">Strong Rent Growth</p>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {selectedAssetType} rents growing at {formatPercent(assetData.rentGrowth)} YoY, 
                          above {currentMarket.name} average. Favorable for value-add opportunities.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-blue-800 dark:text-blue-200 mb-1">High Occupancy</p>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Occupancy at {formatPercent(assetData.occupancy)} indicates strong demand. 
                          Limited availability may support rent premiums.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg border-2 ${
                    assetData.underConstruction / assetData.inventory > 0.05
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200'
                      : 'bg-green-50 dark:bg-green-900/20 border-green-200'
                  }`}>
                    <div className="flex items-start gap-3">
                      <Building2 className={`h-5 w-5 shrink-0 mt-0.5 ${
                        assetData.underConstruction / assetData.inventory > 0.05
                          ? 'text-yellow-600'
                          : 'text-green-600'
                      }`} />
                      <div>
                        <p className={`font-bold mb-1 ${
                          assetData.underConstruction / assetData.inventory > 0.05
                            ? 'text-yellow-800 dark:text-yellow-200'
                            : 'text-green-800 dark:text-green-200'
                        }`}>
                          {assetData.underConstruction / assetData.inventory > 0.05
                            ? 'Moderate New Supply'
                            : 'Limited New Supply'
                          }
                        </p>
                        <p className={`text-sm ${
                          assetData.underConstruction / assetData.inventory > 0.05
                            ? 'text-yellow-700 dark:text-yellow-300'
                            : 'text-green-700 dark:text-green-300'
                        }`}>
                          {((assetData.underConstruction / assetData.inventory) * 100).toFixed(1)}% of inventory under construction. 
                          {assetData.underConstruction / assetData.inventory > 0.05
                            ? ' Monitor competitive positioning of new projects.'
                            : ' Low supply pressure supports stable fundamentals.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* All Asset Types Overview */}
        {selectedAssetType === 'all' && (
          <>
            <h2 className="text-2xl font-black mt-8 mb-4">All Asset Classes - Quick Compare</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { type: 'multifamily', label: 'Multifamily', data: currentMarket.multifamily, color: 'blue' },
                { type: 'office', label: 'Office', data: currentMarket.office, color: 'purple' },
                { type: 'industrial', label: 'Industrial', data: currentMarket.industrial, color: 'orange' },
                { type: 'retail', label: 'Retail', data: currentMarket.retail, color: 'green' },
              ].map(asset => (
                <Card key={asset.type} className={`border-4 border-${asset.color}-500 hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => setSelectedAssetType(asset.type as any)}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{asset.label}</span>
                      <Badge className={`bg-${asset.color}-100 text-${asset.color}-700`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {formatPercent(asset.data.rentGrowth)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Avg Rent</p>
                        <p className="font-black">
                          {asset.type === 'multifamily'
                            ? formatCurrency(asset.data.avgRent)
                            : `$${asset.data.avgRent.toFixed(2)}`
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Occupancy</p>
                        <p className="font-black">{formatPercent(asset.data.occupancy)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Cap Rate</p>
                        <p className="font-black">{formatPercent(asset.data.avgCapRate)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

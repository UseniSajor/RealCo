"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import {
  Building2,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Target,
  TrendingUp,
  FileText,
  Calculator,
  Home,
  BarChart3,
  Hammer,
  Upload,
  Save,
  X,
  Plus,
  Percent,
  Hash
} from "lucide-react"

export default function NewDealPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    assetType: "Multifamily",
    dealSize: "",
    targetEquity: "",
    ltv: "70",
    projectedIRR: "",
    projectedMultiple: "",
    capRate: "",
    units: "",
    squareFeet: "",
    broker: "",
    source: "Broker",
    notes: ""
  })

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Capital Raised", href: "/dashboard/sponsor/capital-raised", icon: DollarSign },
    { title: "Construction", href: "/dashboard/sponsor/construction", icon: Hammer },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Team", href: "/dashboard/sponsor/team", icon: Users },
    { title: "Documents", href: "/dashboard/sponsor/analytics", icon: FileText },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect back to pipeline
    router.push("/dashboard/sponsor/deal-pipeline")
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName={user?.name || "Sponsor User"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BackButton href="/dashboard/sponsor/deal-pipeline" label="Back to Pipeline" />
              <div>
                <h1 className="text-3xl font-black">Add New Deal</h1>
                <p className="text-muted-foreground">Enter deal information to add to pipeline</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Property Information */}
            <Card className="border-4 border-[#E07A47] mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#E07A47]" />
                  Property Information
                </CardTitle>
                <CardDescription>Basic details about the property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Property Name *</label>
                    <Input
                      placeholder="e.g., Gateway Industrial Park"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Street Address *</label>
                    <Input
                      placeholder="e.g., 8500 Commerce Way"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City *</label>
                    <Input
                      placeholder="e.g., Dallas"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">State *</label>
                      <Input
                        placeholder="TX"
                        value={formData.state}
                        onChange={(e) => handleChange("state", e.target.value)}
                        required
                        className="border-2"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">ZIP Code</label>
                      <Input
                        placeholder="75201"
                        value={formData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Asset Type *</label>
                    <select
                      value={formData.assetType}
                      onChange={(e) => handleChange("assetType", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    >
                      <option value="Multifamily">Multifamily</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                      <option value="Mixed-Use">Mixed-Use</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Units</label>
                    <Input
                      type="number"
                      placeholder="e.g., 250"
                      value={formData.units}
                      onChange={(e) => handleChange("units", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Square Feet</label>
                    <Input
                      type="number"
                      placeholder="e.g., 385000"
                      value={formData.squareFeet}
                      onChange={(e) => handleChange("squareFeet", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card className="border-4 border-purple-500 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-500" />
                  Financial Information
                </CardTitle>
                <CardDescription>Deal economics and projections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deal Size ($) *</label>
                    <Input
                      type="number"
                      placeholder="e.g., 42500000"
                      value={formData.dealSize}
                      onChange={(e) => handleChange("dealSize", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Target Equity ($)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 12750000"
                      value={formData.targetEquity}
                      onChange={(e) => handleChange("targetEquity", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">LTV (%)</label>
                    <Input
                      type="number"
                      placeholder="70"
                      value={formData.ltv}
                      onChange={(e) => handleChange("ltv", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Projected IRR (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 18.5"
                      value={formData.projectedIRR}
                      onChange={(e) => handleChange("projectedIRR", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Equity Multiple (x)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 2.1"
                      value={formData.projectedMultiple}
                      onChange={(e) => handleChange("projectedMultiple", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Cap Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 6.2"
                      value={formData.capRate}
                      onChange={(e) => handleChange("capRate", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Source Information */}
            <Card className="border-4 border-green-500 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-500" />
                  Source Information
                </CardTitle>
                <CardDescription>How did you find this deal?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deal Source</label>
                    <select
                      value={formData.source}
                      onChange={(e) => handleChange("source", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    >
                      <option value="Broker">Broker</option>
                      <option value="Direct">Direct / Off-Market</option>
                      <option value="Auction">Auction</option>
                      <option value="Referral">Referral</option>
                      <option value="Marketing">Marketing Campaign</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Broker / Source Name</label>
                    <Input
                      placeholder="e.g., CBRE"
                      value={formData.broker}
                      onChange={(e) => handleChange("broker", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <textarea
                    placeholder="Additional notes about the deal..."
                    value={formData.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border-2 border-input bg-background resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/sponsor/deal-pipeline")}
                className="border-2"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#E07A47] hover:bg-[#D96835]"
              >
                {isSubmitting ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Add to Pipeline
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

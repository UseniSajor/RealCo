"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BackButton } from "@/components/ui/back-button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  DollarSign,
  FileText,
  TrendingUp,
  Hammer,
  BarChart3,
  Calculator,
  Target,
  Search,
  UserPlus,
  MapPin,
  Home,
  Save,
  X,
  Phone,
  Mail,
  MessageSquare,
  Settings,
  User,
  Globe,
  Tag,
  Briefcase
} from "lucide-react"

export default function NewLeadPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    propertyName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    propertyType: "Multifamily",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactTitle: "",
    source: "Broker Referral",
    estimatedValue: "",
    units: "",
    squareFeet: "",
    notes: "",
    priority: "Normal"
  })

  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
    { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
    { title: "Lead Management", href: "/dashboard/sponsor/leads", icon: UserPlus, badge: "12" },
    { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
    { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
    { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
    { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
    { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
    { title: "Construction", href: "/dashboard/sponsor/construction", icon: Hammer },
    { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
    { title: "Draw Requests", href: "/dashboard/sponsor/draw-request", icon: FileText },
    { title: "Investor CRM", href: "/dashboard/sponsor/investor-relations", icon: Users },
    { title: "Messages", href: "/dashboard/sponsor/team", icon: MessageSquare, badge: "3" },
    { title: "Settings", href: "/dashboard/sponsor/team", icon: Settings },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Redirect back to leads
    router.push("/dashboard/sponsor/leads")
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor Portal"
        roleIcon={Building2}
        userName={user?.name || "Acme Development Group"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <BackButton href="/dashboard/sponsor/leads" label="Back to Leads" />
              <div>
                <h1 className="text-3xl font-black">Add New Lead</h1>
                <p className="text-muted-foreground">Enter property and contact information</p>
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
                <CardDescription>Details about the property opportunity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Property Name *</label>
                    <Input
                      placeholder="e.g., Lakeside Apartments"
                      value={formData.propertyName}
                      onChange={(e) => handleChange("propertyName", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium mb-2 block">Street Address *</label>
                    <Input
                      placeholder="e.g., 4200 Lake Drive"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">City *</label>
                    <Input
                      placeholder="e.g., Austin"
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
                        placeholder="78701"
                        value={formData.zipCode}
                        onChange={(e) => handleChange("zipCode", e.target.value)}
                        className="border-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property Type *</label>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => handleChange("propertyType", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    >
                      <option value="Multifamily">Multifamily</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Office">Office</option>
                      <option value="Retail">Retail</option>
                      <option value="Mixed-Use">Mixed-Use</option>
                      <option value="Student Housing">Student Housing</option>
                      <option value="Medical Office">Medical Office</option>
                      <option value="Land">Land</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Estimated Value ($)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 24500000"
                      value={formData.estimatedValue}
                      onChange={(e) => handleChange("estimatedValue", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Units</label>
                    <Input
                      type="number"
                      placeholder="e.g., 186"
                      value={formData.units}
                      onChange={(e) => handleChange("units", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Square Feet</label>
                    <Input
                      type="number"
                      placeholder="e.g., 250000"
                      value={formData.squareFeet}
                      onChange={(e) => handleChange("squareFeet", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-4 border-[#56CCF2] mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#56CCF2]" />
                  Contact Information
                </CardTitle>
                <CardDescription>Primary contact for this property</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Contact Name *</label>
                    <Input
                      placeholder="e.g., Sarah Johnson"
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title / Role</label>
                    <Input
                      placeholder="e.g., Property Manager"
                      value={formData.contactTitle}
                      onChange={(e) => handleChange("contactTitle", e.target.value)}
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="e.g., sarah@example.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange("contactEmail", e.target.value)}
                      required
                      className="border-2"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      type="tel"
                      placeholder="e.g., (512) 555-0123"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange("contactPhone", e.target.value)}
                      className="border-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lead Source & Priority */}
            <Card className="border-4 border-green-500 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-green-500" />
                  Source & Priority
                </CardTitle>
                <CardDescription>How did you find this lead?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Lead Source *</label>
                    <select
                      value={formData.source}
                      onChange={(e) => handleChange("source", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    >
                      <option value="Broker Referral">Broker Referral</option>
                      <option value="LoopNet">LoopNet</option>
                      <option value="CoStar">CoStar</option>
                      <option value="Direct Seller">Direct Seller</option>
                      <option value="Website Form">Website Form</option>
                      <option value="Cold Call">Cold Call</option>
                      <option value="Networking Event">Networking Event</option>
                      <option value="Referral">Referral</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    >
                      <option value="High">High Priority</option>
                      <option value="Normal">Normal</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Notes</label>
                  <textarea
                    placeholder="Additional notes about this lead..."
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
                onClick={() => router.push("/dashboard/sponsor/leads")}
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
                    Add Lead
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

"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { CapitalRaisedDashboard } from "@/components/finance/CapitalRaisedDashboard"
import {
  Building2,
  Home,
  Search,
  UserPlus,
  MapPin,
  Target,
  Calculator,
  BarChart3,
  TrendingUp,
  DollarSign,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/sponsor", icon: Home },
  { title: "Property Search", href: "/dashboard/sponsor/property-search", icon: Search },
  { title: "Leads", href: "/dashboard/sponsor/leads", icon: UserPlus },
  { title: "Market Research", href: "/dashboard/sponsor/market-research", icon: MapPin },
  { title: "Deal Pipeline", href: "/dashboard/sponsor/deal-pipeline", icon: Target },
  { title: "Underwriting", href: "/dashboard/sponsor/underwriting", icon: Calculator },
  { title: "Analytics", href: "/dashboard/sponsor/analytics", icon: BarChart3 },
  { title: "Capital Raise", href: "/dashboard/sponsor/investor-relations", icon: TrendingUp },
  { title: "Distributions", href: "/dashboard/sponsor/distributions", icon: DollarSign },
]

export default function SponsorCapitalRaisedPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Sponsor"
        roleIcon={Building2}
        userName={user?.email || "Sponsor User"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-6xl px-6 py-12 mx-auto">
          <CapitalRaisedDashboard />
        </div>
      </main>
    </div>
  )
}

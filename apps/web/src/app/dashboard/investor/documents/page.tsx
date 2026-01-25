"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { DocumentCenter } from "@/components/finance/DocumentCenter"
import { useAuth } from "@/lib/auth-context"
import {
  Home,
  TrendingUp,
  BarChart3,
  Receipt,
  FileText,
  Calculator,
  CreditCard,
  Calendar,
  Briefcase,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: Home },
  { title: "Invest", href: "/dashboard/investor/invest", icon: TrendingUp },
  { title: "Portfolio", href: "/dashboard/investor/portfolio-analytics", icon: BarChart3 },
  { title: "Transactions", href: "/dashboard/investor/transactions", icon: Receipt },
  { title: "Documents", href: "/dashboard/investor/documents", icon: FileText },
  { title: "Tax Center", href: "/dashboard/investor/tax-center", icon: Calculator },
  { title: "Banking", href: "/dashboard/investor/banking", icon: CreditCard },
  { title: "Events", href: "/dashboard/investor/events", icon: Calendar },
]

export default function InvestorDocumentsPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Investor Portal"
        roleIcon={Briefcase}
        userName={user?.name || "Investor"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        <div className="container max-w-6xl px-8 py-8 mx-auto">
          <DocumentCenter />
        </div>
      </main>
    </div>
  )
}

"use client"

import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { useAuth } from "@/lib/auth-context"
import { InvoiceSubmission } from "@/components/finance/InvoiceSubmission"
import { BackButton } from "@/components/ui/back-button"
import {
  Wrench,
  Home,
  Upload,
  Receipt,
  CreditCard,
  Target,
  ClipboardList,
  CheckCircle2,
  Shield
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/provider", icon: Home },
  { title: "Submit Invoice", href: "/dashboard/provider/submit-invoice", icon: Upload },
  { title: "Transactions", href: "/dashboard/provider/transactions", icon: Receipt },
  { title: "Banking", href: "/dashboard/provider/banking", icon: CreditCard },
  { title: "Vendor Portal", href: "/dashboard/provider/vendor-portal", icon: Target },
  { title: "Daily Logs", href: "/dashboard/provider/daily-logs", icon: ClipboardList },
  { title: "Inspections", href: "/dashboard/provider/inspections", icon: CheckCircle2 },
  { title: "Safety", href: "/dashboard/provider/safety", icon: Shield },
]

export default function ProviderInvoicePage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Service Provider"
        roleIcon={Wrench}
        userName={user?.name || "BuildRight Construction"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <BackButton href="/dashboard/provider" />
            <h1 className="text-3xl font-black">Submit Invoice</h1>
          </div>

          <InvoiceSubmission />
        </div>
      </main>
    </div>
  )
}

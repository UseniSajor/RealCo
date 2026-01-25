"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"

interface SidebarItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

interface DashboardSidebarProps {
  items: SidebarItem[]
  role: string
  roleIcon: LucideIcon
  userName: string
  onLogout?: () => void
}

export function DashboardSidebar({ items, role, roleIcon: RoleIcon, userName, onLogout }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#56CCF2] border-r border-[#56CCF2] flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center">
            <RoleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg">{role}</h2>
            <p className="text-xs text-white/70">{userName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12",
                  isActive
                    ? "bg-[#E07A47] text-white hover:bg-[#E07A47]/90"
                    : "text-white hover:bg-white/20 hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-[#56CCF2] text-white">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/20 space-y-2">
        <Link href="/dashboard">
          <Button variant="outline" className="w-full text-white border-white hover:bg-white/20" size="sm">
            Switch Role
          </Button>
        </Link>
        {onLogout && (
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-white/20 hover:text-white"
            size="sm"
            onClick={onLogout}
          >
            Sign Out
          </Button>
        )}
      </div>
    </aside>
  )
}

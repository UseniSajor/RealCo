"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon, LogOut, ArrowLeftRight } from "lucide-react"
import { useState } from "react"

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
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <aside className="fixed left-0 top-0 h-screen w-24 bg-gradient-to-b from-[#56CCF2] to-[#3BB5E0] border-r-4 border-[#E07A47] flex flex-col overflow-y-auto z-50 shadow-xl">
      {/* Header - Role Icon */}
      <div className="p-4 border-b border-white/20 flex flex-col items-center">
        <Link href="/dashboard" className="group relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E07A47] to-[#D96835] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <RoleIcon className="h-8 w-8 text-white" />
          </div>
          {/* Tooltip */}
          <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-[100] pointer-events-none shadow-2xl">
            <div>{role}</div>
            <div className="text-xs text-slate-400 font-normal">{userName}</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        </Link>
      </div>

      {/* Navigation - Icons Only */}
      <nav className="flex-1 py-4 px-3 space-y-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const isHovered = hoveredItem === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative block"
            >
              <div
                className={cn(
                  "w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-200 relative",
                  isActive
                    ? "bg-[#E07A47] text-white shadow-lg scale-105"
                    : "text-white hover:bg-white/20 hover:scale-105"
                )}
              >
                <Icon className="h-7 w-7" />
                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[22px] h-6 px-1.5 text-xs font-bold rounded-full bg-[#E07A47] text-white flex items-center justify-center shadow-md border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Tooltip */}
              <div
                className={cn(
                  "absolute left-full ml-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg whitespace-nowrap z-[100] pointer-events-none shadow-2xl transition-all duration-200",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                )}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#E07A47]">
                    {item.badge}
                  </span>
                )}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Action Icons */}
      <div className="p-3 border-t border-white/20 space-y-2">
        {/* Switch Role */}
        <Link
          href="/dashboard"
          className="relative block group"
        >
          <div className="w-14 h-12 mx-auto rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
            Switch Role
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        </Link>

        {/* Sign Out */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="relative block w-full group"
          >
            <div className="w-14 h-12 mx-auto rounded-xl flex items-center justify-center text-white hover:bg-red-500/80 transition-all">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
              Sign Out
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900 rotate-45"></div>
            </div>
          </button>
        )}
      </div>
    </aside>
  )
}

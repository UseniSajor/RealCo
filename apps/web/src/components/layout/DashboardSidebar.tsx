"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon, LogOut, ArrowLeftRight, Settings } from "lucide-react"
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
    <aside className="fixed left-0 top-0 h-screen w-24 bg-slate-900 border-r-4 border-[#E07A47] flex flex-col overflow-hidden z-50 shadow-xl">
      {/* Header - Role Icon */}
      <div className="p-4 border-b border-slate-700 flex flex-col items-center">
        <Link href="/dashboard" className="group relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E07A47] to-[#D96835] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            <RoleIcon className="h-8 w-8 text-white" />
          </div>
          {/* Tooltip - positioned outside sidebar */}
          <div className="fixed left-28 px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-[9999] pointer-events-none shadow-2xl border border-slate-700" style={{ top: 'var(--tooltip-y, 50%)' }}>
            <div>{role}</div>
            <div className="text-xs text-slate-400 font-normal">{userName}</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        </Link>
      </div>

      {/* Navigation - Icons Only */}
      <nav className="flex-1 py-4 px-3 space-y-2 overflow-y-auto scrollbar-hide">
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
                    : "text-slate-300 hover:bg-slate-800 hover:text-white hover:scale-105"
                )}
              >
                <Icon className="h-7 w-7" />
                {/* Badge */}
                {item.badge && (
                  <span className="absolute -top-1 -right-1 min-w-[22px] h-6 px-1.5 text-xs font-bold rounded-full bg-[#E07A47] text-white flex items-center justify-center shadow-md border-2 border-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Tooltip - Fixed positioning outside sidebar */}
              <div
                className={cn(
                  "fixed left-28 px-4 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg whitespace-nowrap z-[9999] pointer-events-none shadow-2xl border border-slate-700 transition-all duration-200",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                style={{
                  top: isHovered ? `${document.querySelector(`[href="${item.href}"]`)?.getBoundingClientRect().top ?? 0 + 32}px` : '0px'
                }}
              >
                {item.title}
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#E07A47]">
                    {item.badge}
                  </span>
                )}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Action Icons */}
      <div className="p-3 border-t border-slate-700 space-y-2">
        {/* Settings */}
        <Link
          href="/dashboard"
          className="relative block group"
        >
          <div className="w-14 h-12 mx-auto rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Settings className="h-5 w-5" />
          </div>
          <div className="fixed left-28 top-auto px-3 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none shadow-xl border border-slate-700">
            Settings
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        </Link>

        {/* Switch Role */}
        <Link
          href="/dashboard"
          className="relative block group"
        >
          <div className="w-14 h-12 mx-auto rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
          <div className="fixed left-28 top-auto px-3 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none shadow-xl border border-slate-700">
            Switch Role
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
          </div>
        </Link>

        {/* Sign Out */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="relative block w-full group"
          >
            <div className="w-14 h-12 mx-auto rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-600 hover:text-white transition-all">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="fixed left-28 top-auto px-3 py-2 bg-slate-800 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-[9999] pointer-events-none shadow-xl border border-slate-700">
              Sign Out
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-800 rotate-45 border-l border-b border-slate-700"></div>
            </div>
          </button>
        )}
      </div>
    </aside>
  )
}

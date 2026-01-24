"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LucideIcon } from "lucide-react"
import { DarkModeToggle } from "./DarkModeToggle"

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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-realco-blue border-r border-white/10 flex flex-col overflow-y-auto z-40">
      {/* Header with circular icon */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 shape-circle bg-white/20 backdrop-blur flex items-center justify-center">
            <RoleIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg text-contrast">{role}</h2>
            <p className="text-xs text-white/90 text-contrast">{userName}</p>
          </div>
        </div>
      </div>

      {/* Navigation with circular active indicators */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 h-12 shape-oval text-contrast font-medium transition-all",
                  isActive
                    ? "bg-realco-orange text-white hover:bg-realco-orange/90 shadow-lg scale-105"
                    : "text-white/90 hover:bg-white/10 hover:text-white hover:scale-102"
                )}
              >
                <div className={cn(
                  "w-8 h-8 shape-circle flex items-center justify-center",
                  isActive ? "bg-white/20" : "bg-white/10"
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-left">{item.title}</span>
                {item.badge && (
                  <span className="px-2.5 py-0.5 text-xs shape-circle bg-realco-orange text-white font-bold shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* Footer with oval buttons */}
      <div className="p-4 border-t border-white/20 space-y-3">
        {/* Dark Mode Toggle */}
        <div className="flex justify-center">
          <DarkModeToggle />
        </div>
        
        <Link href="/dashboard">
          <Button 
            variant="outline" 
            className="w-full shape-oval border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 text-contrast font-semibold" 
            size="sm"
          >
            Switch Role
          </Button>
        </Link>
        {onLogout && (
          <Button 
            variant="ghost" 
            className="w-full text-white/80 hover:text-white hover:bg-white/10 shape-oval text-contrast" 
            size="sm"
            onClick={onLogout}
          >
            Exit Demo
          </Button>
        )}
      </div>
    </aside>
  )
}

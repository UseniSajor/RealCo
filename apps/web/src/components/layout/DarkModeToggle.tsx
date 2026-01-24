"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-14 shape-circle bg-gray-100 dark:bg-realco-gray-dark" />
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        w-14 h-14 shape-circle p-0 transition-all duration-300 shadow-lg hover:scale-110
        ${isDark 
          ? 'bg-realco-gray text-white hover:bg-realco-gray/90' 
          : 'bg-white text-realco-navy hover:bg-gray-50 border-2 border-gray-200'
        }
      `}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
    </Button>
  )
}

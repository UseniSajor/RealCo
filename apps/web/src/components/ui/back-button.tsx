"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  href: string
  label?: string
}

export function BackButton({ href, label = "Back to Dashboard" }: BackButtonProps) {
  return (
    <Button
      asChild
      className="bg-[#E07A47] hover:bg-[#D96835] text-white rounded-full px-6"
    >
      <Link href={href}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </Button>
  )
}

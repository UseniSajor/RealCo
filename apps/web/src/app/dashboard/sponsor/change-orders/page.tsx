"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { ChangeOrderManager } from "@/components/construction/ChangeOrderManager"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SponsorChangeOrdersPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-12 min-h-screen bg-muted/30">
        <div className="container max-w-6xl px-6 mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/sponsor/construction">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Construction
            </Link>
          </Button>

          <ChangeOrderManager />
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

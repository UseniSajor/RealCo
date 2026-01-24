"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, ArrowLeft, Home } from "lucide-react"

interface DemoModeNoticeProps {
  feature: string
  dashboardHref?: string
  description?: string
}

export function DemoModeNotice({
  feature,
  dashboardHref = "/dashboard",
  description
}: DemoModeNoticeProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full border-4 border-[#56CCF2] bg-slate-50">
        <CardHeader className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-[#56CCF2]" />
          </div>
          <CardTitle className="text-3xl font-black mb-2">
            Not Available in Demo Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-xl font-bold text-[#E07A47]">
              {feature}
            </p>
            <p className="text-muted-foreground">
              {description || `This feature is not available in demo mode. Sign up for a free account to access ${feature.toLowerCase()} and all platform features.`}
            </p>
          </div>

          <div className="bg-gradient-to-r from-[#56CCF2]/10 to-[#E07A47]/10 border-2 border-[#56CCF2] rounded-xl p-6">
            <h3 className="font-bold text-lg mb-2">Ready to Get Started?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your free account and unlock all features including:
            </p>
            <ul className="text-sm text-left space-y-2 mb-4 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-[#56CCF2] mt-1">✓</span>
                <span>Full access to all dashboard features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#56CCF2] mt-1">✓</span>
                <span>Real-time data and analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#56CCF2] mt-1">✓</span>
                <span>Document management and storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#56CCF2] mt-1">✓</span>
                <span>Investor relations tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#56CCF2] mt-1">✓</span>
                <span>Payment processing and distributions</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-[#E07A47] hover:bg-[#D96835] text-white font-bold rounded-full">
              <Link href="/signup">
                Start Free Trial
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={dashboardHref}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t border-slate-200">
            <Button asChild variant="ghost" size="sm">
              <Link href="/" className="text-muted-foreground">
                <Home className="mr-2 h-4 w-4" />
                Go to Homepage
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

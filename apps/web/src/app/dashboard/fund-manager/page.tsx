"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Building2, 
  DollarSign, 
  FileText, 
  BarChart3,
  Users,
  TrendingUp,
  Home,
  LogOut,
  Calculator,
  Mail
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function FundManagerDashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-[#E07A47]" />
            <div>
              <h1 className="text-2xl font-black text-white">Fund Manager Portal</h1>
              <p className="text-xs text-gray-400">Elite Asset Management</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white" asChild>
              <Link href="/dashboard">
                <Home className="h-4 w-4 mr-2" />
                Switch Role
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="text-white" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center pt-20 pb-8">
        <div className="container max-w-6xl px-6">
          {/* Central Stats Card */}
          <Card className="border-4 border-[#E07A47] bg-black/40 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <Building2 className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">24</div>
                  <p className="text-sm text-gray-400">Properties Managed</p>
                </div>
                <div>
                  <DollarSign className="h-8 w-8 text-[#E07A47] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">$485M</div>
                  <p className="text-sm text-gray-400">Assets Under Mgmt</p>
                </div>
                <div>
                  <Users className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">1,247</div>
                  <p className="text-sm text-gray-400">Total Investors</p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">11.2%</div>
                  <p className="text-sm text-gray-400">Avg IRR</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/dashboard/fund-manager/properties">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Building2 className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Properties</h3>
                  <p className="text-sm text-gray-400">Asset management</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/fund-manager/analytics">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Analytics</h3>
                  <p className="text-sm text-gray-400">Performance data</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/fund-manager/financials">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Calculator className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Financials</h3>
                  <p className="text-sm text-gray-400">P&L statements</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/fund-manager/distributions">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <DollarSign className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Distributions</h3>
                  <p className="text-sm text-gray-400">Process payments</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/fund-manager/communications">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Mail className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Communications</h3>
                  <p className="text-sm text-gray-400">Investor updates</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/fund-manager/reports">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Reports</h3>
                  <p className="text-sm text-gray-400">Generate reports</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-6 py-3 text-center">
          <p className="text-sm text-gray-400">
            <span className="text-[#E07A47] font-bold">DEMO MODE</span> - Explore all features with sample data • 
            <Link href="/signup" className="text-[#56CCF2] hover:underline ml-2">Start Free Trial →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  PieChart,
  CreditCard,
  Download,
  Home,
  LogOut,
  Receipt,
  Briefcase
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function InvestorDashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-[#56CCF2]" />
            <div>
              <h1 className="text-2xl font-black text-white">Investor Portal</h1>
              <p className="text-xs text-gray-400">John Smith • Accredited Investor</p>
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
          <Card className="border-4 border-[#56CCF2] bg-black/40 backdrop-blur-xl mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <DollarSign className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">$2.5M</div>
                  <p className="text-sm text-gray-400">Total Invested</p>
                </div>
                <div>
                  <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">$3.2M</div>
                  <p className="text-sm text-gray-400">Current Value</p>
                </div>
                <div>
                  <DollarSign className="h-8 w-8 text-[#E07A47] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">$245K</div>
                  <p className="text-sm text-gray-400">Distributions YTD</p>
                </div>
                <div>
                  <Briefcase className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">12</div>
                  <p className="text-sm text-gray-400">Active Investments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Grid */}
          <div className="grid grid-cols-3 gap-4">
            <Link href="/dashboard/investor/portfolio-analytics">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <PieChart className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Portfolio</h3>
                  <p className="text-sm text-gray-400">View investments</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investor/invest">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <DollarSign className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Invest</h3>
                  <p className="text-sm text-gray-400">New opportunities</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investor/transactions">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Receipt className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Transactions</h3>
                  <p className="text-sm text-gray-400">Payment history</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investor/banking">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <CreditCard className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Banking</h3>
                  <p className="text-sm text-gray-400">Manage accounts</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investor/tax-center">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <FileText className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Tax Center</h3>
                  <p className="text-sm text-gray-400">K-1s & 1099s</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/investor/documents">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Download className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Documents</h3>
                  <p className="text-sm text-gray-400">All files</p>
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
            <span className="text-[#56CCF2] font-bold">DEMO MODE</span> - Explore all features with sample data • 
            <Link href="/signup" className="text-[#E07A47] hover:underline ml-2">Start Free Trial →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

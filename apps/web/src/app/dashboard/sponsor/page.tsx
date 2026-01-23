"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Building2, 
  Search,
  UserPlus,
  MapPin,
  Target,
  Calculator,
  BarChart3,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowLeft,
  Home,
  LogOut
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SponsorDashboardPage() {
  const { logout } = useAuth()

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      {/* Top Navigation Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="h-8 w-8 text-[#E07A47]" />
            <div>
              <h1 className="text-2xl font-black text-white">Sponsor Portal</h1>
              <p className="text-xs text-gray-400">Acme Development Group</p>
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
                  <DollarSign className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">$32.5M</div>
                  <p className="text-sm text-gray-400">Capital Raised</p>
                </div>
                <div>
                  <Building2 className="h-8 w-8 text-[#E07A47] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">8</div>
                  <p className="text-sm text-gray-400">Active Projects</p>
                </div>
                <div>
                  <Users className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">342</div>
                  <p className="text-sm text-gray-400">Total Investors</p>
                </div>
                <div>
                  <AlertTriangle className="h-8 w-8 text-[#E07A47] mx-auto mb-2" />
                  <div className="text-3xl font-black text-white">7</div>
                  <p className="text-sm text-gray-400">Pending Tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Grid */}
          <div className="grid grid-cols-3 gap-4">
            {/* Deal Sourcing */}
            <Link href="/dashboard/sponsor/property-search">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Search className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Property Search</h3>
                  <p className="text-sm text-gray-400">Find opportunities</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/sponsor/leads">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <UserPlus className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Lead Management</h3>
                  <p className="text-sm text-gray-400">Track leads</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/sponsor/market-research">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <MapPin className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Market Research</h3>
                  <p className="text-sm text-gray-400">Analyze markets</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/sponsor/deal-pipeline">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Target className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Deal Pipeline</h3>
                  <p className="text-sm text-gray-400">Manage deals</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/sponsor/underwriting">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <Calculator className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Underwriting</h3>
                  <p className="text-sm text-gray-400">Financial models</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/sponsor/analytics">
              <Card className="h-40 border-4 border-[#56CCF2] hover:border-[#E07A47] transition-all cursor-pointer group bg-black/40 backdrop-blur-xl hover:bg-black/60">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <BarChart3 className="h-12 w-12 text-[#56CCF2] group-hover:text-[#E07A47] transition-colors mb-3" />
                  <h3 className="text-xl font-black text-white mb-1">Analytics</h3>
                  <p className="text-sm text-gray-400">Reports & insights</p>
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

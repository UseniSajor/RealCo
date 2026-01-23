"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Building2, TrendingUp, Wrench, Building, ArrowLeft } from "lucide-react"

export default function DashboardPage() {
  const roles = [
    {
      icon: Building2,
      title: "Sponsor Portal",
      description: "Raise capital and manage real estate projects",
      href: "/dashboard/sponsor",
      gradient: "from-orange-500 to-red-500",
      features: ["Property Search & Leads", "Deal Pipeline", "Underwriting", "Analytics"]
    },
    {
      icon: TrendingUp,
      title: "Investor Portal",
      description: "Track investments and portfolio performance",
      href: "/dashboard/investor",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Portfolio Analytics", "Investments", "Tax Documents", "Distributions"]
    },
    {
      icon: Building,
      title: "Fund Manager",
      description: "Manage assets and investor relations",
      href: "/dashboard/fund-manager",
      gradient: "from-purple-500 to-pink-500",
      features: ["Asset Management", "Financial Reporting", "Distributions", "Analytics"]
    },
    {
      icon: Wrench,
      title: "Service Provider",
      description: "Submit invoices and track project work",
      href: "/dashboard/provider",
      gradient: "from-amber-500 to-orange-500",
      features: ["Vendor Portal", "Invoice Submission", "Payments", "Compliance"]
    },
  ]

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-bold">Back to Home</span>
          </Link>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="bg-[#E07A47] hover:bg-[#E07A47]/90" asChild>
              <Link href="/signup">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pt-20 pb-8">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-black text-white mb-4">
              Choose Your Portal
            </h1>
            <p className="text-xl text-gray-300 mb-2">
              Experience RealCo from different perspectives
            </p>
            <p className="text-gray-400">
              All demo portals use sample data • No login required
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Link key={role.title} href={role.href} className="group">
                  <Card className="h-full border-4 border-white/20 hover:border-[#E07A47] transition-all duration-300 bg-black/40 backdrop-blur-xl hover:bg-black/60 hover:scale-105 hover:shadow-2xl">
                    <CardContent className="p-6 flex flex-col h-full">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      
                      {/* Title & Description */}
                      <h3 className="text-2xl font-black text-white mb-2 group-hover:text-[#E07A47] transition-colors">
                        {role.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 flex-grow">
                        {role.description}
                      </p>
                      
                      {/* Features */}
                      <div className="space-y-2 mb-4">
                        {role.features.map((feature, i) => (
                          <div key={i} className="text-xs text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#56CCF2]"></div>
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Button */}
                      <Button className="w-full bg-gradient-to-r from-[#56CCF2] to-[#E07A47] hover:opacity-90 transition-opacity">
                        Enter Portal →
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Info Bar */}
          <div className="mt-12 text-center">
            <Card className="border-4 border-[#56CCF2] bg-black/40 backdrop-blur-xl inline-block">
              <CardContent className="p-6">
                <p className="text-white font-bold mb-2">
                  🎯 DEMO MODE ACTIVE
                </p>
                <p className="text-gray-400 text-sm">
                  Explore all features with sample data • When you're ready, 
                  <Link href="/signup" className="text-[#E07A47] hover:underline ml-1">
                    sign up for a free trial
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="container mx-auto px-6 py-3 flex items-center justify-center gap-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>•</span>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-white transition-colors">Contact Sales</Link>
        </div>
      </div>
    </div>
  )
}

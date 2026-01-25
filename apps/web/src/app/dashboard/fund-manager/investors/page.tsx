"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState } from "react"
import {
  ArrowLeft,
  Search,
  Filter,
  Users,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  Building2,
  FileText,
  Download,
  Plus,
  MoreHorizontal,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Briefcase,
  Eye,
  MessageSquare
} from "lucide-react"

// Mock investor data
const MOCK_INVESTORS = [
  {
    id: "inv_001",
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "(555) 123-4567",
    company: "Chen Family Office",
    type: "ACCREDITED",
    status: "ACTIVE",
    totalInvested: 2500000,
    activeInvestments: 3,
    joinedDate: "2022-03-15",
    lastActivity: "2024-01-20",
    preferredComm: "EMAIL",
    notes: "High net worth individual, interested in multifamily",
    rating: 5
  },
  {
    id: "inv_002",
    name: "Michael Rodriguez",
    email: "michael.r@investcorp.com",
    phone: "(555) 234-5678",
    company: "InvestCorp Partners",
    type: "INSTITUTIONAL",
    status: "ACTIVE",
    totalInvested: 15000000,
    activeInvestments: 5,
    joinedDate: "2021-06-01",
    lastActivity: "2024-01-22",
    preferredComm: "PHONE",
    notes: "Institutional investor, large allocations",
    rating: 5
  },
  {
    id: "inv_003",
    name: "Emily Watson",
    email: "ewatson@wealthmgmt.com",
    phone: "(555) 345-6789",
    company: "Watson Wealth Management",
    type: "ACCREDITED",
    status: "ACTIVE",
    totalInvested: 750000,
    activeInvestments: 2,
    joinedDate: "2023-01-10",
    lastActivity: "2024-01-18",
    preferredComm: "EMAIL",
    notes: "New investor, conservative allocation preference",
    rating: 4
  },
  {
    id: "inv_004",
    name: "David Kim",
    email: "dkim@techventures.com",
    phone: "(555) 456-7890",
    company: "Tech Ventures LLC",
    type: "QUALIFIED",
    status: "PROSPECT",
    totalInvested: 0,
    activeInvestments: 0,
    joinedDate: "2024-01-05",
    lastActivity: "2024-01-21",
    preferredComm: "EMAIL",
    notes: "Interested in tech-focused properties",
    rating: 3
  },
  {
    id: "inv_005",
    name: "Jennifer Thompson",
    email: "jennifer.t@gmail.com",
    phone: "(555) 567-8901",
    company: "",
    type: "ACCREDITED",
    status: "INACTIVE",
    totalInvested: 500000,
    activeInvestments: 1,
    joinedDate: "2020-08-20",
    lastActivity: "2023-06-15",
    preferredComm: "PHONE",
    notes: "Previous investor, may re-engage",
    rating: 4
  }
]

// Mock vendor data
const MOCK_VENDORS = [
  {
    id: "vnd_001",
    name: "ABC Construction",
    email: "contact@abcconstruction.com",
    phone: "(555) 111-2222",
    type: "GENERAL_CONTRACTOR",
    status: "ACTIVE",
    totalProjects: 8,
    activeProjects: 2,
    rating: 5,
    location: "Austin, TX"
  },
  {
    id: "vnd_002",
    name: "Legal Partners LLP",
    email: "info@legalpartners.com",
    phone: "(555) 222-3333",
    type: "LEGAL",
    status: "ACTIVE",
    totalProjects: 15,
    activeProjects: 4,
    rating: 5,
    location: "New York, NY"
  },
  {
    id: "vnd_003",
    name: "Premier Property Management",
    email: "hello@premierpm.com",
    phone: "(555) 333-4444",
    type: "PROPERTY_MANAGEMENT",
    status: "ACTIVE",
    totalProjects: 12,
    activeProjects: 6,
    rating: 4,
    location: "San Diego, CA"
  }
]

export default function FundManagerInvestorsPage() {
  const [activeTab, setActiveTab] = useState<'investors' | 'vendors'>('investors')
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredInvestors = MOCK_INVESTORS.filter(inv => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false
    if (searchQuery && !inv.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inv.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !inv.company.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const filteredVendors = MOCK_VENDORS.filter(vnd => {
    if (searchQuery && !vnd.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !vnd.email.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-300'
      case 'PROSPECT': return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'INACTIVE': return 'bg-slate-100 text-slate-600 border-slate-300'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INSTITUTIONAL': return 'bg-purple-100 text-purple-700'
      case 'ACCREDITED': return 'bg-[#E07A47]/10 text-[#E07A47]'
      case 'QUALIFIED': return 'bg-blue-100 text-blue-700'
      default: return 'bg-slate-100 text-slate-600'
    }
  }

  return (
    <>
      <MarketingNav />

      <section className="py-12 min-h-screen bg-white">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard/fund-manager">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black mb-2">CRM & Relationships</h1>
              <p className="text-muted-foreground">
                Manage investors, vendors, and business relationships
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-2 border-[#E07A47]">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button className="bg-[#E07A47] hover:bg-[#D96835]">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-4 border-[#E07A47]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Investors</p>
                    <p className="text-3xl font-black">{MOCK_INVESTORS.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-[#E07A47]" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-green-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Investors</p>
                    <p className="text-3xl font-black">{MOCK_INVESTORS.filter(i => i.status === 'ACTIVE').length}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-purple-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total AUM</p>
                    <p className="text-3xl font-black">{formatCurrency(MOCK_INVESTORS.reduce((acc, inv) => acc + inv.totalInvested, 0))}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Prospects</p>
                    <p className="text-3xl font-black">{MOCK_INVESTORS.filter(i => i.status === 'PROSPECT').length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === 'investors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('investors')}
              className={activeTab === 'investors' ? 'bg-[#E07A47] hover:bg-[#D96835]' : 'border-2'}
            >
              <Users className="mr-2 h-4 w-4" />
              Investors ({MOCK_INVESTORS.length})
            </Button>
            <Button
              variant={activeTab === 'vendors' ? 'default' : 'outline'}
              onClick={() => setActiveTab('vendors')}
              className={activeTab === 'vendors' ? 'bg-[#E07A47] hover:bg-[#D96835]' : 'border-2'}
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Vendors ({MOCK_VENDORS.length})
            </Button>
          </div>

          {/* Search & Filters */}
          <Card className="border-4 border-slate-200 mb-6">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {activeTab === 'investors' && (
                  <div className="flex gap-2">
                    {['all', 'ACTIVE', 'PROSPECT', 'INACTIVE'].map(status => (
                      <Button
                        key={status}
                        size="sm"
                        variant={statusFilter === status ? 'default' : 'outline'}
                        onClick={() => setStatusFilter(status)}
                        className={statusFilter === status ? 'bg-[#E07A47]' : ''}
                      >
                        {status === 'all' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase()}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Investor List */}
          {activeTab === 'investors' && (
            <div className="space-y-4">
              {filteredInvestors.map(investor => (
                <Card key={investor.id} className="border-4 border-[#E07A47] hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E07A47] to-[#D96835] flex items-center justify-center text-white font-black text-xl">
                          {investor.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-black text-xl">{investor.name}</h3>
                            <Badge className={getStatusColor(investor.status)}>
                              {investor.status}
                            </Badge>
                            <Badge className={getTypeColor(investor.type)}>
                              {investor.type}
                            </Badge>
                          </div>
                          {investor.company && (
                            <p className="text-muted-foreground mb-2">{investor.company}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {investor.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {investor.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-black text-[#E07A47]">
                          {formatCurrency(investor.totalInvested)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {investor.activeInvestments} active investments
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < investor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-6 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(investor.joinedDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Last activity {new Date(investor.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Vendor List */}
          {activeTab === 'vendors' && (
            <div className="space-y-4">
              {filteredVendors.map(vendor => (
                <Card key={vendor.id} className="border-4 border-purple-500 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white">
                          <Briefcase className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-black text-xl">{vendor.name}</h3>
                            <Badge className="bg-purple-100 text-purple-700">
                              {vendor.type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-2">{vendor.location}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {vendor.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {vendor.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-purple-600">
                          {vendor.totalProjects} Projects
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {vendor.activeProjects} active
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < vendor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 pt-4 border-t">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <FileText className="mr-2 h-4 w-4" />
                          View Contracts
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

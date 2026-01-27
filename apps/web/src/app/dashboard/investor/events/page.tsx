"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  TrendingUp,
  BarChart3,
  Receipt,
  FileText,
  Calculator,
  CreditCard,
  Briefcase,
} from "lucide-react"

const sidebarItems = [
  { title: "Dashboard", href: "/dashboard/investor", icon: Home },
  { title: "Invest", href: "/dashboard/investor/invest", icon: TrendingUp },
  { title: "Portfolio", href: "/dashboard/investor/portfolio-analytics", icon: BarChart3 },
  { title: "Transactions", href: "/dashboard/investor/transactions", icon: Receipt },
  { title: "Documents", href: "/dashboard/investor/documents", icon: FileText },
  { title: "Tax Center", href: "/dashboard/investor/tax-center", icon: Calculator },
  { title: "Banking", href: "/dashboard/investor/banking", icon: CreditCard },
  { title: "Events", href: "/dashboard/investor/events", icon: Calendar },
]

export default function EventsPage() {
  const { user, logout } = useAuth()
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'past'>('upcoming')

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Annual Investor Meeting 2024",
      date: "2024-03-15",
      time: "2:00 PM - 5:00 PM CST",
      location: "Austin Convention Center",
      address: "500 E Cesar Chavez St, Austin, TX 78701",
      type: "Annual Meeting",
      description: "Join us for our 2024 annual investor meeting featuring portfolio performance review, market outlook, and networking opportunities.",
      attendees: 250,
      capacity: 300,
      rsvpStatus: "pending",
      rsvpDeadline: "2024-03-08",
      status: "upcoming",
      agenda: [
        "Portfolio Performance Review (2:00 PM)",
        "2024 Market Outlook (3:00 PM)",
        "Q&A Session (4:00 PM)",
        "Networking Reception (4:30 PM)",
      ],
    },
    {
      id: 2,
      title: "Riverside Apartments Property Tour",
      date: "2024-02-20",
      time: "10:00 AM - 12:00 PM CST",
      location: "Riverside Apartments",
      address: "1500 Riverside Dr, Austin, TX 78704",
      type: "Property Tour",
      description: "Exclusive property tour of Riverside Apartments featuring recent renovations and value-add improvements.",
      attendees: 18,
      capacity: 25,
      rsvpStatus: "attending",
      rsvpDeadline: "2024-02-13",
      status: "upcoming",
      agenda: [
        "Property Overview (10:00 AM)",
        "Model Unit Tour (10:30 AM)",
        "Amenities Walkthrough (11:00 AM)",
        "Q&A with Property Manager (11:30 AM)",
      ],
    },
    {
      id: 3,
      title: "Q4 2023 Performance Webinar",
      date: "2024-01-25",
      time: "12:00 PM - 1:00 PM CST",
      location: "Virtual Event (Zoom)",
      address: null,
      type: "Webinar",
      description: "Review Q4 2023 performance across all portfolio properties and discuss distribution details.",
      attendees: 156,
      capacity: 500,
      rsvpStatus: "attended",
      rsvpDeadline: "2024-01-24",
      status: "past",
      agenda: [
        "Q4 Performance Highlights",
        "Distribution Breakdown",
        "Market Update",
        "Live Q&A",
      ],
    },
    {
      id: 4,
      title: "Real Estate Investment Workshop",
      date: "2024-04-10",
      time: "6:00 PM - 8:00 PM CST",
      location: "The Domain - Conference Room A",
      address: "11410 Century Oaks Terrace, Austin, TX 78758",
      type: "Workshop",
      description: "Educational workshop covering real estate investment strategies, tax benefits, and portfolio diversification.",
      attendees: 42,
      capacity: 75,
      rsvpStatus: "pending",
      rsvpDeadline: "2024-04-03",
      status: "upcoming",
      agenda: [
        "Investment Fundamentals (6:00 PM)",
        "Tax Strategies (6:45 PM)",
        "Portfolio Optimization (7:30 PM)",
        "Networking (7:45 PM)",
      ],
    },
    {
      id: 5,
      title: "Tech Plaza Office Tour",
      date: "2023-12-05",
      time: "2:00 PM - 4:00 PM CST",
      location: "Tech Plaza",
      address: "1200 Innovation Dr, Austin, TX 78758",
      type: "Property Tour",
      description: "Tour of our recently acquired office property in Austin's tech corridor.",
      attendees: 24,
      capacity: 30,
      rsvpStatus: "attended",
      rsvpDeadline: "2023-11-28",
      status: "past",
      agenda: [
        "Property Overview",
        "Tenant Mix Discussion",
        "Building Tour",
        "Future Plans",
      ],
    },
  ]

  const filteredEvents = events.filter(e =>
    filterStatus === 'all' || e.status === filterStatus
  )

  const metrics = {
    upcomingEvents: events.filter(e => e.status === 'upcoming').length,
    eventsAttended: events.filter(e => e.rsvpStatus === 'attended').length,
    pendingRSVPs: events.filter(e => e.rsvpStatus === 'pending' && e.status === 'upcoming').length,
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'attending': return 'bg-green-500'
      case 'attended': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      case 'declined': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <DashboardSidebar
        items={sidebarItems}
        role="Investor Portal"
        roleIcon={Briefcase}
        userName={user?.name || "Investor"}
        onLogout={logout}
      />

      <main className="flex-1 ml-24 bg-white">
        {/* Header */}
        <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
          <div className="container max-w-7xl px-6 py-8 mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black">Events & RSVPs</h1>
                <p className="text-white/80">Investor meetings, property tours, and webinars</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Upcoming Events</p>
                    <p className="text-3xl font-black">{metrics.upcomingEvents}</p>
                  </div>
                  <Calendar className="h-10 w-10 text-white/50" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Events Attended</p>
                    <p className="text-3xl font-black">{metrics.eventsAttended}</p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/70 text-sm mb-1">Pending RSVPs</p>
                    <p className="text-3xl font-black">{metrics.pendingRSVPs}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl px-6 py-8 mx-auto">
          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex gap-2">
              {(['all', 'upcoming', 'past'] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
                >
                  {status === 'all' ? 'All Events' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-4 border-[#E07A47] bg-white hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="grid lg:grid-cols-12 gap-6">
                    {/* Event Info */}
                    <div className="lg:col-span-5">
                      <div className="flex items-start gap-3 mb-4">
                        <Calendar className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-2xl font-black mb-2">{event.title}</h3>
                          <div className="flex gap-2 mb-3">
                            <Badge className="bg-[#56CCF2] text-white">{event.type}</Badge>
                            <Badge className={`${getStatusColor(event.rsvpStatus)} text-white`}>
                              {event.rsvpStatus === 'attending' ? 'ATTENDING' :
                               event.rsvpStatus === 'attended' ? 'ATTENDED' :
                               event.rsvpStatus === 'pending' ? 'RSVP PENDING' : 'DECLINED'}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {event.description}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Calendar className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                            <p className="text-sm text-muted-foreground">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-[#56CCF2] shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold">{event.location}</p>
                            {event.address && (
                              <p className="text-sm text-muted-foreground">{event.address}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-[#56CCF2]" />
                          <p className="text-sm">
                            <span className="font-bold">{event.attendees}</span> registered
                            <span className="text-muted-foreground"> of {event.capacity} capacity</span>
                          </p>
                        </div>

                        {event.status === 'upcoming' && (
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-yellow-600" />
                            <p className="text-sm text-muted-foreground">
                              RSVP by {new Date(event.rsvpDeadline).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Agenda */}
                    <div className="lg:col-span-4">
                      <h4 className="font-bold text-lg mb-3">Event Agenda</h4>
                      <div className="bg-muted/50 rounded-lg p-4">
                        <ul className="space-y-2">
                          {event.agenda.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-[#56CCF2] shrink-0 mt-0.5" />
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:col-span-3 flex flex-col justify-between">
                      {event.status === 'upcoming' && event.rsvpStatus === 'pending' && (
                        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3 mb-4">
                          <p className="text-xs font-semibold text-yellow-800">
                            Please RSVP by {new Date(event.rsvpDeadline).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {event.status === 'upcoming' && event.rsvpStatus === 'attending' && (
                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 mb-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <p className="text-xs font-semibold text-green-800">
                              You're registered!
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {event.status === 'upcoming' && event.rsvpStatus === 'pending' && (
                          <>
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              RSVP - Attending
                            </Button>
                            <Button variant="outline" className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50">
                              Decline
                            </Button>
                          </>
                        )}

                        {event.status === 'upcoming' && event.rsvpStatus === 'attending' && (
                          <>
                            <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                              <Link href={`/dashboard/investor/events/${event.id}/details`}>
                                View Event Details
                              </Link>
                            </Button>
                            <Button variant="outline" className="w-full border-2 border-[#E07A47]">
                              Add to Calendar
                            </Button>
                            <Button variant="outline" className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50">
                              Cancel RSVP
                            </Button>
                          </>
                        )}

                        {event.status === 'past' && (
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/investor/events/${event.id}/recap`}>
                              View Event Recap
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

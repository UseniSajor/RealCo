"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Mail,
  Send,
  Calendar,
  Users,
  ArrowLeft,
  Plus,
  MessageSquare,
  Bell,
  CheckCircle2,
} from "lucide-react"

export default function CommunicationsPage() {
  const [typeFilter, setTypeFilter] = useState<'all' | 'email' | 'event'>('all')

  // Mock communications data
  const communications = [
    {
      id: 1,
      type: "email",
      subject: "Q4 2023 Investor Report Available",
      message: "We're pleased to share your Q4 2023 quarterly report. The property continues to perform well with strong occupancy...",
      offering: "Riverside Apartments Fund",
      recipientCount: 24,
      sentDate: "2024-01-10",
      openRate: 95.8,
      clickRate: 72.3,
      status: "sent",
    },
    {
      id: 2,
      type: "email",
      subject: "Distribution Notice: $425K Processed",
      message: "Your quarterly distribution of $17,708 has been processed and will be deposited on January 15th...",
      offering: "Riverside Apartments Fund",
      recipientCount: 24,
      sentDate: "2024-01-08",
      openRate: 100,
      clickRate: 45.8,
      status: "sent",
    },
    {
      id: 3,
      type: "event",
      subject: "Annual Investor Meeting 2024",
      message: "Join us for our annual investor meeting on March 15th to review 2023 performance and discuss 2024 plans...",
      offering: "All Properties",
      recipientCount: 54,
      eventDate: "2024-03-15",
      location: "Austin Convention Center",
      rsvpCount: 42,
      status: "scheduled",
    },
    {
      id: 4,
      type: "email",
      subject: "Property Update: Roof Replacement Complete",
      message: "We're happy to report that the planned roof replacement has been completed on schedule and under budget...",
      offering: "Riverside Apartments Fund",
      recipientCount: 24,
      sentDate: "2023-12-20",
      openRate: 91.7,
      clickRate: 38.5,
      status: "sent",
    },
    {
      id: 5,
      type: "email",
      subject: "Market Update: Austin Multifamily Trends",
      message: "We wanted to share some positive market trends we're seeing in the Austin multifamily market...",
      offering: "All Properties",
      recipientCount: 54,
      sentDate: null,
      openRate: 0,
      clickRate: 0,
      status: "draft",
    },
  ]

  const filteredCommunications = communications.filter(c => 
    typeFilter === 'all' || c.type === typeFilter
  )

  const metrics = {
    totalSent: communications.filter(c => c.status === 'sent').length,
    avgOpenRate: communications.filter(c => c.status === 'sent' && c.type === 'email').reduce((sum, c) => sum + c.openRate, 0) / communications.filter(c => c.status === 'sent' && c.type === 'email').length,
    upcomingEvents: communications.filter(c => c.type === 'event' && c.status === 'scheduled').length,
    totalRecipients: communications.reduce((sum, c) => sum + c.recipientCount, 0),
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b-4 border-[#E07A47] bg-[#2C3E50] text-white">
        <div className="container max-w-7xl px-6 py-8 mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-4xl font-black">Investor Communications</h1>
                <p className="text-white/80">Manage investor updates, announcements, and events</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link href="/dashboard/fund-manager/communications/event/new">
                  <Calendar className="h-4 w-4 mr-2" />
                  Create Event
                </Link>
              </Button>
              <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                <Link href="/dashboard/fund-manager/communications/email/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Email
                </Link>
              </Button>
            </div>
          </div>

          {/* Summary Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Messages Sent</p>
                  <p className="text-3xl font-black">{metrics.totalSent}</p>
                </div>
                <Send className="h-10 w-10 text-white/50" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Avg Open Rate</p>
                  <p className="text-3xl font-black">{metrics.avgOpenRate.toFixed(1)}%</p>
                </div>
                <Mail className="h-10 w-10 text-green-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Upcoming Events</p>
                  <p className="text-3xl font-black">{metrics.upcomingEvents}</p>
                </div>
                <Calendar className="h-10 w-10 text-blue-400" />
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">Total Recipients</p>
                  <p className="text-3xl font-black">{metrics.totalRecipients}</p>
                </div>
                <Users className="h-10 w-10 text-yellow-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl px-6 py-8 mx-auto">
        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {(['all', 'email', 'event'] as const).map((type) => (
              <Button
                key={type}
                variant={typeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setTypeFilter(type)}
                className={typeFilter === type ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : "border-2 border-[#E07A47]"}
              >
                {type === 'all' ? 'All' : type === 'email' ? 'Emails' : 'Events'}
              </Button>
            ))}
          </div>
        </div>

        {/* Communications Grid */}
        <div className="grid gap-6">
          {filteredCommunications.map((comm) => (
            <Card key={comm.id} className="border-4 border-[#E07A47] dark:bg-[#6b7280] hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Communication Info */}
                  <div className="lg:col-span-5">
                    <div className="flex items-start gap-3 mb-4">
                      {comm.type === 'email' ? (
                        <Mail className="h-6 w-6 text-[#E07A47] shrink-0 mt-1" />
                      ) : (
                        <Calendar className="h-6 w-6 text-[#56CCF2] shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={comm.type === 'email' ? 'bg-[#E07A47]' : 'bg-[#56CCF2]'}>
                            {comm.type.toUpperCase()}
                          </Badge>
                          <Badge className={`${
                            comm.status === 'sent' ? 'bg-green-500' :
                            comm.status === 'scheduled' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          } text-white`}>
                            {comm.status.toUpperCase()}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-black mb-2 dark:text-white">{comm.subject}</h3>
                        <p className="text-sm text-muted-foreground dark:text-white/70 mb-3 line-clamp-2">
                          {comm.message}
                        </p>
                        <p className="text-sm font-semibold text-[#56CCF2]">{comm.offering}</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground dark:text-white/70">Recipients:</span>
                        <span className="font-bold dark:text-white">{comm.recipientCount} investors</span>
                      </div>
                      {comm.sentDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground dark:text-white/70">Sent Date:</span>
                          <span className="font-bold text-green-600">{new Date(comm.sentDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {comm.type === 'event' && comm.eventDate && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground dark:text-white/70">Event Date:</span>
                            <span className="font-bold text-blue-600">{new Date(comm.eventDate).toLocaleDateString()}</span>
                          </div>
                          {comm.location && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground dark:text-white/70">Location:</span>
                              <span className="font-bold dark:text-white">{comm.location}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="lg:col-span-4">
                    {comm.type === 'email' && comm.status === 'sent' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Open Rate</p>
                          <p className="text-3xl font-black text-green-600">{comm.openRate}%</p>
                          <p className="text-xs text-muted-foreground dark:text-white/70 mt-1">
                            {Math.round((comm.openRate / 100) * comm.recipientCount)} opened
                          </p>
                        </div>

                        <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground dark:text-white/70 mb-1">Click Rate</p>
                          <p className="text-3xl font-black text-[#56CCF2]">{comm.clickRate}%</p>
                          <p className="text-xs text-muted-foreground dark:text-white/70 mt-1">
                            {Math.round((comm.clickRate / 100) * comm.recipientCount)} clicked
                          </p>
                        </div>

                        <div className="col-span-2 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <p className="text-sm font-bold text-green-800 dark:text-green-200">
                              Delivered to all recipients
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground dark:text-white/70">
                            0 bounces, 0 complaints
                          </p>
                        </div>
                      </div>
                    )}

                    {comm.type === 'event' && (
                      <div className="space-y-4">
                        <div className="bg-[#56CCF2]/10 dark:bg-[#56CCF2]/20 rounded-lg p-4 border-2 border-[#56CCF2]">
                          <p className="text-sm font-bold text-[#56CCF2] mb-2">RSVP Status</p>
                          <p className="text-4xl font-black text-[#56CCF2]">{comm.rsvpCount || 0}/{comm.recipientCount}</p>
                          <p className="text-sm text-muted-foreground dark:text-white/70 mt-2">
                            {comm.rsvpCount ? `${((comm.rsvpCount / comm.recipientCount) * 100).toFixed(0)}% confirmed` : 'Awaiting responses'}
                          </p>
                        </div>

                        <div className="bg-muted/50 dark:bg-slate-700 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground dark:text-white/70 mb-2">Event Details</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-[#56CCF2]" />
                              <span className="dark:text-white">{comm.eventDate && new Date(comm.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            {comm.location && (
                              <div className="flex items-center gap-2">
                                <Bell className="h-4 w-4 text-[#56CCF2]" />
                                <span className="dark:text-white">{comm.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {comm.status === 'draft' && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded-lg p-4">
                        <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                          📝 Draft Message
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-white/70">
                          Complete and schedule this message to send to investors
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      {comm.status === 'sent' && (
                        <>
                          <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/analytics`}>
                              View Analytics
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/duplicate`}>
                              Duplicate
                            </Link>
                          </Button>
                        </>
                      )}

                      {comm.status === 'draft' && (
                        <>
                          <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/edit`}>
                              Edit Message
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/send`}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </Link>
                          </Button>
                        </>
                      )}

                      {comm.status === 'scheduled' && comm.type === 'event' && (
                        <>
                          <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/rsvps`}>
                              View RSVPs
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-[#E07A47]">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/edit`}>
                              Edit Event
                            </Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full border-2 border-slate-300 dark:border-slate-600">
                            <Link href={`/dashboard/fund-manager/communications/${comm.id}/reminder`}>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Communication Templates */}
        <Card className="border-4 border-[#56CCF2] dark:bg-[#6b7280] mt-8">
          <CardHeader>
            <CardTitle className="text-2xl dark:text-white">Communication Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { title: 'Quarterly Report', desc: 'Share performance updates', icon: Mail },
                { title: 'Distribution Notice', desc: 'Notify about payments', icon: DollarSign },
                { title: 'Property Update', desc: 'Share property news', icon: MessageSquare },
                { title: 'Annual Meeting', desc: 'Invite to events', icon: Calendar },
              ].map((template) => (
                <Button key={template.title} variant="outline" className="h-auto flex-col items-start p-4 border-2 border-[#E07A47] hover:bg-muted/50">
                  <template.icon className="h-6 w-6 text-[#56CCF2] mb-2" />
                  <span className="font-bold text-left dark:text-white">{template.title}</span>
                  <span className="text-xs text-muted-foreground dark:text-white/70 text-left mt-1">{template.desc}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

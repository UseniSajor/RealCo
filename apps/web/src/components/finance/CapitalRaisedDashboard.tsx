"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Target } from "lucide-react"
import { transactionsAPI } from "@/lib/api/transactions.api"

export function CapitalRaisedDashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await transactionsAPI.getTransactionSummary()
        setSummary(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load capital summary')
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) return <div className="p-8 text-center text-lg">Loading capital summary...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>
  if (!summary) return <div className="p-8 text-center text-muted-foreground">No capital data found.</div>

  // Example: Use summary fields (adjust as needed for your API)
  const totalRaised = summary.totalInvested || 0
  const totalDistributions = summary.totalDistributions || 0
  const totalFees = summary.totalFees || 0
  const pendingAmount = summary.pendingAmount || 0
  const transactionCount = summary.transactionCount || 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black mb-2">Capital Raised</h2>
        <p className="text-base text-muted-foreground">
          Track fundraising progress across all your offerings
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-4 border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-3xl font-black text-primary">
              {formatCurrency(totalRaised)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {transactionCount} transactions
            </p>
          </CardContent>
        </Card>
        <Card className="border-4 border-secondary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Distributions</p>
              <Target className="h-5 w-5 text-secondary" />
            </div>
            <p className="text-3xl font-black text-secondary">
              {formatCurrency(totalDistributions)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Paid to investors
            </p>
          </CardContent>
        </Card>
        <Card className="border-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Fees</p>
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-black text-green-600">
              {formatCurrency(totalFees)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Platform/processing fees
            </p>
          </CardContent>
        </Card>
        <Card className="border-4 border-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-black text-purple-600">
              {formatCurrency(pendingAmount)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Awaiting completion
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

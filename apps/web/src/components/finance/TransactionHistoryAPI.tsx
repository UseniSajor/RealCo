"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { transactionsAPI, type Transaction } from "@/lib/api/transactions.api"

export function TransactionHistoryAPI() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>("ALL")
  const [summary, setSummary] = useState({
    totalInvested: 0,
    totalDistributions: 0,
    totalFees: 0,
    pendingAmount: 0,
    transactionCount: 0
  })

  useEffect(() => {
    loadTransactions()
    loadSummary()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await transactionsAPI.getTransactions({ limit: 50 })
      setTransactions(response.transactions)
    } catch (err) {
      console.error('Error loading transactions:', err)
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const loadSummary = async () => {
    try {
      const summaryData = await transactionsAPI.getTransactionSummary()
      setSummary(summaryData)
    } catch (err) {
      console.error('Error loading summary:', err)
    }
  }

  const filteredTransactions = filterType === "ALL" 
    ? transactions 
    : transactions.filter(t => t.type === filterType)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-500/20 text-green-600"
      case "PROCESSING": return "bg-[#56CCF2]/20 text-[#56CCF2]"
      case "FAILED": return "bg-red-500/20 text-red-600"
      case "CANCELLED": return "bg-gray-500/20 text-gray-600"
      default: return "bg-[#E07A47]/20 text-[#E07A47]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED": return <CheckCircle2 className="h-4 w-4" />
      case "PROCESSING": return <Clock className="h-4 w-4 animate-spin" />
      case "FAILED": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getTransactionIcon = (type: string) => {
    if (type === "INVESTMENT") return <ArrowDownRight className="h-5 w-5 text-green-600" />
    if (type === "DISTRIBUTION") return <ArrowUpRight className="h-5 w-5 text-[#56CCF2]" />
    return <ArrowUpRight className="h-5 w-5 text-[#E07A47]" />
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2] mx-auto mb-4" />
          <p className="text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <div className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-800 dark:text-red-200">Error</p>
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Transaction History</h2>
          <p className="text-base text-muted-foreground">
            View all your payments, deposits, and distributions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadTransactions} disabled={loading}>
            <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="border-4 border-[#E07A47]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-bold">Filter by type:</span>
            {["ALL", "INVESTMENT", "DISTRIBUTION", "FEE", "REFUND"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={filterType === type ? "bg-[#56CCF2] hover:bg-[#3BB5E0]" : ""}
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <Card key={transaction.id} className="border-4 border-[#E07A47] hover:shadow-lg transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{transaction.description}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(transaction.initiatedAt), "MMM dd, yyyy")}</span>
                      <span>•</span>
                      <span>{transaction.paymentMethod}</span>
                      {transaction.feeAmount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-xs">Fee: ${transaction.feeAmount.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-black ${transaction.type === 'DISTRIBUTION' ? 'text-green-600' : 'text-[#56CCF2]'}`}>
                  {transaction.type === 'DISTRIBUTION' ? '+' : ''}{formatAmount(transaction.amount)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTransactions.length === 0 && (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No Transactions Found</h3>
              <p className="text-sm text-muted-foreground">
                {filterType === "ALL" ? "You haven't made any transactions yet" : `No ${filterType} transactions found`}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
              <p className="text-2xl font-black text-green-600">${(summary.totalInvested / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Distributions</p>
              <p className="text-2xl font-black text-[#56CCF2]">${(summary.totalDistributions / 1000).toFixed(0)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Platform Fees</p>
              <p className="text-2xl font-black text-[#E07A47]">${(summary.totalFees / 1000).toFixed(1)}K</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-black text-yellow-600">${(summary.pendingAmount / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

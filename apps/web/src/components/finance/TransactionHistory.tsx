"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle } from "lucide-react"
import { format } from "date-fns"


import { useEffect } from "react"
import { transactionsAPI, Transaction } from "@/lib/api/transactions.api"


export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [filterType, setFilterType] = useState<string>("ALL")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = (type?: string) => {
    setLoading(true)
    transactionsAPI.getTransactions(type && type !== "ALL" ? { type } : undefined)
      .then(res => {
        setTransactions(res.transactions)
        setLoading(false)
      })
      .catch(e => {
        setError(e.message || 'Failed to load transactions')
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    fetchTransactions(filterType)
  }, [filterType])

  const filteredTransactions = transactions

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-600"
      case "PROCESSING":
        return "bg-[#56CCF2]/20 text-[#56CCF2]"
      case "FAILED":
        return "bg-red-500/20 text-red-600"
      default:
        return "bg-[#E07A47]/20 text-[#E07A47]"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle2 className="h-4 w-4" />
      case "PROCESSING":
        return <Clock className="h-4 w-4" />
      case "FAILED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTransactionIcon = (type: string) => {
    if (type === "DEPOSIT" || type === "DISTRIBUTION") {
      return type === "DEPOSIT" ? (
        <ArrowDownRight className="h-5 w-5 text-green-600" />
      ) : (
        <ArrowUpRight className="h-5 w-5 text-[#56CCF2]" />
      )
    }
    return <ArrowUpRight className="h-5 w-5 text-[#E07A47]" />
  }

  const formatAmount = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount))
    
    return amount < 0 ? `-${formatted}` : formatted
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    alert("Export feature will download transactions as CSV")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Transaction History</h2>
          <p className="text-base text-muted-foreground">
            View all your payments, deposits, and distributions
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-4 border-[#E07A47]">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-bold">Filter by type:</span>
            {["ALL", "DEPOSIT", "DISTRIBUTION", "PLATFORM_FEE"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filterType === type ? "default" : "outline"}
                onClick={() => setFilterType(type)}
                className={filterType === type ? "bg-[#56CCF2] hover:bg-[#3BB5E0]" : ""}
              >
                {type.replace("_", " ")}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
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
                      <span>{format(transaction.date, "MMM dd, yyyy")}</span>
                      <span>•</span>
                      <span>{transaction.paymentMethod}</span>
                      <span>•</span>
                      <span>{transaction.from} → {transaction.to}</span>
                    </div>
                  </div>
                </div>
                <div className={`text-xl font-black ${transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.amount < 0 ? '-' : '+'}{formatAmount(transaction.amount)}
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
                {filterType === "ALL" 
                  ? "You haven't made any transactions yet" 
                  : `No ${filterType} transactions found`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Deposits</p>
              <p className="text-2xl font-black text-green-600">
                {formatAmount(
                  transactions
                    .filter(t => t.type === "DEPOSIT" && t.status === "COMPLETED")
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Distributions</p>
              <p className="text-2xl font-black text-[#56CCF2]">
                {formatAmount(
                  transactions
                    .filter(t => t.type === "DISTRIBUTION" && t.status === "COMPLETED")
                    .reduce((sum, t) => sum + t.amount, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Platform Fees</p>
              <p className="text-2xl font-black text-[#E07A47]">
                {formatAmount(
                  Math.abs(transactions
                    .filter(t => t.type === "PLATFORM_FEE" && t.status === "COMPLETED")
                    .reduce((sum, t) => sum + t.amount, 0))
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

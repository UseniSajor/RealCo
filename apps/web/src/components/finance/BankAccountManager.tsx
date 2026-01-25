"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Check, X, Building, CreditCard } from "lucide-react"


import { useEffect } from "react"
import { bankingAPI, BankAccount } from "@/lib/api/banking.api"


export function BankAccountManager() {
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccounts = () => {
    setLoading(true)
    bankingAPI.getBankAccounts()
      .then(setAccounts)
      .catch(e => setError(e.message || 'Failed to load accounts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleSetDefault = async (id: string) => {
    try {
      await bankingAPI.setDefaultAccount(id)
      fetchAccounts()
    } catch (e: any) {
      setError(e.message || 'Failed to set default')
    }
  }

  const handleRemove = async (id: string) => {
    if (confirm("Are you sure you want to remove this bank account?")) {
      try {
        await bankingAPI.removeBankAccount(id)
        fetchAccounts()
      } catch (e: any) {
        setError(e.message || 'Failed to remove account')
      }
    }
  }

  // TODO: Wire up add account (Plaid/manual) to API

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Bank Accounts</h2>
          <p className="text-base text-muted-foreground">
            Manage your payment methods and bank accounts
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Bank Accounts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">Loading bank accounts...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">{error}</div>
        ) : accounts.length > 0 ? (
          accounts.map((account) => (
            <Card key={account.id} className="border-4 border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#56CCF2]/10 flex items-center justify-center">
                      <Building className="h-6 w-6 text-[#56CCF2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{account.bankName}</h3>
                        {account.isDefault && (
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-[#56CCF2]/20 text-[#56CCF2]">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {account.accountType} •••• {account.lastFourDigits}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {account.status === "VERIFIED" ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-semibold">Verified</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-[#E07A47]" />
                            <span className="text-xs text-[#E07A47] font-semibold">Pending Verification</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!account.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSetDefault(account.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemove(account.id)}
                      className="border-red-500 text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No Bank Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a bank account to start making transactions
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        )}

        {accounts.length === 0 && (
          <Card className="border-4 border-[#E07A47]">
            <CardContent className="py-12 text-center">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">No Bank Accounts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add a bank account to start making transactions
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Account Form */}
      {showAddForm && (
        <Card className="border-4 border-[#56CCF2] shadow-lg shadow-[#56CCF2]/20">
          <CardHeader>
            <CardTitle>Add Bank Account</CardTitle>
            <CardDescription>
              Choose how you'd like to add your bank account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Plaid Link (Instant) */}
            <Card className="border-2 border-slate-200 dark:border-[#E07A47] cursor-pointer hover:shadow-lg transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#56CCF2]/10 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-[#56CCF2]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Instant Verification</h3>
                    <p className="text-sm text-muted-foreground">
                      Connect your bank instantly and securely with Plaid
                    </p>
                  </div>
                  <Button>Connect Bank</Button>
                </div>
              </CardContent>
            </Card>

            {/* Manual Entry */}
            <Card className="border-2 border-slate-200 dark:border-[#E07A47]">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#E07A47]/10 flex items-center justify-center">
                    <Building className="h-6 w-6 text-[#E07A47]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">Manual Entry</h3>
                    <p className="text-sm text-muted-foreground">
                      Enter your bank details manually (requires micro-deposit verification)
                    </p>
                  </div>
                </div>
                
                <form className="space-y-4 ml-16">
                  <div>
                    <label className="block text-sm font-bold mb-2">Bank Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                      placeholder="Chase Bank"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Routing Number</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                        placeholder="110000000"
                        maxLength={9}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Account Number</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                        placeholder="000123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Account Type</label>
                    <select className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm">
                      <option>Checking</option>
                      <option>Savings</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-sm"
                      placeholder="John Smith"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="submit" className="flex-1">Add Account</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Security Notice */}
      <Card className="border-2 border-slate-200 dark:border-[#E07A47] bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#56CCF2]/10 flex items-center justify-center flex-shrink-0">
              <Check className="h-5 w-5 text-[#56CCF2]" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Bank-Level Security</h3>
              <p className="text-sm text-muted-foreground">
                All bank account information is encrypted with AES-256 encryption. 
                We never store your full account number in plaintext. Your data is protected 
                with the same security standards used by banks.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

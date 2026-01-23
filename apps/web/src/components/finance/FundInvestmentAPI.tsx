"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, DollarSign, CreditCard, ArrowRight, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { bankingAPI, type BankAccount } from "@/lib/api/banking.api"
import { transactionsAPI } from "@/lib/api/transactions.api"

interface Offering {
  id: string
  name: string
  location: string
  minInvestment: number
  targetRaise: number
  currentRaised: number
  assetType?: string
  projectedIRR?: number
  projectedMultiple?: number
}

interface FundInvestmentAPIProps {
  offerings?: Offering[]
}

const defaultOfferings: Offering[] = [
  {
    id: "1",
    name: "Riverside Apartments",
    location: "Austin, TX",
    minInvestment: 50000,
    targetRaise: 10000000,
    currentRaised: 7250000,
    assetType: "Multifamily",
    projectedIRR: 17.2,
    projectedMultiple: 1.95
  },
  {
    id: "2",
    name: "Tech Center Plaza",
    location: "Dallas, TX",
    minInvestment: 100000,
    targetRaise: 20000000,
    currentRaised: 15600000,
    assetType: "Commercial Office",
    projectedIRR: 15.8,
    projectedMultiple: 1.82
  },
  {
    id: "3",
    name: "Gateway Industrial Park",
    location: "Houston, TX",
    minInvestment: 75000,
    targetRaise: 15000000,
    currentRaised: 9800000,
    assetType: "Industrial",
    projectedIRR: 18.5,
    projectedMultiple: 2.03
  }
]

export function FundInvestmentAPI({ offerings = defaultOfferings }: FundInvestmentAPIProps) {
  const [step, setStep] = useState(1)
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [selectedBankAccount, setSelectedBankAccount] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'ACH' | 'WIRE'>('ACH')
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const selectedOfferingData = offerings.find(o => o.id === selectedOffering)

  // Load bank accounts when reaching payment step
  useEffect(() => {
    if (step === 3) {
      loadBankAccounts()
    }
  }, [step])

  const loadBankAccounts = async () => {
    try {
      setLoading(true)
      const accounts = await bankingAPI.getBankAccounts()
      const verifiedAccounts = accounts.filter(a => a.status === 'VERIFIED')
      setBankAccounts(verifiedAccounts)
      
      // Auto-select default account
      const defaultAccount = verifiedAccounts.find(a => a.isDefault)
      if (defaultAccount) {
        setSelectedBankAccount(defaultAccount.id)
      }
    } catch (err) {
      console.error('Error loading bank accounts:', err)
      setError('Failed to load bank accounts')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const validateAmount = (): string | null => {
    const investmentAmount = parseInt(amount)
    
    if (!investmentAmount || investmentAmount <= 0) {
      return "Please enter a valid investment amount"
    }
    
    if (selectedOfferingData && investmentAmount < selectedOfferingData.minInvestment) {
      return `Minimum investment is ${formatCurrency(selectedOfferingData.minInvestment)}`
    }
    
    return null
  }

  const handleSubmitInvestment = async () => {
    if (!selectedOffering || !selectedBankAccount) {
      setError('Please complete all required fields')
      return
    }

    const validation = validateAmount()
    if (validation) {
      setError(validation)
      return
    }

    try {
      setProcessing(true)
      setError(null)

      // Create investment transaction via API
      const transaction = await transactionsAPI.createInvestment({
        offeringId: selectedOffering,
        amount: parseInt(amount),
        bankAccountId: selectedBankAccount,
        paymentMethod: paymentMethod
      })

      setTransactionId(transaction.id)
      setSuccess(true)
      setStep(5) // Success step

    } catch (err) {
      console.error('Error processing investment:', err)
      setError(err instanceof Error ? err.message : 'Failed to process investment')
    } finally {
      setProcessing(false)
    }
  }

  const resetWizard = () => {
    setStep(1)
    setSelectedOffering(null)
    setAmount("")
    setSelectedBankAccount(null)
    setPaymentMethod('ACH')
    setError(null)
    setSuccess(false)
    setTransactionId(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black mb-2">Fund Investment</h2>
        <p className="text-base text-muted-foreground">
          Invest in available real estate opportunities
        </p>
      </div>

      {/* Error Alert */}
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

      {/* Success State */}
      {success && transactionId && (
        <Card className="border-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-black mb-2">Investment Initiated!</h3>
              <p className="text-muted-foreground mb-4">
                Your investment of {formatCurrency(parseInt(amount))} in {selectedOfferingData?.name} has been initiated.
              </p>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Transaction ID</p>
                <p className="font-mono text-sm">{transactionId}</p>
              </div>
              <div className="space-y-2 text-sm text-left max-w-md mx-auto mb-6">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p>ACH transfer initiated from your bank account</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p>Funds will arrive in 3-5 business days</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                  <p>You'll receive confirmation email once funds are received</p>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetWizard} variant="outline" className="border-2 border-[#E07A47]">
                  Make Another Investment
                </Button>
                <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                  <a href="/dashboard/investor">Go to Dashboard</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Steps */}
      {!success && (
        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: "Select Deal" },
                { num: 2, label: "Amount" },
                { num: 3, label: "Payment" },
                { num: 4, label: "Review" }
              ].map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s.num ? 'bg-[#56CCF2] text-white' : 'bg-muted text-muted-foreground'
                    }`}>
                      {s.num}
                    </div>
                    <span className="text-xs mt-2 font-semibold text-center">{s.label}</span>
                  </div>
                  {i < 3 && <div className={`w-16 h-1 mx-2 ${step > s.num ? 'bg-[#56CCF2]' : 'bg-muted'}`} />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 1: Select Offering */}
      {step === 1 && !success && (
        <div className="space-y-4">
          {offerings.map((offering) => {
            const percentRaised = (offering.currentRaised / offering.targetRaise) * 100
            
            return (
              <Card 
                key={offering.id}
                className={`border-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedOffering === offering.id 
                    ? 'border-[#56CCF2] bg-[#56CCF2]/10' 
                    : 'border-[#E07A47]'
                }`}
                onClick={() => setSelectedOffering(offering.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <Building2 className="h-8 w-8 text-[#E07A47] shrink-0" />
                      <div className="flex-1">
                        <h3 className="text-xl font-black mb-1">{offering.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{offering.location}</p>
                        
                        {offering.assetType && (
                          <div className="flex gap-2 mb-3">
                            <span className="px-2 py-1 bg-[#E07A47]/20 text-[#E07A47] rounded text-xs font-semibold">
                              {offering.assetType}
                            </span>
                            {offering.projectedIRR && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                {offering.projectedIRR}% IRR
                              </span>
                            )}
                            {offering.projectedMultiple && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                {offering.projectedMultiple}x Multiple
                              </span>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Minimum:</span>
                            <span className="ml-2 font-bold">{formatCurrency(offering.minInvestment)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Target Raise:</span>
                            <span className="ml-2 font-bold">{formatCurrency(offering.targetRaise)}</span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Capital Raised:</span>
                            <span className="font-bold">{percentRaised.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-[#56CCF2] h-2 rounded-full transition-all"
                              style={{ width: `${percentRaised}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>{formatCurrency(offering.currentRaised)}</span>
                            <span>{formatCurrency(offering.targetRaise - offering.currentRaised)} remaining</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {selectedOffering === offering.id && (
                      <CheckCircle2 className="h-6 w-6 text-[#56CCF2]" />
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          
          <div className="flex justify-end">
            <Button 
              onClick={() => setStep(2)}
              disabled={!selectedOffering}
              className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Enter Amount */}
      {step === 2 && !success && selectedOfferingData && (
        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6 space-y-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-bold mb-1">Selected Investment</h4>
              <p className="text-lg font-black text-[#56CCF2]">{selectedOfferingData.name}</p>
              <p className="text-sm text-muted-foreground">{selectedOfferingData.location}</p>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Investment Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={selectedOfferingData.minInvestment.toString()}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 dark:border-[#E07A47] rounded-lg focus:border-[#56CCF2] focus:outline-none text-lg font-bold"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Minimum investment: {formatCurrency(selectedOfferingData.minInvestment)}
              </p>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="outline" className="border-2 border-[#E07A47]">
                Back
              </Button>
              <Button 
                onClick={() => {
                  const validation = validateAmount()
                  if (validation) {
                    setError(validation)
                  } else {
                    setError(null)
                    setStep(3)
                  }
                }}
                className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Select Payment Method */}
      {step === 3 && !success && (
        <Card className="border-4 border-[#E07A47]">
          <CardContent className="pt-6 space-y-6">
            {loading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#56CCF2] mx-auto mb-4" />
                <p className="text-muted-foreground">Loading bank accounts...</p>
              </div>
            ) : bankAccounts.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-bold mb-2">No Bank Accounts Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Please add a verified bank account before making an investment.
                </p>
                <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                  <a href="/dashboard/investor/banking">Add Bank Account</a>
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-bold mb-3">Select Bank Account</label>
                  <div className="space-y-3">
                    {bankAccounts.map((account) => (
                      <div
                        key={account.id}
                        onClick={() => setSelectedBankAccount(account.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedBankAccount === account.id
                            ? 'border-[#56CCF2] bg-[#56CCF2]/10'
                            : 'border-slate-200 dark:border-[#E07A47] hover:border-[#56CCF2]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-6 w-6 text-[#E07A47]" />
                            <div>
                              <p className="font-bold">{account.bankName || 'Bank Account'}</p>
                              <p className="text-sm text-muted-foreground">
                                {account.accountType} ••••{account.lastFourDigits}
                              </p>
                              {account.isDefault && (
                                <span className="text-xs bg-[#56CCF2]/20 text-[#56CCF2] px-2 py-0.5 rounded mt-1 inline-block">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedBankAccount === account.id && (
                            <CheckCircle2 className="h-5 w-5 text-[#56CCF2]" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-3">Payment Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentMethod('ACH')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'ACH'
                          ? 'border-[#56CCF2] bg-[#56CCF2]/10'
                          : 'border-slate-200 dark:border-[#E07A47]'
                      }`}
                    >
                      <div className="text-center">
                        <CreditCard className="h-8 w-8 text-[#56CCF2] mx-auto mb-2" />
                        <p className="font-bold">ACH Transfer</p>
                        <p className="text-xs text-muted-foreground mt-1">3-5 business days</p>
                        <p className="text-xs text-green-600 font-semibold mt-1">Free</p>
                      </div>
                    </div>

                    <div
                      onClick={() => setPaymentMethod('WIRE')}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        paymentMethod === 'WIRE'
                          ? 'border-[#56CCF2] bg-[#56CCF2]/10'
                          : 'border-slate-200 dark:border-[#E07A47]'
                      }`}
                    >
                      <div className="text-center">
                        <Building2 className="h-8 w-8 text-[#E07A47] mx-auto mb-2" />
                        <p className="font-bold">Wire Transfer</p>
                        <p className="text-xs text-muted-foreground mt-1">Same business day</p>
                        <p className="text-xs text-[#E07A47] font-semibold mt-1">$25 fee</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={() => setStep(2)} variant="outline" className="border-2 border-[#E07A47]">
                    Back
                  </Button>
                  <Button 
                    onClick={() => setStep(4)}
                    disabled={!selectedBankAccount}
                    className="bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                  >
                    Review Investment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review & Confirm */}
      {step === 4 && !success && selectedOfferingData && (
        <Card className="border-4 border-[#56CCF2]">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-2xl font-black mb-4">Review Your Investment</h3>
              
              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Investment Property:</span>
                  <span className="font-bold">{selectedOfferingData.name}</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-bold">{selectedOfferingData.location}</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Investment Amount:</span>
                  <span className="font-bold text-[#56CCF2] text-xl">{formatCurrency(parseInt(amount))}</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="font-bold">{paymentMethod} Transfer</span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Bank Account:</span>
                  <span className="font-bold">
                    {bankAccounts.find(a => a.id === selectedBankAccount)?.bankName} 
                    {' '}••••{bankAccounts.find(a => a.id === selectedBankAccount)?.lastFourDigits}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b">
                  <span className="text-muted-foreground">Processing Fee:</span>
                  <span className="font-bold">{paymentMethod === 'WIRE' ? '$25.00' : '$0.00'}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="font-bold text-lg">Total:</span>
                  <span className="font-black text-2xl text-green-600">
                    {formatCurrency(parseInt(amount) + (paymentMethod === 'WIRE' ? 25 : 0))}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                      Important Information
                    </p>
                    <ul className="space-y-1 text-yellow-700 dark:text-yellow-300">
                      <li>• Funds will be held in SEC-compliant escrow</li>
                      <li>• ACH transfers take 3-5 business days</li>
                      <li>• You'll receive confirmation when funds are received</li>
                      <li>• Investment documents will be sent for e-signature</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setStep(3)} variant="outline" className="border-2 border-[#E07A47]">
                Back
              </Button>
              <Button 
                onClick={handleSubmitInvestment}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {processing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Investment
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

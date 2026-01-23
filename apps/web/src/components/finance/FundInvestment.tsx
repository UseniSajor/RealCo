"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, DollarSign, CreditCard, ArrowRight, AlertCircle } from "lucide-react"

interface FundInvestmentProps {
  offerings?: Array<{
    id: string
    name: string
    location: string
    minInvestment: number
    targetRaise: number
    currentRaised: number
  }>
}

const defaultOfferings = [
  {
    id: "1",
    name: "Marina Bay Apartments",
    location: "San Diego, CA",
    minInvestment: 50000,
    targetRaise: 12000000,
    currentRaised: 8500000
  },
  {
    id: "2",
    name: "Tech Park Office",
    location: "Seattle, WA",
    minInvestment: 100000,
    targetRaise: 25000000,
    currentRaised: 15000000
  }
]

export function FundInvestment({ offerings = defaultOfferings }: FundInvestmentProps) {
  const [step, setStep] = useState(1)
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)

  const selectedOfferingData = offerings.find(o => o.id === selectedOffering)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSubmit = () => {
    alert(`Investment processed!\n\nOffering: ${selectedOfferingData?.name}\nAmount: ${formatCurrency(parseInt(amount))}\nPayment Method: ${paymentMethod}`)
    // Reset form
    setStep(1)
    setSelectedOffering(null)
    setAmount("")
    setPaymentMethod(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Fund Investment</h2>
        <p className="text-base text-muted-foreground">
          Invest in available real estate opportunities
        </p>
      </div>

      {/* Progress Steps */}
      <Card className="border-4 border-[#E07A47]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Select Deal" },
              { num: 2, label: "Enter Amount" },
              { num: 3, label: "Payment Method" },
              { num: 4, label: "Review" }
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s.num 
                      ? 'bg-[#56CCF2] text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {s.num}
                  </div>
                  <span className="text-xs mt-2 font-semibold">{s.label}</span>
                </div>
                {i < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > s.num ? 'bg-[#56CCF2]' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Select Offering */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Available Opportunities</h3>
          {offerings.map((offering) => {
            const percentFunded = (offering.currentRaised / offering.targetRaise) * 100
            return (
              <Card 
                key={offering.id}
                className={`border-4 cursor-pointer transition-all ${
                  selectedOffering === offering.id 
                    ? 'border-[#56CCF2] shadow-lg shadow-[#56CCF2]/20' 
                    : 'border-[#E07A47] hover:shadow-lg'
                }`}
                onClick={() => setSelectedOffering(offering.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold mb-1">{offering.name}</h4>
                      <p className="text-sm text-muted-foreground">{offering.location}</p>
                    </div>
                    {selectedOffering === offering.id && (
                      <div className="w-6 h-6 rounded-full bg-[#56CCF2] flex items-center justify-center">
                        <ArrowRight className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{formatCurrency(offering.currentRaised)} / {formatCurrency(offering.targetRaise)}</span>
                      <span className="text-muted-foreground">{percentFunded.toFixed(0)}% funded</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#56CCF2]" 
                        style={{ width: `${percentFunded}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Minimum investment: {formatCurrency(offering.minInvestment)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <Button 
            className="w-full" 
            size="lg"
            disabled={!selectedOffering}
            onClick={() => setStep(2)}
          >
            Continue to Amount
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Step 2: Enter Amount */}
      {step === 2 && selectedOfferingData && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep(1)}
            className="mb-4"
          >
            ← Back to Deal Selection
          </Button>
          
          <Card className="border-4 border-[#56CCF2]">
            <CardHeader>
              <CardTitle>{selectedOfferingData.name}</CardTitle>
              <CardDescription>{selectedOfferingData.location}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                    $
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-4 pl-8 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white text-2xl font-bold"
                    placeholder="0"
                    min={selectedOfferingData.minInvestment}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Minimum: {formatCurrency(selectedOfferingData.minInvestment)}
                </p>
              </div>

              {parseInt(amount) > 0 && parseInt(amount) < selectedOfferingData.minInvestment && (
                <div className="p-3 rounded-lg bg-[#E07A47]/10 border-2 border-[#E07A47] flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-[#E07A47] mt-0.5" />
                  <p className="text-sm text-[#E07A47]">
                    Amount must be at least {formatCurrency(selectedOfferingData.minInvestment)}
                  </p>
                </div>
              )}

              <Button 
                className="w-full" 
                size="lg"
                disabled={!amount || parseInt(amount) < selectedOfferingData.minInvestment}
                onClick={() => setStep(3)}
              >
                Continue to Payment
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Select Payment Method */}
      {step === 3 && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep(2)}
            className="mb-4"
          >
            ← Back to Amount
          </Button>
          
          <h3 className="text-2xl font-bold">Select Payment Method</h3>
          
          <Card 
            className={`border-4 cursor-pointer transition-all ${
              paymentMethod === "ACH" 
                ? 'border-[#56CCF2] shadow-lg shadow-[#56CCF2]/20' 
                : 'border-[#E07A47] hover:shadow-lg'
            }`}
            onClick={() => setPaymentMethod("ACH")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#56CCF2]/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-[#56CCF2]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">ACH Transfer (Recommended)</h4>
                  <p className="text-sm text-muted-foreground">
                    Chase Bank ••4242 • 3-5 business days • No fees
                  </p>
                </div>
                {paymentMethod === "ACH" && (
                  <div className="w-6 h-6 rounded-full bg-[#56CCF2] flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`border-4 cursor-pointer transition-all ${
              paymentMethod === "WIRE" 
                ? 'border-[#56CCF2] shadow-lg shadow-[#56CCF2]/20' 
                : 'border-[#E07A47] hover:shadow-lg'
            }`}
            onClick={() => setPaymentMethod("WIRE")}
          >
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E07A47]/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-[#E07A47]" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg mb-1">Wire Transfer</h4>
                  <p className="text-sm text-muted-foreground">
                    Same day • $25 fee
                  </p>
                </div>
                {paymentMethod === "WIRE" && (
                  <div className="w-6 h-6 rounded-full bg-[#56CCF2] flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button 
            className="w-full" 
            size="lg"
            disabled={!paymentMethod}
            onClick={() => setStep(4)}
          >
            Continue to Review
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Step 4: Review and Confirm */}
      {step === 4 && selectedOfferingData && (
        <div className="space-y-4">
          <Button 
            variant="ghost" 
            onClick={() => setStep(3)}
            className="mb-4"
          >
            ← Back to Payment Method
          </Button>
          
          <Card className="border-4 border-[#56CCF2]">
            <CardHeader>
              <CardTitle>Review Your Investment</CardTitle>
              <CardDescription>
                Please review the details before confirming
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Investment Details */}
              <div className="space-y-3 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Deal</span>
                  <span className="text-sm font-bold">{selectedOfferingData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-bold">{selectedOfferingData.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Investment Amount</span>
                  <span className="text-xl font-black text-[#56CCF2]">
                    {formatCurrency(parseInt(amount))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm font-bold">
                    {paymentMethod === "ACH" ? "ACH Transfer (Chase ••4242)" : "Wire Transfer"}
                  </span>
                </div>
                {paymentMethod === "WIRE" && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Wire Fee</span>
                    <span className="text-sm font-bold text-[#E07A47]">$25.00</span>
                  </div>
                )}
                <div className="pt-3 border-t border-slate-200 dark:border-[#E07A47]">
                  <div className="flex justify-between">
                    <span className="font-bold">Total Amount</span>
                    <span className="text-2xl font-black text-[#56CCF2]">
                      {formatCurrency(parseInt(amount) + (paymentMethod === "WIRE" ? 25 : 0))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Disclosure */}
              <div className="p-4 rounded-lg bg-[#E07A47]/10 border-2 border-[#E07A47]">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-[#E07A47] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-[#E07A47] mb-1">Important Disclosure</p>
                    <p className="text-xs text-muted-foreground">
                      This is an investment in a private real estate offering. All investments carry risk, 
                      including loss of principal. This is not a liquid investment. Please review the offering 
                      memorandum and subscription agreement before investing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirmation */}
              <div className="flex items-start gap-2">
                <input type="checkbox" id="agree" className="mt-1" required />
                <label htmlFor="agree" className="text-sm">
                  I have reviewed the offering documents and agree to the terms and conditions. 
                  I understand this is a high-risk investment.
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={handleSubmit}
                >
                  Confirm Investment
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setStep(1)
                    setSelectedOffering(null)
                    setAmount("")
                    setPaymentMethod(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

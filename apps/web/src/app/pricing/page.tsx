"use client"

import { useState } from "react"
import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { PricingCard } from "@/components/pricing/PricingCard"
import { Button } from "@/components/ui/button"
import { sponsorPricing, investorPricing, providerPricing, fundManagerPricing } from "@/lib/pricing-tiers"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const [selectedRole, setSelectedRole] = useState<'sponsor' | 'investor' | 'provider' | 'fund-manager'>('sponsor')
  const router = useRouter()

  const pricing = selectedRole === 'sponsor' 
    ? sponsorPricing 
    : selectedRole === 'investor' 
    ? investorPricing 
    : selectedRole === 'provider'
    ? providerPricing
    : fundManagerPricing

  const handleSelectTier = (tierName: string) => {
    // Navigate to signup with pre-selected role and tier
    router.push(`/signup?role=${selectedRole}&tier=${tierName}`)
  }

  return (
    <>
      <MarketingNav />

      <section className="py-20 min-h-screen bg-muted/30">
        <div className="container max-w-7xl px-6 mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Start free and upgrade as you grow. All plans include our core features.
              No hidden fees, cancel anytime.
            </p>

            {/* Role Selector */}
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { key: 'sponsor', label: 'For Sponsors' },
                { key: 'investor', label: 'For Investors' },
                { key: 'provider', label: 'For Providers' },
                { key: 'fund-manager', label: 'For Fund Managers' },
              ].map((role) => (
                <Button
                  key={role.key}
                  variant={selectedRole === role.key ? "default" : "outline"}
                  onClick={() => setSelectedRole(role.key as any)}
                  className={selectedRole === role.key ? "bg-[#56CCF2] hover:bg-[#56CCF2]/90" : ""}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {pricing.tiers.map((tier) => (
              <PricingCard
                key={tier.name}
                tier={tier}
                onSelect={handleSelectTier}
              />
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto mt-20">
            <h2 className="text-3xl font-black mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="p-6 rounded-lg bg-[#56CCF2] border-2 border-[#56CCF2]">
                <h3 className="font-bold text-lg mb-2 text-white">Can I switch plans at any time?</h3>
                <p className="text-white">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                  and we'll prorate any billing differences.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#56CCF2] border-2 border-[#56CCF2]">
                <h3 className="font-bold text-lg mb-2 text-white">What happens if I hit my limits on the Free plan?</h3>
                <p className="text-white">
                  We'll notify you when you're approaching your limits and give you the option to upgrade.
                  You won't lose any data, but you may need to upgrade to continue using certain features.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#56CCF2] border-2 border-[#56CCF2]">
                <h3 className="font-bold text-lg mb-2 text-white">Do you offer discounts for annual billing?</h3>
                <p className="text-white">
                  Yes! Save 20% when you pay annually. Contact us for enterprise pricing and custom plans.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#56CCF2] border-2 border-[#56CCF2]">
                <h3 className="font-bold text-lg mb-2 text-white">What payment methods do you accept?</h3>
                <p className="text-white">
                  We accept all major credit cards (Visa, Mastercard, Amex), ACH transfers, and wire transfers
                  for Enterprise plans.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-[#56CCF2] border-2 border-[#56CCF2]">
                <h3 className="font-bold text-lg mb-2 text-white">Is there a setup fee?</h3>
                <p className="text-white">
                  No setup fees for Free and Pro plans. Enterprise plans include complimentary onboarding
                  and training as part of your subscription.
                </p>
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-20 p-12 rounded-2xl bg-gradient-to-br from-[#56CCF2]/20 to-[#E07A47]/20 border-4 border-[#56CCF2] text-center">
            <h2 className="text-4xl font-black mb-4">
              Need a custom plan?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Large organization? Complex requirements? Let's talk about a custom Enterprise solution
              tailored to your needs.
            </p>
            <Button 
              size="lg"
              className="bg-[#E07A47] hover:bg-[#D96835] text-white font-bold text-lg px-8 py-6"
              onClick={() => router.push('/contact')}
            >
              Contact Sales Team
            </Button>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

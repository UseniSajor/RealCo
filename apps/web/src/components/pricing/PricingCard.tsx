"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Zap, Crown, Building2, ArrowRight } from "lucide-react"
import type { PricingTier } from "@/lib/pricing-tiers"

interface PricingCardProps {
  tier: PricingTier
  onSelect: (tierName: string) => void
  currentTier?: string
}

export function PricingCard({ tier, onSelect, currentTier }: PricingCardProps) {
  const isCurrentTier = currentTier === tier.name

  const getTierIcon = () => {
    if (tier.name === 'free') return null
    if (tier.name === 'pro' || tier.popular) return <Zap className="h-5 w-5" />
    if (tier.name === 'enterprise') return <Crown className="h-5 w-5" />
    return <Building2 className="h-5 w-5" />
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${
        tier.popular
          ? 'border-4 border-[#E07A47] shadow-xl shadow-[#E07A47]/20'
          : 'border-4 border-[#E07A47]/50 hover:border-[#E07A47]'
      } ${isCurrentTier ? 'opacity-75' : ''}`}
    >
      {/* Popular Badge */}
      {tier.popular && (
        <div className="absolute -top-0 left-0 right-0">
          <div className="bg-gradient-to-r from-[#E07A47] to-[#D96835] text-white text-center py-2 font-bold text-sm">
            <Zap className="inline h-4 w-4 mr-1" />
            MOST POPULAR
          </div>
        </div>
      )}

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#56CCF2]/10 to-transparent rounded-bl-full pointer-events-none"></div>

      <CardHeader className={`text-center pb-4 ${tier.popular ? 'pt-14' : 'pt-8'}`}>
        {/* Tier Icon */}
        {getTierIcon() && (
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center text-white shadow-lg">
            {getTierIcon()}
          </div>
        )}

        <CardTitle className="text-2xl font-black mb-2">
          {tier.displayName}
        </CardTitle>

        {/* Price Display */}
        <div className="mb-4">
          {tier.price === 0 ? (
            <div>
              <span className="text-5xl font-black text-[#56CCF2]">Free</span>
              <p className="text-sm text-muted-foreground mt-1">Forever</p>
            </div>
          ) : tier.name === 'enterprise' ? (
            <div>
              <span className="text-4xl font-black">Custom</span>
              <p className="text-sm text-muted-foreground mt-1">Contact for pricing</p>
            </div>
          ) : (
            <div>
              <span className="text-5xl font-black">${tier.price}</span>
              <span className="text-muted-foreground text-lg">/{tier.billingPeriod}</span>
              {tier.price > 0 && (
                <p className="text-xs text-green-600 font-semibold mt-1">
                  Save 20% with annual billing
                </p>
              )}
            </div>
          )}
        </div>

        <CardDescription className="text-base">
          {tier.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Features List */}
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-200 transition-colors">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={() => onSelect(tier.name)}
          disabled={isCurrentTier}
          size="lg"
          className={`w-full font-bold text-lg py-6 group transition-all ${
            tier.popular
              ? 'bg-gradient-to-r from-[#E07A47] to-[#D96835] hover:from-[#D96835] hover:to-[#C55A28] shadow-lg shadow-[#E07A47]/30'
              : tier.name === 'enterprise'
              ? 'bg-gradient-to-r from-[#56CCF2] to-[#3BB5E0] hover:from-[#3BB5E0] hover:to-[#2A9AC8] shadow-lg shadow-[#56CCF2]/30'
              : 'bg-slate-800 hover:bg-slate-700'
          }`}
        >
          {isCurrentTier ? 'Current Plan' : (
            <>
              {tier.cta}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        {/* Trust Badges */}
        {tier.name === 'free' && (
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground font-semibold">
              No credit card required
            </p>
            <p className="text-xs text-green-600">
              Start in under 2 minutes
            </p>
          </div>
        )}

        {tier.popular && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Join 500+ sponsors using Pro
            </p>
          </div>
        )}

        {tier.name === 'enterprise' && (
          <div className="text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Custom onboarding included
            </p>
            <p className="text-xs text-[#56CCF2] font-semibold">
              Dedicated account manager
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

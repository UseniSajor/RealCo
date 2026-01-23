"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import type { PricingTier } from "@/lib/pricing-tiers"

interface PricingCardProps {
  tier: PricingTier
  onSelect: (tierName: string) => void
  currentTier?: string
}

export function PricingCard({ tier, onSelect, currentTier }: PricingCardProps) {
  const isCurrentTier = currentTier === tier.name

  return (
    <Card 
      className={`relative ${
        tier.popular 
          ? 'border-4 border-[#56CCF2] shadow-xl scale-105' 
          : 'border-2 border-slate-200 dark:border-[#E07A47]'
      } ${isCurrentTier ? 'opacity-75' : ''}`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-[#56CCF2] text-white font-bold px-4 py-1">
            MOST POPULAR
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-2xl font-black mb-2">
          {tier.displayName}
        </CardTitle>
        <div className="mb-4">
          <span className="text-5xl font-black">
            ${tier.price}
          </span>
          <span className="text-muted-foreground">
            /{tier.billingPeriod}
          </span>
        </div>
        <CardDescription className="text-base">
          {tier.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Features List */}
        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          onClick={() => onSelect(tier.name)}
          disabled={isCurrentTier}
          className={`w-full font-bold ${
            tier.popular
              ? 'bg-[#56CCF2] hover:bg-[#56CCF2]/90'
              : tier.name === 'enterprise'
              ? 'bg-[#E07A47] hover:bg-[#D96835]'
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          {isCurrentTier ? 'Current Plan' : tier.cta}
        </Button>

        {tier.name === 'free' && (
          <p className="text-xs text-center text-muted-foreground">
            No credit card required
          </p>
        )}
      </CardContent>
    </Card>
  )
}

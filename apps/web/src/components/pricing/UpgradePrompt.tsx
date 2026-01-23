"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Lock, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface UpgradePromptProps {
  feature: string
  requiredTier: 'pro' | 'enterprise'
  variant?: 'card' | 'inline' | 'modal'
}

export function UpgradePrompt({ feature, requiredTier, variant = 'card' }: UpgradePromptProps) {
  const { user } = useAuth()

  if (!user) return null

  const benefits = requiredTier === 'pro' ? [
    'Up to 5 Active Projects',
    'Unlimited Investors',
    'Advanced Analytics',
    'Priority Support',
  ] : [
    'Unlimited Everything',
    'White-Label Options',
    'Dedicated Account Manager',
    '24/7 Support',
  ]

  const price = requiredTier === 'pro' ? 199 : 499

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-[#56CCF2]/10 to-[#E07A47]/10 border-2 border-[#56CCF2]">
        <Lock className="h-8 w-8 text-[#56CCF2] flex-shrink-0" />
        <div className="flex-1">
          <p className="font-bold text-sm mb-1">{feature} requires {requiredTier.toUpperCase()}</p>
          <p className="text-xs text-muted-foreground">
            Upgrade to unlock this feature and more
          </p>
        </div>
        <Button asChild className="bg-[#56CCF2] hover:bg-[#56CCF2]/90">
          <Link href="/pricing">
            Upgrade Now
          </Link>
        </Button>
      </div>
    )
  }

  if (variant === 'modal') {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#56CCF2]/20 flex items-center justify-center mx-auto mb-4">
          <Lock className="h-8 w-8 text-[#56CCF2]" />
        </div>
        <h3 className="text-2xl font-black mb-2">Upgrade to {requiredTier.toUpperCase()}</h3>
        <p className="text-muted-foreground mb-6">
          Unlock <span className="font-semibold">{feature}</span> and advanced features
        </p>
        <div className="bg-muted/50 p-4 rounded-lg mb-6">
          <p className="text-3xl font-black text-[#56CCF2] mb-1">${price}/mo</p>
          <p className="text-sm text-muted-foreground">Billed monthly</p>
        </div>
        <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90 mb-3">
          <Link href="/pricing">
            View All Plans
          </Link>
        </Button>
        <Button variant="ghost" className="w-full">
          Maybe Later
        </Button>
      </div>
    )
  }

  // Card variant (default)
  return (
    <Card className="border-4 border-[#56CCF2] bg-gradient-to-br from-[#56CCF2]/5 to-[#E07A47]/5">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-[#56CCF2] text-white">
            {requiredTier.toUpperCase()} FEATURE
          </Badge>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-6 w-6 text-[#56CCF2]" />
          Upgrade to Access {feature}
        </CardTitle>
        <CardDescription>
          This feature requires the {requiredTier.toUpperCase()} plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-lg bg-white dark:bg-slate-800">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-black text-[#56CCF2]">${price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {requiredTier === 'pro' ? 'Perfect for active users' : 'For large organizations'}
          </p>
        </div>

        <div>
          <p className="font-semibold mb-3">What you'll get:</p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-[#56CCF2]" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90">
            <Link href="/pricing">
              View Full Pricing
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/${user.role}`}>
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Tier Badge Component
export function TierBadge() {
  const { user } = useAuth()

  if (!user) return null

  const badgeColor = user.tier === 'free' 
    ? 'bg-slate-500' 
    : user.tier === 'pro' 
    ? 'bg-[#56CCF2]' 
    : 'bg-[#E07A47]'

  return (
    <Badge className={`${badgeColor} text-white font-bold`}>
      {user.tier.toUpperCase()}
    </Badge>
  )
}

// Upgrade Button Component
export function UpgradeButton() {
  const { user } = useAuth()

  if (!user || user.tier === 'enterprise') return null

  return (
    <Button asChild className="bg-gradient-to-r from-[#56CCF2] to-[#E07A47] hover:from-[#56CCF2]/90 hover:to-[#E07A47]/90 text-white font-bold">
      <Link href="/pricing">
        <TrendingUp className="mr-2 h-4 w-4" />
        Upgrade to {user.tier === 'free' ? 'Pro' : 'Enterprise'}
      </Link>
    </Button>
  )
}

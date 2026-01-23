"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PricingCard } from "@/components/pricing/PricingCard"
import { useAuth } from "@/lib/auth-context"
import { sponsorPricing, investorPricing, providerPricing, fundManagerPricing, type TierName } from "@/lib/pricing-tiers"
import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup } = useAuth()

  const [step, setStep] = useState<'role' | 'tier' | 'account'>('role')
  const [selectedRole, setSelectedRole] = useState<'sponsor' | 'investor' | 'provider' | 'fund-manager' | null>(null)
  const [selectedTier, setSelectedTier] = useState<TierName>('free')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Check for pre-selected role and tier from URL
  useEffect(() => {
    const urlRole = searchParams.get('role') as 'sponsor' | 'investor' | 'provider' | 'fund-manager' | null
    const urlTier = searchParams.get('tier') as TierName | null

    if (urlRole) {
      setSelectedRole(urlRole)
      setStep('tier')
    }
    if (urlTier) {
      setSelectedTier(urlTier)
    }
  }, [searchParams])

  const pricing = selectedRole === 'sponsor'
    ? sponsorPricing
    : selectedRole === 'investor'
    ? investorPricing
    : selectedRole === 'provider'
    ? providerPricing
    : fundManagerPricing

  const handleRoleSelect = (role: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => {
    setSelectedRole(role)
    setStep('tier')
  }

  const handleTierSelect = (tierName: string) => {
    setSelectedTier(tierName as TierName)
    if (tierName === 'free') {
      // Skip to account creation for free tier
      setStep('account')
    } else if (tierName === 'enterprise') {
      // Redirect to contact for enterprise
      router.push('/contact?plan=enterprise')
    } else {
      // Show account creation for paid tiers
      setStep('account')
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !selectedRole) {
      alert("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      await signup(email, password, selectedRole, selectedTier)
    } catch (error) {
      console.error('Signup error:', error)
      alert("Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <MarketingNav />

      <section className="py-12 min-h-screen bg-muted/30">
        <div className="container max-w-6xl px-6 mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className={`flex items-center gap-2 ${step === 'role' ? 'text-[#56CCF2]' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step !== 'role' ? 'bg-green-500 text-white' : 'bg-[#56CCF2] text-white'}`}>
                {step !== 'role' ? <Check className="h-5 w-5" /> : '1'}
              </div>
              <span className="font-semibold">Choose Role</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className={`flex items-center gap-2 ${step === 'tier' ? 'text-[#56CCF2]' : step === 'account' ? 'text-green-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'account' ? 'bg-green-500 text-white' : step === 'tier' ? 'bg-[#56CCF2] text-white' : 'bg-slate-300 text-white'}`}>
                {step === 'account' ? <Check className="h-5 w-5" /> : '2'}
              </div>
              <span className="font-semibold">Select Plan</span>
            </div>
            <div className="w-16 h-0.5 bg-slate-300" />
            <div className={`flex items-center gap-2 ${step === 'account' ? 'text-[#56CCF2]' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'account' ? 'bg-[#56CCF2] text-white' : 'bg-slate-300 text-white'}`}>
                3
              </div>
              <span className="font-semibold">Create Account</span>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-5xl font-black mb-4">Join RealCo</h1>
                <p className="text-xl text-muted-foreground">
                  Choose your role to get started
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {[
                  {
                    role: 'sponsor',
                    title: 'Sponsor',
                    description: 'Raise capital and manage construction projects',
                    features: ['Capital Management', 'Investor Relations', 'Project Management', 'Distribution Tracking'],
                  },
                  {
                    role: 'investor',
                    title: 'Investor',
                    description: 'Browse opportunities and track investments',
                    features: ['Investment Portfolio', 'Document Access', 'Distribution Tracking', 'Real-Time Updates'],
                  },
                  {
                    role: 'provider',
                    title: 'Provider',
                    description: 'Submit invoices and get paid faster',
                    features: ['Invoice Submission', 'Payment Tracking', 'Lien Waivers', 'Document Management'],
                  },
                  {
                    role: 'fund-manager',
                    title: 'Fund Manager',
                    description: 'Operate assets and manage investor relations',
                    features: ['Asset Operations', 'Fund Accounting', 'Investor Reporting', 'Exit Management'],
                  },
                ].map((option) => (
                  <Card
                    key={option.role}
                    className="border-2 border-slate-200 dark:border-[#E07A47] hover:border-[#56CCF2] cursor-pointer transition-all"
                    onClick={() => handleRoleSelect(option.role as any)}
                  >
                    <CardHeader>
                      <CardTitle className="text-2xl">{option.title}</CardTitle>
                      <CardDescription>{option.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6 bg-[#56CCF2] hover:bg-[#56CCF2]/90">
                        Continue as {option.title}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Tier Selection */}
          {step === 'tier' && selectedRole && (
            <div>
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setStep('role')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Role Selection
              </Button>

              <div className="text-center mb-12">
                <h1 className="text-5xl font-black mb-4">
                  Choose Your Plan
                </h1>
                <p className="text-xl text-muted-foreground">
                  Start with our free plan and upgrade anytime
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {pricing.tiers.map((tier) => (
                  <PricingCard
                    key={tier.name}
                    tier={tier}
                    onSelect={handleTierSelect}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Account Creation */}
          {step === 'account' && (
            <div className="max-w-md mx-auto">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setStep('tier')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plan Selection
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-black mb-2">Create Your Account</h1>
                <p className="text-base text-muted-foreground">
                  You're signing up as a <span className="font-bold text-[#56CCF2]">{selectedRole}</span> on the <span className="font-bold text-[#56CCF2]">{selectedTier}</span> plan
                </p>
              </div>

              <Card className="border-4 border-[#E07A47] bg-white dark:bg-white">
                <CardHeader>
                  <CardTitle className="dark:text-slate-900">Sign Up</CardTitle>
                  <CardDescription className="dark:text-slate-600">
                    Enter your details to create your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-slate-900">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white text-slate-900 text-sm"
                        placeholder="you@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 dark:text-slate-900">
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white text-slate-900 text-sm"
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <div className="bg-[#56CCF2]/10 p-4 rounded-lg">
                      <h3 className="font-bold text-sm mb-2 dark:text-slate-900">Your Plan:</h3>
                      <p className="text-sm dark:text-slate-700">
                        <span className="font-semibold">{selectedTier.toUpperCase()}</span> - ${pricing.tiers.find(t => t.name === selectedTier)?.price}/month
                      </p>
                      {selectedTier === 'free' && (
                        <p className="text-xs text-slate-600 dark:text-slate-600 mt-2">
                          No credit card required. Upgrade anytime.
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                      disabled={loading}
                    >
                      {loading ? 'Creating account...' : selectedTier === 'free' ? 'Start Free' : 'Continue to Payment'}
                    </Button>
                  </form>

                  <div className="mt-4 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-600">
                      Already have an account?{" "}
                      <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-300">
                    <p className="text-xs text-center text-slate-500 dark:text-slate-600">
                      ✨ Temporary Auth: Use any email and password
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

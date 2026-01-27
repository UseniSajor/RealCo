"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PricingCard } from "@/components/pricing/PricingCard"
import { useAuth } from "@/lib/auth-context"
import { sponsorPricing, investorPricing, providerPricing, fundManagerPricing, type TierName } from "@/lib/pricing-tiers"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  Building2,
  TrendingUp,
  Wrench,
  Briefcase,
  ArrowRight,
  Mail,
  Lock,
  Sparkles,
  Shield
} from "lucide-react"

function SignupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signup } = useAuth()

  const [step, setStep] = useState<'role' | 'tier' | 'account'>('role')
  const [selectedRole, setSelectedRole] = useState<'sponsor' | 'investor' | 'provider' | 'fund-manager' | null>(null)
  const [selectedTier, setSelectedTier] = useState<TierName>('free')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [loading, setLoading] = useState(false)

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
      setStep('account')
    } else if (tierName === 'enterprise') {
      router.push('/contact?plan=enterprise')
    } else {
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

  const roleOptions = [
    {
      role: 'sponsor',
      title: 'Sponsor',
      icon: Building2,
      gradient: 'from-[#E07A47] to-[#D96835]',
      description: 'Raise capital and manage construction projects',
      features: ['Capital Management', 'Investor Relations', 'Project Tracking', 'Distribution Automation'],
    },
    {
      role: 'investor',
      title: 'Investor',
      icon: TrendingUp,
      gradient: 'from-[#56CCF2] to-[#3BB5E0]',
      description: 'Browse opportunities and track investments',
      features: ['Investment Portfolio', 'Document Access', 'K-1 Tax Center', 'Real-Time Updates'],
    },
    {
      role: 'provider',
      title: 'Service Provider',
      icon: Wrench,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Submit invoices and get paid faster',
      features: ['Invoice Submission', 'Payment Tracking', 'Work Orders', 'Compliance Tools'],
    },
    {
      role: 'fund-manager',
      title: 'Fund Manager',
      icon: Briefcase,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Operate assets and manage investor relations',
      features: ['Asset Operations', 'Fund Accounting', 'Investor Reporting', 'Exit Management'],
    },
  ]

  return (
    <>
      <MarketingNav />

      <section className="py-12 min-h-screen bg-white dark:bg-slate-900">
        <div className="container max-w-6xl px-6 mx-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
            {[
              { num: 1, label: 'Choose Role', key: 'role' },
              { num: 2, label: 'Select Plan', key: 'tier' },
              { num: 3, label: 'Create Account', key: 'account' },
            ].map((s, i) => {
              const isComplete = (s.key === 'role' && step !== 'role') ||
                                 (s.key === 'tier' && step === 'account')
              const isCurrent = s.key === step

              return (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-2 ${isCurrent ? 'text-[#56CCF2]' : isComplete ? 'text-green-500' : 'text-slate-400'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isComplete ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-[#56CCF2] text-white shadow-lg shadow-[#56CCF2]/30' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-500'
                    }`}>
                      {isComplete ? <Check className="h-5 w-5" /> : s.num}
                    </div>
                    <span className="font-semibold hidden md:inline">{s.label}</span>
                  </div>
                  {i < 2 && (
                    <div className={`w-8 md:w-16 h-1 mx-2 rounded ${
                      isComplete ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Step 1: Role Selection */}
          {step === 'role' && (
            <div>
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  Join <span className="text-[#56CCF2]">RealCo</span> Today
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Choose your role to get started with the platform that powers real estate syndication
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <Card
                      key={option.role}
                      className="border-4 border-[#E07A47]/50 hover:border-[#E07A47] cursor-pointer transition-all hover:shadow-2xl hover:scale-105 group"
                      onClick={() => handleRoleSelect(option.role as any)}
                    >
                      <CardHeader className="text-center pb-4">
                        <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-8 w-8 text-white" />
                        </div>
                        <CardTitle className="text-2xl">{option.title}</CardTitle>
                        <CardDescription className="text-sm">{option.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {option.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <Check className="h-3 w-3 text-green-600" />
                              </div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button className={`w-full bg-gradient-to-r ${option.gradient} hover:opacity-90 font-bold group-hover:shadow-lg transition-all`}>
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-4">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#56CCF2] font-bold hover:underline">
                    Sign in here
                  </Link>
                </p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    SOC 2 Compliant
                  </span>
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#E07A47]" />
                    Free Forever Plan
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tier Selection */}
          {step === 'tier' && selectedRole && (
            <div>
              <Button
                variant="ghost"
                className="mb-6 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setStep('role')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Role Selection
              </Button>

              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  Choose Your Plan
                </h1>
                <p className="text-xl text-muted-foreground">
                  Start free and upgrade as you grow. No credit card required.
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

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  All plans include 24/7 support and our core features.{" "}
                  <Link href="/pricing" className="text-[#56CCF2] hover:underline">
                    Compare all features
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Account Creation */}
          {step === 'account' && (
            <div className="max-w-lg mx-auto">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setStep('tier')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Plan Selection
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-black mb-4">Create Your Account</h1>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#56CCF2]/10 text-[#56CCF2]">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-semibold capitalize">{selectedRole}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="font-semibold capitalize">{selectedTier} Plan</span>
                </div>
              </div>

              <Card className="border-4 border-[#E07A47] shadow-2xl shadow-[#E07A47]/10">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Almost There!</CardTitle>
                  <CardDescription>
                    Fill in your details to get started
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                          placeholder="John Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Company
                        </label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                          placeholder="Acme Corp"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Mail className="inline h-4 w-4 mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                        placeholder="you@company.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        <Lock className="inline h-4 w-4 mr-2" />
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-800 text-sm"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum 8 characters
                      </p>
                    </div>

                    {selectedTier === 'free' && (
                      <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 p-4 rounded-xl">
                        <p className="text-sm text-green-700 dark:text-green-400 font-semibold flex items-center gap-2">
                          <Check className="h-4 w-4" />
                          No credit card required for free plan
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-gradient-to-r from-[#E07A47] to-[#D96835] hover:from-[#D96835] hover:to-[#C55A28] font-bold text-lg py-6 shadow-lg shadow-[#E07A47]/30"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Creating account...
                        </>
                      ) : (
                        <>
                          {selectedTier === 'free' ? 'Start Free Now' : 'Continue to Payment'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By signing up, you agree to our{" "}
                      <Link href="/terms" className="text-[#56CCF2] hover:underline">Terms of Service</Link>
                      {" "}and{" "}
                      <Link href="/privacy" className="text-[#56CCF2] hover:underline">Privacy Policy</Link>
                    </p>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                    <p className="text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link href="/login" className="text-[#56CCF2] font-bold hover:underline">
                        Sign in
                      </Link>
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#56CCF2] to-[#E07A47] flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-slate-600 font-semibold">Loading...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}

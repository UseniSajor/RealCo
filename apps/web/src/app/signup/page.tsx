"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { Building2, TrendingUp, Wrench, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const handleRoleSignup = (role: string) => {
    // TODO: Connect to backend API
    alert(`Sign up as ${role} - Will connect to backend API`)
  }

  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen bg-muted/30">
        <div className="container max-w-5xl px-6">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black mb-4">Choose Your Role</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Select the option that best describes you and start your free trial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card 
              className="cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group"
              onClick={() => handleRoleSignup("Sponsor")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Sponsor / Developer</CardTitle>
                <CardDescription className="text-base">
                  Raise capital and manage projects end-to-end
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-left space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">✓ Capital raise tools</p>
                  <p className="text-sm text-muted-foreground">✓ Compliance workflows</p>
                  <p className="text-sm text-muted-foreground">✓ Construction tracking</p>
                  <p className="text-sm text-muted-foreground">✓ Investor reporting</p>
                </div>
                <Button className="w-full group-hover:scale-105 transition-transform" size="lg">
                  Sign Up as Sponsor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group"
              onClick={() => handleRoleSignup("Investor")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Investor</CardTitle>
                <CardDescription className="text-base">
                  Invest in opportunities with full transparency
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-left space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">✓ Deal transparency</p>
                  <p className="text-sm text-muted-foreground">✓ Secure onboarding</p>
                  <p className="text-sm text-muted-foreground">✓ Real-time updates</p>
                  <p className="text-sm text-muted-foreground">✓ Automated distributions</p>
                </div>
                <Button className="w-full group-hover:scale-105 transition-transform" size="lg">
                  Sign Up as Investor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-2xl transition-all hover:border-[#E07A47] border-4 group"
              onClick={() => handleRoleSignup("Provider")}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Wrench className="h-8 w-8 text-white" />
                </div>
                <CardTitle>Service Provider</CardTitle>
                <CardDescription className="text-base">
                  Partner with sponsors on deals
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-left space-y-2 mb-4">
                  <p className="text-sm text-muted-foreground">✓ Faster approvals</p>
                  <p className="text-sm text-muted-foreground">✓ Digital workflows</p>
                  <p className="text-sm text-muted-foreground">✓ Payment tracking</p>
                  <p className="text-sm text-muted-foreground">✓ Automated billing</p>
                </div>
                <Button className="w-full group-hover:scale-105 transition-transform" size="lg">
                  Sign Up as Provider
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="underline">Terms of Service</Link>
              {" "}and{" "}
              <Link href="/privacy" className="underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

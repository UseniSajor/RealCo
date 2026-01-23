"use client"

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"

export default function SignupFormPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields")
      return
    }
    
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }
    
    // Demo mode: Accept any credentials
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name)
    
    // Redirect to role selection
    window.location.href = '/auth/role-select'
  }

  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="container max-w-md px-6 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Create Account</h1>
            <p className="text-xl text-muted-foreground">
              Join RealCo and start your free trial
            </p>
          </div>

          <Card className="border-4 border-[#E07A47]">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create your account to access the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-bold mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-[#6b7280] dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Create Account
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
                
                {/* Skip to Demo */}
                <div className="pt-4 border-t border-slate-200 dark:border-[#E07A47]">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-[#56CCF2] text-[#56CCF2] hover:bg-[#56CCF2] hover:text-white"
                    asChild
                  >
                    <Link href="/dashboard">
                      Skip to Demo Dashboard →
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Explore the platform without signing up
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="underline">Privacy Policy</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

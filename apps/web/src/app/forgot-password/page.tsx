"use client"

import { useState } from "react"
import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Temporary: Just show success message
    setSubmitted(true)
  }

  return (
    <>
      <MarketingNav />
      
      <section className="py-12 min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="container max-w-md px-6 mx-auto">
          {!submitted ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-black mb-2">Reset Password</h1>
                <p className="text-base text-muted-foreground">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <Card className="border-4 border-[#E07A47] bg-white dark:bg-white">
                <CardHeader>
                  <CardTitle className="dark:text-slate-900">Forgot Password</CardTitle>
                  <CardDescription className="dark:text-slate-600">
                    We'll email you instructions to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold mb-2 dark:text-slate-900">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 dark:border-[#E07A47] focus:border-[#56CCF2] focus:outline-none bg-white text-slate-900 text-sm"
                        placeholder="you@company.com"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-[#56CCF2] hover:bg-[#56CCF2]/90"
                    >
                      Send Reset Link
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-600">
                      Remember your password?{" "}
                      <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-300">
                    <p className="text-xs text-center text-slate-500 dark:text-slate-600">
                      ✨ Temporary: This will be fully functional once production auth is implemented
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card className="border-4 border-green-500 bg-white dark:bg-white">
                <CardContent className="pt-12 pb-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-200 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-black mb-3 dark:text-slate-900">Check Your Email</h2>
                  <p className="text-muted-foreground dark:text-slate-600 mb-6">
                    We've sent password reset instructions to:<br />
                    <span className="font-semibold text-[#56CCF2]">{email}</span>
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-100 p-4 rounded-lg mb-6">
                    <p className="text-sm text-slate-700 dark:text-slate-900">
                      Didn't receive the email? Check your spam folder or{" "}
                      <button 
                        onClick={() => setSubmitted(false)} 
                        className="text-[#56CCF2] font-semibold hover:underline"
                      >
                        try again
                      </button>
                    </p>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href="/login">
                      Back to Sign In
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export const metadata = {
  title: "Contact Us | RealCo",
  description: "Book a demo or get in touch with our team.",
}

export default function ContactPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen flex items-center justify-center">
        <div className="container max-w-2xl px-6 mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Book a Demo</h1>
            <p className="text-xl text-muted-foreground">
              Get a personalized walkthrough of the platform
            </p>
          </div>

          <Card className="border-4 border-[#E07A47]">
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none bg-white dark:bg-slate-900"
                    placeholder="Your name"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[rgb(var(--primary))] focus:outline-none"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-bold mb-2">
                    I am a...
                  </label>
                  <select
                    id="role"
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[rgb(var(--primary))] focus:outline-none"
                  >
                    <option>Sponsor / Developer</option>
                    <option>Investor</option>
                    <option>Service Provider</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#56CCF2] focus:outline-none resize-none bg-white dark:bg-[#6b7280] dark:text-white"
                    placeholder="Tell us about your needs..."
                  />
                </div>

                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center mt-6">
                We'll get back to you within 24 hours.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#56CCF2] font-semibold hover:underline">
                    Sign in
                  </Link>
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

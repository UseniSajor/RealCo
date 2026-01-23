import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata = {
  title: "Contact Us | RealCo",
  description: "Book a demo or get in touch with our team.",
}

export default function ContactPage() {
  return (
    <>
      <MarketingNav />
      
      <section className="py-24 min-h-screen">
        <div className="container max-w-2xl px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4">Book a Demo</h1>
            <p className="text-xl text-muted-foreground">
              Get a personalized walkthrough of the platform
            </p>
          </div>

          <Card>
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[rgb(var(--primary))] focus:outline-none"
                    placeholder="Your name"
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-border focus:border-[rgb(var(--primary))] focus:outline-none resize-none"
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
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </>
  )
}

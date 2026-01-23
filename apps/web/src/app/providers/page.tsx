import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { CTASection } from "@/components/marketing/cta-section"
import { CheckCircle2, Handshake, TrendingUp, Shield, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "For Providers | RealCo - Contractors, Attorneys, Brokers",
  description: "Faster approvals. Cleaner paperwork. More predictable pay. Join RealCo's network of service providers and streamline your workflow with automated billing, lien waivers, and payment tracking.",
  keywords: ["construction management", "real estate attorneys", "deal sourcing", "contractor platform", "fund administration"],
}

export default function ProvidersPage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="Faster approvals. Cleaner paperwork. More predictable pay."
        subheadline="Join RealCo's trusted network of service providers. Streamline billing, approvals, and payments—without constant chasing."
        primaryCta={{ label: "Create Provider Account", href: "/signup" }}
        secondaryCta={{ label: "Partner with Sponsors", href: "#partner" }}
        tertiaryCta={{ label: "Book Walkthrough", href: "/contact" }}
      />

      {/* Contractors Section */}
      <section className="py-24">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-secondary flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">For Contractors / Construction Managers</h2>
            <p className="text-xl text-muted-foreground">Get paid faster with digital workflows and automated approvals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Submit digital draw requests", desc: "Upload invoices, photos, and progress reports in one place" },
              { title: "Track approval status in real-time", desc: "See exactly where your request is in the approval chain" },
              { title: "Upload lien waivers automatically", desc: "Digital signatures and instant verification" },
              { title: "Receive ACH payments directly", desc: "No more waiting for checks—get paid via direct deposit" },
              { title: "Maintain complete payment history", desc: "Access all invoices and payments in one dashboard" },
              { title: "Auto-generate conditional/unconditional releases", desc: "System creates proper lien waiver forms based on payment stage" },
              { title: "Budget vs actual tracking", desc: "See project budgets and your billings in real-time" },
              { title: "Mobile-friendly field updates", desc: "Submit progress from the job site via phone or tablet" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all duration-300 hover:shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-[#E07A47] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-base font-bold text-foreground mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorneys Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-secondary flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">For Attorneys / Fund Administrators</h2>
            <p className="text-xl text-muted-foreground">Streamline compliance workflows and reduce administrative overhead</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Review subscription agreements digitally", desc: "E-signatures, version control, and audit trails built-in" },
              { title: "Automated compliance checklists", desc: "Reg D/506(b)/506(c) workflows with deadline reminders" },
              { title: "Collaborate on Form D filings", desc: "Real-time collaboration with sponsors on SEC filings" },
              { title: "Generate audit-ready reports instantly", desc: "Compliance reports, investor lists, and activity logs on demand" },
              { title: "Investor accreditation verification", desc: "Integrated third-party verification workflows" },
              { title: "Blue sky filing management", desc: "Track state-by-state notice filings and deadlines" },
              { title: "Document version control", desc: "Automatic versioning and change tracking for all legal docs" },
              { title: "Secure client communications", desc: "Encrypted messaging and file sharing with sponsors" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all duration-300 hover:shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-[#E07A47] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-base font-bold text-foreground mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brokers Section */}
      <section className="py-24">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl gradient-secondary flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">For Brokers / Deal Sourcers</h2>
            <p className="text-xl text-muted-foreground">Track commissions and manage investor relationships effortlessly</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Monitor investor subscriptions in real-time", desc: "See which of your investors have committed and funded" },
              { title: "Automated commission tracking", desc: "System calculates your commission as subscriptions close" },
              { title: "Share deal materials with investors", desc: "Send PPMs, decks, and updates directly through the platform" },
              { title: "Receive automated notifications", desc: "Instant alerts when investors view docs, subscribe, or fund" },
              { title: "Track investor pipeline across deals", desc: "See all your investor relationships in one CRM-style view" },
              { title: "Generate investor performance reports", desc: "Show your investors their portfolio returns and distributions" },
              { title: "Digital co-brokerage agreements", desc: "Split commissions transparently with other brokers" },
              { title: "Compliance-ready activity logs", desc: "All communications and referrals documented for FINRA/state compliance" },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all duration-300 hover:shadow-lg">
                <CheckCircle2 className="h-6 w-6 text-[#E07A47] flex-shrink-0 mt-1" />
                <div>
                  <p className="text-base font-bold text-foreground mb-1">{feature.title}</p>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner with Sponsors Section */}
      <section id="partner" className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl gradient-hero flex items-center justify-center">
              <Handshake className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">Partner with Sponsors on RealCo</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join our growing network of service providers working with top real estate sponsors nationwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all">
              <div className="text-5xl font-black text-[#56CCF2] mb-4">500+</div>
              <p className="text-lg font-bold mb-2">Active Sponsors</p>
              <p className="text-sm text-muted-foreground">Raising capital and building projects on RealCo</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all">
              <div className="text-5xl font-black text-[#E07A47] mb-4">$2.5B+</div>
              <p className="text-lg font-bold mb-2">In Projects</p>
              <p className="text-sm text-muted-foreground">Total project value managed on the platform</p>
            </div>
            <div className="text-center p-8 rounded-2xl bg-white dark:bg-slate-900 border-4 border-slate-200 dark:border-slate-700 hover:border-[#E07A47] transition-all">
              <div className="text-5xl font-black text-[#56CCF2] mb-4">15 Days</div>
              <p className="text-lg font-bold mb-2">Faster Payments</p>
              <p className="text-sm text-muted-foreground">Average time saved from invoice to payment</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center">Why Sponsors Choose Providers on RealCo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                { icon: Clock, title: "Pre-Vetted Network", desc: "All providers verified and compliance-checked" },
                { icon: Shield, title: "Audit-Ready Workflows", desc: "Every transaction documented and traceable" },
                { icon: TrendingUp, title: "Performance Tracking", desc: "Ratings and reviews from past projects" },
                { icon: CheckCircle2, title: "Integrated Payments", desc: "Faster approvals and payment cycles" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-6 rounded-xl bg-white dark:bg-slate-900 border-2 border-[#E07A47]">
                  <div className="w-12 h-12 rounded-lg bg-[#E07A47]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-[#E07A47]" />
                  </div>
                  <div>
                    <p className="font-bold mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center space-y-6 p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#E07A47]">
              <h3 className="text-2xl font-black">Ready to Join Our Provider Network?</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create your provider profile and start receiving project invitations from sponsors in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <button className="px-8 py-4 bg-[#56CCF2] text-white font-bold rounded-xl hover:bg-[#3BB5E0] transition-all hover:scale-105 shadow-lg">
                    Create Provider Account
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="px-8 py-4 border-2 border-[#56CCF2] text-[#56CCF2] font-bold rounded-xl hover:bg-[#56CCF2] hover:text-white transition-all">
                    Schedule a Call
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Join the workflow that reduces delays for everyone."
        subtitle="Over 1,500 service providers trust RealCo to streamline their operations"
        buttons={[
          { label: "Create Account", href: "/signup" },
          { label: "Book Walkthrough", href: "/contact" },
          { label: "View Pricing", href: "#pricing", variant: "outline" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

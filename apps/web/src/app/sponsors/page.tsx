import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { CTASection } from "@/components/marketing/cta-section"
import { RoleTabs } from "@/components/marketing/role-tabs"

export const metadata = {
  title: "For Sponsors | RealCo",
  description: "Raise capital faster. Stay compliant. Execute with control. Manage subscriptions, compliance workflows, project spend, and investor reporting in one system.",
}

export default function SponsorsPage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="Raise capital faster. Stay compliant. Execute with control."
        subheadline="Manage subscriptions, compliance workflows, project spend, escrow-style payouts, and investor reporting in one system."
        primaryCta={{ label: "Book a Sponsor Demo", href: "/contact" }}
        secondaryCta={{ label: "Start Sponsor Trial", href: "/signup" }}
        tertiaryCta={{ label: "Download Sponsor Overview", href: "#download" }}
      />

      {/* Role Navigation Tabs */}
      <RoleTabs currentRole="sponsors" />

      <FeatureGrid
        title="Top outcomes"
        subtitle="What sponsors achieve on RealCo"
        items={[
          "Close faster",
          "Reduce compliance chaos",
          "Control construction spend",
          "Automate reporting",
        ]}
        columns={2}
      />

      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">What Sponsors run in RealCo</h2>
            <p className="text-xl text-muted-foreground">Complete platform for every phase of your deal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 rounded-2xl bg-card border-4 border-border hover:border-[rgb(var(--secondary))] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Capital Raise + IRM</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Digital subscription agreements</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Accreditation verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Investor portal</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Subscription tracking</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white dark:bg-[#6b7280] border-4 border-[#E07A47] hover:border-[#D96835] transition-all duration-300 hover:shadow-xl hover:shadow-[#E07A47]/20">
              <h3 className="text-2xl font-bold mb-4">Compliance Workflows (Reg D oriented)</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[#E07A47] text-xl">✓</span>
                  <span>Form D preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Investor suitability questionnaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Deadline tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Immutable audit trails</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border-4 border-border hover:border-[rgb(var(--secondary))] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Construction + Payments</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Real-time tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Draw requests</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Milestone releases</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Lien waivers</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-card border-4 border-border hover:border-[rgb(var(--secondary))] transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4">Reporting + Distributions</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Quarterly reports</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>Waterfall calculations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>K-1 preparation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[rgb(var(--secondary))]">✓</span>
                  <span>ACH distributions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="See your first deal setup flow in 15 minutes."
        subtitle="Already managing deals on RealCo? Sign in to your dashboard"
        buttons={[
          { label: "Book Demo", href: "/contact" },
          { label: "Start Trial", href: "/signup" },
          { label: "Sign In", href: "/login", variant: "outline" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

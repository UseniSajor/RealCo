import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { ReturnsEducation } from "@/components/marketing/returns-education"
import { ComplianceBlock } from "@/components/marketing/compliance-block"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata = {
  title: "For Investors | RealCo",
  description: "Invest with clarity—documents, updates, distributions, and tax files in one portal. Track opportunities and monitor performance with transparent reporting.",
}

export default function InvestorsPage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="Invest with clarity—documents, updates, distributions, and tax files in one portal."
        subheadline="Track opportunities and monitor performance with transparent reporting and streamlined funding workflows."
        primaryCta={{ label: "Create Free Investor Account", href: "/signup" }}
        secondaryCta={{ label: "See Sample Dashboard", href: "#sample" }}
        tertiaryCta={{ label: "How It Works", href: "#how" }}
      />

      {/* Role Navigation Tabs */}
      <RoleTabs currentRole="investors" />

      <FeatureGrid
        title="What you get"
        items={[
          "Deal transparency",
          "Secure onboarding",
          "Ongoing visibility",
          "Distributions & tax docs",
        ]}
        columns={2}
      />

      <ReturnsEducation />

      <section id="how" className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to start investing</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border-4 border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-2xl font-black">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Create account</h3>
              <p className="text-sm text-muted-foreground">Sign up and verify identity</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border-4 border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-2xl font-black">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Review</h3>
              <p className="text-sm text-muted-foreground">Browse opportunities</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border-4 border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-2xl font-black">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Subscribe + fund</h3>
              <p className="text-sm text-muted-foreground">Sign docs and fund</p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border-4 border-border">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgb(var(--primary))] text-white flex items-center justify-center text-2xl font-black">
                4
              </div>
              <h3 className="text-xl font-bold mb-2">Monitor</h3>
              <p className="text-sm text-muted-foreground">Track and receive</p>
            </div>
          </div>
        </div>
      </section>

      <ComplianceBlock />

      <CTASection
        title="Ready to start investing with full transparency?"
        subtitle="Already an investor on RealCo? Access your dashboard"
        buttons={[
          { label: "Create Free Account", href: "/signup" },
          { label: "Book Demo", href: "/contact" },
          { label: "Sign In", href: "/login", variant: "outline" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

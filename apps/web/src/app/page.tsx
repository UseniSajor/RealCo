import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { RoleCards } from "@/components/marketing/role-cards"
import { RoleFeatures } from "@/components/marketing/role-features"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { ComplianceBlock } from "@/components/marketing/compliance-block"
import { ReturnsEducation } from "@/components/marketing/returns-education"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata = {
  title: "RealCo | Real Estate Syndication Platform - Raise Capital, Manage Construction, Automate Investor Relations",
  description: "All-in-one platform for real estate syndication. Streamline capital raising, Reg D compliance, construction management, and investor reporting. Trusted by 500+ sponsors managing $2.5B+ in projects. Start your free trial today.",
  keywords: [
    "real estate syndication software",
    "capital raising platform",
    "Reg D compliance",
    "506b 506c offerings",
    "investor relations management",
    "construction project management",
    "real estate crowdfunding platform",
    "syndication software",
    "private placement platform",
    "real estate investment management",
  ],
  openGraph: {
    title: "RealCo | Real Estate Syndication Platform",
    description: "Streamline capital raising, compliance, construction, and investor reporting in one platform",
    type: "website",
    url: "https://realco.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "RealCo | Real Estate Syndication Platform",
    description: "All-in-one platform for sponsors, investors, and service providers",
  },
}

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="The only platform you need to raise, build, and report on real estate deals."
        subheadline="RealCo unifies capital raising, Reg D compliance, construction payments, and investor reporting into one powerful system. Stop juggling 12 tools—run your entire syndication on RealCo."
        primaryCta={{ label: "Book a Demo", href: "/contact" }}
        secondaryCta={{ label: "Start Free Trial", href: "/signup" }}
        trustLine="Trusted by 500+ sponsors managing $2.5B+ in projects. SOC 2 Type II compliant. Bank-grade security."
      />

      <RoleCards />

      <RoleFeatures />

      <FeatureGrid
        title="One system. Five workflows. Zero tool sprawl."
        subtitle="Replace DocuSign, Carta, Procore, QuickBooks, and your investor portal with one integrated platform"
        items={[
          "Capital raise + investor portal + digital subscriptions → Replace Carta/AngelList",
          "Compliance workflows + audit trails (Reg D oriented) → Replace manual spreadsheets",
          "Construction tracking + budget vs actual + daily logs → Replace Procore/Buildertrend",
          "Escrow-style milestone releases + lien waivers + ACH payments → Replace QuickBooks",
          "Automated reporting + distributions + K-1 center → Replace manual investor emails",
          "Document management + e-signatures + version control → Replace DocuSign/Box",
          "Accreditation verification + investor CRM → Replace manual processes",
          "Waterfall calculations + performance tracking + IRR reporting → Replace Excel models",
        ]}
      />

      <ComplianceBlock />

      <ReturnsEducation />

      {/* Social Proof Section */}
      <section className="py-24 bg-muted/30">
        <div className="container max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Trusted by Leading Sponsors</h2>
            <p className="text-xl text-muted-foreground">Join hundreds of sponsors who've streamlined their operations on RealCo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {[
              { metric: "500+", label: "Active Sponsors" },
              { metric: "$2.5B+", label: "Projects Managed" },
              { metric: "5,000+", label: "Investors" },
              { metric: "98%", label: "On-Time Distributions" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-white dark:bg-slate-900">
                <div className="text-5xl font-black gradient-text mb-2">{stat.metric}</div>
                <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-[#E07A47]">
              <p className="text-lg italic mb-4">
                "We were using 8 different tools to manage our syndications. RealCo replaced all of them and saved us 20+ hours per week on administrative work. The compliance workflows alone are worth 10x the cost."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary"></div>
                <div>
                  <p className="font-bold">Michael Chen</p>
                  <p className="text-sm text-muted-foreground">Managing Partner, Apex Development Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to streamline your syndication business?"
        subtitle="Join 500+ sponsors who've ditched tool sprawl and gone all-in on RealCo"
        buttons={[
          { label: "Book a 15-Min Demo", href: "/contact" },
          { label: "Start Free 30-Day Trial", href: "/signup" },
          { label: "See Pricing", href: "#pricing", variant: "outline" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

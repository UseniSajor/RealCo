import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { RoleCards } from "@/components/marketing/role-cards"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { ComplianceBlock } from "@/components/marketing/compliance-block"
import { ReturnsEducation } from "@/components/marketing/returns-education"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata = {
  title: "RealCo | Unified Real Estate Syndication Platform",
  description: "Capital raising, compliance workflows, construction payments, and investor reporting—into one platform. Built for Sponsors, Investors, and Service Providers.",
}

export default function HomePage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="RealCo unifies capital raising, compliance workflows, construction payments, and investor reporting—into one platform."
        subheadline="Built for Sponsors, Investors, and Service Providers who need audit-ready compliance, real-time visibility, and faster execution from raise → build → distributions."
        primaryCta={{ label: "Book a Demo", href: "/contact" }}
        secondaryCta={{ label: "Start Free Trial", href: "/signup" }}
        trustLine="Compliance-first workflows. Bank-grade security. Built for repeat deals."
      />

      <RoleCards />

      <FeatureGrid
        title="One system. Five workflows. Zero tool sprawl."
        items={[
          "Capital raise + investor portal + digital subscriptions",
          "Compliance workflows + audit trails (Reg D oriented)",
          "Construction tracking + budget vs actual",
          "Escrow-style milestone releases + documentation",
          "Automated reporting + distributions + tax document center",
        ]}
      />

      <ComplianceBlock />

      <ReturnsEducation />

      <CTASection
        title="Choose your role. Get operational in days, not months."
        buttons={[
          { label: "Book Demo", href: "/contact" },
          { label: "Start Free Trial", href: "/signup" },
          { label: "Contact Sales", href: "/contact", variant: "outline" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

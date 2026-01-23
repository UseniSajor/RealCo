import { MarketingNav } from "@/components/marketing/marketing-nav"
import { MarketingFooter } from "@/components/marketing/marketing-footer"
import { Hero } from "@/components/marketing/hero"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { CTASection } from "@/components/marketing/cta-section"

export const metadata = {
  title: "For Providers | RealCo",
  description: "Faster approvals. Cleaner paperwork. More predictable pay. Billing, lien waivers, approvals, and payment releases—without constant chasing.",
}

export default function ProvidersPage() {
  return (
    <>
      <MarketingNav />
      
      <Hero
        headline="Faster approvals. Cleaner paperwork. More predictable pay."
        subheadline="Billing, lien waivers, approvals, and payment releases—without constant chasing."
        primaryCta={{ label: "Create Provider Account", href: "/signup" }}
        secondaryCta={{ label: "Partner with Sponsors", href: "/contact" }}
        tertiaryCta={{ label: "Book Walkthrough", href: "#demo" }}
      />

      <FeatureGrid
        title="For Contractors / Construction Managers"
        items={[
          "Submit draw requests",
          "Upload lien waivers",
          "Track approvals",
          "Receive ACH payments",
        ]}
        columns={2}
      />

      <FeatureGrid
        title="For Attorneys / Fund Admin"
        items={[
          "Review subscriptions",
          "Compliance checklists",
          "Form D collaboration",
          "Audit-ready reports",
        ]}
        columns={2}
      />

      <FeatureGrid
        title="For Brokers / Deal Sourcers"
        items={[
          "Monitor subscriptions",
          "Commission tracking",
          "Share deal materials",
          "Automated notifications",
        ]}
        columns={2}
      />

      <CTASection
        title="Join the workflow that reduces delays for everyone."
        buttons={[
          { label: "Create Account", href: "/signup" },
          { label: "Book Walkthrough", href: "/contact" },
        ]}
      />

      <MarketingFooter />
    </>
  )
}

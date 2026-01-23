import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/marketing/Hero";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export const Route = createFileRoute("/providers")({
  component: ProvidersPage,
});

function ProvidersPage() {
  return (
    <>
      <Hero
        title="Faster approvals."
        titleHighlight="Cleaner paperwork. More predictable pay."
        subtitle="Billing, lien waivers, approvals, and payment releases—without constant chasing."
        primaryCTA={{ text: "Create Provider Account", href: "/login" }}
        secondaryCTA={{ text: "Partner with Sponsors", href: "/offerings" }}
        tertiaryCTA={{ text: "Book Walkthrough", href: "/offerings" }}
      />

      <FeatureGrid
        title="Contractors / CMs"
        items={[
          "Submit draw requests",
          "Upload lien waivers",
          "Track approvals",
          "Receive ACH payments"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Attorneys / fund admins"
        items={[
          "Review subscriptions",
          "Compliance checklists",
          "Form D collaboration",
          "Audit-ready reports"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Brokers"
        items={[
          "Monitor subscriptions",
          "Commission tracking",
          "Share deal materials",
          "Automated notifications"
        ]}
        columns={2}
      />

      <CTASection
        title="Join the workflow that reduces delays for everyone."
        buttons={[
          { text: "Create Account", href: "/login" },
          { text: "Book Walkthrough", href: "/offerings" }
        ]}
      />

      <Disclaimer />

      <MarketingFooter />
    </>
  );
}

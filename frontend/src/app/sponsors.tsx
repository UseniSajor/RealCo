import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/marketing/Hero";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <>
      <Hero
        title="Raise capital faster."
        titleHighlight="Stay compliant. Execute with control."
        subtitle="Manage subscriptions, compliance workflows, project spend, escrow-style payouts, and investor reporting in one system."
        primaryCTA={{ text: "Book a Sponsor Demo", href: "/offerings" }}
        secondaryCTA={{ text: "Start Sponsor Trial", href: "/login" }}
        tertiaryCTA={{ text: "Download Sponsor Overview", href: "/offerings" }}
      />

      <FeatureGrid
        title="Top outcomes"
        items={[
          "Close faster",
          "Reduce compliance chaos",
          "Control construction spend",
          "Automate reporting"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Capital Raise + IRM"
        items={[
          "Digital subscription agreements",
          "Accreditation verification",
          "Investor portal",
          "Subscription tracking"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Compliance Workflows (Reg D oriented)"
        items={[
          "Form D preparation",
          "Investor suitability questionnaires",
          "Deadline tracking",
          "Immutable audit trails"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Construction + Payments"
        items={[
          "Real-time tracking",
          "Draw requests",
          "Milestone releases",
          "Lien waivers"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Reporting + Distributions"
        items={[
          "Quarterly reports",
          "Waterfall calculations",
          "K-1 preparation",
          "ACH distributions"
        ]}
        columns={2}
      />

      <CTASection
        title="See your first deal setup flow in 15 minutes."
        buttons={[
          { text: "Book Demo", href: "/offerings" },
          { text: "Start Trial", href: "/login" }
        ]}
      />

      <Disclaimer />

      <MarketingFooter />
    </>
  );
}

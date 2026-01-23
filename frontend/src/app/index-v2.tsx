import React from "react";
import { Hero } from "../components/marketing/Hero";
import { RoleCards } from "../components/marketing/RoleCards";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { ReturnsEducation } from "../components/marketing/ReturnsEducation";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export function HomePageV2() {
  return (
    <>
      <Hero
        title="RealCo unifies capital raising, compliance workflows, construction payments, and investor reporting—into one platform."
        subtitle="Built for Sponsors, Investors, and Service Providers who need audit-ready compliance, real-time visibility, and faster execution from raise → build → distributions."
        primaryCTA={{ text: "Book a Demo", href: "/offerings" }}
        secondaryCTA={{ text: "Start Free Trial", href: "/login" }}
        trustLine="Compliance-first workflows. Bank-grade security. Built for repeat deals."
      />

      <RoleCards
        title="Choose your role"
        cards={[
          {
            title: "Sponsors",
            description: "Raise faster. Run projects. Report automatically.",
            href: "/sponsors",
            icon: "🏗️"
          },
          {
            title: "Investors",
            description: "Transparency, documents, updates, distributions.",
            href: "/investors",
            icon: "💰"
          },
          {
            title: "Providers",
            description: "Faster approvals, cleaner paperwork, predictable pay.",
            href: "/providers",
            icon: "🔧"
          }
        ]}
      />

      <FeatureGrid
        title="One system. Five workflows. Zero tool sprawl."
        items={[
          "Capital raise + investor portal with subscription management and automated onboarding",
          "Compliance workflows + audit trails (Reg D oriented) with immutable activity logs",
          "Construction tracking with real-time progress monitoring and photo documentation",
          "Escrow-style milestone releases tied to project phases and approvals",
          "Automated reporting + distributions + tax center with K-1 generation"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Compliance-forward by design."
        subtitle="Structured for private offerings and audit-ready workflows"
        items={[
          "Structured workflows for private offerings (Reg D oriented) with guided compliance steps",
          "Investor verification workflows with accreditation status tracking",
          "Deadline tracking and automated reminders for regulatory filings",
          "Immutable activity logs and audit trails for complete transparency"
        ]}
        columns={2}
      />

      <ReturnsEducation
        title="What investors typically target (educational ranges)"
        subtitle="Understanding typical return expectations across asset classes"
        ranges={[
          {
            assetClass: "Value-Add Multifamily",
            targetIRR: "~15–20%",
            equityMultiple: "~1.6x–2.0x",
            holdPeriod: "3–5 years",
            description: "Renovate and reposition existing properties to increase NOI and value"
          },
          {
            assetClass: "Ground-Up Development",
            targetIRR: "~18–25%",
            equityMultiple: "~1.8x–2.5x",
            holdPeriod: "2–4 years",
            description: "Build new properties from the ground up with higher risk and return potential"
          },
          {
            assetClass: "Core / Core-Plus",
            targetIRR: "~10–15%",
            equityMultiple: "~1.4x–1.7x",
            holdPeriod: "5–10 years",
            description: "Stabilized properties with predictable cash flows and lower risk profiles"
          }
        ]}
      />

      <CTASection
        title="Choose your role. Get operational in days, not months."
        buttons={[
          { text: "Book Demo", href: "/offerings" },
          { text: "Start Free Trial", href: "/login" },
          { text: "Contact Sales", href: "/offerings" }
        ]}
      />

      <Disclaimer />

      <MarketingFooter />
    </>
  );
}

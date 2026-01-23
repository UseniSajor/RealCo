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
          "Capital raise + investor portal",
          "Compliance workflows + audit trails (Reg D oriented)",
          "Construction tracking",
          "Escrow-style milestone releases",
          "Automated reporting + distributions + tax center"
        ]}
        columns={1}
      />

      <FeatureGrid
        title="Compliance-forward by design."
        items={[
          "Structured workflows for private offerings (Reg D oriented)",
          "Verification workflows",
          "Deadline tracking",
          "Immutable activity logs"
        ]}
        columns={1}
      />
      
      <Disclaimer />

      <ReturnsEducation
        title="What investors typically target (educational ranges)."
        ranges={[
          {
            assetClass: "Value-Add Multifamily",
            targetIRR: "~15–20%",
            equityMultiple: "~1.6x–2.0x",
            holdPeriod: "3–5 yrs"
          },
          {
            assetClass: "Ground-Up Development",
            targetIRR: "~18–25%",
            equityMultiple: "~1.8x–2.5x",
            holdPeriod: "2–4 yrs"
          },
          {
            assetClass: "Core / Core-Plus",
            targetIRR: "~10–15%",
            equityMultiple: "~1.4x–1.7x",
            holdPeriod: "5–10 yrs"
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

      <MarketingFooter />
    </>
  );
}

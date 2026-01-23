import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/marketing/Hero";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { ReturnsEducation } from "../components/marketing/ReturnsEducation";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export const Route = createFileRoute("/investors")({
  component: InvestorsPage,
});

function InvestorsPage() {
  return (
    <>
      <Hero
        title="Invest with clarity—documents, updates, distributions, and tax files"
        titleHighlight="in one portal."
        subtitle="Track opportunities and monitor performance with transparent reporting and streamlined funding workflows."
        primaryCTA={{ text: "Create Free Investor Account", href: "/login" }}
        secondaryCTA={{ text: "See Sample Dashboard", href: "/offerings" }}
        tertiaryCTA={{ text: "How It Works", href: "#how-it-works" }}
      />

      <FeatureGrid
        title="What you get"
        items={[
          "Deal transparency",
          "Secure onboarding",
          "Ongoing visibility",
          "Distributions & tax docs"
        ]}
        columns={2}
      />

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

      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create account</h3>
              <p>Sign up and verify identity</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Review</h3>
              <p>Browse opportunities</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Subscribe + fund</h3>
              <p>Sign docs and fund</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Monitor</h3>
              <p>Track and receive</p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to start investing with full transparency?"
        buttons={[
          { text: "Create Free Account", href: "/login" },
          { text: "Book Demo", href: "/offerings" }
        ]}
      />

      <Disclaimer />

      <MarketingFooter />
    </>
  );
}

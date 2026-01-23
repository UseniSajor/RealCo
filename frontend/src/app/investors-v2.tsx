import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/marketing/Hero";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { ReturnsEducation } from "../components/marketing/ReturnsEducation";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export const Route = createFileRoute("/investors-v2")({
  component: InvestorsPageV2,
});

function InvestorsPageV2() {
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
        title="What you get as an investor"
        items={[
          "Deal transparency: Full access to offering documents, financial projections, and sponsor track records before you invest",
          "Secure onboarding: Digital subscription process with identity verification and accreditation status management",
          "Ongoing visibility: Real-time construction updates, photo documentation, and project milestone tracking throughout the investment lifecycle",
          "Distributions & tax docs: Automated distribution processing with instant notifications and downloadable K-1s at tax time"
        ]}
        columns={2}
      />

      <ReturnsEducation
        title="Understanding typical return targets (educational ranges)"
        subtitle="What different asset classes typically target—for educational purposes only"
        ranges={[
          {
            assetClass: "Value-Add Multifamily",
            targetIRR: "~15–20%",
            equityMultiple: "~1.6x–2.0x",
            holdPeriod: "3–5 years",
            description: "Renovate existing properties to increase rental income and property value"
          },
          {
            assetClass: "Ground-Up Development",
            targetIRR: "~18–25%",
            equityMultiple: "~1.8x–2.5x",
            holdPeriod: "2–4 years",
            description: "Build new properties with higher return potential and higher risk profile"
          },
          {
            assetClass: "Core / Core-Plus",
            targetIRR: "~10–15%",
            equityMultiple: "~1.4x–1.7x",
            holdPeriod: "5–10 years",
            description: "Invest in stabilized properties with predictable cash flows and lower risk"
          }
        ]}
      />

      <section id="how-it-works" className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>From account creation to receiving distributions—streamlined for investors</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create account</h3>
              <p>
                Sign up in minutes. Complete your investor profile and verify your identity. 
                Accreditation status verified if applicable.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Review opportunities</h3>
              <p>
                Browse available offerings. Access detailed financial projections, property information, 
                and sponsor track records. Ask questions directly through the platform.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Subscribe + fund</h3>
              <p>
                Sign subscription documents digitally. Fund your investment via ACH, wire, or check. 
                Track your subscription status in real-time.
              </p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Monitor & receive</h3>
              <p>
                Get regular project updates with photos and progress reports. Receive automated 
                distribution notifications. Download tax documents instantly.
              </p>
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

import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "../components/marketing/Hero";
import { FeatureGrid } from "../components/marketing/FeatureGrid";
import { CTASection } from "../components/marketing/CTASection";
import { Disclaimer } from "../components/marketing/Disclaimer";
import { MarketingFooter } from "../components/marketing/MarketingFooter";

export const Route = createFileRoute("/sponsors-v2")({
  component: SponsorsPageV2,
});

function SponsorsPageV2() {
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

      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Top outcomes for sponsors</h2>
            <p>What you achieve when everything works from one platform</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Close faster</h3>
              <p>
                Digital subscriptions, automated compliance checks, and integrated escrow reduce your capital raise cycle from months to weeks.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📋</div>
              <h3>Reduce compliance chaos</h3>
              <p>
                Reg D workflows, Form D filing support, investor verification, and immutable audit logs keep you organized and inspection-ready.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏗️</div>
              <h3>Control construction spend</h3>
              <p>
                Track budgets vs. actuals, manage draw requests, approve payments, and maintain lien waiver documentation—all in one place.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Automate reporting</h3>
              <p>
                Quarterly reports, distribution calculations, K-1 preparation, and investor communications generated automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid
        title="Capital Raise + Investor Relations Management"
        items={[
          "Digital subscription agreements with e-signature integration and automated investor onboarding",
          "Accreditation verification workflows with document collection and status tracking",
          "Investor portal with deal documents, updates, and secure communication channels",
          "Subscription tracking dashboard with real-time capital commitments and close monitoring"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Compliance Workflows (Reg D Oriented)"
        items={[
          "Guided Form D preparation and filing support with state-by-state blue sky tracking",
          "Investor suitability questionnaires and verification documentation management",
          "Regulatory deadline tracking with automated reminders for timely filings",
          "Immutable audit trail of all investor interactions, subscriptions, and compliance actions"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Construction + Payments"
        items={[
          "Real-time project tracking with photo documentation, daily logs, and milestone updates",
          "Draw request management with approval workflows and automatic budget checks",
          "Escrow-style milestone releases tied to construction progress and inspection approvals",
          "Lien waiver collection and tracking to protect against mechanic's liens"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="Reporting + Distributions"
        items={[
          "Automated quarterly investor reports with performance metrics and project updates",
          "Waterfall distribution calculations with preferred return and profit split logic",
          "K-1 preparation support with tax document generation and investor delivery",
          "Distribution processing with ACH payments and automatic notification to investors"
        ]}
        columns={2}
      />

      <CTASection
        title="See your first deal setup flow in 15 minutes."
        subtitle="Book a personalized walkthrough of the sponsor platform"
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

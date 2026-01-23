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
        title="For Contractors & Construction Managers"
        subtitle="Get paid faster with streamlined approvals and documentation"
        items={[
          "Submit draw requests and invoices directly through the platform with automatic routing to appropriate approvers",
          "Upload lien waivers and supporting documentation digitally with organized tracking and status updates",
          "Track approval status in real-time with automatic notifications when payments are approved and processed",
          "Receive payments via ACH with predictable schedules tied to milestone completion and documentation requirements"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="For Attorneys & Fund Administrators"
        subtitle="Collaborate efficiently with organized workflows and audit trails"
        items={[
          "Review subscription documents and investor verifications with centralized document access and comment threads",
          "Access compliance checklists and regulatory deadline trackers with automatic alerts for upcoming filing dates",
          "Collaborate with sponsors on Form D filings and state blue sky requirements through structured workflows",
          "Generate audit-ready reports with complete activity logs and investor interaction histories for compliance reviews"
        ]}
        columns={2}
      />

      <FeatureGrid
        title="For Brokers & Placement Agents"
        subtitle="Track commissions and investor activity seamlessly"
        items={[
          "Monitor investor subscriptions and funding status in real-time with detailed pipeline tracking and conversion metrics",
          "Access commission tracking dashboards with automatic calculations based on closed subscriptions and funding milestones",
          "Share deal materials and updates with prospective investors through secure, compliant communication channels",
          "Receive automated notifications for subscription milestones, closes, and commission payment schedules"
        ]}
        columns={2}
      />

      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Why service providers choose RealCo</h2>
            <p>Benefits that improve your workflow and cash flow</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Faster turnaround times</h3>
              <p>
                Eliminate email chains and phone tag. All approvals, documents, and communications 
                flow through one organized system with automatic notifications.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📄</div>
              <h3>Cleaner documentation</h3>
              <p>
                Structured workflows ensure all required documents are collected and organized. 
                No more scrambling for missing paperwork at critical moments.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>More predictable payments</h3>
              <p>
                Milestone-based releases and automated approval workflows mean you know exactly 
                when to expect payment—no more uncertainty or cash flow surprises.
              </p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Better sponsor relationships</h3>
              <p>
                When everyone works from the same platform with clear processes, projects run smoother 
                and professional relationships strengthen through trust and transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Join the workflow that reduces delays for everyone."
        subtitle="Get set up as a provider and start working with sponsors on the platform"
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

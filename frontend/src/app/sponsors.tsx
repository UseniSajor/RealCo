import React from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

// Concise Sponsor Landing Page - Pain-Point Focused
export const Route = createFileRoute("/sponsors")({
  component: SponsorsPage,
});

function SponsorsPage() {
  return (
    <>
      {/* Minimal Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">All-in-One Platform for Real Estate Sponsors</span>
          <h1 className="hero-title">
            Syndicate Deals
            <span className="gradient-text"> 3x Faster</span>
          </h1>
          <p className="hero-subtitle">
            Raise capital, manage construction, automate compliance, and keep investors happy. 
            Everything you need in one powerful platform.
          </p>
          <div className="hero-cta">
            <Link to="/offerings" className="btn btn-hero-primary">
              Schedule Demo
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Sponsor Login
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Solved */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Stop Losing Deals to Complexity</h2>
            <p>Common sponsor pain points, solved</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Slow Capital Raises</h3>
              <p><strong>Pain Point:</strong> Manual docs, compliance delays, lost momentum</p>
              <p><strong>RealCo Solution:</strong> Digital subscriptions, auto Form D filing, instant compliance checks. Close deals 3x faster.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📄</div>
              <h3>Compliance Nightmares</h3>
              <p><strong>Pain Point:</strong> SEC regulations, blue sky laws, investor verification</p>
              <p><strong>RealCo Solution:</strong> Automated Form D, accreditation checks, OFAC screening. Stay compliant automatically.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💬</div>
              <h3>Investor Communication</h3>
              <p><strong>Pain Point:</strong> "Where's my distribution? What's the project status?"</p>
              <p><strong>RealCo Solution:</strong> Automated reports, investor portal, instant notifications. Less time on emails, more on deals.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏗️</div>
              <h3>Construction Chaos</h3>
              <p><strong>Pain Point:</strong> Budget overruns, schedule delays, no visibility</p>
              <p><strong>RealCo Solution:</strong> Real-time tracking, automated milestone payments, budget alerts. Stay on time and on budget.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>Distribution Headaches</h3>
              <p><strong>Pain Point:</strong> Manual waterfall calcs, check writing, tax docs</p>
              <p><strong>RealCo Solution:</strong> Automated waterfall logic, ACH payments, auto tax forms. Distributions done in minutes.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔐</div>
              <h3>Escrow Management</h3>
              <p><strong>Pain Point:</strong> Setting up escrow, managing releases, reconciliation</p>
              <p><strong>RealCo Solution:</strong> Built-in escrow, milestone-based releases, automatic ledgers. Fully managed for you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features - Minimal */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need. One Platform.</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <h3>📊 Deal Syndication</h3>
              <p>Raise capital with digital subscriptions, automated compliance, and investor portal.</p>
            </div>

            <div className="feature-card-modern">
              <h3>🏗️ Construction Management</h3>
              <p>Track projects, manage contractors, control budgets, automate milestone payments.</p>
            </div>

            <div className="feature-card-modern">
              <h3>🔒 Escrow & Distributions</h3>
              <p>Secure escrow accounts, automated waterfall distributions, instant tax reporting.</p>
            </div>

            <div className="feature-card-modern">
              <h3>👥 Investor Relations</h3>
              <p>Automated quarterly reports, document library, investor portal access.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to 3x Your Deal Velocity?</h2>
          <p>Join 2,500+ sponsors using RealCo</p>
          <Link to="/offerings" className="btn btn-cta">
            Schedule a Demo
          </Link>
        </div>
      </section>
    </>
  );
}

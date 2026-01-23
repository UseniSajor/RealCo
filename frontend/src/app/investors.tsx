import React from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

// Concise Investor Landing Page - Pain-Point Focused
export const Route = createFileRoute("/investors")({
  component: InvestorsPage,
});

function InvestorsPage() {
  return (
    <>
      {/* Minimal Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">SEC-Compliant | Accredited & Non-Accredited Welcome</span>
          <h1 className="hero-title">
            Passive Real Estate Income
            <span className="gradient-text"> Starts at $10K</span>
          </h1>
          <p className="hero-subtitle">
            Earn 12-18% target returns from professionally managed real estate developments. 
            Full transparency. Quarterly distributions. No property management hassles.
          </p>
          <div className="hero-cta">
            <Link to="/offerings" className="btn btn-hero-primary">
              View Current Opportunities
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Investor Login
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points Solved */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Why RealCo Investors Win</h2>
            <p>Common frustrations, eliminated</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💵</div>
              <h3>Lower Minimums</h3>
              <p><strong>Pain Point:</strong> Traditional deals require $100K+</p>
              <p><strong>RealCo Solution:</strong> Start investing with just $10,000. Diversify across multiple properties.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔍</div>
              <h3>Real Transparency</h3>
              <p><strong>Pain Point:</strong> "Where's my money? What's happening on-site?"</p>
              <p><strong>RealCo Solution:</strong> Daily construction photos, budget tracking, live updates. See everything.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏦</div>
              <h3>Secure Escrow</h3>
              <p><strong>Pain Point:</strong> Worried about fund safety before deployment</p>
              <p><strong>RealCo Solution:</strong> FDIC-insured segregated accounts. Multi-party controls. Bank-grade security.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Passive Income</h3>
              <p><strong>Pain Point:</strong> Real estate requires active management</p>
              <p><strong>RealCo Solution:</strong> 100% passive. Quarterly distributions. No tenant calls. No repairs.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📄</div>
              <h3>Simple Paperwork</h3>
              <p><strong>Pain Point:</strong> Complex docs, wire instructions, tax forms</p>
              <p><strong>RealCo Solution:</strong> E-sign online. Fund via ACH. Tax docs auto-generated.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Mobile Access</h3>
              <p><strong>Pain Point:</strong> Can't track investments on-the-go</p>
              <p><strong>RealCo Solution:</strong> Full mobile app. Instant notifications. Access anywhere.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Minimal */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>Start Investing Today</h2>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create account. Verify accreditation (if applicable). Done in 5 minutes.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Browse Deals</h3>
              <p>Review vetted opportunities. See detailed financials and risk assessments.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Invest Securely</h3>
              <p>E-sign docs. Fund via ACH/wire. Money held in secure escrow.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Earn Returns</h3>
              <p>Receive quarterly distributions. Track performance in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Earning Passive Income?</h2>
          <Link to="/offerings" className="btn btn-cta">
            View Current Opportunities
          </Link>
          <p className="cta-disclaimer" style={{ marginTop: '1.5rem' }}>
            * Investments involve risk. Past performance doesn't guarantee future results.
          </p>
        </div>
      </section>
    </>
  );
}

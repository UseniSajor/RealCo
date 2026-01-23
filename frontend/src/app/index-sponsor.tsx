import React from "react";
import { Link } from "@tanstack/react-router";

// This is the sponsor/fund manager focused landing page
export function SponsorLandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">SEC-Compliant Investment Platform</span>
          <h1 className="hero-title">
            Syndicate Real Estate
            <span className="gradient-text"> Without the Headache</span>
          </h1>
          <p className="hero-subtitle">
            The first all-in-one platform for real estate sponsors. Raise capital, manage construction, 
            handle escrow, and keep investors happy—all from one powerful dashboard.
          </p>
          <div className="hero-cta">
            <Link to="/offerings" className="btn btn-hero-primary">
              <span>See Platform Demo</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Sponsor Login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">$250M+</div>
              <div className="stat-label">Capital Raised</div>
            </div>
            <div className="stat">
              <div className="stat-value">2,500+</div>
              <div className="stat-label">Sponsors</div>
            </div>
            <div className="stat">
              <div className="stat-value">98%</div>
              <div className="stat-label">On-Time Delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Everything You Need in One Platform</h2>
            <p>From capital raising to project completion, manage everything in one place</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <div className="feature-icon">🏗️</div>
              <h3>Deal Syndication</h3>
              <p>
                Raise capital from accredited investors with automated compliance, digital documents, 
                and SEC Form D filing.
              </p>
              <ul className="feature-list">
                <li>Automated investor onboarding</li>
                <li>Digital subscription agreements</li>
                <li>Real-time capital tracking</li>
                <li>SEC compliance built-in</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">🔒</div>
              <h3>Construction Management</h3>
              <p>
                Track project progress with daily logs, budget management, and contractor oversight.
              </p>
              <ul className="feature-list">
                <li>Real-time project tracking</li>
                <li>Automated payment milestones</li>
                <li>Budget vs. actual reporting</li>
                <li>Change order management</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">💎</div>
              <h3>Escrow & Distributions</h3>
              <p>
                Secure escrow accounts with automated distributions tied to your waterfall structure.
              </p>
              <ul className="feature-list">
                <li>Segregated escrow accounts</li>
                <li>Waterfall distribution logic</li>
                <li>Preferred return tracking</li>
                <li>Automated tax reporting</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">📊</div>
              <h3>Investor Relations</h3>
              <p>
                Keep investors informed with automated reports, updates, and transparent communication.
              </p>
              <ul className="feature-list">
                <li>Automated quarterly reports</li>
                <li>Investor portal access</li>
                <li>Document library</li>
                <li>K-1 generation</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">🛡️</div>
              <h3>SEC Compliance</h3>
              <p>
                Automated regulatory filings and compliance tracking for all offering types.
              </p>
              <ul className="feature-list">
                <li>Form D auto-filing</li>
                <li>Investor verification</li>
                <li>Blue sky compliance</li>
                <li>Audit-ready records</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">📱</div>
              <h3>White Label Option</h3>
              <p>
                Brand the platform as your own with custom domains, logos, and styling.
              </p>
              <ul className="feature-list">
                <li>Custom branding</li>
                <li>Your own domain</li>
                <li>API access</li>
                <li>Priority support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How RealCo Works for Sponsors</h2>
            <p>From deal sourcing to investor returns in four simple steps</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create Your Offering</h3>
              <p>Set up your syndication with automated SEC compliance, digital documents, and investor portal.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Raise Capital</h3>
              <p>Invite investors, collect subscriptions, and fund your deal with built-in escrow services.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Manage Construction</h3>
              <p>Track progress daily, manage contractors, control budgets, and keep investors informed.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Distribute Returns</h3>
              <p>Automated waterfall distributions based on your structure. Tax documents generated automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Streamline Your Syndications?</h2>
          <p>Join 2,500+ sponsors using RealCo to raise capital and manage projects</p>
          <Link to="/offerings" className="btn btn-cta">
            Schedule a Demo
          </Link>
        </div>
      </section>
    </>
  );
}

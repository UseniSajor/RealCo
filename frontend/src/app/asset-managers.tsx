import React from "react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

// Asset Manager & Fund Manager Landing Page - Pain-Point Focused
export const Route = createFileRoute("/asset-managers")({
  component: AssetManagersPage,
});

function AssetManagersPage() {
  return (
    <>
      {/* Minimal Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">Enterprise Solution for Asset Managers & Fund Managers</span>
          <h1 className="hero-title">
            White-Label Platform
            <span className="gradient-text"> For Your Investors</span>
          </h1>
          <p className="hero-subtitle">
            Offer your investors a branded, institutional-grade platform. 
            Complete real estate investment infrastructure without the dev costs.
          </p>
          <div className="hero-cta">
            <Link to="/offerings" className="btn btn-hero-primary">
              Schedule Enterprise Demo
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Manager Login
            </Link>
          </div>
        </div>
      </section>

      {/* Pain Points for Asset/Fund Managers */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise Challenges We Solve</h2>
            <p>Built for asset managers, fund managers, and family offices</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💻</div>
              <h3>Expensive Tech Stack</h3>
              <p><strong>Pain Point:</strong> Building custom investor portals costs $500K+ and 12+ months</p>
              <p><strong>RealCo Solution:</strong> White-label ready. Your brand, your domain, your investors. Live in 30 days.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">⚡</div>
              <h3>Multi-Fund Management</h3>
              <p><strong>Pain Point:</strong> Managing multiple funds/SPVs across different platforms</p>
              <p><strong>RealCo Solution:</strong> Unified dashboard for all funds. Cross-fund reporting. Consolidated investor view.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔐</div>
              <h3>Compliance Overhead</h3>
              <p><strong>Pain Point:</strong> Manual SEC filings, accreditation checks, audit prep</p>
              <p><strong>RealCo Solution:</strong> Automated compliance engine. Form D filing, investor verification, audit-ready records.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>Investor Transparency</h3>
              <p><strong>Pain Point:</strong> HNWI investors demand institutional-grade reporting</p>
              <p><strong>RealCo Solution:</strong> Real-time construction tracking, automated reports, document libraries. White-glove service.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔄</div>
              <h3>Operational Inefficiency</h3>
              <p><strong>Pain Point:</strong> Teams spread across Excel, DocuSign, QuickBooks, email</p>
              <p><strong>RealCo Solution:</strong> All-in-one platform. Capital calls, distributions, reporting, communications—unified.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🎨</div>
              <h3>Brand Dilution</h3>
              <p><strong>Pain Point:</strong> Sending investors to generic third-party portals</p>
              <p><strong>RealCo Solution:</strong> 100% white-label. Your logo, colors, domain. Investors never see "RealCo."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Enterprise Features Included</h2>
            <p>Everything your investors expect, everything your team needs</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <h3>🎨 White-Label Platform</h3>
              <p>Your brand, your domain, custom styling. Investors see your identity only.</p>
            </div>

            <div className="feature-card-modern">
              <h3>📂 Multi-Fund Support</h3>
              <p>Manage unlimited funds/SPVs. Cross-fund analytics. Consolidated reporting.</p>
            </div>

            <div className="feature-card-modern">
              <h3>🔌 API Access</h3>
              <p>Full REST API for integrations. Connect to your existing tech stack.</p>
            </div>

            <div className="feature-card-modern">
              <h3>👥 Team Permissions</h3>
              <p>Role-based access. Admins, analysts, investors—all controlled granularly.</p>
            </div>

            <div className="feature-card-modern">
              <h3>📊 Custom Reporting</h3>
              <p>Build custom reports for LPs. Automated delivery schedules. White-label branding.</p>
            </div>

            <div className="feature-card-modern">
              <h3>🛡️ Dedicated Support</h3>
              <p>Dedicated account manager. Priority support. Custom feature development available.</p>
            </div>

            <div className="feature-card-modern">
              <h3>🏦 Enterprise Escrow</h3>
              <p>Multi-signature controls. Custom waterfall logic. Integration with your banking.</p>
            </div>

            <div className="feature-card-modern">
              <h3>📈 Investor Self-Service</h3>
              <p>Let investors track investments, view docs, manage tax forms—all self-service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>Built For</h2>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">💼</div>
              <h3>Asset Managers</h3>
              <p>Manage client capital across multiple real estate funds. White-label investor experience.</p>
            </div>
            <div className="step">
              <div className="step-number">🏛️</div>
              <h3>Fund Managers</h3>
              <p>Launch and operate multiple real estate funds. Automated compliance and reporting.</p>
            </div>
            <div className="step">
              <div className="step-number">👨‍👩‍👧‍👦</div>
              <h3>Family Offices</h3>
              <p>Manage family real estate investments. Co-investment opportunities. Unified reporting.</p>
            </div>
            <div className="step">
              <div className="step-number">🏢</div>
              <h3>RIA Firms</h3>
              <p>Offer alternative investment options to clients. Simplified administration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Note */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Enterprise Pricing</h2>
          <p>Custom pricing based on AUM and feature requirements</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
            <Link to="/offerings" className="btn btn-cta">
              Schedule Enterprise Demo
            </Link>
          </div>
          <p className="cta-disclaimer" style={{ marginTop: '2rem', fontSize: '0.875rem' }}>
            Starting at $5,000/month for white-label platform with unlimited investors and deals.
            <br />
            Custom integrations, dedicated support, and feature development available.
          </p>
        </div>
      </section>
    </>
  );
}

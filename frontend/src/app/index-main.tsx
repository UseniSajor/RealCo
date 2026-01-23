import React from "react";
import { Link } from "@tanstack/react-router";

// Main Role Selection Landing Page - Modeled after RealtyMogul
export function MainLandingPage() {
  return (
    <>
      {/* Hero Section - Simple & Direct */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Real Estate Investing
            <span className="gradient-text"> Made Transparent</span>
          </h1>
          <p className="hero-subtitle">
            Access institutional-grade real estate opportunities with complete transparency, 
            secure escrow, and real-time construction tracking.
          </p>
          
          {/* Role Selection Cards */}
          <div className="features-grid" style={{ maxWidth: '900px', margin: '3rem auto 0' }}>
            <Link to="/investors" className="feature-card-modern" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">💰</div>
              <h3>For Investors</h3>
              <p>Build wealth through passive real estate income. Start with $10K.</p>
              <div style={{ marginTop: '1rem', color: 'var(--secondary)', fontWeight: '700' }}>
                Learn More →
              </div>
            </Link>

            <Link to="/sponsors" className="feature-card-modern" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">🏗️</div>
              <h3>For Sponsors</h3>
              <p>Raise capital, manage projects, automate compliance. All-in-one platform.</p>
              <div style={{ marginTop: '1rem', color: 'var(--secondary)', fontWeight: '700' }}>
                Learn More →
              </div>
            </Link>

            <Link to="/asset-managers" className="feature-card-modern" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="feature-icon">📊</div>
              <h3>For Asset Managers</h3>
              <p>White-label platform for your investors. Enterprise features included.</p>
              <div style={{ marginTop: '1rem', color: 'var(--secondary)', fontWeight: '700' }}>
                Learn More →
              </div>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="hero-stats" style={{ marginTop: '4rem' }}>
            <div className="stat">
              <div className="stat-value">$850M+</div>
              <div className="stat-label">Invested</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Investors</div>
            </div>
            <div className="stat">
              <div className="stat-value">98%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Real Estate Investing Challenges? We've Solved Them.</h2>
            <p>Common pain points, solved with technology</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <h3>❌ Problem: Lack of Transparency</h3>
              <p>Traditional investing means trusting blindly. No visibility into what's happening on-site.</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: Live Construction Tracking</h3>
              <p>Daily photo updates, progress reports, budget tracking—see everything in real-time.</p>
            </div>

            <div className="feature-card-modern">
              <h3>❌ Problem: High Minimums</h3>
              <p>Most deals require $100K+ to participate. Smaller investors get locked out.</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: $10K Minimum</h3>
              <p>Access the same deals as institutional investors. Diversify with less capital.</p>
            </div>

            <div className="feature-card-modern">
              <h3>❌ Problem: Complex Paperwork</h3>
              <p>Subscription docs, wire instructions, tax forms—paperwork nightmare for investors and sponsors.</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: Digital Everything</h3>
              <p>E-sign documents, ACH funding, automated tax forms. Done in minutes, not days.</p>
            </div>

            <div className="feature-card-modern">
              <h3>❌ Problem: Compliance Headaches</h3>
              <p>SEC regulations, state blue sky laws, investor verification—easy to make costly mistakes.</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: Automated Compliance</h3>
              <p>Form D filing, accreditation checks, OFAC screening—all handled automatically.</p>
            </div>

            <div className="feature-card-modern">
              <h3>❌ Problem: Fund Security Concerns</h3>
              <p>Where does money go before deployment? How do I know it's safe?</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: Segregated Escrow</h3>
              <p>Bank-grade security, FDIC insured, multi-party controls. Your capital is protected.</p>
            </div>

            <div className="feature-card-modern">
              <h3>❌ Problem: Slow Distribution Processing</h3>
              <p>Manual calculations, check writing, tax form generation—distributions take weeks.</p>
              <h3 style={{ color: 'var(--success)', marginTop: '1rem' }}>✓ Solution: Automated Waterfall</h3>
              <p>Distributions calculated and sent automatically. Tax docs generated instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Choose your path below</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
            <Link to="/investors" className="btn btn-cta">For Investors</Link>
            <Link to="/sponsors" className="btn btn-cta">For Sponsors</Link>
            <Link to="/asset-managers" className="btn btn-cta">For Asset Managers</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import React from "react";
import { HomePageV2 } from "./index-v2";

// Main Landing Page with Detailed Content
export function IndexPage() {
  return <HomePageV2 />;
}

// Original landing page content (now split into investor/sponsor versions)
export function OriginalIndexPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <span className="hero-badge">SEC-Compliant Investment Platform</span>
          <h1 className="hero-title">
            Invest in Real Estate Development
            <span className="gradient-text"> With Complete Transparency</span>
          </h1>
          <p className="hero-subtitle">
            Access institutional-grade real estate opportunities with full construction tracking,
            secure escrow management, and automated compliance—all in one platform.
          </p>
          <div className="hero-cta">
            <Link to="/offerings" className="btn btn-hero-primary">
              <span>Browse Investment Opportunities</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
              </svg>
            </Link>
            <Link to="/login" className="btn btn-hero-secondary">
              Investor Login
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">$250M+</div>
              <div className="stat-label">Total Funded</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Active Investors</div>
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
            <p>From investment to completion, track every aspect of your real estate portfolio</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card-modern">
              <div className="feature-icon">🏗️</div>
              <h3>Live Construction Tracking</h3>
              <p>
                Monitor project progress with daily logs, progress photos, milestone updates, 
                and interactive Gantt charts. Know exactly what's happening on-site.
              </p>
              <ul className="feature-list">
                <li>Daily progress reports</li>
                <li>Time-stamped photo documentation</li>
                <li>Budget vs. actual tracking</li>
                <li>Schedule variance alerts</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">🔒</div>
              <h3>SEC-Compliant Escrow</h3>
              <p>
                Your capital is secured in segregated escrow accounts with multi-signature 
                controls, automated compliance checks, and complete audit trails.
              </p>
              <ul className="feature-list">
                <li>Segregated escrow accounts</li>
                <li>Multi-party authorization</li>
                <li>OFAC & AML screening</li>
                <li>Real-time fund tracking</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">💎</div>
              <h3>Automated Distributions</h3>
              <p>
                Preferred returns and profit splits calculated automatically. Waterfall 
                distributions processed on schedule with complete transparency.
              </p>
              <ul className="feature-list">
                <li>Waterfall distribution logic</li>
                <li>Preferred return tracking</li>
                <li>Automated tax reporting</li>
                <li>Instant payment notifications</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">📊</div>
              <h3>Portfolio Dashboard</h3>
              <p>
                Real-time insights into all your investments. Track performance, view 
                documents, and access financial reports from one centralized dashboard.
              </p>
              <ul className="feature-list">
                <li>Portfolio performance metrics</li>
                <li>Transaction history</li>
                <li>Document library</li>
                <li>Tax form generation</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">🛡️</div>
              <h3>Risk Management</h3>
              <p>
                Comprehensive due diligence, compliance monitoring, and risk assessment 
                tools to protect your investment at every stage.
              </p>
              <ul className="feature-list">
                <li>Project vetting process</li>
                <li>Contractor verification</li>
                <li>Insurance tracking</li>
                <li>Lien waivers management</li>
              </ul>
            </div>

            <div className="feature-card-modern">
              <div className="feature-icon">📱</div>
              <h3>Mobile Access</h3>
              <p>
                Manage your investments anywhere. Get instant notifications for 
                important updates, distributions, and project milestones.
              </p>
              <ul className="feature-list">
                <li>Mobile-responsive design</li>
                <li>Real-time notifications</li>
                <li>Document access on-the-go</li>
                <li>Quick action capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How RealCo Works</h2>
            <p>Your journey from investment to returns in four simple steps</p>
          </div>
          
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Browse Opportunities</h3>
              <p>Explore vetted development projects with detailed financial models, project plans, and sponsor track records.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Invest Securely</h3>
              <p>Complete investment documents online and fund via ACH, wire, or check. All funds held in segregated escrow.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Track Progress</h3>
              <p>Monitor construction daily with photos, reports, and milestone updates. Full transparency from groundbreaking to completion.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Receive Returns</h3>
              <p>Automated distributions based on your investment agreement. Preferred returns and profit splits calculated automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Investing?</h2>
          <p>Join hundreds of investors building wealth through real estate development</p>
          <Link to="/offerings" className="btn btn-cta">
            View Current Opportunities
          </Link>
        </div>
      </section>
    </>
  );
}

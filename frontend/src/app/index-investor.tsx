import React from "react";
import { Link } from "@tanstack/react-router";

export function InvestorLandingPage() {
  return (
    <>
      {/* Hero Section with Side Cards */}
      <section className="hero-section-investor">
        <div className="hero-grid">
          {/* Left Side Card */}
          <div className="side-card side-card-left">
            <div className="side-card-icon">💰</div>
            <h4>Diversify Your Portfolio</h4>
            <p>Access institutional-quality real estate with as little as $10,000</p>
            <div className="side-card-stat">
              <span className="stat-number">12-18%</span>
              <span className="stat-label">Target Returns</span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="hero-content-investor">
            <span className="hero-badge">Accredited & Non-Accredited Welcome</span>
            <h1 className="hero-title-investor">
              Build Wealth Through
              <span className="gradient-text"> Real Estate Investment</span>
            </h1>
            <p className="hero-subtitle-investor">
              Join 500+ investors earning passive income from professionally managed 
              real estate developments. Transparent, secure, and designed for investors like you.
            </p>
            <div className="hero-cta-investor">
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
            <div className="trust-indicators">
              <div className="trust-item">
                <svg className="trust-icon" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>SEC Compliant</span>
              </div>
              <div className="trust-item">
                <svg className="trust-icon" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                </svg>
                <span>Bank-Grade Security</span>
              </div>
              <div className="trust-item">
                <svg className="trust-icon" width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span>500+ Happy Investors</span>
              </div>
            </div>
          </div>

          {/* Right Side Card */}
          <div className="side-card side-card-right">
            <div className="side-card-icon">📊</div>
            <h4>Track Your Returns</h4>
            <p>Real-time dashboard shows construction progress and projected returns</p>
            <div className="side-card-stat">
              <span className="stat-number">$850M+</span>
              <span className="stat-label">Total Invested</span>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Invest with RealCo?</h2>
            <p>Professional real estate investing made simple and transparent</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Low Minimum Investment</h3>
              <p>Start investing with as little as $10,000. No need to buy entire properties.</p>
              <ul className="benefit-list">
                <li>$10,000 minimum investment</li>
                <li>Multiple properties available</li>
                <li>Diversify across projects</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">💵</div>
              <h3>Passive Income</h3>
              <p>Earn quarterly distributions from rental income and property appreciation.</p>
              <ul className="benefit-list">
                <li>Quarterly cash distributions</li>
                <li>8% preferred returns</li>
                <li>Profit sharing on sale</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📈</div>
              <h3>Full Transparency</h3>
              <p>Track your investments in real-time with our investor portal.</p>
              <ul className="benefit-list">
                <li>Daily construction updates</li>
                <li>Financial reporting</li>
                <li>Document access 24/7</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🏗️</div>
              <h3>Vetted Opportunities</h3>
              <p>Every project undergoes rigorous due diligence and risk assessment.</p>
              <ul className="benefit-list">
                <li>Market analysis</li>
                <li>Contractor verification</li>
                <li>Insurance requirements</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">🔒</div>
              <h3>Secure Escrow</h3>
              <p>Your funds are protected in segregated escrow accounts until deployment.</p>
              <ul className="benefit-list">
                <li>Bank-grade security</li>
                <li>FDIC insured accounts</li>
                <li>Multi-party controls</li>
              </ul>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">📱</div>
              <h3>Easy to Manage</h3>
              <p>Mobile-friendly platform lets you manage investments anywhere.</p>
              <ul className="benefit-list">
                <li>Mobile app available</li>
                <li>Instant notifications</li>
                <li>Digital tax documents</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works for Investors */}
      <section className="how-it-works-investor">
        <div className="container">
          <div className="section-header">
            <h2>Start Investing in 4 Simple Steps</h2>
            <p>From signup to earning returns - simplified for investors</p>
          </div>
          
          <div className="steps-investor">
            <div className="step-investor">
              <div className="step-number">1</div>
              <h3>Create Your Account</h3>
              <p>Sign up in minutes and complete investor verification (accredited or non-accredited).</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-investor">
              <div className="step-number">2</div>
              <h3>Browse Opportunities</h3>
              <p>Review detailed project information, financial projections, and risk assessments.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-investor">
              <div className="step-number">3</div>
              <h3>Invest Securely</h3>
              <p>Complete investment documents online and fund via ACH, wire, or check.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step-investor">
              <div className="step-number">4</div>
              <h3>Earn Returns</h3>
              <p>Receive quarterly distributions and track your investment performance in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Investor Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Investors Say</h2>
            <p>Real results from real investors</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Finally, a platform that makes real estate investing accessible. I've invested in 3 projects 
                and the transparency is incredible. I can see daily construction updates!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div>
                  <div className="author-name">Jennifer D.</div>
                  <div className="author-role">Investor since 2024</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "I love the passive income from quarterly distributions. The 8% preferred return is exactly 
                what I was looking for to diversify my portfolio."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div>
                  <div className="author-name">Michael R.</div>
                  <div className="author-role">Invested $50,000</div>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The mobile app makes it so easy to track my investments. I get notified of every distribution 
                and can download my tax documents instantly."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div>
                  <div className="author-name">Sarah K.</div>
                  <div className="author-role">4 Active Investments</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section-investor">
        <div className="cta-content">
          <h2>Ready to Start Building Wealth?</h2>
          <p>Join hundreds of investors earning passive income from real estate</p>
          <div className="cta-buttons">
            <Link to="/offerings" className="btn btn-cta">
              View Current Opportunities
            </Link>
            <Link to="/login" className="btn btn-cta-secondary">
              Already an Investor? Login
            </Link>
          </div>
          <p className="cta-disclaimer">
            * Investments involve risk. Past performance does not guarantee future results. 
            Consult with a financial advisor before investing.
          </p>
        </div>
      </section>
    </>
  );
}

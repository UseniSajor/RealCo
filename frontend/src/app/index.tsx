import React from "react";
import { Link } from "@tanstack/react-router";

export function IndexPage() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Welcome to RealCo</h1>
        <p>
          Invest in real estate development projects with confidence.
          Our platform connects investors with vetted development opportunities,
          providing transparency and security throughout the investment lifecycle.
        </p>
        <Link to="/offerings" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
          View Offerings
        </Link>
      </div>

      <div className="features">
        <div className="feature-card">
          <h3>🏗️ Construction Tracking</h3>
          <p>
            Monitor project progress in real-time with daily updates, photos,
            and milestone tracking. Stay informed every step of the way.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>💰 Secure Escrow</h3>
          <p>
            All funds are held in secure escrow accounts with transparent
            distribution tracking and automated compliance checks.
          </p>
        </div>
        
        <div className="feature-card">
          <h3>📊 Transparent Reporting</h3>
          <p>
            Access detailed financial reports, transaction history, and
            distribution schedules through your personalized dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "@tanstack/react-router";

export function MarketingFooter() {
  return (
    <footer style={{
      background: 'var(--text-primary)',
      color: 'white',
      padding: '3rem 2rem 2rem',
      marginTop: '4rem'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>
              RealCo
            </h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: '1.6' }}>
              Unified platform for real estate syndication, compliance, and investor relations.
            </p>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/sponsors" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.875rem' }}>
                  For Sponsors
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/investors" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.875rem' }}>
                  For Investors
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/providers" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.875rem' }}>
                  For Providers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Resources
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/offerings" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Book a Demo
                </Link>
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/login" style={{ color: 'white', opacity: 0.8, textDecoration: 'none', fontSize: '0.875rem' }}>
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          paddingTop: '2rem',
          marginTop: '2rem'
        }}>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: '1.7', marginBottom: '1rem' }}>
            <strong>Disclaimer:</strong> RealCo provides software and workflows for real estate syndication, compliance management, and investor relations. We do not provide legal, tax, or investment advice. All users should consult with qualified professionals regarding their specific situations. Investments in real estate involve risk, including possible loss of principal. Past performance does not guarantee future results. Any target returns or projections shown are for educational purposes only and do not represent guarantees or promises of future performance.
          </p>
          <p style={{ fontSize: '0.75rem', opacity: 0.7, textAlign: 'center' }}>
            © {new Date().getFullYear()} RealCo Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

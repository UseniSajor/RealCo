import React from "react";

interface DisclaimerProps {
  text?: string;
}

export function Disclaimer({ text }: DisclaimerProps) {
  const defaultText = "RealCo provides software and workflows, not legal/tax/investment advice.";

  return (
    <section style={{
      background: 'var(--bg-grey)',
      padding: '3rem 2rem',
      borderTop: '1px solid var(--border)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          border: '2px solid var(--border)',
          borderLeft: '4px solid var(--secondary)'
        }}>
          <h3 style={{
            color: 'var(--text-primary)',
            fontSize: '1.125rem',
            fontWeight: '800',
            marginBottom: '1rem'
          }}>
            Important Disclosure
          </h3>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            margin: 0
          }}>
            {text || defaultText}
          </p>
        </div>
      </div>
    </section>
  );
}

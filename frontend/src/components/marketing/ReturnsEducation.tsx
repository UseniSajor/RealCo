import React from "react";

interface ReturnRange {
  assetClass: string;
  targetIRR: string;
  equityMultiple: string;
  holdPeriod: string;
  description?: string;
}

interface ReturnsEducationProps {
  title: string;
  subtitle?: string;
  ranges: ReturnRange[];
}

export function ReturnsEducation({ title, subtitle, ranges }: ReturnsEducationProps) {
  return (
    <section className="benefits-section">
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        
        <div className="benefits-grid">
          {ranges.map((range, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">📊</div>
              <h3>{range.assetClass}</h3>
              {range.description && (
                <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {range.description}
                </p>
              )}
              <div style={{
                background: 'var(--bg-light)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Target IRR:</strong>
                  <span style={{ color: 'var(--secondary)', fontWeight: '700', marginLeft: '0.5rem' }}>
                    {range.targetIRR}
                  </span>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Equity Multiple:</strong>
                  <span style={{ color: 'var(--primary)', fontWeight: '700', marginLeft: '0.5rem' }}>
                    {range.equityMultiple}
                  </span>
                </div>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Hold Period:</strong>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: '600', marginLeft: '0.5rem' }}>
                    {range.holdPeriod}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Required Disclaimer */}
        <div style={{
          maxWidth: '900px',
          margin: '3rem auto 0',
          padding: '1.5rem',
          background: '#FFF3CD',
          border: '2px solid #FFC107',
          borderRadius: '12px'
        }}>
          <p style={{
            color: '#856404',
            fontSize: '0.875rem',
            lineHeight: '1.7',
            margin: 0,
            fontWeight: '600'
          }}>
            <strong>Educational Ranges Only:</strong> The figures shown represent typical target returns for these asset classes and are for educational purposes only. They are not guarantees, projections, or promises of future performance. Actual returns vary widely based on market conditions, execution, and numerous other factors. All real estate investments involve substantial risk, including possible loss of principal. Past performance of any investment does not guarantee future results. Consult with qualified financial, legal, and tax advisors before making investment decisions.
          </p>
        </div>
      </div>
    </section>
  );
}

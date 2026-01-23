import React from "react";

interface ReturnRange {
  assetClass: string;
  targetIRR: string;
  equityMultiple: string;
  holdPeriod: string;
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
              <div style={{
                background: 'var(--bg-light)',
                padding: '1rem',
                borderRadius: '8px',
                marginTop: '1rem'
              }}>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <strong>Target IRR</strong> {range.targetIRR}
                </div>
                <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  <strong>Equity multiple</strong> {range.equityMultiple}
                </div>
                <div style={{ fontSize: '0.875rem' }}>
                  <strong>Hold</strong> {range.holdPeriod}
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
            <strong>Required disclosure:</strong> Past performance is not a guarantee of future results. All investments involve risk, including possible loss of principal. Returns vary widely based on market conditions and execution.
          </p>
        </div>
      </div>
    </section>
  );
}

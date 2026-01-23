import React from "react";

interface FeatureGridProps {
  title: string;
  subtitle?: string;
  items: string[];
  columns?: 1 | 2 | 3 | 4;
}

export function FeatureGrid({ title, subtitle, items, columns = 2 }: FeatureGridProps) {
  const gridCols = {
    1: 'repeat(1, 1fr)',
    2: 'repeat(auto-fit, minmax(400px, 1fr))',
    3: 'repeat(auto-fit, minmax(300px, 1fr))',
    4: 'repeat(auto-fit, minmax(250px, 1fr))',
  };

  return (
    <section className="features-section" style={{ background: 'var(--bg-light)' }}>
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: gridCols[columns],
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '12px',
                border: '2px solid var(--border)',
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 20 20"
                fill="var(--secondary)"
                style={{ flexShrink: 0, marginTop: '2px' }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span style={{ color: 'var(--text-primary)', fontWeight: '500', lineHeight: '1.6' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from "react";
import { Link } from "@tanstack/react-router";

interface CTAButton {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

interface CTASectionProps {
  title: string;
  subtitle?: string;
  buttons: CTAButton[];
}

export function CTASection({ title, subtitle, buttons }: CTASectionProps) {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginTop: subtitle ? '2rem' : '1.5rem'
        }}>
          {buttons.map((button, index) => (
            <Link
              key={index}
              to={button.href}
              className={button.variant === 'secondary' ? 'btn btn-cta-secondary' : 'btn btn-cta'}
            >
              {button.text}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

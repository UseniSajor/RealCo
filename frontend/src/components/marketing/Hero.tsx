import React from "react";
import { Link } from "@tanstack/react-router";

interface HeroProps {
  title: string;
  titleHighlight?: string;
  subtitle: string;
  primaryCTA: { text: string; href: string };
  secondaryCTA?: { text: string; href: string };
  tertiaryCTA?: { text: string; href: string };
  trustLine?: string;
  badge?: string;
}

export function Hero({
  title,
  titleHighlight,
  subtitle,
  primaryCTA,
  secondaryCTA,
  tertiaryCTA,
  trustLine,
  badge,
}: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-content">
        {badge && <span className="hero-badge">{badge}</span>}
        <h1 className="hero-title">
          {title}
          {titleHighlight && (
            <span className="gradient-text"> {titleHighlight}</span>
          )}
        </h1>
        <p className="hero-subtitle">{subtitle}</p>
        <div className="hero-cta">
          <Link to={primaryCTA.href} className="btn btn-hero-primary">
            <span>{primaryCTA.text}</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
            </svg>
          </Link>
          {secondaryCTA && (
            <Link to={secondaryCTA.href} className="btn btn-hero-secondary">
              {secondaryCTA.text}
            </Link>
          )}
          {tertiaryCTA && (
            <Link to={tertiaryCTA.href} className="btn btn-hero-secondary">
              {tertiaryCTA.text}
            </Link>
          )}
        </div>
        {trustLine && (
          <p style={{
            marginTop: '2rem',
            fontSize: '1rem',
            fontWeight: '600',
            color: 'rgba(255, 255, 255, 0.95)',
            maxWidth: '700px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            {trustLine}
          </p>
        )}
      </div>
    </section>
  );
}

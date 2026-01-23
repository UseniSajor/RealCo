import React from "react";
import { Link } from "@tanstack/react-router";

interface RoleCard {
  title: string;
  description: string;
  href: string;
  icon: string;
}

interface RoleCardsProps {
  title: string;
  cards: RoleCard[];
}

export function RoleCards({ title, cards }: RoleCardsProps) {
  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2>{title}</h2>
        </div>
        
        <div className="features-grid" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.href}
              className="feature-card-modern"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="feature-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div style={{ marginTop: '1rem', color: 'var(--secondary)', fontWeight: '700' }}>
                Learn More →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

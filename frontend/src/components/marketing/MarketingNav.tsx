import React from "react";
import { Link } from "@tanstack/react-router";

export function MarketingNav() {
  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">
        RealCo
      </Link>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/sponsors" className="nav-link">Sponsors</Link>
        <Link to="/investors" className="nav-link">Investors</Link>
        <Link to="/providers" className="nav-link">Providers</Link>
        <Link to="/offerings" className="btn btn-primary" style={{ padding: '0.5rem 1.5rem' }}>
          Book Demo
        </Link>
      </div>
    </nav>
  );
}

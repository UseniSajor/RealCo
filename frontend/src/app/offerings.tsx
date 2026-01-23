import React from "react";
import { apiClient } from "../lib/apiClient";

export function OfferingsPage() {
  const [offerings, setOfferings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function fetchOfferings() {
      try {
        const response = await apiClient.get("/offerings");
        setOfferings(response.data.items || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load offerings");
      } finally {
        setLoading(false);
      }
    }
    fetchOfferings();
  }, []);

  if (loading) {
    return <div className="loading">Loading offerings...</div>;
  }

  return (
    <div className="container">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Investment Offerings</h1>
        <p style={{ fontSize: '1.1rem', color: '#666' }}>
          Explore vetted real estate development opportunities
        </p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {offerings.length === 0 ? (
        <div className="hero">
          <h2>No Offerings Available</h2>
          <p>Check back soon for new investment opportunities.</p>
        </div>
      ) : (
        <div className="features">
          {offerings.map((offering) => (
            <div key={offering.id} className="feature-card">
              <h3>{offering.name}</h3>
              <p>{offering.description}</p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
                <p><strong>Target:</strong> ${offering.targetAmount?.toLocaleString()}</p>
                <p><strong>Min Investment:</strong> ${offering.minInvestment?.toLocaleString()}</p>
              </div>
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Learn More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

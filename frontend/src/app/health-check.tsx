import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';

export const Route = createFileRoute('/health-check')({
  component: HealthCheckPage,
});

interface HealthCheckResult {
  status: 'ok' | 'fail' | 'loading';
  response: any;
  error: string | null;
}

function HealthCheckPage() {
  const [healthStatus, setHealthStatus] = React.useState<HealthCheckResult>({
    status: 'loading',
    response: null,
    error: null,
  });
  
  const [readyStatus, setReadyStatus] = React.useState<HealthCheckResult>({
    status: 'loading',
    response: null,
    error: null,
  });

  React.useEffect(() => {
    const checkEndpoints = async () => {
      // Get normalized API URL (same logic as apiClient)
      const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const normalizedApiUrl = rawApiUrl.replace(/\/+$/, '');
      
      const healthUrl = `${normalizedApiUrl}/health`;
      const readyUrl = `${normalizedApiUrl}/api/v1/ready`;

      // Check /health endpoint
      try {
        const healthRes = await axios.get(healthUrl);
        setHealthStatus({
          status: 'ok',
          response: healthRes.data,
          error: null,
        });
      } catch (err: any) {
        setHealthStatus({
          status: 'fail',
          response: err?.response?.data || null,
          error: err?.message || 'Failed to fetch health check',
        });
      }

      // Check /api/v1/ready endpoint
      try {
        const readyRes = await axios.get(readyUrl);
        setReadyStatus({
          status: 'ok',
          response: readyRes.data,
          error: null,
        });
      } catch (err: any) {
        setReadyStatus({
          status: 'fail',
          response: err?.response?.data || null,
          error: err?.message || 'Failed to fetch ready check',
        });
      }
    };

    checkEndpoints();
  }, []);

  const renderCheckResult = (title: string, result: HealthCheckResult, url: string) => (
    <div style={{ marginBottom: 32, padding: 16, border: '1px solid #ddd', borderRadius: 4 }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <div style={{ marginBottom: 8, fontSize: 14, color: '#666' }}>
        <strong>URL: </strong>
        <code>{url}</code>
      </div>
      
      <div style={{ marginBottom: 16 }}>
        <strong>Status: </strong>
        <span
          style={{
            color: result.status === 'ok' ? 'green' : result.status === 'fail' ? 'red' : 'gray',
            fontWeight: 'bold',
          }}
        >
          {result.status === 'loading' ? 'Loading...' : result.status.toUpperCase()}
        </span>
      </div>

      {result.error && (
        <div style={{ marginBottom: 16, color: 'red' }}>
          <strong>Error: </strong>
          {result.error}
        </div>
      )}

      <div>
        <strong>Response:</strong>
        <pre
          style={{
            marginTop: 8,
            padding: 16,
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            overflow: 'auto',
            fontSize: 14,
          }}
        >
          {result.response ? JSON.stringify(result.response, null, 2) : 'No response data'}
        </pre>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h2>Health Check</h2>
      
      {renderCheckResult(
        'Health Endpoint',
        healthStatus,
        `${(import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '')}/health`
      )}
      
      {renderCheckResult(
        'Ready Endpoint',
        readyStatus,
        `${(import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/+$/, '')}/api/v1/ready`
      )}
    </div>
  );
}


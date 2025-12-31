import * as React from 'react';
import { Outlet, createRootRoute, Link, useNavigate } from '@tanstack/react-router';
import { auth } from '../lib/auth';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(auth.isAuthenticated());

  React.useEffect(() => {
    // Update auth state when token changes
    const checkAuth = () => setIsAuthenticated(auth.isAuthenticated());
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  function handleLogout() {
    auth.clearToken();
    setIsAuthenticated(false);
    navigate({ to: '/login' });
  }

  return (
    <div style={{ fontFamily: 'system-ui', padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>RealCo Platform</h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link>
              <Link to="/offerings" style={{ textDecoration: 'none', color: 'inherit' }}>Offerings</Link>
              <button
                onClick={handleLogout}
                style={{
                  padding: '6px 12px',
                  fontSize: 14,
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

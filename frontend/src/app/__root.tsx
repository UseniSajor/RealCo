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
    <div>
      <nav className="nav-bar">
        <div className="nav-logo">RealCo Platform</div>
        <div className="nav-links">
          {isAuthenticated ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/offerings" className="nav-link">Offerings</Link>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

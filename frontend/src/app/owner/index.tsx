import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/owner/')({
  component: OwnerPortal,
});

function OwnerPortal() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Portal</h1>
      <nav className="mb-6">
        <Link to="/owner/dashboard" className="mr-4 text-blue-600">Dashboard</Link>
      </nav>
      <p>Welcome to the Owner Portal. Select a page from the navigation.</p>
    </div>
  );
}


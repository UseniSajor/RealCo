import * as React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/owner/dashboard')({
  component: OwnerDashboard,
});

export default function OwnerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Active Projects</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Total Budget</h3>
          <p className="text-3xl font-bold">$0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Contractors</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}






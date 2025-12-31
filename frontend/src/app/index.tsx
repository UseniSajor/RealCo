import * as React from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <div>
      <p>Welcome. Choose a module:</p>
      <ul>
        <li><Link to="/offerings">Offerings</Link></li>
      </ul>
    </div>
  );
}

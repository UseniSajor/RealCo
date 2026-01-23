import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router';
import './index.css';

// Development-only console log
if (import.meta.env.DEV) {
  console.log('API:', import.meta.env.VITE_API_URL);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);

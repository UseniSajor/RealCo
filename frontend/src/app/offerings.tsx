import * as React from 'react';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { OfferingsPage } from '../features/offerings/OfferingsPage';
import { auth } from '../lib/auth';

export const Route = createFileRoute('/offerings')({
  beforeLoad: () => {
    if (!auth.isAuthenticated()) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: () => <OfferingsPage />,
});

// Production Configuration for RealCo Platform

export const config = {
  // API Configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  
  // Mode Configuration
  authMode: process.env.NEXT_PUBLIC_AUTH_MODE || 'production',
  isDemoMode: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  
  // Payment Providers
  plaid: {
    clientId: process.env.NEXT_PUBLIC_PLAID_CLIENT_ID || '',
    environment: (process.env.NEXT_PUBLIC_PLAID_ENV || 'sandbox') as 'sandbox' | 'development' | 'production',
    enabled: process.env.NEXT_PUBLIC_ENABLE_PLAID === 'true',
  },
  
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    enabled: process.env.NEXT_PUBLIC_ENABLE_STRIPE === 'true',
  },
  
  // Kealee Integration
  kealee: {
    apiUrl: process.env.NEXT_PUBLIC_KEALEE_API_URL || '',
    apiKey: process.env.NEXT_PUBLIC_KEALEE_API_KEY || '',
    enabled: process.env.NEXT_PUBLIC_ENABLE_KEALEE === 'true',
  },
  
  // Maps
  mapbox: {
    token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
    enabled: process.env.NEXT_PUBLIC_ENABLE_MAPS === 'true',
  },
  
  // Site Configuration
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    name: process.env.NEXT_PUBLIC_SITE_NAME || 'RealCo',
  },
} as const

export type Config = typeof config

// Pricing tiers for RealCo platform

export type TierName = 'free' | 'pro' | 'enterprise'

export interface PricingTier {
  name: TierName
  displayName: string
  price: number
  billingPeriod: 'month' | 'year'
  description: string
  features: string[]
  limits: {
    [key: string]: number | string
  }
  cta: string
  popular?: boolean
}

export interface RolePricing {
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  tiers: PricingTier[]
}

// SPONSOR PRICING
export const sponsorPricing: RolePricing = {
  role: 'sponsor',
  tiers: [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      billingPeriod: 'month',
      description: 'Perfect for testing the platform and small projects',
      features: [
        '1 Active Project',
        'Up to 10 Investors',
        'Basic Capital Tracking',
        'Construction Dashboard',
        'Daily Logs (30 days history)',
        'Photo Gallery (100 photos)',
        'Basic Reporting',
        'Email Support',
      ],
      limits: {
        projects: 1,
        investors: 10,
        capitalRaised: 500000,
        photos: 100,
        logHistory: 30,
      },
      cta: 'Start Free',
    },
    {
      name: 'pro',
      displayName: 'Pro',
      price: 199,
      billingPeriod: 'month',
      description: 'For active sponsors managing multiple projects',
      features: [
        'Up to 5 Active Projects',
        'Unlimited Investors',
        'Advanced Capital Tracking',
        'Distribution Management (Waterfall)',
        'Construction PM Suite (All Tools)',
        'Unlimited Daily Logs & Photos',
        'RFI & Submittal Tracking',
        'Change Orders & Punch Lists',
        'Advanced Reporting & Analytics',
        'Draw Request Management',
        'Priority Email Support',
        'API Access',
      ],
      limits: {
        projects: 5,
        investors: -1, // unlimited
        capitalRaised: 10000000,
        photos: -1,
        logHistory: -1,
      },
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 499,
      billingPeriod: 'month',
      description: 'For large sponsors with complex needs',
      features: [
        'Unlimited Projects',
        'Unlimited Investors',
        'White-Label Options',
        'Custom Waterfall Structures',
        'Dedicated Account Manager',
        'Custom Integrations (BuilderTrend, Procore)',
        'Advanced Security & Compliance',
        'Custom Reporting',
        'SLA Guarantee (99.9% uptime)',
        'Phone Support',
        '24/7 Priority Support',
        'Onboarding & Training',
      ],
      limits: {
        projects: -1,
        investors: -1,
        capitalRaised: -1,
        photos: -1,
        logHistory: -1,
      },
      cta: 'Contact Sales',
    },
  ],
}

// INVESTOR PRICING
export const investorPricing: RolePricing = {
  role: 'investor',
  tiers: [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      billingPeriod: 'month',
      description: 'Perfect for new investors exploring opportunities',
      features: [
        'Browse All Offerings',
        'Invest in 1 Project',
        'View Investment Dashboard',
        'Basic Document Access',
        'Transaction History',
        'Quarterly Reports',
        'Email Notifications',
        'Community Support',
      ],
      limits: {
        activeInvestments: 1,
        totalInvested: 50000,
        documentDownloads: 10,
      },
      cta: 'Start Free',
    },
    {
      name: 'pro',
      displayName: 'Pro',
      price: 49,
      billingPeriod: 'month',
      description: 'For active investors building a portfolio',
      features: [
        'Invest in Up to 10 Projects',
        'Portfolio Dashboard',
        'Advanced Analytics',
        'All Document Types',
        'Unlimited Downloads',
        'Real-Time Construction Updates',
        'Distribution Forecasting',
        'K-1 Tax Document Access',
        'Priority Support',
        'Early Access to New Offerings',
      ],
      limits: {
        activeInvestments: 10,
        totalInvested: 1000000,
        documentDownloads: -1,
      },
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 199,
      billingPeriod: 'month',
      description: 'For institutional and high-net-worth investors',
      features: [
        'Unlimited Investments',
        'Custom Portfolio Reports',
        'Dedicated Investment Advisor',
        'Priority Access to Offerings',
        'Custom Investment Terms',
        'Advanced Tax Planning Tools',
        'White-Glove Service',
        'Direct Line to Sponsors',
        'Quarterly Review Calls',
        'Custom Integrations',
      ],
      limits: {
        activeInvestments: -1,
        totalInvested: -1,
        documentDownloads: -1,
      },
      cta: 'Contact Sales',
    },
  ],
}

// PROVIDER PRICING
export const providerPricing: RolePricing = {
  role: 'provider',
  tiers: [
    {
      name: 'free',
      displayName: 'Free',
      price: 0,
      billingPeriod: 'month',
      description: 'Perfect for contractors testing the platform',
      features: [
        'Submit Up to 5 Invoices/Month',
        'Basic Invoice Tracking',
        'Payment Status Updates',
        'Document Upload (100MB)',
        'Email Notifications',
        'Community Support',
      ],
      limits: {
        monthlyInvoices: 5,
        storageGB: 1,
        projects: 1,
      },
      cta: 'Start Free',
    },
    {
      name: 'pro',
      displayName: 'Pro',
      price: 79,
      billingPeriod: 'month',
      description: 'For active contractors and service providers',
      features: [
        'Unlimited Invoices',
        'Multiple Projects',
        'Lien Waiver Management',
        'Payment Scheduling',
        'Advanced Tracking & Reports',
        'Document Storage (50GB)',
        'Integration with QuickBooks',
        'Priority Payment Processing',
        'Email & Chat Support',
      ],
      limits: {
        monthlyInvoices: -1,
        storageGB: 50,
        projects: 10,
      },
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 199,
      billingPeriod: 'month',
      description: 'For large contractors and GCs',
      features: [
        'Unlimited Everything',
        'White-Label Portal',
        'Custom Invoice Templates',
        'Advanced Analytics',
        'Dedicated Account Manager',
        'API Access',
        'Custom Integrations',
        'Unlimited Storage',
        'Phone & 24/7 Support',
        'Payment Guarantees',
      ],
      limits: {
        monthlyInvoices: -1,
        storageGB: -1,
        projects: -1,
      },
      cta: 'Contact Sales',
    },
  ],
}

// FUND MANAGER PRICING
export const fundManagerPricing: RolePricing = {
  role: 'fund-manager',
  tiers: [
    {
      name: 'free',
      displayName: 'Starter',
      price: 0,
      billingPeriod: 'month',
      description: 'Perfect for small portfolios getting started',
      features: [
        'Up to 3 Properties',
        '50 Units Tracked',
        '100 Investors',
        'Basic Asset Dashboard',
        'Lease Management',
        'Maintenance Tracking',
        'Quarterly Investor Reports',
        'Email Support',
      ],
      limits: {
        properties: 3,
        units: 50,
        investors: 100,
        storageGB: 5,
      },
      cta: 'Start Free',
    },
    {
      name: 'pro',
      displayName: 'Professional',
      price: 999,
      billingPeriod: 'month',
      description: 'For growing portfolios',
      features: [
        'Up to 10 Properties',
        '500 Units Tracked',
        '500 Investors',
        'Advanced Asset Operations',
        'Full Lease & Tenant Management',
        'Capital Project Tracking',
        'Operating Statement Import',
        'Investor Capital Accounts',
        'Waterfall Calculations',
        'Monthly Investor Reports',
        'Communication Tools (Email/SMS)',
        'PM Software Integration (Yardi/AppFolio)',
        'Priority Support',
      ],
      limits: {
        properties: 10,
        units: 500,
        investors: 500,
        storageGB: 100,
      },
      cta: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'enterprise',
      displayName: 'Enterprise',
      price: 2499,
      billingPeriod: 'month',
      description: 'For large portfolios and institutions',
      features: [
        'Up to 50 Properties',
        'Unlimited Units',
        'Unlimited Investors',
        'Full Platform Access',
        'Disposition Management',
        'Exit Analysis & Reporting',
        'Portfolio Analytics',
        'Custom Integrations',
        'API Access',
        'Dedicated Account Manager',
        'White-Label Options',
        'Custom Reporting',
        '24/7 Priority Support',
        'Onboarding & Training',
      ],
      limits: {
        properties: 50,
        units: -1,
        investors: -1,
        storageGB: -1,
      },
      cta: 'Contact Sales',
    },
  ],
}

// Helper functions
export function getTierForRole(role: 'sponsor' | 'investor' | 'provider' | 'fund-manager', tierName: TierName): PricingTier | undefined {
  const pricing = role === 'sponsor' ? sponsorPricing : role === 'investor' ? investorPricing : role === 'provider' ? providerPricing : fundManagerPricing
  return pricing.tiers.find(t => t.name === tierName)
}

export function canAccessFeature(
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager',
  currentTier: TierName,
  feature: string
): boolean {
  const tier = getTierForRole(role, currentTier)
  return tier?.features.includes(feature) ?? false
}

export function isAtLimit(
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager',
  currentTier: TierName,
  limitKey: string,
  currentValue: number
): boolean {
  const tier = getTierForRole(role, currentTier)
  if (!tier) return true
  
  const limit = tier.limits[limitKey]
  if (typeof limit === 'number') {
    if (limit === -1) return false // unlimited
    return currentValue >= limit
  }
  
  return false
}

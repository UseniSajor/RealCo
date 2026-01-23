import { DemoBankAccount, DemoTransaction, DemoOffering, DemoInvestment, DemoDrawRequest, DemoInvoice, DemoProject } from './types'

// Bank Accounts
export const mockBankAccounts: DemoBankAccount[] = [
  {
    id: 'bank-1',
    bankName: 'Chase Bank',
    accountType: 'CHECKING',
    last4: '4242',
    status: 'VERIFIED',
    isDefault: true,
  },
  {
    id: 'bank-2',
    bankName: 'Bank of America',
    accountType: 'SAVINGS',
    last4: '8765',
    status: 'VERIFIED',
    isDefault: false,
  },
]

// Transactions
export const mockTransactions: DemoTransaction[] = [
  {
    id: 'txn-1',
    type: 'DEPOSIT',
    amount: 250000,
    status: 'COMPLETED',
    date: new Date('2026-01-20'),
    description: 'Investment in Sunset Apartments',
    paymentMethod: 'ACH',
    from: 'Chase Bank ••4242',
    to: 'Escrow Account',
  },
  {
    id: 'txn-2',
    type: 'DISTRIBUTION',
    amount: 12500,
    status: 'COMPLETED',
    date: new Date('2026-01-15'),
    description: 'Q4 2025 Distribution - Downtown Office Tower',
    paymentMethod: 'ACH',
    from: 'Escrow Account',
    to: 'Chase Bank ••4242',
  },
  {
    id: 'txn-3',
    type: 'DEPOSIT',
    amount: 150000,
    status: 'PROCESSING',
    date: new Date('2026-01-22'),
    description: 'Investment in Riverside Condos',
    paymentMethod: 'WIRE',
    from: 'Bank of America ••8765',
    to: 'Escrow Account',
  },
  {
    id: 'txn-4',
    type: 'DISTRIBUTION',
    amount: 8750,
    status: 'COMPLETED',
    date: new Date('2026-01-10'),
    description: 'Monthly Distribution - Sunset Apartments',
    paymentMethod: 'ACH',
    from: 'Escrow Account',
    to: 'Chase Bank ••4242',
  },
  {
    id: 'txn-5',
    type: 'PLATFORM_FEE',
    amount: -500,
    status: 'COMPLETED',
    date: new Date('2026-01-20'),
    description: 'Platform Fee - Sunset Apartments Investment',
    paymentMethod: 'ACH',
    from: 'Chase Bank ••4242',
    to: 'RealCo Platform',
  },
]

// Offerings
export const mockOfferings: DemoOffering[] = [
  {
    id: 'offer-1',
    name: 'Marina Bay Apartments',
    location: 'San Diego, CA',
    minInvestment: 50000,
    targetRaise: 12000000,
    currentRaised: 8500000,
    status: 'ACTIVE',
    targetReturn: '15-20% IRR',
    holdPeriod: '3-5 years',
  },
  {
    id: 'offer-2',
    name: 'Tech Park Office',
    location: 'Seattle, WA',
    minInvestment: 100000,
    targetRaise: 25000000,
    currentRaised: 15000000,
    status: 'ACTIVE',
    targetReturn: '18-23% IRR',
    holdPeriod: '5-7 years',
  },
  {
    id: 'offer-3',
    name: 'Sunset Apartments',
    location: 'Austin, TX',
    minInvestment: 25000,
    targetRaise: 8000000,
    currentRaised: 8000000,
    status: 'FUNDED',
    targetReturn: '16-21% IRR',
    holdPeriod: '4-6 years',
  },
]

// Investments
export const mockInvestments: DemoInvestment[] = [
  {
    id: 'inv-1',
    offeringId: 'offer-3',
    amount: 250000,
    date: new Date('2025-06-15'),
    status: 'ACTIVE',
    returnToDate: 18750, // 7.5% over 6 months
  },
  {
    id: 'inv-2',
    offeringId: 'offer-1',
    amount: 100000,
    date: new Date('2025-03-10'),
    status: 'ACTIVE',
    returnToDate: 12500, // 12.5% over 9 months
  },
]

// Draw Requests
export const mockDrawRequests: DemoDrawRequest[] = [
  {
    id: 'DR-003',
    projectName: 'Sunset Apartments',
    amount: 450000,
    category: 'Foundation',
    status: 'APPROVED',
    date: new Date('2026-01-15'),
    description: 'Foundation work completed for Building A and B. Includes concrete, rebar, and waterproofing.',
  },
  {
    id: 'DR-002',
    projectName: 'Sunset Apartments',
    amount: 325000,
    category: 'Site Work',
    status: 'PAID',
    date: new Date('2026-01-08'),
    description: 'Site preparation, grading, and utility connections completed.',
  },
  {
    id: 'DR-001',
    projectName: 'Sunset Apartments',
    amount: 180000,
    category: 'Soft Costs',
    status: 'PAID',
    date: new Date('2026-01-01'),
    description: 'Architecture, engineering, and permitting fees for project kickoff.',
  },
]

// Invoices
export const mockInvoices: DemoInvoice[] = [
  {
    id: 'inv-2026-003',
    invoiceNumber: 'INV-2026-003',
    projectName: 'Sunset Apartments',
    amount: 45000,
    status: 'APPROVED',
    date: new Date('2026-01-20'),
    description: 'Electrical rough-in for Building A - 40 units completed',
  },
  {
    id: 'inv-2026-002',
    invoiceNumber: 'INV-2026-002',
    projectName: 'Marina Bay',
    amount: 32500,
    status: 'UNDER_REVIEW',
    date: new Date('2026-01-18'),
    description: 'Plumbing installation for floors 1-3',
  },
  {
    id: 'inv-2026-001',
    invoiceNumber: 'INV-2026-001',
    projectName: 'Downtown Office',
    amount: 28750,
    status: 'PAID',
    date: new Date('2026-01-15'),
    description: 'HVAC system installation - Main floor completed',
  },
]

// Projects
export const mockProjects: DemoProject[] = [
  {
    id: 'proj-1',
    name: 'Sunset Apartments',
    totalBudget: 12000000,
    drawnToDate: 4500000,
    status: 'IN_PROGRESS',
    startDate: new Date('2025-12-01'),
    expectedCompletion: new Date('2027-06-30'),
  },
  {
    id: 'proj-2',
    name: 'Marina Bay',
    totalBudget: 18500000,
    drawnToDate: 2100000,
    status: 'IN_PROGRESS',
    startDate: new Date('2025-09-15'),
    expectedCompletion: new Date('2027-12-31'),
  },
  {
    id: 'proj-3',
    name: 'Downtown Office',
    totalBudget: 32000000,
    drawnToDate: 28500000,
    status: 'IN_PROGRESS',
    startDate: new Date('2024-03-01'),
    expectedCompletion: new Date('2026-08-31'),
  },
]

// Helper to get data by role
export const getMockDataForRole = (role: 'investor' | 'sponsor' | 'provider') => {
  switch (role) {
    case 'investor':
      return {
        offerings: mockOfferings.filter(o => o.status === 'ACTIVE'),
        investments: mockInvestments,
        transactions: mockTransactions.filter(t => 
          t.type === 'DEPOSIT' || t.type === 'DISTRIBUTION' || t.type === 'PLATFORM_FEE'
        ),
      }
    case 'sponsor':
      return {
        projects: mockProjects,
        drawRequests: mockDrawRequests,
        transactions: mockTransactions.filter(t => 
          t.type === 'CONSTRUCTION_DRAW' || t.type === 'DEPOSIT'
        ),
      }
    case 'provider':
      return {
        invoices: mockInvoices,
        transactions: mockTransactions.filter(t => 
          t.type === 'CONSTRUCTION_DRAW'
        ),
      }
    default:
      return {}
  }
}

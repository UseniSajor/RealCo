// Demo Mode Types

export interface DemoUser {
  id: string
  email: string
  name: string
  role: 'investor' | 'sponsor' | 'provider'
}

export interface DemoBankAccount {
  id: string
  bankName: string
  accountType: 'CHECKING' | 'SAVINGS'
  last4: string
  status: 'VERIFIED' | 'PENDING_VERIFICATION'
  isDefault: boolean
  routingNumber?: string
  accountNumber?: string
}

export interface DemoTransaction {
  id: string
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'DISTRIBUTION' | 'CONSTRUCTION_DRAW' | 'PLATFORM_FEE' | 'REFERRAL_FEE'
  status: 'COMPLETED' | 'PROCESSING' | 'FAILED' | 'PENDING'
  amount: number
  date: Date
  description: string
  paymentMethod: 'ACH' | 'WIRE' | 'CHECK'
  from: string
  to: string
}

export interface DemoOffering {
  id: string
  name: string
  location: string
  minInvestment: number
  targetRaise: number
  currentRaised: number
  status: 'ACTIVE' | 'FUNDED' | 'CLOSED'
  targetReturn: string
  holdPeriod: string
  assetType?: string
  units?: number
  squareFeet?: number
  occupancyRate?: string
  description?: string
}

export interface DemoInvestment {
  id: string
  offeringId: string
  amount: number
  date: Date
  status: 'ACTIVE' | 'EXITED'
  returnToDate: number
  currentValue?: number
  distributionsReceived?: number
  lastDistributionDate?: Date
  annualizedReturn?: number
}

export interface DemoDrawRequest {
  id: string
  projectName: string
  amount: number
  category: string
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | 'UNDER_REVIEW'
  date: Date
  description: string
  inspectionDate?: Date
  inspector?: string
  requestedBy?: string
  paidDate?: Date
  checkNumber?: string
}

export interface DemoInvoice {
  id: string
  invoiceNumber: string
  projectName: string
  amount: number
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PAID' | 'REJECTED'
  date: Date
  description: string
  vendorName?: string
  vendorContact?: string
  approvedDate?: Date
  paidDate?: Date
  paymentMethod?: 'ACH' | 'CHECK' | 'WIRE'
  checkNumber?: string
  dueDate?: Date
}

export interface DemoProject {
  id: string
  name: string
  totalBudget: number
  drawnToDate: number
  status: 'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'
  startDate: Date
  expectedCompletion: Date
  completionPercentage?: number
  address?: string
  developer?: string
  generalContractor?: string
  architect?: string
  units?: number
  totalSquareFeet?: number
  budgetCategories?: Array<{
    name: string
    budgeted: number
    spent: number
    percentage: number
  }>
  milestones?: Array<{
    name: string
    targetDate: Date
    actualDate: Date | null
    status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  }>
}

export interface DemoState {
  user: DemoUser | null
  bankAccounts: DemoBankAccount[]
  transactions: DemoTransaction[]
  offerings: DemoOffering[]
  investments: DemoInvestment[]
  drawRequests: DemoDrawRequest[]
  invoices: DemoInvoice[]
  projects: DemoProject[]
}

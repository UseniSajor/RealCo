// Properties API Client - AI-Enhanced Property Search & Analysis
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export type PropertyType = 'MULTIFAMILY' | 'COMMERCIAL' | 'INDUSTRIAL' | 'RETAIL' | 'OFFICE' | 'MIXED_USE' | 'LAND' | 'HOSPITALITY';
export type PropertyStatus = 'ACTIVE' | 'PENDING' | 'UNDER_CONTRACT' | 'SOLD' | 'OFF_MARKET' | 'COMING_SOON';
export type PropertySource = 'LOOPNET' | 'COSTAR' | 'CREXI' | 'MARCUS_MILLICHAP' | 'CBRE' | 'JLL' | 'DIRECT' | 'BROKER' | 'AI_SOURCED' | 'MANUAL';
export type DealStage = 'SOURCING' | 'INITIAL_REVIEW' | 'UNDERWRITING' | 'DUE_DILIGENCE' | 'NEGOTIATION' | 'UNDER_CONTRACT' | 'CLOSING' | 'CLOSED' | 'PASSED';

export interface PropertyMetrics {
  capRate: number | null;
  noi: number | null;
  pricePerUnit: number | null;
  pricePerSqFt: number | null;
  occupancy: number | null;
  grossIncome: number | null;
  operatingExpenses: number | null;
  debtService: number | null;
  cashOnCash: number | null;
  irr: number | null;
  equityMultiple: number | null;
}

export interface PropertyFinancials {
  purchasePrice: number;
  estimatedValue: number | null;
  renovationCost: number | null;
  arv: number | null; // After Repair Value
  closingCosts: number | null;
  totalInvestment: number | null;
  downPayment: number | null;
  loanAmount: number | null;
  interestRate: number | null;
  loanTerm: number | null;
  monthlyPayment: number | null;
}

export interface PropertyContact {
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  type: 'BROKER' | 'OWNER' | 'AGENT' | 'PROPERTY_MANAGER' | 'OTHER';
}

export interface AIAnalysis {
  score: number; // 0-100 deal score
  recommendation: 'STRONG_BUY' | 'BUY' | 'HOLD' | 'PASS' | 'STRONG_PASS';
  strengths: string[];
  weaknesses: string[];
  marketInsights: string[];
  comparableDeals: string[];
  riskFactors: string[];
  investmentHighlights: string[];
  generatedAt: string;
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string | null;
  latitude: number | null;
  longitude: number | null;

  // Property Details
  type: PropertyType;
  subType: string | null;
  status: PropertyStatus;
  units: number | null;
  sqft: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  parkingSpaces: number | null;
  stories: number | null;

  // Pricing & Financials
  askingPrice: number;
  metrics: PropertyMetrics;
  financials: PropertyFinancials;

  // Listing Info
  source: PropertySource;
  sourceUrl: string | null;
  listingDate: string | null;
  daysOnMarket: number | null;
  contacts: PropertyContact[];

  // Media
  photos: string[];
  documents: string[];
  virtualTourUrl: string | null;

  // AI Analysis
  aiAnalysis: AIAnalysis | null;

  // Pipeline
  dealStage: DealStage | null;
  isSaved: boolean;
  notes: string | null;
  tags: string[];

  // Timestamps
  orgId: string;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PropertySearchFilters {
  query?: string;
  types?: PropertyType[];
  statuses?: PropertyStatus[];
  sources?: PropertySource[];
  minPrice?: number;
  maxPrice?: number;
  minUnits?: number;
  maxUnits?: number;
  minSqft?: number;
  maxSqft?: number;
  minCapRate?: number;
  maxCapRate?: number;
  minNOI?: number;
  maxNOI?: number;
  city?: string;
  state?: string;
  zipCode?: string;
  radius?: number; // miles from location
  lat?: number;
  lng?: number;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  savedOnly?: boolean;
  hasAIAnalysis?: boolean;
  minAIScore?: number;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'cap_rate_desc' | 'noi_desc' | 'days_on_market' | 'ai_score_desc' | 'created_at';
  limit?: number;
  offset?: number;
}

export interface AIPropertySearchRequest {
  description: string; // Natural language search
  investmentCriteria?: {
    targetReturns?: number;
    investmentHorizon?: number;
    riskTolerance?: 'LOW' | 'MEDIUM' | 'HIGH';
    preferredTypes?: PropertyType[];
    preferredMarkets?: string[];
    budgetMin?: number;
    budgetMax?: number;
  };
  includeOffMarket?: boolean;
}

export interface PropertyAnalysisRequest {
  propertyId?: string;
  propertyData?: Partial<Property>;
  includeComparables?: boolean;
  includeMarketAnalysis?: boolean;
  investmentCriteria?: {
    targetIRR?: number;
    targetCashOnCash?: number;
    holdPeriod?: number;
    exitCapRate?: number;
  };
}

export interface MarketData {
  city: string;
  state: string;
  medianPrice: number;
  medianCapRate: number;
  medianRent: number;
  vacancyRate: number;
  populationGrowth: number;
  jobGrowth: number;
  rentGrowth: number;
  priceGrowth: number;
  demandScore: number;
  supplyScore: number;
  marketCycle: 'EXPANSION' | 'PEAK' | 'CONTRACTION' | 'TROUGH';
}

export interface OwnerContact {
  name: string;
  entityName: string | null;
  mailingAddress: string | null;
  phone: string | null;
  email: string | null;
  ownershipType: 'INDIVIDUAL' | 'LLC' | 'CORPORATION' | 'TRUST' | 'PARTNERSHIP';
  acquisitionDate: string | null;
  acquisitionPrice: number | null;
  estimatedEquity: number | null;
  contactAttempts: number;
  lastContactDate: string | null;
  responseStatus: 'NOT_CONTACTED' | 'NO_RESPONSE' | 'INTERESTED' | 'NOT_INTERESTED' | 'UNDER_NEGOTIATION';
}

class PropertiesAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('realco_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `API Error: ${response.status}`);
    }
    return response.json();
  }

  // === Property CRUD ===

  async getProperties(filters?: PropertySearchFilters): Promise<{ items: Property[]; total: number; hasMore: boolean }> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.set(key, value.join(','));
          } else {
            params.set(key, String(value));
          }
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/properties${query}`);
  }

  async getProperty(id: string): Promise<Property> {
    return this.request(`/properties/${id}`);
  }

  async createProperty(data: Partial<Property>): Promise<Property> {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    return this.request(`/properties/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request(`/properties/${id}`, { method: 'DELETE' });
  }

  // === Save/Favorite ===

  async saveProperty(id: string): Promise<Property> {
    return this.request(`/properties/${id}/save`, { method: 'POST' });
  }

  async unsaveProperty(id: string): Promise<Property> {
    return this.request(`/properties/${id}/unsave`, { method: 'POST' });
  }

  async getSavedProperties(): Promise<{ items: Property[] }> {
    return this.request('/properties/saved');
  }

  // === Pipeline Management ===

  async updateDealStage(id: string, stage: DealStage, notes?: string): Promise<Property> {
    return this.request(`/properties/${id}/stage`, {
      method: 'POST',
      body: JSON.stringify({ stage, notes }),
    });
  }

  async addToPipeline(id: string, stage: DealStage = 'SOURCING'): Promise<Property> {
    return this.request(`/properties/${id}/pipeline`, {
      method: 'POST',
      body: JSON.stringify({ stage }),
    });
  }

  // === AI-Powered Features ===

  async aiSearch(request: AIPropertySearchRequest): Promise<{ items: Property[]; insights: string[] }> {
    return this.request('/properties/ai-search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAIAnalysis(request: PropertyAnalysisRequest): Promise<AIAnalysis> {
    return this.request('/properties/ai-analysis', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async refreshAIAnalysis(propertyId: string): Promise<Property> {
    return this.request(`/properties/${propertyId}/refresh-analysis`, { method: 'POST' });
  }

  // === Market Data ===

  async getMarketData(city: string, state: string): Promise<MarketData> {
    return this.request(`/properties/market-data?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`);
  }

  async getComparables(propertyId: string, limit?: number): Promise<{ items: Property[] }> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/properties/${propertyId}/comparables${query}`);
  }

  // === Owner Contact ===

  async getOwnerInfo(propertyId: string): Promise<OwnerContact | null> {
    return this.request(`/properties/${propertyId}/owner`);
  }

  async lookupOwner(address: string): Promise<OwnerContact | null> {
    return this.request('/properties/lookup-owner', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async logContactAttempt(propertyId: string, data: {
    type: 'CALL' | 'EMAIL' | 'LETTER' | 'TEXT' | 'VISIT';
    notes: string;
    outcome: 'NO_ANSWER' | 'LEFT_MESSAGE' | 'SPOKE_WITH_OWNER' | 'MEETING_SCHEDULED' | 'NOT_INTERESTED' | 'INTERESTED';
  }): Promise<OwnerContact> {
    return this.request(`/properties/${propertyId}/contact-attempt`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // === Bulk Operations ===

  async bulkImport(properties: Partial<Property>[]): Promise<{ imported: number; errors: string[] }> {
    return this.request('/properties/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });
  }

  async exportProperties(filters?: PropertySearchFilters, format: 'csv' | 'xlsx' | 'pdf' = 'csv'): Promise<Blob> {
    const params = new URLSearchParams();
    params.set('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.set(key, value.join(','));
          } else {
            params.set(key, String(value));
          }
        }
      });
    }
    const response = await fetch(`${API_BASE_URL}/properties/export?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });
    return response.blob();
  }

  // === Notes & Tags ===

  async addNote(propertyId: string, note: string): Promise<Property> {
    return this.request(`/properties/${propertyId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    });
  }

  async addTags(propertyId: string, tags: string[]): Promise<Property> {
    return this.request(`/properties/${propertyId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
  }

  async removeTags(propertyId: string, tags: string[]): Promise<Property> {
    return this.request(`/properties/${propertyId}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tags }),
    });
  }
}

export const propertiesAPI = new PropertiesAPI();

// === Mock Data for Development ===
export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    name: 'Riverside Luxury Apartments',
    address: '2400 Riverside Drive',
    city: 'Austin',
    state: 'TX',
    zipCode: '78741',
    county: 'Travis',
    latitude: 30.2672,
    longitude: -97.7431,
    type: 'MULTIFAMILY',
    subType: 'Class A',
    status: 'ACTIVE',
    units: 156,
    sqft: 145000,
    lotSize: 4.2,
    yearBuilt: 2019,
    parkingSpaces: 280,
    stories: 4,
    askingPrice: 52500000,
    metrics: {
      capRate: 4.8,
      noi: 2520000,
      pricePerUnit: 336538,
      pricePerSqFt: 362,
      occupancy: 94,
      grossIncome: 3800000,
      operatingExpenses: 1280000,
      debtService: 1800000,
      cashOnCash: 7.2,
      irr: 15.5,
      equityMultiple: 1.85,
    },
    financials: {
      purchasePrice: 52500000,
      estimatedValue: 55000000,
      renovationCost: 0,
      arv: 55000000,
      closingCosts: 1050000,
      totalInvestment: 53550000,
      downPayment: 13125000,
      loanAmount: 39375000,
      interestRate: 5.75,
      loanTerm: 10,
      monthlyPayment: 150000,
    },
    source: 'COSTAR',
    sourceUrl: 'https://costar.com/listing/123',
    listingDate: '2025-12-15',
    daysOnMarket: 41,
    contacts: [
      { name: 'Sarah Mitchell', company: 'CBRE', email: 'sarah.mitchell@cbre.com', phone: '512-555-1234', type: 'BROKER' }
    ],
    photos: ['/api/placeholder/800/600', '/api/placeholder/800/600'],
    documents: [],
    virtualTourUrl: null,
    aiAnalysis: {
      score: 85,
      recommendation: 'BUY',
      strengths: ['Strong Austin market fundamentals', 'Recent construction with modern amenities', 'Below replacement cost', 'High occupancy rate'],
      weaknesses: ['Premium pricing', 'Compressed cap rate', 'Rising interest rates impact returns'],
      marketInsights: ['Austin MSA population growth 2.8% YoY', 'Tech sector employment strong', 'Limited new supply in submarket'],
      comparableDeals: ['The Domain - $365k/unit', 'Mueller Apartments - $340k/unit'],
      riskFactors: ['Interest rate sensitivity', 'Economic cycle exposure'],
      investmentHighlights: ['Value-add potential with unit upgrades', 'Strong tenant demand', 'Exit cap rate compression opportunity'],
      generatedAt: '2026-01-20T10:00:00Z',
    },
    dealStage: null,
    isSaved: true,
    notes: null,
    tags: ['Core Plus', 'Austin', 'Multifamily'],
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: '2025-12-15T00:00:00Z',
    updatedAt: '2026-01-20T00:00:00Z',
  },
  {
    id: '2',
    name: 'Downtown Tech Center',
    address: '500 Congress Avenue',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    county: 'Travis',
    latitude: 30.2665,
    longitude: -97.7428,
    type: 'OFFICE',
    subType: 'Class A',
    status: 'ACTIVE',
    units: null,
    sqft: 285000,
    lotSize: 1.8,
    yearBuilt: 2015,
    parkingSpaces: 850,
    stories: 18,
    askingPrice: 125000000,
    metrics: {
      capRate: 5.2,
      noi: 6500000,
      pricePerUnit: null,
      pricePerSqFt: 438,
      occupancy: 88,
      grossIncome: 12000000,
      operatingExpenses: 5500000,
      debtService: null,
      cashOnCash: null,
      irr: null,
      equityMultiple: null,
    },
    financials: {
      purchasePrice: 125000000,
      estimatedValue: 130000000,
      renovationCost: 5000000,
      arv: 145000000,
      closingCosts: 2500000,
      totalInvestment: 132500000,
      downPayment: 37500000,
      loanAmount: 87500000,
      interestRate: 6.0,
      loanTerm: 7,
      monthlyPayment: 525000,
    },
    source: 'JLL',
    sourceUrl: 'https://jll.com/listing/456',
    listingDate: '2025-11-01',
    daysOnMarket: 85,
    contacts: [
      { name: 'Michael Chen', company: 'JLL', email: 'michael.chen@jll.com', phone: '512-555-5678', type: 'BROKER' }
    ],
    photos: ['/api/placeholder/800/600'],
    documents: [],
    virtualTourUrl: null,
    aiAnalysis: {
      score: 72,
      recommendation: 'HOLD',
      strengths: ['Prime downtown location', 'Strong tenant roster', 'Parking ratio above market'],
      weaknesses: ['Office sector headwinds', 'High vacancy compared to pre-pandemic', 'Capital intensive improvements needed'],
      marketInsights: ['Office vacancy 18% in Austin CBD', 'Flight to quality trend', 'Hybrid work impact stabilizing'],
      comparableDeals: ['Frost Tower - $420/sf', '300 Colorado - $390/sf'],
      riskFactors: ['Remote work trends', 'Tenant rollover risk', 'Capital markets volatility'],
      investmentHighlights: ['Below replacement cost', 'Strong sponsorship', 'Amenity-rich building'],
      generatedAt: '2026-01-18T14:00:00Z',
    },
    dealStage: 'INITIAL_REVIEW',
    isSaved: false,
    notes: null,
    tags: ['Value-Add', 'Downtown', 'Office'],
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: '2025-11-01T00:00:00Z',
    updatedAt: '2026-01-18T00:00:00Z',
  },
  {
    id: '3',
    name: 'Industrial Distribution Center',
    address: '8500 E. Highway 290',
    city: 'Austin',
    state: 'TX',
    zipCode: '78724',
    county: 'Travis',
    latitude: 30.2910,
    longitude: -97.6520,
    type: 'INDUSTRIAL',
    subType: 'Distribution',
    status: 'OFF_MARKET',
    units: null,
    sqft: 425000,
    lotSize: 22.5,
    yearBuilt: 2021,
    parkingSpaces: 150,
    stories: 1,
    askingPrice: 68000000,
    metrics: {
      capRate: 5.8,
      noi: 3944000,
      pricePerUnit: null,
      pricePerSqFt: 160,
      occupancy: 100,
      grossIncome: 5100000,
      operatingExpenses: 1156000,
      debtService: null,
      cashOnCash: null,
      irr: null,
      equityMultiple: null,
    },
    financials: {
      purchasePrice: 68000000,
      estimatedValue: 72000000,
      renovationCost: 0,
      arv: 72000000,
      closingCosts: 1360000,
      totalInvestment: 69360000,
      downPayment: 17000000,
      loanAmount: 51000000,
      interestRate: 5.5,
      loanTerm: 10,
      monthlyPayment: 295000,
    },
    source: 'AI_SOURCED',
    sourceUrl: null,
    listingDate: null,
    daysOnMarket: null,
    contacts: [
      { name: 'Robert Williams', company: null, email: 'rwilliams@industrialholdings.com', phone: '512-555-9012', type: 'OWNER' }
    ],
    photos: ['/api/placeholder/800/600'],
    documents: [],
    virtualTourUrl: null,
    aiAnalysis: {
      score: 91,
      recommendation: 'STRONG_BUY',
      strengths: ['Off-market opportunity', 'Triple-net lease structure', 'Credit tenant', 'Modern specs', 'E-commerce tailwinds'],
      weaknesses: ['Single tenant risk', 'Limited value-add opportunities'],
      marketInsights: ['Industrial vacancy sub 3%', 'Rent growth 8% YoY', 'E-commerce driving demand'],
      comparableDeals: ['Amazon DC - $175/sf', 'FedEx Hub - $165/sf'],
      riskFactors: ['Tenant concentration', 'Lease rollover in 7 years'],
      investmentHighlights: ['Institutional quality', 'Below market rent with mark-to-market upside', 'Strategic I-35 corridor location'],
      generatedAt: '2026-01-22T09:00:00Z',
    },
    dealStage: 'UNDERWRITING',
    isSaved: true,
    notes: 'Owner approached directly. 1031 exchange motivated seller.',
    tags: ['Off-Market', 'Triple Net', 'Industrial', 'Hot Deal'],
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: '2026-01-10T00:00:00Z',
    updatedAt: '2026-01-22T00:00:00Z',
  },
];

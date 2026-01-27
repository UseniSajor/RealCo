// Leads & Prospects API Client - CRM for Deal Sourcing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFYING' | 'QUALIFIED' | 'NEGOTIATING' | 'UNDER_CONTRACT' | 'CLOSED' | 'LOST' | 'COLD';
export type LeadScore = 'HOT' | 'WARM' | 'COLD';
export type LeadSource = 'BROKER' | 'LOOPNET' | 'COSTAR' | 'CREXI' | 'DIRECT_MAIL' | 'COLD_CALL' | 'REFERRAL' | 'WEBSITE' | 'AI_SOURCED' | 'NETWORKING' | 'AUCTION' | 'OTHER';
export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'TASK' | 'SITE_VISIT' | 'OFFER_SENT' | 'CONTRACT' | 'STATUS_CHANGE';
export type ContactType = 'OWNER' | 'BROKER' | 'AGENT' | 'ATTORNEY' | 'PROPERTY_MANAGER' | 'OTHER';

export interface LeadContact {
  id: string;
  name: string;
  type: ContactType;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  isPrimary: boolean;
  notes: string | null;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description: string | null;
  outcome: string | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export interface LeadTask {
  id: string;
  leadId: string;
  title: string;
  description: string | null;
  dueDate: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedToId: string | null;
  assignedToName: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface LeadOffer {
  id: string;
  leadId: string;
  amount: number;
  terms: string;
  expirationDate: string;
  status: 'DRAFT' | 'SENT' | 'COUNTERED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
  counterAmount: number | null;
  counterTerms: string | null;
  sentAt: string | null;
  respondedAt: string | null;
  createdAt: string;
}

export interface Lead {
  id: string;

  // Property Info
  propertyId: string | null;
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyType: string;

  // Deal Info
  status: LeadStatus;
  score: LeadScore;
  probability: number; // 0-100
  estimatedValue: number;
  targetPrice: number | null;
  source: LeadSource;
  sourceDetails: string | null;

  // Contacts
  contacts: LeadContact[];
  primaryContact: LeadContact | null;

  // Assignment
  assignedToId: string | null;
  assignedToName: string | null;
  teamIds: string[];

  // Timeline
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  lastContactDate: string | null;
  nextFollowUpDate: string | null;

  // Activity Summary
  totalActivities: number;
  totalNotes: number;
  totalTasks: number;
  openTasks: number;

  // Next Action
  nextAction: string | null;
  nextActionDueDate: string | null;

  // Additional
  tags: string[];
  customFields: Record<string, string | number | boolean>;
  notes: string | null;

  // Pipeline
  pipelineStage: string | null;
  stageEnteredAt: string | null;
  daysInStage: number;

  // Timestamps
  orgId: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadFilters {
  query?: string;
  statuses?: LeadStatus[];
  scores?: LeadScore[];
  sources?: LeadSource[];
  propertyTypes?: string[];
  assignedToId?: string;
  minValue?: number;
  maxValue?: number;
  minProbability?: number;
  maxProbability?: number;
  city?: string;
  state?: string;
  hasOpenTasks?: boolean;
  needsFollowUp?: boolean;
  tags?: string[];
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: 'created_at' | 'updated_at' | 'value_desc' | 'probability_desc' | 'next_follow_up' | 'score';
  limit?: number;
  offset?: number;
}

export interface LeadStats {
  totalLeads: number;
  byStatus: Record<LeadStatus, number>;
  byScore: Record<LeadScore, number>;
  bySource: Record<LeadSource, number>;
  totalPipelineValue: number;
  weightedPipelineValue: number;
  averageProbability: number;
  leadsNeedingFollowUp: number;
  leadsWithOpenTasks: number;
  conversionRate: number;
  averageDaysToClose: number;
}

export interface CreateLeadRequest {
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyType: string;
  propertyId?: string;
  estimatedValue: number;
  targetPrice?: number;
  source: LeadSource;
  sourceDetails?: string;
  contacts?: Omit<LeadContact, 'id'>[];
  assignedToId?: string;
  tags?: string[];
  notes?: string;
}

export interface AILeadScoringRequest {
  leadId?: string;
  propertyData?: {
    address: string;
    type: string;
    estimatedValue: number;
    askingPrice?: number;
  };
  ownerData?: {
    ownershipDuration?: number;
    estimatedEquity?: number;
    ownerAge?: number;
    multipleProperties?: boolean;
  };
  marketData?: {
    daysOnMarket?: number;
    priceReductions?: number;
    marketTrend?: 'UP' | 'STABLE' | 'DOWN';
  };
}

export interface AILeadScoringResponse {
  score: LeadScore;
  probability: number;
  reasoning: string[];
  suggestedActions: string[];
  bestContactMethod: 'CALL' | 'EMAIL' | 'DIRECT_MAIL' | 'TEXT';
  bestContactTime: string;
  talkingPoints: string[];
  objectionHandlers: Record<string, string>;
}

export interface CampaignSequence {
  id: string;
  name: string;
  description: string;
  steps: {
    day: number;
    type: 'EMAIL' | 'CALL' | 'SMS' | 'DIRECT_MAIL';
    template: string;
    subject?: string;
  }[];
  isActive: boolean;
}

class LeadsAPI {
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

  // === Lead CRUD ===

  async getLeads(filters?: LeadFilters): Promise<{ items: Lead[]; total: number; hasMore: boolean }> {
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
    return this.request(`/leads${query}`);
  }

  async getLead(id: string): Promise<Lead> {
    return this.request(`/leads/${id}`);
  }

  async createLead(data: CreateLeadRequest): Promise<Lead> {
    return this.request('/leads', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: Partial<Lead>): Promise<Lead> {
    return this.request(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string): Promise<void> {
    return this.request(`/leads/${id}`, { method: 'DELETE' });
  }

  // === Lead Status & Assignment ===

  async updateStatus(id: string, status: LeadStatus, notes?: string): Promise<Lead> {
    return this.request(`/leads/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  }

  async assignLead(id: string, assignedToId: string): Promise<Lead> {
    return this.request(`/leads/${id}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assignedToId }),
    });
  }

  async bulkAssign(leadIds: string[], assignedToId: string): Promise<{ updated: number }> {
    return this.request('/leads/bulk-assign', {
      method: 'POST',
      body: JSON.stringify({ leadIds, assignedToId }),
    });
  }

  // === Contacts ===

  async addContact(leadId: string, contact: Omit<LeadContact, 'id'>): Promise<Lead> {
    return this.request(`/leads/${leadId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  async updateContact(leadId: string, contactId: string, data: Partial<LeadContact>): Promise<Lead> {
    return this.request(`/leads/${leadId}/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async removeContact(leadId: string, contactId: string): Promise<Lead> {
    return this.request(`/leads/${leadId}/contacts/${contactId}`, { method: 'DELETE' });
  }

  // === Activities ===

  async getActivities(leadId: string, limit?: number): Promise<{ items: LeadActivity[] }> {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/leads/${leadId}/activities${query}`);
  }

  async logActivity(leadId: string, activity: {
    type: ActivityType;
    title: string;
    description?: string;
    outcome?: string;
    scheduledAt?: string;
    completedAt?: string;
  }): Promise<LeadActivity> {
    return this.request(`/leads/${leadId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  }

  // === Tasks ===

  async getTasks(leadId: string): Promise<{ items: LeadTask[] }> {
    return this.request(`/leads/${leadId}/tasks`);
  }

  async createTask(leadId: string, task: {
    title: string;
    description?: string;
    dueDate: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    assignedToId?: string;
  }): Promise<LeadTask> {
    return this.request(`/leads/${leadId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async completeTask(leadId: string, taskId: string): Promise<LeadTask> {
    return this.request(`/leads/${leadId}/tasks/${taskId}/complete`, { method: 'POST' });
  }

  // === Offers ===

  async getOffers(leadId: string): Promise<{ items: LeadOffer[] }> {
    return this.request(`/leads/${leadId}/offers`);
  }

  async createOffer(leadId: string, offer: {
    amount: number;
    terms: string;
    expirationDate: string;
  }): Promise<LeadOffer> {
    return this.request(`/leads/${leadId}/offers`, {
      method: 'POST',
      body: JSON.stringify(offer),
    });
  }

  async sendOffer(leadId: string, offerId: string): Promise<LeadOffer> {
    return this.request(`/leads/${leadId}/offers/${offerId}/send`, { method: 'POST' });
  }

  // === Pipeline ===

  async moveToPipeline(leadId: string, stage?: string): Promise<Lead> {
    return this.request(`/leads/${leadId}/to-pipeline`, {
      method: 'POST',
      body: JSON.stringify({ stage }),
    });
  }

  async convertToProperty(leadId: string): Promise<{ propertyId: string; lead: Lead }> {
    return this.request(`/leads/${leadId}/convert`, { method: 'POST' });
  }

  // === Stats & Analytics ===

  async getStats(filters?: Partial<LeadFilters>): Promise<LeadStats> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/leads/stats${query}`);
  }

  // === AI Features ===

  async getAIScoring(request: AILeadScoringRequest): Promise<AILeadScoringResponse> {
    return this.request('/leads/ai-scoring', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getAISuggestedLeads(criteria?: {
    propertyTypes?: string[];
    markets?: string[];
    minValue?: number;
    maxValue?: number;
  }): Promise<{ items: Lead[]; reasoning: string[] }> {
    return this.request('/leads/ai-suggestions', {
      method: 'POST',
      body: JSON.stringify(criteria || {}),
    });
  }

  async generateOutreachScript(leadId: string, method: 'CALL' | 'EMAIL' | 'TEXT'): Promise<{
    script: string;
    subject?: string;
    talkingPoints: string[];
    objectionHandlers: Record<string, string>;
  }> {
    return this.request(`/leads/${leadId}/ai-outreach`, {
      method: 'POST',
      body: JSON.stringify({ method }),
    });
  }

  // === Campaigns ===

  async enrollInCampaign(leadId: string, campaignId: string): Promise<Lead> {
    return this.request(`/leads/${leadId}/campaigns/${campaignId}/enroll`, { method: 'POST' });
  }

  async getCampaigns(): Promise<{ items: CampaignSequence[] }> {
    return this.request('/leads/campaigns');
  }

  // === Bulk Operations ===

  async bulkImport(leads: CreateLeadRequest[]): Promise<{ imported: number; errors: string[] }> {
    return this.request('/leads/bulk-import', {
      method: 'POST',
      body: JSON.stringify({ leads }),
    });
  }

  async exportLeads(filters?: LeadFilters, format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
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
    const response = await fetch(`${API_BASE_URL}/leads/export?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });
    return response.blob();
  }

  // === Tags ===

  async addTags(leadId: string, tags: string[]): Promise<Lead> {
    return this.request(`/leads/${leadId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tags }),
    });
  }

  async removeTags(leadId: string, tags: string[]): Promise<Lead> {
    return this.request(`/leads/${leadId}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tags }),
    });
  }
}

export const leadsAPI = new LeadsAPI();

// === Mock Data for Development ===
export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    propertyId: null,
    propertyName: 'Lakeside Apartments',
    propertyAddress: '1200 Lake Austin Blvd',
    propertyCity: 'Austin',
    propertyState: 'TX',
    propertyZip: '78703',
    propertyType: 'Multifamily',
    status: 'QUALIFIED',
    score: 'HOT',
    probability: 75,
    estimatedValue: 28500000,
    targetPrice: 27000000,
    source: 'BROKER',
    sourceDetails: 'Marcus & Millichap - John Smith',
    contacts: [
      { id: 'c1', name: 'John Smith', type: 'BROKER', company: 'Marcus & Millichap', title: 'Senior Associate', email: 'jsmith@mm.com', phone: '512-555-0101', isPrimary: true, notes: null },
      { id: 'c2', name: 'Sarah Owner', type: 'OWNER', company: 'Lakeside Holdings LLC', title: 'Managing Member', email: 'sarah@lakeside.com', phone: '512-555-0102', isPrimary: false, notes: 'Prefers email communication' }
    ],
    primaryContact: { id: 'c1', name: 'John Smith', type: 'BROKER', company: 'Marcus & Millichap', title: 'Senior Associate', email: 'jsmith@mm.com', phone: '512-555-0101', isPrimary: true, notes: null },
    assignedToId: 'user-1',
    assignedToName: 'Alex Johnson',
    teamIds: [],
    expectedCloseDate: '2026-03-15',
    actualCloseDate: null,
    lastContactDate: '2026-01-22',
    nextFollowUpDate: '2026-01-28',
    totalActivities: 12,
    totalNotes: 5,
    totalTasks: 3,
    openTasks: 1,
    nextAction: 'Send updated LOI with revised terms',
    nextActionDueDate: '2026-01-28',
    tags: ['High Priority', 'Value-Add', 'Off-Market'],
    customFields: {},
    notes: 'Owner motivated by 1031 exchange deadline. Quality asset with deferred maintenance.',
    pipelineStage: 'NEGOTIATING',
    stageEnteredAt: '2026-01-15',
    daysInStage: 10,
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: '2025-12-01',
    updatedAt: '2026-01-22',
  },
  {
    id: 'lead-2',
    propertyId: null,
    propertyName: 'Downtown Office Tower',
    propertyAddress: '100 Congress Ave',
    propertyCity: 'Austin',
    propertyState: 'TX',
    propertyZip: '78701',
    propertyType: 'Office',
    status: 'QUALIFYING',
    score: 'WARM',
    probability: 45,
    estimatedValue: 85000000,
    targetPrice: 78000000,
    source: 'COSTAR',
    sourceDetails: 'Found via CoStar market alerts',
    contacts: [
      { id: 'c3', name: 'Mike Broker', type: 'BROKER', company: 'CBRE', title: 'Vice Chairman', email: 'mike.broker@cbre.com', phone: '512-555-0201', isPrimary: true, notes: null }
    ],
    primaryContact: { id: 'c3', name: 'Mike Broker', type: 'BROKER', company: 'CBRE', title: 'Vice Chairman', email: 'mike.broker@cbre.com', phone: '512-555-0201', isPrimary: true, notes: null },
    assignedToId: 'user-2',
    assignedToName: 'Maria Garcia',
    teamIds: [],
    expectedCloseDate: '2026-06-30',
    actualCloseDate: null,
    lastContactDate: '2026-01-18',
    nextFollowUpDate: '2026-01-30',
    totalActivities: 5,
    totalNotes: 2,
    totalTasks: 2,
    openTasks: 2,
    nextAction: 'Schedule property tour with broker',
    nextActionDueDate: '2026-01-30',
    tags: ['Large Deal', 'Office'],
    customFields: {},
    notes: 'Major tenant rolling in 18 months. Potential value-add with re-tenanting strategy.',
    pipelineStage: 'INITIAL_REVIEW',
    stageEnteredAt: '2026-01-10',
    daysInStage: 15,
    orgId: 'org-1',
    createdById: 'user-2',
    createdAt: '2026-01-05',
    updatedAt: '2026-01-18',
  },
  {
    id: 'lead-3',
    propertyId: null,
    propertyName: 'Industrial Warehouse Complex',
    propertyAddress: '5000 E. Ben White Blvd',
    propertyCity: 'Austin',
    propertyState: 'TX',
    propertyZip: '78741',
    propertyType: 'Industrial',
    status: 'CONTACTED',
    score: 'HOT',
    probability: 60,
    estimatedValue: 42000000,
    targetPrice: 40000000,
    source: 'AI_SOURCED',
    sourceDetails: 'AI identified off-market opportunity via ownership analysis',
    contacts: [
      { id: 'c4', name: 'Robert Williams', type: 'OWNER', company: 'Industrial Holdings LLC', title: 'Owner', email: 'rwilliams@indhold.com', phone: '512-555-0301', isPrimary: true, notes: 'Direct owner contact - no broker' }
    ],
    primaryContact: { id: 'c4', name: 'Robert Williams', type: 'OWNER', company: 'Industrial Holdings LLC', title: 'Owner', email: 'rwilliams@indhold.com', phone: '512-555-0301', isPrimary: true, notes: 'Direct owner contact - no broker' },
    assignedToId: 'user-1',
    assignedToName: 'Alex Johnson',
    teamIds: [],
    expectedCloseDate: '2026-04-30',
    actualCloseDate: null,
    lastContactDate: '2026-01-20',
    nextFollowUpDate: '2026-01-25',
    totalActivities: 3,
    totalNotes: 1,
    totalTasks: 1,
    openTasks: 1,
    nextAction: 'Follow up on interest call',
    nextActionDueDate: '2026-01-25',
    tags: ['Off-Market', 'Industrial', 'AI Sourced', 'Hot Deal'],
    customFields: {},
    notes: 'Owner expressed initial interest. 15-year hold, may be ready to sell.',
    pipelineStage: 'SOURCING',
    stageEnteredAt: '2026-01-18',
    daysInStage: 7,
    orgId: 'org-1',
    createdById: 'user-1',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-20',
  },
];

export const MOCK_LEAD_STATS: LeadStats = {
  totalLeads: 24,
  byStatus: {
    NEW: 5,
    CONTACTED: 6,
    QUALIFYING: 4,
    QUALIFIED: 3,
    NEGOTIATING: 2,
    UNDER_CONTRACT: 1,
    CLOSED: 2,
    LOST: 1,
    COLD: 0,
  },
  byScore: {
    HOT: 6,
    WARM: 10,
    COLD: 8,
  },
  bySource: {
    BROKER: 8,
    LOOPNET: 4,
    COSTAR: 3,
    CREXI: 2,
    DIRECT_MAIL: 2,
    COLD_CALL: 1,
    REFERRAL: 2,
    WEBSITE: 1,
    AI_SOURCED: 1,
    NETWORKING: 0,
    AUCTION: 0,
    OTHER: 0,
  },
  totalPipelineValue: 385000000,
  weightedPipelineValue: 168500000,
  averageProbability: 48,
  leadsNeedingFollowUp: 8,
  leadsWithOpenTasks: 12,
  conversionRate: 18.5,
  averageDaysToClose: 67,
};

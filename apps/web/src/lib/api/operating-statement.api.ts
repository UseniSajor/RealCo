// Operating Statement API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface OperatingStatement {
  id: string;
  projectId: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  rentalIncome: number;
  otherIncome: number;
  vacancyLoss: number;
  effectiveGrossIncome: number;
  propertyManagement: number;
  utilities: number;
  insurance: number;
  propertyTaxes: number;
  repairsMaintenance: number;
  marketing: number;
  administrative: number;
  totalOpex: number;
  noi: number;
  budgetedNOI: number;
  noiVariance: number;
  noiVariancePct: number;
  createdAt: string;
  updatedAt: string;
  project?: {
    id: string;
    projectCode: string;
    developmentProject: { name: string; address: string | null };
  };
}

class OperatingStatementAPI {
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

  // Get all operating statements for org (optionally filter by project)
  async getAll(params?: { projectId?: string }): Promise<{ items: OperatingStatement[] }> {
    const query = params?.projectId ? `?projectId=${params.projectId}` : '';
    return this.request(`/operating-statements${query}`);
  }

  // Get all operating statements for a single project
  async getForProject(projectId: string): Promise<{ items: OperatingStatement[] }> {
    return this.request(`/projects/${projectId}/operating-statements`);
  }
}

export const operatingStatementAPI = new OperatingStatementAPI();

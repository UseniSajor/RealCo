// Construction API Client - OS-PM Module
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export type ProjectPhase =
  | 'PRE_CONSTRUCTION'
  | 'FOUNDATION'
  | 'FRAMING'
  | 'MEP_ROUGH_IN'
  | 'ENCLOSURE'
  | 'INTERIOR_FINISH'
  | 'CLOSEOUT'
  | 'COMPLETED';

export type TaskStatus =
  | 'NOT_STARTED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETED'
  | 'CANCELLED';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type WeatherCondition =
  | 'CLEAR'
  | 'CLOUDY'
  | 'RAIN'
  | 'SNOW'
  | 'WIND'
  | 'EXTREME_HEAT'
  | 'EXTREME_COLD'
  | 'OTHER';

export type RfiStatus = 'OPEN' | 'PENDING_RESPONSE' | 'ANSWERED' | 'CLOSED';

export type SubmittalStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISED';

export type InspectionStatus =
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'PASSED'
  | 'FAILED'
  | 'DEFERRED'
  | 'CANCELLED';

// =============================================================================
// INTERFACES
// =============================================================================

export interface ConstructionProject {
  id: string;
  projectCode: string;
  developmentProjectId: string;
  phase: ProjectPhase;
  percentComplete: number;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  totalBudget: number | null;
  spentToDate: number;
  scheduleVarianceDays: number | null;
  costVariance: number | null;
  createdAt: string;
  updatedAt: string;
  developmentProject?: {
    id: string;
    name: string;
    address: string | null;
    projectType: string | null;
    offering?: {
      id: string;
      name: string;
    };
  };
  tasks?: Task[];
  milestones?: Milestone[];
  dailyLogs?: DailyLog[];
  _count?: {
    tasks: number;
    dailyLogs: number;
    rfis: number;
    submittals?: number;
    inspections?: number;
    safetyIncidents?: number;
  };
}

export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  percentComplete: number;
  plannedStartDate: string | null;
  plannedEndDate: string | null;
  actualStartDate: string | null;
  actualEndDate: string | null;
  durationDays: number | null;
  predecessorTaskIds: string[];
  lagDays: number;
  isCriticalPath: boolean;
  budgetAmount: number | null;
  actualCost: number | null;
  assignedToId: string | null;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    email: string;
  };
  parent?: {
    id: string;
    title: string;
  };
  children?: {
    id: string;
    title: string;
    status: TaskStatus;
  }[];
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  targetDate: string | null;
  completedDate: string | null;
  relatedTaskIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyLog {
  id: string;
  projectId: string;
  logDate: string;
  weather: WeatherCondition | null;
  temperature: number | null;
  laborCount: any | null; // JSON object: { trade: string; count: number }[]
  equipmentUsed: string[];
  materialsDelivered: string | null;
  workCompleted: string | null;
  issuesDelays: string | null;
  visitorLog: string | null;
  safetyObservations: string | null;
  createdById: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    email: string;
  };
}

export interface RFI {
  id: string;
  projectId: string;
  rfiNumber: string;
  subject: string;
  description: string;
  status: RfiStatus;
  response: string | null;
  respondedById: string | null;
  respondedAt: string | null;
  dueDate: string | null;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
  respondedBy?: {
    id: string;
    email: string;
  };
}

export interface Submittal {
  id: string;
  projectId: string;
  submittalNumber: string;
  name: string;
  description: string | null;
  specSection: string | null;
  status: SubmittalStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewerNotes: string | null;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Inspection {
  id: string;
  projectId: string;
  inspectionType: string;
  scheduledDate: string | null;
  completedDate: string | null;
  status: InspectionStatus;
  result: string | null; // 'PASSED' | 'FAILED' | 'DEFERRED'
  notes: string | null;
  leadInspectorId: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
  leadInspector?: {
    id: string;
    email: string;
  };
}

export interface SafetyIncident {
  id: string;
  projectId: string;
  incidentType: string;
  description: string;
  incidentDate: string;
  location: string | null;
  oshaReportable: boolean;
  correctiveActions: string | null;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}

// =============================================================================
// MOCK DATA FOR DEMO/DEVELOPMENT
// =============================================================================

export const MOCK_CONSTRUCTION_PROJECTS: ConstructionProject[] = [
  {
    id: 'proj_001',
    projectCode: 'SUNSET-2024',
    developmentProjectId: 'dev_001',
    phase: 'FRAMING',
    percentComplete: 45,
    plannedStartDate: '2024-01-15',
    plannedEndDate: '2025-06-30',
    actualStartDate: '2024-01-20',
    actualEndDate: null,
    totalBudget: 12500000,
    spentToDate: 5625000,
    scheduleVarianceDays: 5,
    costVariance: -125000,
    createdAt: '2024-01-10',
    updatedAt: new Date().toISOString(),
    developmentProject: {
      id: 'dev_001',
      name: 'Sunset Luxury Apartments',
      address: '1234 Sunset Blvd, Austin, TX 78701',
      projectType: 'MULTIFAMILY',
      offering: {
        id: 'off_001',
        name: 'Sunset Apartments Fund I'
      }
    },
    _count: {
      tasks: 24,
      dailyLogs: 89,
      rfis: 12,
      submittals: 18,
      inspections: 8,
      safetyIncidents: 1
    }
  },
  {
    id: 'proj_002',
    projectCode: 'HARBOR-2024',
    developmentProjectId: 'dev_002',
    phase: 'MEP_ROUGH_IN',
    percentComplete: 62,
    plannedStartDate: '2023-09-01',
    plannedEndDate: '2025-03-31',
    actualStartDate: '2023-09-05',
    actualEndDate: null,
    totalBudget: 28000000,
    spentToDate: 17360000,
    scheduleVarianceDays: -3,
    costVariance: 280000,
    createdAt: '2023-08-15',
    updatedAt: new Date().toISOString(),
    developmentProject: {
      id: 'dev_002',
      name: 'Harbor View Office Tower',
      address: '5678 Harbor Dr, San Diego, CA 92101',
      projectType: 'COMMERCIAL',
      offering: {
        id: 'off_002',
        name: 'Harbor Office Development'
      }
    },
    _count: {
      tasks: 42,
      dailyLogs: 156,
      rfis: 28,
      submittals: 35,
      inspections: 15,
      safetyIncidents: 0
    }
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'task_001',
    projectId: 'proj_001',
    parentId: null,
    title: 'Foundation Work',
    description: 'Complete foundation pour and curing',
    status: 'COMPLETED',
    priority: 'HIGH',
    percentComplete: 100,
    plannedStartDate: '2024-01-20',
    plannedEndDate: '2024-03-01',
    actualStartDate: '2024-01-20',
    actualEndDate: '2024-02-28',
    durationDays: 39,
    predecessorTaskIds: [],
    lagDays: 0,
    isCriticalPath: true,
    budgetAmount: 850000,
    actualCost: 825000,
    assignedToId: 'user_001',
    attachmentUrls: [],
    createdAt: '2024-01-15',
    updatedAt: '2024-02-28',
  },
  {
    id: 'task_002',
    projectId: 'proj_001',
    parentId: null,
    title: 'Structural Framing',
    description: 'Erect structural steel and wood framing',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    percentComplete: 65,
    plannedStartDate: '2024-03-01',
    plannedEndDate: '2024-05-15',
    actualStartDate: '2024-03-05',
    actualEndDate: null,
    durationDays: 75,
    predecessorTaskIds: ['task_001'],
    lagDays: 0,
    isCriticalPath: true,
    budgetAmount: 1250000,
    actualCost: 812500,
    assignedToId: 'user_002',
    attachmentUrls: [],
    createdAt: '2024-02-15',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task_003',
    projectId: 'proj_001',
    parentId: null,
    title: 'Electrical Rough-In',
    description: 'Install electrical conduit and wiring',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    percentComplete: 0,
    plannedStartDate: '2024-04-15',
    plannedEndDate: '2024-06-30',
    actualStartDate: null,
    actualEndDate: null,
    durationDays: 76,
    predecessorTaskIds: ['task_002'],
    lagDays: 5,
    isCriticalPath: false,
    budgetAmount: 450000,
    actualCost: 0,
    assignedToId: 'user_003',
    attachmentUrls: [],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
  {
    id: 'task_004',
    projectId: 'proj_001',
    parentId: null,
    title: 'Plumbing Rough-In',
    description: 'Install plumbing pipes and fixtures',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    percentComplete: 0,
    plannedStartDate: '2024-04-20',
    plannedEndDate: '2024-07-05',
    actualStartDate: null,
    actualEndDate: null,
    durationDays: 76,
    predecessorTaskIds: ['task_002'],
    lagDays: 10,
    isCriticalPath: false,
    budgetAmount: 380000,
    actualCost: 0,
    assignedToId: 'user_004',
    attachmentUrls: [],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  },
  {
    id: 'task_005',
    projectId: 'proj_001',
    parentId: null,
    title: 'HVAC Installation',
    description: 'Install HVAC ductwork and units',
    status: 'NOT_STARTED',
    priority: 'HIGH',
    percentComplete: 0,
    plannedStartDate: '2024-05-01',
    plannedEndDate: '2024-08-15',
    actualStartDate: null,
    actualEndDate: null,
    durationDays: 106,
    predecessorTaskIds: ['task_002'],
    lagDays: 15,
    isCriticalPath: true,
    budgetAmount: 620000,
    actualCost: 0,
    assignedToId: 'user_005',
    attachmentUrls: [],
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
  }
];

// =============================================================================
// API CLASS
// =============================================================================

class ConstructionAPI {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('realco_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
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
      const error = await response.json().catch(() => ({
        error: { message: response.statusText },
      }));
      throw new Error(error.error?.message || error.message || `API Error: ${response.status}`);
    }

    return response.json();
  }

  // =============================================================================
  // CONSTRUCTION PROJECTS
  // =============================================================================

  async getProjects(): Promise<{ projects: ConstructionProject[] }> {
    try {
      return await this.request<{ projects: ConstructionProject[] }>('/construction/projects');
    } catch {
      // Return mock data for demo/development
      return { projects: MOCK_CONSTRUCTION_PROJECTS };
    }
  }

  async getProject(projectId: string): Promise<{ project: ConstructionProject }> {
    return this.request<{ project: ConstructionProject }>(`/construction/projects/${projectId}`);
  }

  async createProject(data: {
    developmentProjectId: string;
    plannedStartDate?: string;
    plannedEndDate?: string;
    totalBudget?: number;
  }): Promise<{ project: ConstructionProject }> {
    return this.request<{ project: ConstructionProject }>('/construction/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(
    projectId: string,
    data: {
      phase?: ProjectPhase;
      percentComplete?: number;
      plannedStartDate?: string;
      plannedEndDate?: string;
      actualStartDate?: string;
      actualEndDate?: string;
      totalBudget?: number;
      spentToDate?: number;
    }
  ): Promise<{ project: ConstructionProject }> {
    return this.request<{ project: ConstructionProject }>(`/construction/projects/${projectId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // TASKS
  // =============================================================================

  async getTasks(projectId: string): Promise<{ tasks: Task[] }> {
    try {
      return await this.request<{ tasks: Task[] }>(`/construction/projects/${projectId}/tasks`);
    } catch {
      // Return mock tasks for the project
      return { tasks: MOCK_TASKS.filter(t => t.projectId === projectId) };
    }
  }

  async createTask(
    projectId: string,
    data: {
      title: string;
      description?: string;
      parentId?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      plannedStartDate?: string;
      plannedEndDate?: string;
      durationDays?: number;
      predecessorTaskIds?: string[];
      budgetAmount?: number;
      assignedToId?: string;
    }
  ): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/construction/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(
    taskId: string,
    data: {
      title?: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      percentComplete?: number;
      plannedStartDate?: string;
      plannedEndDate?: string;
      actualStartDate?: string;
      actualEndDate?: string;
      budgetAmount?: number;
      actualCost?: number;
      assignedToId?: string;
    }
  ): Promise<{ task: Task }> {
    return this.request<{ task: Task }>(`/construction/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // DAILY LOGS
  // =============================================================================

  async getDailyLogs(projectId: string): Promise<{ dailyLogs: DailyLog[] }> {
    return this.request<{ dailyLogs: DailyLog[] }>(`/construction/projects/${projectId}/daily-logs`);
  }

  async createDailyLog(
    projectId: string,
    data: {
      logDate: string;
      weather?: WeatherCondition;
      temperature?: number;
      laborCount?: any;
      equipmentUsed?: string[];
      materialsDelivered?: string;
      workCompleted?: string;
      issuesDelays?: string;
      visitorLog?: string;
      safetyObservations?: string;
      photoUrls?: string[];
    }
  ): Promise<{ dailyLog: DailyLog }> {
    return this.request<{ dailyLog: DailyLog }>(`/construction/projects/${projectId}/daily-logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // RFIs
  // =============================================================================

  async getRFIs(projectId: string): Promise<{ rfis: RFI[] }> {
    return this.request<{ rfis: RFI[] }>(`/construction/projects/${projectId}/rfis`);
  }

  async createRFI(
    projectId: string,
    data: {
      subject: string;
      description: string;
      dueDate?: string;
      attachmentUrls?: string[];
    }
  ): Promise<{ rfi: RFI }> {
    return this.request<{ rfi: RFI }>(`/construction/projects/${projectId}/rfis`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRFI(
    rfiId: string,
    data: {
      status?: RfiStatus;
      response?: string;
    }
  ): Promise<{ rfi: RFI }> {
    return this.request<{ rfi: RFI }>(`/construction/rfis/${rfiId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // SUBMITTALS
  // =============================================================================

  async getSubmittals(projectId: string): Promise<{ submittals: Submittal[] }> {
    return this.request<{ submittals: Submittal[] }>(`/construction/projects/${projectId}/submittals`);
  }

  async createSubmittal(
    projectId: string,
    data: {
      name: string;
      description?: string;
      specSection?: string;
      attachmentUrls?: string[];
    }
  ): Promise<{ submittal: Submittal }> {
    return this.request<{ submittal: Submittal }>(`/construction/projects/${projectId}/submittals`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSubmittal(
    submittalId: string,
    data: {
      status?: SubmittalStatus;
      reviewerNotes?: string;
    }
  ): Promise<{ submittal: Submittal }> {
    return this.request<{ submittal: Submittal }>(`/construction/submittals/${submittalId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // INSPECTIONS
  // =============================================================================

  async getInspections(projectId: string): Promise<{ inspections: Inspection[] }> {
    return this.request<{ inspections: Inspection[] }>(`/construction/projects/${projectId}/inspections`);
  }

  async createInspection(
    projectId: string,
    data: {
      inspectionType: string;
      scheduledDate: string;
      leadInspectorId?: string;
    }
  ): Promise<{ inspection: Inspection }> {
    return this.request<{ inspection: Inspection }>(`/construction/projects/${projectId}/inspections`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInspection(
    inspectionId: string,
    data: {
      status?: InspectionStatus;
      result?: 'PASSED' | 'FAILED' | 'DEFERRED';
      notes?: string;
      photoUrls?: string[];
      completedDate?: string;
    }
  ): Promise<{ inspection: Inspection }> {
    return this.request<{ inspection: Inspection }>(`/construction/inspections/${inspectionId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // =============================================================================
  // SAFETY INCIDENTS
  // =============================================================================

  async getSafetyIncidents(projectId: string): Promise<{ safetyIncidents: SafetyIncident[] }> {
    return this.request<{ safetyIncidents: SafetyIncident[] }>(
      `/construction/projects/${projectId}/safety-incidents`
    );
  }

  async createSafetyIncident(
    projectId: string,
    data: {
      incidentType: string;
      description: string;
      incidentDate: string;
      location?: string;
      oshaReportable?: boolean;
      correctiveActions?: string;
      photoUrls?: string[];
    }
  ): Promise<{ safetyIncident: SafetyIncident }> {
    return this.request<{ safetyIncident: SafetyIncident }>(
      `/construction/projects/${projectId}/safety-incidents`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }
}

export const constructionAPI = new ConstructionAPI();

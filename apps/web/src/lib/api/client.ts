/**
 * RealCo API Client
 * Connects frontend to backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/v1'

interface ApiError {
  code: string
  message: string
  details?: unknown
}

interface ApiResponse<T> {
  data?: T
  error?: ApiError
}

class ApiClient {
  private token: string | null = null

  constructor() {
    // Load token from localStorage on init (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('realco_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('realco_token', token)
      } else {
        localStorage.removeItem('realco_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          error: data.error || {
            code: 'API_ERROR',
            message: data.message || 'Request failed',
          },
        }
      }

      return { data }
    } catch (error) {
      return {
        error: {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network request failed',
        },
      }
    }
  }

  // ========== Authentication ==========

  async login(email: string, password: string): Promise<ApiResponse<{ token: string }>> {
    const result = await this.request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (result.data?.token) {
      this.setToken(result.data.token)
    }

    return result
  }

  async devLogin(): Promise<ApiResponse<{ token: string }>> {
    const result = await this.request<{ token: string }>('/auth/dev-login', {
      method: 'POST',
    })

    if (result.data?.token) {
      this.setToken(result.data.token)
    }

    return result
  }

  async register(data: {
    email: string
    password: string
    name: string
    organizationName?: string
  }): Promise<ApiResponse<{ id: string; token: string }>> {
    const result = await this.request<{ id: string; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (result.data?.token) {
      this.setToken(result.data.token)
    }

    return result
  }

  logout() {
    this.setToken(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('realco_user')
    }
  }

  // ========== Offerings (Deals) ==========

  async getOfferings(): Promise<ApiResponse<{ items: Offering[] }>> {
    return this.request('/offerings')
  }

  async createOffering(data: {
    name: string
    regulation_mode?: '506b' | '506c' | 'internal'
  }): Promise<ApiResponse<{ id: string }>> {
    return this.request('/offerings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ========== Development Projects ==========

  async getDevelopmentProjects(): Promise<ApiResponse<{ items: DevelopmentProject[] }>> {
    return this.request('/development-projects')
  }

  async createDevelopmentProject(data: {
    name: string
    address?: string
    projectType?: 'NEW_CONSTRUCTION' | 'RENOVATION' | 'MULTI_FAMILY' | 'COMMERCIAL'
    offeringId?: string
  }): Promise<ApiResponse<{ id: string }>> {
    return this.request('/development-projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // ========== Construction Projects ==========

  async getProjects(): Promise<ApiResponse<{ items: Project[] }>> {
    return this.request('/projects')
  }

  async getProject(id: string): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}`)
  }

  async createProject(data: {
    developmentProjectId: string
    plannedStartDate: Date
    plannedEndDate: Date
    totalBudget?: number
    phase?: ProjectPhase
  }): Promise<ApiResponse<Project>> {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProjectProgress(id: string, percentComplete: number): Promise<ApiResponse<Project>> {
    return this.request(`/projects/${id}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ percentComplete }),
    })
  }

  async getProjectMetrics(id: string): Promise<ApiResponse<ProjectMetrics>> {
    return this.request(`/projects/${id}/metrics`)
  }

  // ========== Tasks ==========

  async getTasks(projectId: string, filters?: TaskFilters): Promise<ApiResponse<{ items: Task[] }>> {
    const params = new URLSearchParams()
    if (filters?.status) params.set('status', filters.status)
    if (filters?.priority) params.set('priority', filters.priority)
    if (filters?.assignedToId) params.set('assignedToId', filters.assignedToId)
    if (filters?.rootOnly) params.set('rootOnly', 'true')

    const query = params.toString()
    return this.request(`/projects/${projectId}/tasks${query ? `?${query}` : ''}`)
  }

  async createTask(projectId: string, data: CreateTaskData): Promise<ApiResponse<Task>> {
    return this.request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTask(taskId: string, data: UpdateTaskData): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async updateTaskProgress(taskId: string, percentComplete: number): Promise<ApiResponse<Task>> {
    return this.request(`/tasks/${taskId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ percentComplete }),
    })
  }

  // ========== Daily Logs ==========

  async getDailyLogs(projectId: string, dateRange?: { startDate: Date; endDate: Date }): Promise<ApiResponse<{ items: DailyLog[] }>> {
    const params = new URLSearchParams()
    if (dateRange) {
      params.set('startDate', dateRange.startDate.toISOString())
      params.set('endDate', dateRange.endDate.toISOString())
    }

    const query = params.toString()
    return this.request(`/projects/${projectId}/daily-logs${query ? `?${query}` : ''}`)
  }

  async createDailyLog(projectId: string, data: CreateDailyLogData): Promise<ApiResponse<DailyLog>> {
    return this.request(`/projects/${projectId}/daily-logs`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getProgressPhotos(projectId: string): Promise<ApiResponse<{ items: ProgressPhoto[] }>> {
    return this.request(`/projects/${projectId}/progress-photos`)
  }

  // ========== Operating Statements ==========

  async getOperatingStatements(projectId?: string): Promise<ApiResponse<{ items: OperatingStatement[] }>> {
    const params = projectId ? `?projectId=${projectId}` : ''
    return this.request(`/operating-statements${params}`)
  }

  // ========== Health Check ==========

  async healthCheck(): Promise<ApiResponse<{ ok: boolean; name: string }>> {
    return this.request('/health')
  }
}

// Singleton instance
export const apiClient = new ApiClient()

// ========== Types ==========

export interface Offering {
  id: string
  name: string
  status: string
  regulationMode: string
  createdAt: string
  updatedAt: string
}

export interface DevelopmentProject {
  id: string
  name: string
  address: string | null
  projectType: string | null
  offeringId: string | null
  createdAt: string
  updatedAt: string
}

export type ProjectPhase =
  | 'PRE_CONSTRUCTION'
  | 'FOUNDATION'
  | 'FRAMING'
  | 'MEP_ROUGH_IN'
  | 'ENCLOSURE'
  | 'INTERIOR_FINISH'
  | 'CLOSEOUT'
  | 'COMPLETED'

export interface Project {
  id: string
  developmentProjectId: string
  projectCode: string
  percentComplete: number
  phase: ProjectPhase
  totalBudget: number | null
  plannedStartDate: string
  plannedEndDate: string
  actualStartDate: string | null
  actualEndDate: string | null
  developmentProject?: {
    name: string
    address: string | null
  }
  _count?: {
    tasks?: number
    dailyLogs?: number
    submittals?: number
    rfis?: number
    inspections?: number
  }
  createdAt: string
  updatedAt: string
}

export interface ProjectMetrics {
  percentComplete: number
  budgetUtilization: number
  scheduleVariance: number
  taskCompletion: {
    total: number
    completed: number
    inProgress: number
    notStarted: number
  }
}

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Task {
  id: string
  projectId: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority
  percentComplete: number
  plannedStartDate: string | null
  plannedEndDate: string | null
  actualStartDate: string | null
  actualEndDate: string | null
  durationDays: number | null
  parentId: string | null
  assignedToId: string | null
  budgetAmount: number | null
  actualCost: number | null
  createdAt: string
  updatedAt: string
}

export interface TaskFilters {
  status?: TaskStatus
  priority?: TaskPriority
  assignedToId?: string
  rootOnly?: boolean
}

export interface CreateTaskData {
  title: string
  description?: string
  priority?: TaskPriority
  plannedStartDate?: Date
  plannedEndDate?: Date
  durationDays?: number
  predecessorTaskIds?: string[]
  lagDays?: number
  parentId?: string
  assignedToId?: string
  budgetAmount?: number
}

export interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  percentComplete?: number
  plannedStartDate?: Date
  plannedEndDate?: Date
  actualStartDate?: Date
  actualEndDate?: Date
  durationDays?: number
  predecessorTaskIds?: string[]
  lagDays?: number
  assignedToId?: string | null
  budgetAmount?: number
  actualCost?: number
}

export type WeatherCondition = 'CLEAR' | 'CLOUDY' | 'RAIN' | 'SNOW' | 'WIND' | 'EXTREME_HEAT' | 'EXTREME_COLD' | 'OTHER'

export interface DailyLog {
  id: string
  projectId: string
  logDate: string
  weather: WeatherCondition | null
  temperature: number | null
  laborCount: { trade: string; count: number }[] | null
  equipmentUsed: string[] | null
  materialsDelivered: string | null
  workCompleted: string | null
  issuesDelays: string | null
  visitorLog: string | null
  safetyObservations: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface CreateDailyLogData {
  logDate: Date
  weather?: WeatherCondition
  temperature?: number
  laborCount?: { trade: string; count: number }[]
  equipmentUsed?: string[]
  materialsDelivered?: string
  workCompleted?: string
  issuesDelays?: string
  visitorLog?: string
  safetyObservations?: string
}

export interface ProgressPhoto {
  id: string
  dailyLogId: string
  url: string
  thumbnailUrl: string | null
  caption: string | null
  location: string | null
  takenAt: string
  createdAt: string
}

export interface OperatingStatement {
  id: string
  projectId: string
  periodStart: string
  periodEnd: string
  grossPotentialRent: number | null
  vacancyLoss: number | null
  effectiveGrossIncome: number | null
  operatingExpenses: number | null
  netOperatingIncome: number | null
  project?: {
    id: string
    projectCode: string
    developmentProject: {
      name: string
      address: string | null
    }
  }
  createdAt: string
}

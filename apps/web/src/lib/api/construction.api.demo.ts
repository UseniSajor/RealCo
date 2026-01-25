// Construction API Demo Data - For Demo Mode
// This provides mock data when NEXT_PUBLIC_DEMO_MODE=true

import type {
  ConstructionProject,
  Task,
  DailyLog,
  RFI,
  Submittal,
  Inspection,
  SafetyIncident,
} from './construction.api'

// Mock data matching seed script
const DEMO_PROJECT: ConstructionProject = {
  id: 'demo-project-1',
  projectCode: 'RC-2026-001',
  phase: 'FRAMING',
  percentComplete: 35,
  totalBudget: 12000000,
  spentToDate: 4200000,
  plannedStartDate: '2025-06-01T00:00:00.000Z',
  actualStartDate: '2025-06-15T00:00:00.000Z',
  plannedEndDate: '2027-06-01T00:00:00.000Z',
  actualEndDate: null,
  costVariance: -150000,
  scheduleVarianceDays: 5,
  developmentProjectId: 'demo-dev-project-1',
  createdAt: '2025-06-01T00:00:00.000Z',
  updatedAt: '2026-01-24T00:00:00.000Z',
  developmentProject: {
    id: 'demo-dev-project-1',
    name: 'Sunset Heights Phase 1',
    address: '1234 Sunset Boulevard, Los Angeles, CA 90028',
    projectType: 'MULTIFAMILY',
    offering: {
      id: 'demo-offering-1',
      name: 'Sunset Heights Multifamily Development',
    },
  },
  _count: {
    tasks: 5,
    dailyLogs: 2,
    rfis: 3,
    submittals: 3,
    inspections: 4,
    safetyIncidents: 2,
  },
}

const DEMO_TASKS: Task[] = [
  {
    id: 'demo-task-1',
    projectId: 'demo-project-1',
    parentId: null,
    title: 'Foundation and Grading Complete',
    description: 'Complete site grading and foundation work for Building A',
    status: 'COMPLETED',
    priority: 'CRITICAL',
    percentComplete: 100,
    plannedStartDate: '2025-06-15T00:00:00.000Z',
    plannedEndDate: '2025-08-30T00:00:00.000Z',
    actualStartDate: '2025-06-15T00:00:00.000Z',
    actualEndDate: '2025-08-25T00:00:00.000Z',
    durationDays: 71,
    predecessorTaskIds: [],
    lagDays: 0,
    isCriticalPath: true,
    budgetAmount: 850000,
    actualCost: 820000,
    assignedToId: 'demo-user-1',
    attachmentUrls: [],
    createdAt: '2025-06-01T00:00:00.000Z',
    updatedAt: '2025-08-25T00:00:00.000Z',
    assignedTo: {
      id: 'demo-user-1',
      email: 'sponsor@realco.com',
    },
  },
  {
    id: 'demo-task-2',
    projectId: 'demo-project-1',
    parentId: null,
    title: 'Structural Steel Framing - Building A',
    description: 'Install structural steel frame for 6-story building',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    percentComplete: 60,
    plannedStartDate: '2025-09-01T00:00:00.000Z',
    plannedEndDate: '2025-11-15T00:00:00.000Z',
    actualStartDate: '2025-09-01T00:00:00.000Z',
    actualEndDate: null,
    durationDays: 75,
    predecessorTaskIds: ['demo-task-1'],
    lagDays: 3,
    isCriticalPath: true,
    budgetAmount: 1200000,
    actualCost: 650000,
    assignedToId: 'demo-user-1',
    attachmentUrls: [],
    createdAt: '2025-08-20T00:00:00.000Z',
    updatedAt: '2026-01-24T00:00:00.000Z',
    assignedTo: {
      id: 'demo-user-1',
      email: 'sponsor@realco.com',
    },
  },
  {
    id: 'demo-task-3',
    projectId: 'demo-project-1',
    parentId: null,
    title: 'MEP Rough-In - Floors 1-3',
    description: 'Mechanical, electrical, and plumbing rough-in for lower floors',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    percentComplete: 45,
    plannedStartDate: '2025-10-01T00:00:00.000Z',
    plannedEndDate: '2026-01-30T00:00:00.000Z',
    actualStartDate: '2025-10-01T00:00:00.000Z',
    actualEndDate: null,
    durationDays: 121,
    predecessorTaskIds: ['demo-task-2'],
    lagDays: 2,
    isCriticalPath: true,
    budgetAmount: 980000,
    actualCost: 450000,
    assignedToId: 'demo-user-1',
    attachmentUrls: [],
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2026-01-24T00:00:00.000Z',
    assignedTo: {
      id: 'demo-user-1',
      email: 'sponsor@realco.com',
    },
  },
  {
    id: 'demo-task-4',
    projectId: 'demo-project-1',
    parentId: null,
    title: 'Exterior Envelope - Building A',
    description: 'Install exterior cladding, windows, and waterproofing',
    status: 'NOT_STARTED',
    priority: 'MEDIUM',
    percentComplete: 0,
    plannedStartDate: '2026-02-01T00:00:00.000Z',
    plannedEndDate: '2026-05-15T00:00:00.000Z',
    actualStartDate: null,
    actualEndDate: null,
    durationDays: 104,
    predecessorTaskIds: ['demo-task-3'],
    lagDays: 2,
    isCriticalPath: false,
    budgetAmount: 750000,
    actualCost: null,
    assignedToId: null,
    attachmentUrls: [],
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-15T00:00:00.000Z',
  },
  {
    id: 'demo-task-5',
    projectId: 'demo-project-1',
    parentId: null,
    title: 'Interior Finishes - Model Units',
    description: 'Complete interior finishes for 6 model apartment units',
    status: 'NOT_STARTED',
    priority: 'LOW',
    percentComplete: 0,
    plannedStartDate: '2026-06-01T00:00:00.000Z',
    plannedEndDate: '2026-08-30T00:00:00.000Z',
    actualStartDate: null,
    actualEndDate: null,
    durationDays: 90,
    predecessorTaskIds: ['demo-task-4'],
    lagDays: 5,
    isCriticalPath: false,
    budgetAmount: 320000,
    actualCost: null,
    assignedToId: null,
    attachmentUrls: [],
    createdAt: '2025-09-15T00:00:00.000Z',
    updatedAt: '2025-09-15T00:00:00.000Z',
  },
]

// Demo mode detection - DISABLED BY DEFAULT (live site only)
export const isDemoMode = () => {
  // Demo is only enabled if BOTH conditions are true:
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' && 
         process.env.NEXT_PUBLIC_AUTH_MODE === 'demo'
}

// Demo data getters with localStorage persistence
export const demoConstructionAPI = {
  async getProjects() {
    await delay(300)
    return { projects: [DEMO_PROJECT] }
  },

  async getTasks(projectId: string) {
    await delay(200)
    // Check localStorage for custom tasks
    const stored = localStorage.getItem(`demo_tasks_${projectId}`)
    const tasks = stored ? JSON.parse(stored) : DEMO_TASKS
    return { tasks }
  },

  async createTask(projectId: string, data: any) {
    await delay(400)
    const newTask: Task = {
      id: `demo-task-${Date.now()}`,
      projectId,
      parentId: null,
      title: data.title,
      description: data.description || null,
      status: data.status,
      priority: data.priority,
      percentComplete: 0,
      plannedStartDate: data.plannedStartDate || null,
      plannedEndDate: data.plannedEndDate || null,
      actualStartDate: null,
      actualEndDate: null,
      durationDays: data.durationDays || null,
      predecessorTaskIds: [],
      lagDays: 0,
      isCriticalPath: false,
      budgetAmount: data.budgetAmount || null,
      actualCost: null,
      assignedToId: 'demo-user-1',
      attachmentUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: {
        id: 'demo-user-1',
        email: 'sponsor@realco.com',
      },
    }

    // Persist to localStorage
    const stored = localStorage.getItem(`demo_tasks_${projectId}`)
    const tasks = stored ? JSON.parse(stored) : DEMO_TASKS
    tasks.push(newTask)
    localStorage.setItem(`demo_tasks_${projectId}`, JSON.stringify(tasks))

    return { task: newTask }
  },

  async updateTask(taskId: string, data: any) {
    await delay(300)
    // In demo mode, just return success
    return { task: { id: taskId, ...data } }
  },

  async getDailyLogs(projectId: string) {
    await delay(200)
    return { dailyLogs: [] }
  },

  async createDailyLog(projectId: string, data: any) {
    await delay(400)
    return {
      dailyLog: {
        id: `demo-log-${Date.now()}`,
        projectId,
        ...data,
        createdAt: new Date().toISOString(),
      },
    }
  },

  async getRFIs(projectId: string) {
    await delay(200)
    return { rfis: [] }
  },

  async createRFI(projectId: string, data: any) {
    await delay(400)
    return {
      rfi: {
        id: `demo-rfi-${Date.now()}`,
        rfiNumber: `RFI-${String(Date.now()).slice(-3)}`,
        projectId,
        status: 'OPEN',
        ...data,
        createdAt: new Date().toISOString(),
      },
    }
  },

  async updateRFI(rfiId: string, data: any) {
    await delay(300)
    return { rfi: { id: rfiId, ...data } }
  },

  async getSubmittals(projectId: string) {
    await delay(200)
    return { submittals: [] }
  },

  async createSubmittal(projectId: string, data: any) {
    await delay(400)
    return {
      submittal: {
        id: `demo-submittal-${Date.now()}`,
        submittalNumber: `SUB-${String(Date.now()).slice(-3)}`,
        projectId,
        status: 'DRAFT',
        ...data,
        createdAt: new Date().toISOString(),
      },
    }
  },

  async updateSubmittal(submittalId: string, data: any) {
    await delay(300)
    return { submittal: { id: submittalId, ...data } }
  },

  async getInspections(projectId: string) {
    await delay(200)
    return { inspections: [] }
  },

  async createInspection(projectId: string, data: any) {
    await delay(400)
    return {
      inspection: {
        id: `demo-inspection-${Date.now()}`,
        inspectionNumber: `INSP-${String(Date.now()).slice(-3)}`,
        projectId,
        status: 'SCHEDULED',
        ...data,
        createdAt: new Date().toISOString(),
      },
    }
  },

  async updateInspection(inspectionId: string, data: any) {
    await delay(300)
    return { inspection: { id: inspectionId, ...data } }
  },

  async getSafetyIncidents(projectId: string) {
    await delay(200)
    return { safetyIncidents: [] }
  },

  async createSafetyIncident(projectId: string, data: any) {
    await delay(400)
    return {
      safetyIncident: {
        id: `demo-incident-${Date.now()}`,
        projectId,
        ...data,
        createdAt: new Date().toISOString(),
      },
    }
  },
}

// Helper function to simulate API delay
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

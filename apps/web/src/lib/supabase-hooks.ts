"use client"

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './auth-context'
import {
  supabaseData,
  type Organization,
  type Property,
  type Lead,
  type Deal,
  type Offering,
  type Project,
  type Task,
  type DailyLog,
  type Transaction,
  type Distribution,
  type Investment,
  type PropertyStatus,
  type PropertyType,
  type LeadStatus,
  type DealStage,
  type TaskStatus,
  type TaskPriority,
  type OfferingStatus,
  type ProjectPhase,
  type TransactionType,
  type TransactionStatus,
  type DistributionType,
  type DistributionStatus,
  type CreatePropertyData,
  type UpdatePropertyData,
  type CreateLeadData,
  type UpdateLeadData,
  type CreateDealData,
  type UpdateDealData,
  type CreateOfferingData,
  type UpdateOfferingData,
  type CreateProjectData,
  type UpdateProjectData,
  type CreateTaskData,
  type UpdateTaskData,
  type CreateDailyLogData,
  type UpdateDailyLogData,
  type CreateTransactionData,
  type CreateDistributionData,
  type CreateInvestmentData,
} from './supabase-data'

// Re-export types
export type {
  Organization,
  Property,
  Lead,
  Deal,
  Offering,
  Project,
  Task,
  DailyLog,
  Transaction,
  Distribution,
  Investment,
  PropertyStatus,
  PropertyType,
  LeadStatus,
  DealStage,
  TaskStatus,
  TaskPriority,
  OfferingStatus,
  ProjectPhase,
  TransactionType,
  TransactionStatus,
  DistributionType,
  DistributionStatus,
  CreatePropertyData,
  UpdatePropertyData,
  CreateLeadData,
  UpdateLeadData,
  CreateDealData,
  UpdateDealData,
  CreateOfferingData,
  UpdateOfferingData,
  CreateProjectData,
  UpdateProjectData,
  CreateTaskData,
  UpdateTaskData,
  CreateDailyLogData,
  UpdateDailyLogData,
  CreateTransactionData,
  CreateDistributionData,
  CreateInvestmentData,
}

// Generic hook state
interface UseDataState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

interface UseListState<T> {
  data: T[]
  count: number
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// Helper to get org ID from user
function useOrgId(): string | null {
  const { user } = useAuth()
  return user?.orgId || null
}

// ========== PROPERTIES ==========

export function useProperties(options?: {
  status?: PropertyStatus
  type?: PropertyType
  search?: string
  limit?: number
  offset?: number
}): UseListState<Property> {
  const orgId = useOrgId()
  const [data, setData] = useState<Property[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getProperties(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.status, options?.type, options?.search, options?.limit, options?.offset])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useProperty(id: string): UseDataState<Property> {
  const [data, setData] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getProperty(id)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [id])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function usePropertyMutations() {
  const orgId = useOrgId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProperty = async (data: Omit<CreatePropertyData, 'org_id'>): Promise<Property | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createProperty({ ...data, org_id: orgId })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateProperty = async (id: string, data: UpdatePropertyData): Promise<Property | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateProperty(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const deleteProperty = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.deleteProperty(id)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    return true
  }

  return { createProperty, updateProperty, deleteProperty, isLoading, error }
}

// ========== LEADS ==========

export function useLeads(options?: {
  status?: LeadStatus
  search?: string
  limit?: number
  offset?: number
}): UseListState<Lead> {
  const orgId = useOrgId()
  const [data, setData] = useState<Lead[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getLeads(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.status, options?.search, options?.limit, options?.offset])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useLeadMutations() {
  const orgId = useOrgId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createLead = async (data: Omit<CreateLeadData, 'org_id'>): Promise<Lead | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createLead({ ...data, org_id: orgId })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateLead = async (id: string, data: UpdateLeadData): Promise<Lead | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateLead(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const deleteLead = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.deleteLead(id)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    return true
  }

  const convertToDeal = async (leadId: string, dealData: Omit<CreateDealData, 'org_id'>): Promise<Deal | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.convertLeadToDeal(leadId, { ...dealData, org_id: orgId })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createLead, updateLead, deleteLead, convertToDeal, isLoading, error }
}

// ========== DEALS (PIPELINE) ==========

export function useDeals(options?: {
  stage?: DealStage
  search?: string
  limit?: number
  offset?: number
}): UseListState<Deal> {
  const orgId = useOrgId()
  const [data, setData] = useState<Deal[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getDeals(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.stage, options?.search, options?.limit, options?.offset])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useDealMutations() {
  const orgId = useOrgId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDeal = async (data: Omit<CreateDealData, 'org_id'>): Promise<Deal | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createDeal({ ...data, org_id: orgId })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateDeal = async (id: string, data: UpdateDealData): Promise<Deal | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateDeal(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateDealStage = async (id: string, stage: DealStage): Promise<Deal | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateDealStage(id, stage)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const deleteDeal = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.deleteDeal(id)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    return true
  }

  return { createDeal, updateDeal, updateDealStage, deleteDeal, isLoading, error }
}

// ========== OFFERINGS ==========

export function useOfferings(options?: {
  status?: OfferingStatus | OfferingStatus[]
  search?: string
  limit?: number
}): UseListState<Offering> {
  const orgId = useOrgId()
  const [data, setData] = useState<Offering[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getOfferings(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.status, options?.search, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useOfferingMutations() {
  const orgId = useOrgId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOffering = async (data: Omit<CreateOfferingData, 'org_id'>): Promise<Offering | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createOffering({ ...data, org_id: orgId })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateOffering = async (id: string, data: UpdateOfferingData): Promise<Offering | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateOffering(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createOffering, updateOffering, isLoading, error }
}

// ========== PROJECTS ==========

export function useProjects(options?: {
  phase?: ProjectPhase | ProjectPhase[]
  search?: string
  limit?: number
}): UseListState<Project> {
  const orgId = useOrgId()
  const [data, setData] = useState<Project[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getProjects(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.phase, options?.search, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useProject(id: string): UseDataState<Project> {
  const [data, setData] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getProject(id)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [id])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useProjectMutations() {
  const orgId = useOrgId()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = async (data: CreateProjectData): Promise<Project | null> => {
    if (!orgId) {
      setError('Not authenticated')
      return null
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createProject(data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateProject = async (id: string, data: UpdateProjectData): Promise<Project | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateProject(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateProjectProgress = async (id: string, percent: number): Promise<Project | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateProjectProgress(id, percent)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createProject, updateProject, updateProjectProgress, isLoading, error }
}

// ========== TASKS ==========

export function useTasks(projectId: string, options?: {
  status?: TaskStatus
  priority?: TaskPriority
  search?: string
  limit?: number
}): UseListState<Task> {
  const [data, setData] = useState<Task[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getTasks(projectId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [projectId, options?.status, options?.priority, options?.search, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useTaskMutations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTask = async (data: CreateTaskData): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createTask(data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateTask = async (id: string, data: UpdateTaskData): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateTask(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateTaskStatus(id, status)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.deleteTask(id)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return false
    }

    return true
  }

  return { createTask, updateTask, updateTaskStatus, deleteTask, isLoading, error }
}

// ========== DAILY LOGS ==========

export function useDailyLogs(projectId: string, options?: {
  startDate?: string
  endDate?: string
  limit?: number
}): UseListState<DailyLog> {
  const [data, setData] = useState<DailyLog[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getDailyLogs(projectId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [projectId, options?.startDate, options?.endDate, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

export function useDailyLogMutations() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDailyLog = async (data: Omit<CreateDailyLogData, 'created_by_id'>): Promise<DailyLog | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.createDailyLog({
      ...data,
      created_by_id: user?.id,
    })

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateDailyLog = async (id: string, data: UpdateDailyLogData): Promise<DailyLog | null> => {
    setIsLoading(true)
    setError(null)

    const result = await supabaseData.updateDailyLog(id, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createDailyLog, updateDailyLog, isLoading, error }
}

// ========== TRANSACTIONS ==========

export function useTransactions(options?: {
  type?: TransactionType | TransactionType[]
  status?: TransactionStatus | TransactionStatus[]
  limit?: number
}): UseListState<Transaction> {
  const orgId = useOrgId()
  const [data, setData] = useState<Transaction[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getTransactions(orgId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [orgId, options?.type, options?.status, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

// ========== DISTRIBUTIONS ==========

export function useDistributions(offeringId: string, options?: {
  status?: DistributionStatus | DistributionStatus[]
  limit?: number
}): UseListState<Distribution> {
  const [data, setData] = useState<Distribution[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!offeringId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getDistributions(offeringId, options)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [offeringId, options?.status, options?.limit])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

// ========== INVESTORS ==========

export function useInvestors(offeringId: string): UseListState<Investment> {
  const [data, setData] = useState<Investment[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!offeringId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getInvestors(offeringId)

    if (result.error) {
      setError(result.error.message)
      setData([])
      setCount(0)
    } else {
      setData(result.data || [])
      setCount(result.count || 0)
    }

    setIsLoading(false)
  }, [offeringId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

// ========== DASHBOARD METRICS ==========

export function useDashboardMetrics() {
  const orgId = useOrgId()
  const [data, setData] = useState<Awaited<ReturnType<typeof supabaseData.getDashboardMetrics>>['data']>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getDashboardMetrics(orgId)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [orgId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

// ========== PORTFOLIO SUMMARY ==========

export function usePortfolioSummary() {
  const orgId = useOrgId()
  const [data, setData] = useState<Awaited<ReturnType<typeof supabaseData.getPortfolioSummary>>['data']>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    const result = await supabaseData.getPortfolioSummary(orgId)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [orgId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

// ========== GLOBAL SEARCH ==========

export function useGlobalSearch(query: string): UseListState<{ type: string; id: string; name: string; subtitle?: string }> {
  const orgId = useOrgId()
  const [data, setData] = useState<Array<{ type: string; id: string; name: string; subtitle?: string }>>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!orgId || !query || query.length < 2) {
      setData([])
      setCount(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await supabaseData.globalSearch(orgId, query)

      // Transform results into a unified format
      const items: Array<{ type: string; id: string; name: string; subtitle?: string }> = [
        ...result.properties.map(p => ({ type: 'property', id: p.id, name: p.name || 'Property', subtitle: p.address })),
        ...result.leads.map(l => ({ type: 'lead', id: l.id, name: l.property_name || 'Lead', subtitle: l.property_address })),
        ...result.deals.map(d => ({ type: 'deal', id: d.id, name: d.name || 'Deal', subtitle: d.stage })),
        ...result.offerings.map(o => ({ type: 'offering', id: o.id, name: o.name, subtitle: o.regulation_mode })),
      ]
      setData(items)
      setCount(items.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setData([])
      setCount(0)
    }

    setIsLoading(false)
  }, [orgId, query])

  useEffect(() => {
    const debounce = setTimeout(refetch, 300)
    return () => clearTimeout(debounce)
  }, [refetch])

  return { data, count, isLoading, error, refetch }
}

"use client"

import { useState, useEffect, useCallback } from 'react'
import {
  apiClient,
  type Project,
  type Task,
  type DailyLog,
  type Offering,
  type DevelopmentProject,
  type ProjectMetrics,
  type TaskFilters,
  type CreateTaskData,
  type UpdateTaskData,
  type CreateDailyLogData
} from './client'

// Generic hook for API state management
interface UseApiState<T> {
  data: T | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

// ========== Projects Hooks ==========

export function useProjects(): UseApiState<Project[]> {
  const [data, setData] = useState<Project[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.getProjects()

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data?.items || [])
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useProject(id: string): UseApiState<Project> {
  const [data, setData] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!id) return

    setIsLoading(true)
    setError(null)

    const result = await apiClient.getProject(id)

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

export function useProjectMetrics(projectId: string): UseApiState<ProjectMetrics> {
  const [data, setData] = useState<ProjectMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) return

    setIsLoading(true)
    setError(null)

    const result = await apiClient.getProjectMetrics(projectId)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [projectId])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

// ========== Tasks Hooks ==========

export function useTasks(projectId: string, filters?: TaskFilters): UseApiState<Task[]> {
  const [data, setData] = useState<Task[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) return

    setIsLoading(true)
    setError(null)

    const result = await apiClient.getTasks(projectId, filters)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data?.items || [])
    }

    setIsLoading(false)
  }, [projectId, filters])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useTaskMutations(projectId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createTask = async (data: CreateTaskData): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.createTask(projectId, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateTask = async (taskId: string, data: UpdateTaskData): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.updateTask(taskId, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  const updateTaskProgress = async (taskId: string, percentComplete: number): Promise<Task | null> => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.updateTaskProgress(taskId, percentComplete)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createTask, updateTask, updateTaskProgress, isLoading, error }
}

// ========== Daily Logs Hooks ==========

export function useDailyLogs(projectId: string, dateRange?: { startDate: Date; endDate: Date }): UseApiState<DailyLog[]> {
  const [data, setData] = useState<DailyLog[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!projectId) return

    setIsLoading(true)
    setError(null)

    const result = await apiClient.getDailyLogs(projectId, dateRange)

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data?.items || [])
    }

    setIsLoading(false)
  }, [projectId, dateRange])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useDailyLogMutations(projectId: string) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createDailyLog = async (data: CreateDailyLogData): Promise<DailyLog | null> => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.createDailyLog(projectId, data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data || null
  }

  return { createDailyLog, isLoading, error }
}

// ========== Offerings Hooks ==========

export function useOfferings(): UseApiState<Offering[]> {
  const [data, setData] = useState<Offering[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.getOfferings()

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data?.items || [])
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

export function useOfferingMutations() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createOffering = async (data: { name: string; regulation_mode?: '506b' | '506c' | 'internal' }): Promise<string | null> => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.createOffering(data)

    setIsLoading(false)

    if (result.error) {
      setError(result.error.message)
      return null
    }

    return result.data?.id || null
  }

  return { createOffering, isLoading, error }
}

// ========== Development Projects Hooks ==========

export function useDevelopmentProjects(): UseApiState<DevelopmentProject[]> {
  const [data, setData] = useState<DevelopmentProject[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.getDevelopmentProjects()

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data?.items || [])
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

// ========== Health Check Hook ==========

export function useHealthCheck(): UseApiState<{ ok: boolean; name: string }> {
  const [data, setData] = useState<{ ok: boolean; name: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const result = await apiClient.healthCheck()

    if (result.error) {
      setError(result.error.message)
      setData(null)
    } else {
      setData(result.data || null)
    }

    setIsLoading(false)
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, isLoading, error, refetch }
}

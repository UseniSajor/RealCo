"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { TierName } from './pricing-tiers'
import { apiClient } from './api/client'
import { supabase, supabaseAuth } from './supabase'

// Auth mode: 'demo' | 'supabase' | 'api'
const AUTH_MODE = process.env.NEXT_PUBLIC_AUTH_MODE || 'demo'

interface User {
  id?: string
  email: string
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  tier: TierName
  name?: string
  company?: string
  createdAt: string
  orgId?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  authMode: string
  login: (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, role: 'sponsor' | 'investor' | 'provider' | 'fund-manager', tier?: TierName, name?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateTier: (newTier: TierName) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user on mount - check Supabase session or localStorage
  useEffect(() => {
    const initAuth = async () => {
      if (AUTH_MODE === 'supabase') {
        // Check Supabase session
        const { data } = await supabaseAuth.getSession()
        if (data.session?.user) {
          const supaUser = data.session.user
          const appUser: User = {
            id: supaUser.id,
            email: supaUser.email || '',
            role: (supaUser.user_metadata?.role as User['role']) || 'sponsor',
            tier: (supaUser.user_metadata?.tier as TierName) || 'free',
            name: supaUser.user_metadata?.name,
            company: supaUser.user_metadata?.company,
            createdAt: supaUser.created_at,
          }
          setUser(appUser)
          setIsAuthenticated(true)
          localStorage.setItem('realco_user', JSON.stringify(appUser))
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session?.user) {
            const supaUser = session.user
            const appUser: User = {
              id: supaUser.id,
              email: supaUser.email || '',
              role: (supaUser.user_metadata?.role as User['role']) || 'sponsor',
              tier: (supaUser.user_metadata?.tier as TierName) || 'free',
              name: supaUser.user_metadata?.name,
              company: supaUser.user_metadata?.company,
              createdAt: supaUser.created_at,
            }
            setUser(appUser)
            setIsAuthenticated(true)
            localStorage.setItem('realco_user', JSON.stringify(appUser))
          } else if (event === 'SIGNED_OUT') {
            setUser(null)
            setIsAuthenticated(false)
            localStorage.removeItem('realco_user')
          }
        })

        setIsLoading(false)
        return () => subscription.unsubscribe()
      } else {
        // Demo or API mode - use localStorage
        const storedUser = localStorage.getItem('realco_user')
        const storedToken = localStorage.getItem('realco_token')

        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setIsAuthenticated(true)

            if (storedToken) {
              apiClient.setToken(storedToken)
            }
          } catch (e) {
            console.error('Error loading user:', e)
            localStorage.removeItem('realco_user')
            localStorage.removeItem('realco_token')
          }
        }
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Demo accounts with pre-configured roles
  const demoAccounts: Record<string, User> = {
    'sponsor@realco.com': {
      email: 'sponsor@realco.com',
      role: 'sponsor',
      tier: 'pro',
      name: 'John Sponsor',
      company: 'Apex Development',
      createdAt: '2024-01-01',
    },
    'investor@realco.com': {
      email: 'investor@realco.com',
      role: 'investor',
      tier: 'pro',
      name: 'Sarah Investor',
      createdAt: '2024-01-01',
    },
    'provider@realco.com': {
      email: 'provider@realco.com',
      role: 'provider',
      tier: 'pro',
      name: 'Mike Provider',
      company: 'BuildRight Construction',
      createdAt: '2024-01-01',
    },
    'fund@realco.com': {
      email: 'fund@realco.com',
      role: 'fund-manager',
      tier: 'pro',
      name: 'Emily Manager',
      company: 'Elite Asset Management',
      createdAt: '2024-01-01',
    },
  }

  const login = async (
    email: string,
    password: string,
    role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // SUPABASE AUTH
    if (AUTH_MODE === 'supabase') {
      const { data, error } = await supabaseAuth.signIn(email, password)

      if (error) {
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.user) {
        const appUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          role: (data.user.user_metadata?.role as User['role']) || 'sponsor',
          tier: (data.user.user_metadata?.tier as TierName) || 'free',
          name: data.user.user_metadata?.name,
          company: data.user.user_metadata?.company,
          createdAt: data.user.created_at,
        }
        setUser(appUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(appUser))
        setIsLoading(false)
        router.push(`/dashboard/${appUser.role}`)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: 'Login failed' }
    }

    // API AUTH
    if (AUTH_MODE === 'api') {
      const result = await apiClient.login(email, password)

      if (result.error) {
        setIsLoading(false)
        return { success: false, error: result.error.message }
      }

      if (result.data?.token) {
        const apiUser: User = {
          email,
          role: role || 'sponsor',
          tier: 'pro',
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        }
        setUser(apiUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(apiUser))
        setIsLoading(false)
        router.push(`/dashboard/${apiUser.role}`)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: 'No token received' }
    }

    // DEMO AUTH (default)
    const demoUser = demoAccounts[email.toLowerCase()]
    if (demoUser) {
      setUser(demoUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(demoUser))
      setIsLoading(false)
      router.push(`/dashboard/${demoUser.role}`)
      return { success: true }
    }

    // Check localStorage users
    const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
    const existingUser = existingUsers.find((u: User) => u.email === email)

    if (existingUser) {
      setUser(existingUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(existingUser))
      setIsLoading(false)
      router.push(`/dashboard/${existingUser.role}`)
      return { success: true }
    }

    if (role) {
      const newUser: User = {
        email,
        role,
        tier: 'free',
        createdAt: new Date().toISOString(),
      }
      existingUsers.push(newUser)
      localStorage.setItem('realco_users', JSON.stringify(existingUsers))
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(newUser))
      setIsLoading(false)
      router.push(`/dashboard/${role}`)
      return { success: true }
    }

    setIsLoading(false)
    return { success: false, error: 'Please select a role' }
  }

  const signup = async (
    email: string,
    password: string,
    role: 'sponsor' | 'investor' | 'provider' | 'fund-manager',
    tier: TierName = 'free',
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // SUPABASE AUTH
    if (AUTH_MODE === 'supabase') {
      const { data, error } = await supabaseAuth.signUp(email, password, {
        name,
        role,
      })

      if (error) {
        setIsLoading(false)
        return { success: false, error: error.message }
      }

      if (data.user) {
        const appUser: User = {
          id: data.user.id,
          email: data.user.email || '',
          role,
          tier,
          name,
          createdAt: data.user.created_at,
        }
        setUser(appUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(appUser))
        setIsLoading(false)
        router.push(`/dashboard/${role}`)
        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: 'Signup failed' }
    }

    // DEMO/API AUTH
    const newUser: User = {
      email,
      role,
      tier,
      name,
      createdAt: new Date().toISOString(),
    }

    const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
    existingUsers.push(newUser)
    localStorage.setItem('realco_users', JSON.stringify(existingUsers))

    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('realco_user', JSON.stringify(newUser))
    setIsLoading(false)
    router.push(`/dashboard/${role}`)
    return { success: true }
  }

  const logout = async () => {
    if (AUTH_MODE === 'supabase') {
      await supabaseAuth.signOut()
    }

    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('realco_user')
    localStorage.removeItem('realco_token')
    apiClient.logout()
    router.push('/')
  }

  const updateTier = (newTier: TierName) => {
    if (user) {
      const updatedUser = { ...user, tier: newTier }
      setUser(updatedUser)
      localStorage.setItem('realco_user', JSON.stringify(updatedUser))

      const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
      const updatedUsers = existingUsers.map((u: User) =>
        u.email === user.email ? updatedUser : u
      )
      localStorage.setItem('realco_users', JSON.stringify(updatedUsers))

      // Update in Supabase if using Supabase auth
      if (AUTH_MODE === 'supabase') {
        supabaseAuth.updateUserMetadata({ tier: newTier })
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      authMode: AUTH_MODE,
      login,
      signup,
      logout,
      updateTier
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

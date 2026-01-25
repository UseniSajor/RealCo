"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { TierName } from './pricing-tiers'
import { apiClient } from './api/client'

// Set to true to use real backend API, false for demo mode
const USE_REAL_API = process.env.NEXT_PUBLIC_USE_REAL_API === 'true'

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
  login: (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => Promise<void>
  signup: (email: string, password: string, role: 'sponsor' | 'investor' | 'provider' | 'fund-manager', tier?: TierName) => Promise<void>
  logout: () => void
  updateTier: (newTier: TierName) => void
  apiLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('realco_user')
    const storedToken = localStorage.getItem('realco_token')

    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)

        // Restore token to API client if exists
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
  }, [])

  // Real API login function
  const apiLogin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)
    try {
      const result = await apiClient.login(email, password)

      if (result.error) {
        setIsLoading(false)
        return { success: false, error: result.error.message }
      }

      if (result.data?.token) {
        // Token is already saved by apiClient
        // Create user from JWT payload (would decode in production)
        const apiUser: User = {
          email,
          role: 'sponsor', // Default role, would come from JWT in production
          tier: 'pro',
          name: email.split('@')[0],
          createdAt: new Date().toISOString(),
        }

        setUser(apiUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(apiUser))
        setIsLoading(false)

        return { success: true }
      }

      setIsLoading(false)
      return { success: false, error: 'No token received' }
    } catch (error) {
      setIsLoading(false)
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
  }

  const login = async (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => {
    // Temporary: Accept ANY username and password
    // In production, this would validate against a real backend
    
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

    // Check demo accounts first
    const demoUser = demoAccounts[email.toLowerCase()]
    if (demoUser) {
      setUser(demoUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(demoUser))
      router.push(`/dashboard/${demoUser.role}`)
      return
    }
    
    // Check if user exists in localStorage
    const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
    let existingUser = existingUsers.find((u: User) => u.email === email)

    if (existingUser) {
      // User exists, log them in
      setUser(existingUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(existingUser))
      
      // Redirect to their dashboard
      router.push(`/dashboard/${existingUser.role}`)
    } else if (role) {
      // New user, create account with specified role
      const newUser: User = {
        email,
        role,
        tier: 'free', // Start with free tier
        createdAt: new Date().toISOString(),
      }
      
      // Save to users list
      existingUsers.push(newUser)
      localStorage.setItem('realco_users', JSON.stringify(existingUsers))
      
      // Set as current user
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(newUser))
      
      // Redirect to dashboard
      router.push(`/dashboard/${role}`)
    } else {
      // No role specified and user doesn't exist, need role selection
      router.push('/signup')
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    role: 'sponsor' | 'investor' | 'provider' | 'fund-manager',
    tier: TierName = 'free'
  ) => {
    // Create new user
    const newUser: User = {
      email,
      role,
      tier,
      createdAt: new Date().toISOString(),
    }

    // Save to users list
    const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
    existingUsers.push(newUser)
    localStorage.setItem('realco_users', JSON.stringify(existingUsers))

    // Set as current user
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('realco_user', JSON.stringify(newUser))

    // Redirect to dashboard
    router.push(`/dashboard/${role}`)
  }

  const logout = () => {
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

      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
      const updatedUsers = existingUsers.map((u: User) => 
        u.email === user.email ? updatedUser : u
      )
      localStorage.setItem('realco_users', JSON.stringify(updatedUsers))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, updateTier, apiLogin }}>
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

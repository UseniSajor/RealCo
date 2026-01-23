"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import type { TierName } from './pricing-tiers'

interface User {
  email: string
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  tier: TierName
  name?: string
  company?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => Promise<void>
  signup: (email: string, password: string, role: 'sponsor' | 'investor' | 'provider' | 'fund-manager', tier?: TierName) => Promise<void>
  logout: () => void
  updateTier: (newTier: TierName) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('realco_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (e) {
        console.error('Error loading user:', e)
        localStorage.removeItem('realco_user')
      }
    }
  }, [])

  const login = async (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => {
    // Temporary: Accept ANY username and password
    // In production, this would validate against a real backend
    
    // Demo accounts with pre-configured roles
    const demoAccounts: Record<string, User> = {
      'sponsor@realco.com': {
        email: 'sponsor@realco.com',
        role: 'sponsor',
        tier: 'professional',
        name: 'John Sponsor',
        company: 'Apex Development',
        createdAt: '2024-01-01',
      },
      'investor@realco.com': {
        email: 'investor@realco.com',
        role: 'investor',
        tier: 'professional',
        name: 'Sarah Investor',
        createdAt: '2024-01-01',
      },
      'provider@realco.com': {
        email: 'provider@realco.com',
        role: 'provider',
        tier: 'professional',
        name: 'Mike Provider',
        company: 'BuildRight Construction',
        createdAt: '2024-01-01',
      },
      'fund@realco.com': {
        email: 'fund@realco.com',
        role: 'fund-manager',
        tier: 'professional',
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateTier }}>
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

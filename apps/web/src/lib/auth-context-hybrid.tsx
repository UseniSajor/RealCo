"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthAPI, type AuthUser, type RegisterRequest, type LoginRequest } from './auth'
import type { TierName } from './pricing-tiers'

// Determine if we're in demo mode or production mode
const IS_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                     process.env.NEXT_PUBLIC_AUTH_MODE === 'demo' ||
                     !process.env.NEXT_PUBLIC_API_URL;

interface DemoUser {
  email: string
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  tier: TierName
  name?: string
  company?: string
  createdAt: string
}

interface ProductionUser extends AuthUser {
  role: 'sponsor' | 'investor' | 'provider' | 'fund-manager'
  tier?: TierName
}

type User = DemoUser | ProductionUser;

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isDemo: boolean
  login: (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => Promise<void>
  signup: (email: string, password: string, role: 'sponsor' | 'investor' | 'provider' | 'fund-manager', tier?: TierName, orgName?: string) => Promise<void>
  logout: () => void
  updateTier: (newTier: TierName) => void
  forgotPassword: (email: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo accounts for demo mode
const DEMO_ACCOUNTS: Record<string, DemoUser> = {
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
  'fundmanager@realco.com': {
    email: 'fundmanager@realco.com',
    role: 'fund-manager',
    tier: 'pro',
    name: 'Emily Manager',
    company: 'Elite Asset Management',
    createdAt: '2024-01-01',
  },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Load user on mount
  useEffect(() => {
    if (IS_DEMO_MODE) {
      // Demo mode: load from localStorage
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
    } else {
      // Production mode: verify token and load user
      if (AuthAPI.isAuthenticated()) {
        const storedUser = AuthAPI.getUser()
        if (storedUser) {
          // Infer role from email or organization (temporary solution)
          const userWithRole = {
            ...storedUser,
            role: inferRoleFromEmail(storedUser.email),
          } as ProductionUser
          setUser(userWithRole)
          setIsAuthenticated(true)

          // Optionally refresh profile from API
          AuthAPI.getProfile()
            .then(profile => {
              const updatedUser = {
                ...profile,
                role: inferRoleFromEmail(profile.email),
              } as ProductionUser
              setUser(updatedUser)
            })
            .catch(err => {
              console.error('Failed to refresh profile:', err)
              // Token might be expired, log out
              logout()
            })
        }
      }
    }
  }, [])

  // Helper function to infer role from email
  const inferRoleFromEmail = (email: string): 'sponsor' | 'investor' | 'provider' | 'fund-manager' => {
    const emailLower = email.toLowerCase()
    if (emailLower.includes('sponsor')) return 'sponsor'
    if (emailLower.includes('investor')) return 'investor'
    if (emailLower.includes('provider') || emailLower.includes('vendor')) return 'provider'
    if (emailLower.includes('fund') || emailLower.includes('manager')) return 'fund-manager'
    return 'investor' // Default role
  }

  const login = async (email: string, password: string, role?: 'sponsor' | 'investor' | 'provider' | 'fund-manager') => {
    if (IS_DEMO_MODE) {
      // Demo mode login
      const demoUser = DEMO_ACCOUNTS[email.toLowerCase()]
      if (demoUser) {
        setUser(demoUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(demoUser))
        router.push(`/dashboard/${demoUser.role}`)
        return
      }

      // Check localStorage for demo accounts
      const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
      let existingUser = existingUsers.find((u: DemoUser) => u.email === email)

      if (existingUser) {
        setUser(existingUser)
        setIsAuthenticated(true)
        localStorage.setItem('realco_user', JSON.stringify(existingUser))
        router.push(`/dashboard/${existingUser.role}`)
      } else if (role) {
        // Create new demo user
        const newUser: DemoUser = {
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
        router.push(`/dashboard/${role}`)
      } else {
        router.push('/signup')
      }
    } else {
      // Production mode login
      try {
        const response = await AuthAPI.login({ email, password })
        const userWithRole = {
          ...response.user,
          role: role || inferRoleFromEmail(response.user.email),
        } as ProductionUser
        setUser(userWithRole)
        setIsAuthenticated(true)
        router.push(`/dashboard/${userWithRole.role}`)
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    role: 'sponsor' | 'investor' | 'provider' | 'fund-manager',
    tier: TierName = 'free',
    orgName?: string
  ) => {
    if (IS_DEMO_MODE) {
      // Demo mode signup
      const newUser: DemoUser = {
        email,
        role,
        tier,
        createdAt: new Date().toISOString(),
      }
      const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
      existingUsers.push(newUser)
      localStorage.setItem('realco_users', JSON.stringify(existingUsers))
      setUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('realco_user', JSON.stringify(newUser))
      router.push(`/dashboard/${role}`)
    } else {
      // Production mode signup
      try {
        const registerData: RegisterRequest = {
          email,
          password,
          orgName,
          role: role.toUpperCase().replace('-', '_') as any,
        }
        const response = await AuthAPI.register(registerData)
        const userWithRole = {
          ...response.user,
          role,
          tier,
        } as ProductionUser
        setUser(userWithRole)
        setIsAuthenticated(true)
        router.push(`/dashboard/${role}`)
      } catch (error) {
        console.error('Signup error:', error)
        throw error
      }
    }
  }

  const logout = () => {
    if (IS_DEMO_MODE) {
      // Demo mode logout
      localStorage.removeItem('realco_user')
    } else {
      // Production mode logout
      AuthAPI.logout()
    }
    setUser(null)
    setIsAuthenticated(false)
    router.push('/')
  }

  const updateTier = (newTier: TierName) => {
    if (user) {
      const updatedUser = { ...user, tier: newTier }
      setUser(updatedUser)
      if (IS_DEMO_MODE) {
        localStorage.setItem('realco_user', JSON.stringify(updatedUser))
        const existingUsers = JSON.parse(localStorage.getItem('realco_users') || '[]')
        const updatedUsers = existingUsers.map((u: DemoUser) => 
          u.email === user.email ? updatedUser : u
        )
        localStorage.setItem('realco_users', JSON.stringify(updatedUsers))
      }
    }
  }

  const forgotPassword = async (email: string) => {
    if (IS_DEMO_MODE) {
      // Demo mode: just show alert
      alert('Demo mode: Password reset link would be sent to ' + email)
    } else {
      // Production mode: call API
      await AuthAPI.forgotPassword({ email })
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (IS_DEMO_MODE) {
      // Demo mode: just update locally
      alert('Demo mode: Password changed successfully')
    } else {
      // Production mode: call API
      await AuthAPI.changePassword({ currentPassword, newPassword })
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isDemo: IS_DEMO_MODE,
      login, 
      signup, 
      logout, 
      updateTier,
      forgotPassword,
      changePassword,
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

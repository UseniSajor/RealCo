"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  DemoState, 
  DemoUser, 
  DemoBankAccount, 
  DemoTransaction, 
  DemoInvestment, 
  DemoDrawRequest, 
  DemoInvoice 
} from './types'
import { 
  mockBankAccounts, 
  mockTransactions, 
  mockOfferings, 
  mockInvestments, 
  mockDrawRequests, 
  mockInvoices, 
  mockProjects 
} from './mockData'

interface DemoContextType {
  state: DemoState
  isDemo: boolean
  
  // User actions
  setUser: (user: DemoUser | null) => void
  logout: () => void
  
  // Bank account actions
  addBankAccount: (account: Omit<DemoBankAccount, 'id'>) => Promise<DemoBankAccount>
  setDefaultBankAccount: (id: string) => Promise<void>
  removeBankAccount: (id: string) => Promise<void>
  
  // Transaction actions
  createTransaction: (transaction: Partial<DemoTransaction>) => Promise<DemoTransaction>
  
  // Investment actions
  createInvestment: (investment: Partial<DemoInvestment>) => Promise<DemoInvestment>
  
  // Draw request actions
  createDrawRequest: (draw: Partial<DemoDrawRequest>) => Promise<DemoDrawRequest>
  
  // Invoice actions
  createInvoice: (invoice: Partial<DemoInvoice>) => Promise<DemoInvoice>
  
  // Reset demo
  resetDemo: () => void
}

const DemoContext = createContext<DemoContextType | undefined>(undefined)

const STORAGE_KEY = 'realco_demo_state'

const initialState: DemoState = {
  user: null,
  bankAccounts: mockBankAccounts,
  transactions: mockTransactions,
  offerings: mockOfferings,
  investments: mockInvestments,
  drawRequests: mockDrawRequests,
  invoices: mockInvoices,
  projects: mockProjects,
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(initialState)
  const [isDemo] = useState(true) // Always in demo mode for now

  // Load state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Convert date strings back to Date objects
        if (parsed.transactions) {
          parsed.transactions = parsed.transactions.map((t: any) => ({
            ...t,
            date: new Date(t.date)
          }))
        }
        if (parsed.investments) {
          parsed.investments = parsed.investments.map((i: any) => ({
            ...i,
            date: new Date(i.date)
          }))
        }
        if (parsed.drawRequests) {
          parsed.drawRequests = parsed.drawRequests.map((d: any) => ({
            ...d,
            date: new Date(d.date)
          }))
        }
        if (parsed.invoices) {
          parsed.invoices = parsed.invoices.map((i: any) => ({
            ...i,
            date: new Date(i.date)
          }))
        }
        if (parsed.projects) {
          parsed.projects = parsed.projects.map((p: any) => ({
            ...p,
            startDate: new Date(p.startDate),
            expectedCompletion: new Date(p.expectedCompletion)
          }))
        }
        setState(parsed)
      } catch (error) {
        console.error('Failed to load demo state:', error)
      }
    }
  }, [])

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Simulate async delay
  const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms))

  const setUser = (user: DemoUser | null) => {
    setState(prev => ({ ...prev, user }))
  }

  const logout = () => {
    setState(prev => ({ ...prev, user: null }))
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userRole')
  }

  const addBankAccount = async (account: Omit<DemoBankAccount, 'id'>): Promise<DemoBankAccount> => {
    await delay()
    const newAccount: DemoBankAccount = {
      ...account,
      id: `bank-${Date.now()}`,
    }
    setState(prev => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, newAccount]
    }))
    return newAccount
  }

  const setDefaultBankAccount = async (id: string): Promise<void> => {
    await delay()
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map(acc => ({
        ...acc,
        isDefault: acc.id === id
      }))
    }))
  }

  const removeBankAccount = async (id: string): Promise<void> => {
    await delay()
    setState(prev => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter(acc => acc.id !== id)
    }))
  }

  const createTransaction = async (transaction: Partial<DemoTransaction>): Promise<DemoTransaction> => {
    await delay(800)
    const newTransaction: DemoTransaction = {
      id: `txn-${Date.now()}`,
      type: transaction.type || 'DEPOSIT',
      amount: transaction.amount || 0,
      status: 'PROCESSING',
      date: new Date(),
      description: transaction.description || '',
      paymentMethod: transaction.paymentMethod || 'ACH',
      from: transaction.from || '',
      to: transaction.to || '',
    }
    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions]
    }))
    
    // Simulate status update after delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        transactions: prev.transactions.map(t =>
          t.id === newTransaction.id ? { ...t, status: 'COMPLETED' } : t
        )
      }))
    }, 3000)
    
    return newTransaction
  }

  const createInvestment = async (investment: Partial<DemoInvestment>): Promise<DemoInvestment> => {
    await delay(1000)
    const newInvestment: DemoInvestment = {
      id: `inv-${Date.now()}`,
      offeringId: investment.offeringId || '',
      amount: investment.amount || 0,
      date: new Date(),
      status: 'ACTIVE',
      returnToDate: 0,
    }
    setState(prev => ({
      ...prev,
      investments: [...prev.investments, newInvestment]
    }))
    
    // Create corresponding transaction
    await createTransaction({
      type: 'DEPOSIT',
      amount: newInvestment.amount,
      description: `Investment in ${mockOfferings.find(o => o.id === newInvestment.offeringId)?.name}`,
      paymentMethod: 'ACH',
      from: 'Chase Bank ••4242',
      to: 'Escrow Account',
    })
    
    return newInvestment
  }

  const createDrawRequest = async (draw: Partial<DemoDrawRequest>): Promise<DemoDrawRequest> => {
    await delay(600)
    const newDraw: DemoDrawRequest = {
      id: `DR-${String(state.drawRequests.length + 1).padStart(3, '0')}`,
      projectName: draw.projectName || '',
      amount: draw.amount || 0,
      category: draw.category || '',
      status: 'PENDING',
      date: new Date(),
      description: draw.description || '',
    }
    setState(prev => ({
      ...prev,
      drawRequests: [newDraw, ...prev.drawRequests]
    }))
    
    // Simulate approval after delay
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        drawRequests: prev.drawRequests.map(d =>
          d.id === newDraw.id ? { ...d, status: 'APPROVED' } : d
        )
      }))
    }, 2000)
    
    return newDraw
  }

  const createInvoice = async (invoice: Partial<DemoInvoice>): Promise<DemoInvoice> => {
    await delay(600)
    const newInvoice: DemoInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoice.invoiceNumber || `INV-2026-${String(state.invoices.length + 1).padStart(3, '0')}`,
      projectName: invoice.projectName || '',
      amount: invoice.amount || 0,
      status: 'SUBMITTED',
      date: new Date(),
      description: invoice.description || '',
    }
    setState(prev => ({
      ...prev,
      invoices: [newInvoice, ...prev.invoices]
    }))
    
    // Simulate review process
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        invoices: prev.invoices.map(i =>
          i.id === newInvoice.id ? { ...i, status: 'UNDER_REVIEW' } : i
        )
      }))
    }, 2000)
    
    return newInvoice
  }

  const resetDemo = () => {
    setState(initialState)
    localStorage.removeItem(STORAGE_KEY)
    logout()
  }

  const value: DemoContextType = {
    state,
    isDemo,
    setUser,
    logout,
    addBankAccount,
    setDefaultBankAccount,
    removeBankAccount,
    createTransaction,
    createInvestment,
    createDrawRequest,
    createInvoice,
    resetDemo,
  }

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider')
  }
  return context
}

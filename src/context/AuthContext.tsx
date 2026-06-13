import { createContext, useContext, useState, ReactNode } from 'react'
import type { User, UserRole, AuthState, ValidationResult } from '../types/auth'

interface AuthContextType extends AuthState {
  login: (loginId: string, passwordHash: string, role: UserRole) => ValidationResult
  signup: (user: Omit<User, 'id'>) => ValidationResult
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Pre-populate with one admin and one user for testing convenience
const mockDatabase: User[] = [
  { id: '1', loginId: 'admin123', email: 'admin@system.com', passwordHash: 'Admin@123', role: 'admin' },
  { id: '2', loginId: 'user1234', email: 'user@system.com', passwordHash: 'User@1234', role: 'user' }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(mockDatabase)
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  })

  const login = (loginId: string, passwordHash: string, role: UserRole): ValidationResult => {
    const user = users.find(u => u.loginId === loginId && u.passwordHash === passwordHash && u.role === role)
    if (user) {
      setAuthState({ user, isAuthenticated: true })
      return { isValid: true, errors: [] }
    }
    return { isValid: false, errors: ['Invalid Login Id or Password'] }
  }

  const signup = (newUser: Omit<User, 'id'>): ValidationResult => {
    const errors: string[] = []

    // 1. login ID should be unique and must be in between 6-12 characters.
    if (newUser.loginId.length < 6 || newUser.loginId.length > 12) {
      errors.push('Login ID must be between 6 and 12 characters.')
    }
    if (users.some(u => u.loginId === newUser.loginId)) {
      errors.push('Login ID already exists.')
    }

    // 2. Email Id should not be a duplicate in database.
    if (users.some(u => u.email === newUser.email)) {
      errors.push('Email ID is already registered.')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      errors.push('Invalid Email ID format.')
    }

    // 3. Password must be unique and must contain a small case, a large case and a special character and length should be in more then 8 characters.
    if (newUser.passwordHash.length <= 8) {
      errors.push('Password must be more than 8 characters.')
    }
    if (!/[a-z]/.test(newUser.passwordHash)) {
      errors.push('Password must contain at least one lowercase letter.')
    }
    if (!/[A-Z]/.test(newUser.passwordHash)) {
      errors.push('Password must contain at least one uppercase letter.')
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(newUser.passwordHash)) {
      errors.push('Password must contain at least one special character.')
    }
    // "Password must be unique" -> We check if anyone else has this exact password
    if (users.some(u => u.passwordHash === newUser.passwordHash)) {
      errors.push('This password has been used before. Please choose a unique password.')
    }

    if (errors.length === 0) {
      const userToCreate: User = { ...newUser, id: String(Date.now()) }
      setUsers([...users, userToCreate])
      return { isValid: true, errors: [] }
    }

    return { isValid: false, errors }
  }

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider value={{ ...authState, login, signup, logout }}>
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

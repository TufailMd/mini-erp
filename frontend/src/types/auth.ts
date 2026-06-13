export type UserRole = 'admin' | 'user'

export interface User {
  id: string
  loginId: string
  email: string
  passwordHash: string // Note: We use a plaintext password for this mock, but we call it Hash to signify how it should be used.
  role: UserRole
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

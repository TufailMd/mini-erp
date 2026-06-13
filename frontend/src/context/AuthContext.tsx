import { createContext, useContext, useState, ReactNode } from 'react'
import type { User, UserRole, AuthState, ValidationResult } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (loginId: string, passwordHash: string, role: UserRole) => Promise<ValidationResult>
  signup: (user: Omit<User, 'id'>) => Promise<ValidationResult>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  })

  const login = async (loginId: string, passwordHash: string, _role: UserRole): Promise<ValidationResult> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginId, password: passwordHash })
      });
      const json = await res.json();
      // Unwrap { success, data } envelope
      const payload = json.data || json;
      if (res.ok) {
        localStorage.setItem('token', payload.token);
        const userObj = { id: payload.user.id, loginId: payload.user.email, email: payload.user.email, passwordHash: '', role: 'user' as const };
        setAuthState({ user: userObj, isAuthenticated: true });
        return { isValid: true, errors: [] };
      }
      return { isValid: false, errors: [json.message || 'Login failed'] };
    } catch (err) {
      return { isValid: false, errors: ['Network error connecting to backend'] };
    }
  }

  const signup = async (newUser: Omit<User, 'id'>): Promise<ValidationResult> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser.loginId, email: newUser.email, password: newUser.passwordHash })
      });
      const json = await res.json();
      if (res.ok) {
        return { isValid: true, errors: [] };
      }
      return { isValid: false, errors: [json.message || 'Registration failed'] };
    } catch (err) {
      return { isValid: false, errors: ['Network error connecting to backend'] };
    }
  }

  const logout = () => {
    localStorage.removeItem('token');
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

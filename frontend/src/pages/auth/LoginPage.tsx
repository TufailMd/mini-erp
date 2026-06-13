import { useState } from 'react'
import type { PageProps } from '@/types'
import { useAuth } from '@/context/AuthContext'
import type { UserRole } from '@/types/auth'

export default function LoginPage({ onNavigate }: PageProps) {
  const [role, setRole] = useState<UserRole>('admin')
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = await login(loginId, password, role)
    if (result.isValid) {
      onNavigate('dashboard')
    } else {
      setError(result.errors[0] || 'Invalid login details')
    }
  }

  const toggleRole = () => {
    setRole(role === 'admin' ? 'user' : 'admin')
    setError(null)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* App Logo */}
        <div className="mb-10 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-xl font-bold text-white">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Nexus<span className="text-indigo-600">ERP</span></span>
          </div>
        </div>

        <h2 className="mb-6 text-center text-lg font-semibold text-slate-800">
          {role === 'admin' ? 'Login for System Administrator' : 'Login for System User'}
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Login Id</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              SIGN IN
            </button>
          </div>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3 text-sm">
          <div className="text-slate-500">
            <button onClick={() => onNavigate('forgot-password')} className="hover:text-indigo-600 hover:underline">Forget Password ?</button>
            {' | '}
            <button onClick={() => onNavigate('signup')} className="hover:text-indigo-600 hover:underline">Sign Up</button>
          </div>
          <button onClick={toggleRole} className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
            {role === 'admin' ? 'Login as User' : 'Login as System Administrator'}
          </button>
        </div>
      </div>
    </div>
  )
}

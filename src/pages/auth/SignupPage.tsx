import { useState } from 'react'
import type { PageProps } from '../../types'
import { useAuth } from '../../context/AuthContext'

export default function SignupPage({ onNavigate }: PageProps) {
  const [loginId, setLoginId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  
  const { signup } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])

    if (password !== confirmPassword) {
      setErrors(['Passwords do not match.'])
      return
    }

    const result = signup({
      loginId,
      email,
      passwordHash: password,
      role: 'user' // Default to user on signup, admins must be created by admins (or pre-seeded)
    })

    if (result.isValid) {
      // Auto redirect to login after successful signup
      onNavigate('login')
    } else {
      setErrors(result.errors)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* App Logo */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-xl font-bold text-white">
              N
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Nexus<span className="text-indigo-600">ERP</span></span>
          </div>
        </div>

        <h2 className="mb-6 text-center text-lg font-semibold text-slate-800">
          Sign up Page
        </h2>

        {errors.length > 0 && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
            <ul className="list-disc pl-4 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Enter Login Id</label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-2/3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Enter Email Id</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-2/3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Enter Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-2/3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex items-center">
            <label className="w-1/3 text-sm font-medium text-slate-700">Re-Enter Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-2/3 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="rounded-lg border border-slate-300 bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              SIGN UP
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm">
          <p className="text-slate-500">
            Already have an account? <button onClick={() => onNavigate('login')} className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">Sign In</button>
          </p>
        </div>
      </div>
    </div>
  )
}

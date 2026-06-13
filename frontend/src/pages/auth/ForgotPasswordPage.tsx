import type { PageProps } from '@/types'

export default function ForgotPasswordPage({ onNavigate }: PageProps) {
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
          Reset Password
        </h2>

        <p className="mb-6 text-sm text-slate-600 text-center">
          Enter your email address below and we'll send you instructions to reset your password.
        </p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Reset link sent!'); onNavigate('login') }}>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Send Reset Link
            </button>
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

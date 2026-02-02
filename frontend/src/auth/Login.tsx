import { useState } from 'react'
import { loginApi } from '../api/auth.api'
import { useAuthStore } from './auth.store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(email, password)
      login(res.access_token, res.role)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
  }

  const testBypass = (role: 'user' | 'admin') => {
    login('test-token-' + role, role)
    navigate('/dashboard')
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo and Branding */}
      <div className="text-center mb-8">
        <div className="inline-block mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center font-bold text-white text-3xl shadow-lg">
            F
          </div>
        </div>
        <h1 className="text-3xl font-bold text-blue-600 mb-2">
          FinGuard AI
        </h1>
        <p className="text-gray-600 text-sm">
          Advanced Fraud Detection & Prevention
        </p>
      </div>

      {/* Login Card */}
      <div className="card p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Login to Dashboard</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              className="input"
              placeholder="your@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </div>

          <button
            className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={submit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></span>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Development Bypass - Remove in production */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Dev Mode - Quick Access</p>
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                onClick={() => testBypass('user')}
              >
                Test as User
              </button>
              <button
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                onClick={() => testBypass('admin')}
              >
                Test as Admin
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
            Sign up
          </a>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>🔒 Bank-level security • Real-time fraud detection</p>
      </div>
    </div>
  )
}

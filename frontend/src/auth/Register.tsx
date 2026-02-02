import { useState } from 'react'
import { registerApi } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    setError('')

    if (!email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await registerApi({
        email,
        password,
        role
      })
      navigate('/login')
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            Create your fraud detection account
          </p>
        </div>

        {/* Register Card */}
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create Account</h2>

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
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Account Type</label>
              <select
                className="input"
                value={role}
                onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                disabled={loading}
              >
                <option value="user">👤 Regular User</option>
                <option value="admin">👨‍💼 Administrator</option>
              </select>
            </div>

            <button
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></span>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

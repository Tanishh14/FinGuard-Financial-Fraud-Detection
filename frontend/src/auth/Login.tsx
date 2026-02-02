import { useState } from 'react'
import { loginApi } from '../api/auth.api'
import { useAuthStore } from './auth.store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  const submit = async () => {
    try {
      const res = await loginApi(email, password)

      login(res.access_token, res.role)
      navigate('/dashboard')
    } catch (err) {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="bg-white p-8 rounded shadow w-96">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        FinGuard AI
      </h1>

      <input
        className="input mb-3"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="input mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn-primary w-full"
        onClick={submit}
      >
        Login
      </button>
    </div>
  )
}

import { useState } from 'react'
import { registerApi } from '../api/auth.api'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const navigate = useNavigate()

  const submit = async () => {
    try {
      await registerApi({
        email,
        password,
        role
      })

      navigate('/login')
    } catch (err) {
      alert('Registration failed')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-6 text-center">
          Create Account
        </h2>

        <input
          className="input mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="input mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="input mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          className="btn-primary w-full"
          onClick={submit}
        >
          Register
        </button>
      </div>
    </div>
  )
}

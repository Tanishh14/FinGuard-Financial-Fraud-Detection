import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const navigate = useNavigate()
  const { logout, role } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-md">
          F
        </div>
        <div className="font-bold text-xl text-blue-600">
          FinGuard AI
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-300 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
            Live Monitoring
          </span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <span className="text-sm font-medium text-gray-700 capitalize">{role === 'admin' ? '👨‍💼 Admin' : '👤 User'}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

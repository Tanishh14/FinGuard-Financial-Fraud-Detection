import { useAuth } from '../hooks/useAuth'
import AdminDashboard from '../dashboard/AdminDashboard'
import UserDashboard from '../dashboard/UserDashboard'

export default function DashboardPage() {
  const { role } = useAuth()
  return role === 'admin' ? <AdminDashboard /> : <UserDashboard />
}

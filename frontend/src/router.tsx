import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  { path: '*', element: <NotFound /> }
])

export default router

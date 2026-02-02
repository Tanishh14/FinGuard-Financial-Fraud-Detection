import { createBrowserRouter, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import GNNFraudRingsPage from './pages/GNNFraudRingsPage'
import AnomalyDetectionPage from './pages/AnomalyDetectionPage'
import ExplainabilityPage from './pages/ExplainabilityPage'
import LiveTransactionsPage from './pages/LiveTransactionsPage'

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
  {
    path: '/gnn-fraud-rings',
    element: (
      <ProtectedRoute>
        <GNNFraudRingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/anomaly-detection',
    element: (
      <ProtectedRoute>
        <AnomalyDetectionPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/explainability',
    element: (
      <ProtectedRoute>
        <ExplainabilityPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/live-transactions',
    element: (
      <ProtectedRoute>
        <LiveTransactionsPage />
      </ProtectedRoute>
    )
  },
  { path: '*', element: <NotFound /> }
])

export default router

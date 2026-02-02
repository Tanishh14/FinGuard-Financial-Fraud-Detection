import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import StatCard from '../components/StatCard'
import TransactionsTable from '../components/TransactionsTable'
import { fetchTransactions } from '../api/transactions.api'

interface Transaction {
  id: number
  user_id: number
  merchant: string
  amount: number
  device_id: string
  ip_address: string
  location: string
  avg_user_spend: number
  risk_score: number
  decision: string
  timestamp: string
}

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        const data = await fetchTransactions()
        setTransactions(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  // Calculate stats from transactions
  const totalTransactions = transactions.length
  const fraudPrevented = transactions
    .filter(tx => tx.decision === 'BLOCKED' || tx.decision === 'FLAGGED')
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  const accuracyCount = transactions.filter(tx => tx.risk_score > 0).length
  const accuracy = accuracyCount > 0 
    ? ((transactions.filter(tx => tx.risk_score > 70).length / accuracyCount) * 100).toFixed(1)
    : '0'
  
  const avgLatency = transactions.length > 0 ? '45' : '0' // Placeholder - should come from backend

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon="📊"
          trend=""
          color="blue"
        />
        <StatCard
          title="Fraud Prevented"
          value={`₹${(fraudPrevented / 10000000).toFixed(2)} Cr`}
          icon="🛡️"
          trend=""
          color="orange"
        />
        <StatCard
          title="Detection Accuracy"
          value={`${accuracy}%`}
          icon="🎯"
          trend=""
          color="green"
        />
        <StatCard
          title="Avg. Latency"
          value={`${avgLatency}ms`}
          icon="⚡"
          trend=""
          color="green"
        />
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Transactions</h2>
        <p className="text-gray-600 text-sm">Real-time fraud detection and analysis</p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center p-8">
          <span className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></span>
        </div>
      )}

      {/* Transactions Table */}
      {!loading && <TransactionsTable transactions={transactions} />}
    </AdminLayout>
  )
}


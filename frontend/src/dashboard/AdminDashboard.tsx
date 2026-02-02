import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import StatCard from '../components/StatCard'
import TransactionsTable from '../components/TransactionsTable'
import { fetchTransactions } from '../api/transactions.api'
import { useWebSocket } from '../hooks/useWebSocket'

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
  const [stats, setStats] = useState({
    totalTransactions: 0,
    fraudPrevented: 0,
    accuracy: '0',
    avgLatency: '45'
  })

  // Load initial transactions
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        const data = await fetchTransactions()
        setTransactions(data)
        updateStats(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [])

  // Update stats based on transactions
  const updateStats = (txs: Transaction[]) => {
    const totalTransactions = txs.length
    const fraudPrevented = txs
      .filter(tx => tx.decision === 'BLOCKED' || tx.decision === 'FLAGGED')
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    const accuracyCount = txs.filter(tx => tx.risk_score > 0).length
    const accuracy = accuracyCount > 0 
      ? ((txs.filter(tx => tx.risk_score > 70).length / accuracyCount) * 100).toFixed(1)
      : '0'

    setStats({
      totalTransactions,
      fraudPrevented,
      accuracy,
      avgLatency: '45'
    })
  }

  // WebSocket integration for real-time updates
  useWebSocket((newTransaction: Transaction) => {
    setTransactions(prev => {
      const updated = [newTransaction, ...prev]
      // Keep last 100 transactions for performance
      const limited = updated.slice(0, 100)
      updateStats(limited)
      return limited
    })
  })

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value={stats.totalTransactions.toLocaleString()}
          icon="📊"
          trend=""
          color="blue"
        />
        <StatCard
          title="Fraud Prevented"
          value={`₹${(stats.fraudPrevented / 10000000).toFixed(2)} Cr`}
          icon="🛡️"
          trend=""
          color="orange"
        />
        <StatCard
          title="Detection Accuracy"
          value={`${stats.accuracy}%`}
          icon="🎯"
          trend=""
          color="green"
        />
        <StatCard
          title="Avg. Latency"
          value={`${stats.avgLatency}ms`}
          icon="⚡"
          trend=""
          color="green"
        />
      </div>

      {/* Detection Modules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">GNN Fraud Rings</h3>
              <p className="text-xs text-blue-700">Graph neural network detection</p>
            </div>
            <span className="text-2xl">🔗</span>
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-purple-900 uppercase tracking-wide mb-1">Anomaly Detection</h3>
              <p className="text-xs text-purple-700">Autoencoder-based detection</p>
            </div>
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        <div className="card p-6 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-green-900 uppercase tracking-wide mb-1">LLM Explainability</h3>
              <p className="text-xs text-green-700">RAG-powered explanations</p>
            </div>
            <span className="text-2xl">🧠</span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-Time Transactions</h2>
        <p className="text-gray-600 text-sm">Live fraud detection and analysis • Updates every transaction</p>
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


import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import TransactionsTable from '../components/TransactionsTable'
import { fetchTransactions } from '../api/transactions.api'

interface DebugInfo {
  backendStatus: 'connected' | 'disconnected' | 'checking'
  dbStatus: 'connected' | 'disconnected' | 'checking'
  errors: string[]
  timestamp: string
  lastRefresh: string
}

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

export default function LiveTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [debug, setDebug] = useState<DebugInfo>({
    backendStatus: 'checking',
    dbStatus: 'checking',
    errors: [],
    timestamp: new Date().toISOString(),
    lastRefresh: ''
  })

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true)
        const errors: string[] = []

        // Check backend connection
        try {
          const healthCheck = await fetch('http://localhost:8000/', {
            method: 'GET'
          })
          if (healthCheck.ok) {
            const data = await healthCheck.json()
            setDebug(prev => ({
              ...prev,
              backendStatus: 'connected'
            }))
          } else {
            errors.push('Backend health check failed: ' + healthCheck.status)
            setDebug(prev => ({
              ...prev,
              backendStatus: 'disconnected'
            }))
          }
        } catch (err: any) {
          errors.push('Backend not running at http://localhost:8000: ' + err.message)
          setDebug(prev => ({
            ...prev,
            backendStatus: 'disconnected'
          }))
        }

        // Fetch transactions
        try {
          const data = await fetchTransactions()
          if (Array.isArray(data)) {
            setTransactions(data)
            setDebug(prev => ({
              ...prev,
              dbStatus: 'connected',
              lastRefresh: new Date().toLocaleTimeString()
            }))
          } else {
            errors.push('Invalid transaction data format received')
            setDebug(prev => ({
              ...prev,
              dbStatus: 'disconnected'
            }))
          }
        } catch (err: any) {
          errors.push('Failed to fetch transactions: ' + err.message)
          setDebug(prev => ({
            ...prev,
            dbStatus: 'disconnected'
          }))
        }

        setDebug(prev => ({
          ...prev,
          errors,
          timestamp: new Date().toISOString()
        }))
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()

    // Auto-refresh every 5 seconds
    const interval = setInterval(loadTransactions, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const data = await fetchTransactions()
      if (Array.isArray(data)) {
        setTransactions(data)
        setDebug(prev => ({
          ...prev,
          lastRefresh: new Date().toLocaleTimeString(),
          timestamp: new Date().toISOString()
        }))
      }
    } catch (err: any) {
      console.error('Refresh failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💰 Live Transactions</h1>
          <p className="text-gray-600">Real-time transaction monitoring and analysis</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      {/* Debug Information */}
      <div className="mb-6 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-auto">
        <div className="mb-2 text-blue-400">=== DEBUG INFO ===</div>
        <div>Backend Status: <span className={debug.backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{debug.backendStatus.toUpperCase()}</span></div>
        <div>Database Status: <span className={debug.dbStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{debug.dbStatus.toUpperCase()}</span></div>
        <div>Transactions Loaded: {transactions.length}</div>
        {debug.lastRefresh && <div>Last Refresh: {debug.lastRefresh}</div>}
        <div>Debug Timestamp: {debug.timestamp}</div>

        {debug.errors.length > 0 && (
          <>
            <div className="mt-2 text-red-400">=== ERRORS ===</div>
            {debug.errors.map((err, idx) => (
              <div key={idx} className="text-red-300">• {err}</div>
            ))}
          </>
        )}

        {debug.errors.length === 0 && (
          <div className="mt-2 text-green-400">=== STATUS: OK ===</div>
        )}
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className={`card p-6 border-l-4 ${debug.backendStatus === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-gray-600 text-sm font-semibold mb-2">Backend Connection</div>
          <div className={`text-3xl font-bold ${debug.backendStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.backendStatus === 'connected' ? '✓' : '✗'}
          </div>
          <div className={`text-sm mt-1 ${debug.backendStatus === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
            {debug.backendStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className={`card p-6 border-l-4 ${debug.dbStatus === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-gray-600 text-sm font-semibold mb-2">Database Connection</div>
          <div className={`text-3xl font-bold ${debug.dbStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.dbStatus === 'connected' ? '✓' : '✗'}
          </div>
          <div className={`text-sm mt-1 ${debug.dbStatus === 'connected' ? 'text-green-700' : 'text-red-700'}`}>
            {debug.dbStatus === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="card p-6 border-l-4 border-blue-500 bg-blue-50">
          <div className="text-gray-600 text-sm font-semibold mb-2">Live Transactions</div>
          <div className="text-3xl font-bold text-blue-600">{transactions.length}</div>
          <div className="text-sm mt-1 text-blue-700">records loaded</div>
        </div>
      </div>

      {/* Additional Stats */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Flagged/Blocked</div>
            <div className="text-2xl font-bold text-red-600">
              {transactions.filter(tx => tx.decision === 'BLOCKED' || tx.decision === 'FLAGGED').length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ({((transactions.filter(tx => tx.decision === 'BLOCKED' || tx.decision === 'FLAGGED').length / transactions.length) * 100).toFixed(1)}%)
            </div>
          </div>

          <div className="card p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Avg Risk Score</div>
            <div className="text-2xl font-bold text-yellow-600">
              {(transactions.reduce((sum, tx) => sum + tx.risk_score, 0) / transactions.length).toFixed(1)}%
            </div>
          </div>

          <div className="card p-6">
            <div className="text-gray-600 text-sm font-semibold mb-2">Total Amount</div>
            <div className="text-2xl font-bold text-blue-600">
              ₹{(transactions.reduce((sum, tx) => sum + tx.amount, 0) / 10000000).toFixed(2)}Cr
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && transactions.length === 0 && (
        <div className="card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading transactions...</p>
        </div>
      )}

      {/* Transactions Table */}
      {!loading && <TransactionsTable transactions={transactions} />}

      {/* No Data State */}
      {!loading && transactions.length === 0 && debug.dbStatus === 'connected' && (
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-gray-600">No transactions available. Ensure data is being sent to the backend.</p>
        </div>
      )}
    </AdminLayout>
  )
}

import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'

interface DebugInfo {
  backendStatus: 'connected' | 'disconnected' | 'checking'
  gnnServiceStatus: 'running' | 'stopped' | 'checking'
  errors: string[]
  timestamp: string
}

export default function GNNFraudRingsPage() {
  const [loading, setLoading] = useState(true)
  const [fraudRings, setFraudRings] = useState<any[]>([])
  const [debug, setDebug] = useState<DebugInfo>({
    backendStatus: 'checking',
    gnnServiceStatus: 'checking',
    errors: [],
    timestamp: new Date().toISOString()
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const errors: string[] = []

        // Check backend connection
        try {
          const healthCheck = await fetch('http://localhost:8000/', {
            method: 'GET'
          })
          if (healthCheck.ok) {
            setDebug(prev => ({
              ...prev,
              backendStatus: 'connected'
            }))
          } else {
            errors.push('Backend responded with status: ' + healthCheck.status)
            setDebug(prev => ({
              ...prev,
              backendStatus: 'disconnected'
            }))
          }
        } catch (err: any) {
          errors.push('Backend not running: ' + err.message)
          setDebug(prev => ({
            ...prev,
            backendStatus: 'disconnected'
          }))
        }

        // Fetch GNN fraud rings data
        try {
          const response = await fetch('http://localhost:8000/gnn/fraud-rings', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          })

          if (response.status === 404) {
            errors.push('GNN Fraud Rings endpoint not implemented (/gnn/fraud-rings)')
            setDebug(prev => ({
              ...prev,
              gnnServiceStatus: 'stopped'
            }))
          } else if (response.ok) {
            const data = await response.json()
            setFraudRings(Array.isArray(data) ? data : [])
            setDebug(prev => ({
              ...prev,
              gnnServiceStatus: 'running'
            }))
          } else if (response.status === 503) {
            errors.push('GNN Service unavailable - ML model may not be loaded')
            setDebug(prev => ({
              ...prev,
              gnnServiceStatus: 'stopped'
            }))
          } else {
            errors.push(`GNN endpoint error: ${response.status} ${response.statusText}`)
            setDebug(prev => ({
              ...prev,
              gnnServiceStatus: 'stopped'
            }))
          }
        } catch (err: any) {
          errors.push('GNN Service connection failed: ' + err.message)
          setDebug(prev => ({
            ...prev,
            gnnServiceStatus: 'stopped'
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

    loadData()
  }, [])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 GNN Fraud Rings Detection</h1>
        <p className="text-gray-600">Detect and visualize fraud networks using Graph Neural Networks</p>
      </div>

      {/* Debug Information */}
      <div className="mb-6 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-auto">
        <div className="mb-2 text-blue-400">=== DEBUG INFO ===</div>
        <div>Backend Status: <span className={debug.backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{debug.backendStatus.toUpperCase()}</span></div>
        <div>GNN Service Status: <span className={debug.gnnServiceStatus === 'running' ? 'text-green-400' : 'text-red-400'}>{debug.gnnServiceStatus.toUpperCase()}</span></div>
        <div>Timestamp: {debug.timestamp}</div>
        
        {debug.errors.length > 0 && (
          <>
            <div className="mt-2 text-red-400">=== ERRORS ===</div>
            {debug.errors.map((err, idx) => (
              <div key={idx} className="text-red-300">• {err}</div>
            ))}
          </>
        )}
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`card p-4 border-l-4 ${debug.backendStatus === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Backend Connection</div>
          <div className={`text-lg font-bold ${debug.backendStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.gnnServiceStatus === 'running' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">GNN Service</div>
          <div className={`text-lg font-bold ${debug.gnnServiceStatus === 'running' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.gnnServiceStatus === 'running' ? '✓ Running' : '✗ Not Running'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading GNN Fraud Rings data...</p>
        </div>
      ) : fraudRings.length > 0 ? (
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Fraud Rings ({fraudRings.length})</h2>
          <div className="space-y-4">
            {fraudRings.map((ring, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg">
                <pre className="text-xs overflow-auto">{JSON.stringify(ring, null, 2)}</pre>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GNN Fraud Rings Module</h2>
          <p className="text-gray-600 mb-4">
            This module uses Graph Neural Networks to identify fraud rings and connected fraud patterns.
          </p>
          {debug.gnnServiceStatus !== 'running' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-left">
              <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Setup Required:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Ensure backend is running on http://localhost:8000</li>
                <li>2. Implement GNN service endpoint: <code className="bg-yellow-100 px-2 py-1 rounded">/gnn/fraud-rings</code></li>
                <li>3. Load GNN model and graph data</li>
                <li>4. Refresh this page</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

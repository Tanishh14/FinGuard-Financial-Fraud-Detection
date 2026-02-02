import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'

interface DebugInfo {
  backendStatus: 'connected' | 'disconnected' | 'checking'
  anomalyServiceStatus: 'running' | 'stopped' | 'checking'
  modelStatus: 'loaded' | 'not_loaded' | 'checking'
  errors: string[]
  timestamp: string
}

interface Anomaly {
  id: number
  transaction_id: number
  anomaly_score: number
  anomaly_type: string
  description: string
}

export default function AnomalyDetectionPage() {
  const [loading, setLoading] = useState(true)
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [debug, setDebug] = useState<DebugInfo>({
    backendStatus: 'checking',
    anomalyServiceStatus: 'checking',
    modelStatus: 'checking',
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

        // Fetch anomalies data
        try {
          const response = await fetch('http://localhost:8000/anomaly/detection', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          })

          if (response.status === 404) {
            errors.push('Anomaly Detection endpoint not implemented (/anomaly/detection)')
            setDebug(prev => ({
              ...prev,
              anomalyServiceStatus: 'stopped',
              modelStatus: 'not_loaded'
            }))
          } else if (response.ok) {
            const data = await response.json()
            setAnomalies(Array.isArray(data) ? data : [])
            setDebug(prev => ({
              ...prev,
              anomalyServiceStatus: 'running',
              modelStatus: 'loaded'
            }))
          } else if (response.status === 503) {
            errors.push('Anomaly Detection service unavailable - Autoencoder model may not be loaded')
            setDebug(prev => ({
              ...prev,
              anomalyServiceStatus: 'stopped',
              modelStatus: 'not_loaded'
            }))
          } else {
            errors.push(`Anomaly endpoint error: ${response.status} ${response.statusText}`)
            setDebug(prev => ({
              ...prev,
              anomalyServiceStatus: 'stopped'
            }))
          }
        } catch (err: any) {
          errors.push('Anomaly Detection connection failed: ' + err.message)
          setDebug(prev => ({
            ...prev,
            anomalyServiceStatus: 'stopped',
            modelStatus: 'not_loaded'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">⚡ Anomaly Detection</h1>
        <p className="text-gray-600">Identify unusual patterns and outliers in transaction data</p>
      </div>

      {/* Debug Information */}
      <div className="mb-6 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-auto">
        <div className="mb-2 text-blue-400">=== DEBUG INFO ===</div>
        <div>Backend Status: <span className={debug.backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{debug.backendStatus.toUpperCase()}</span></div>
        <div>Anomaly Service: <span className={debug.anomalyServiceStatus === 'running' ? 'text-green-400' : 'text-red-400'}>{debug.anomalyServiceStatus.toUpperCase()}</span></div>
        <div>Model Status: <span className={debug.modelStatus === 'loaded' ? 'text-green-400' : 'text-red-400'}>{debug.modelStatus.toUpperCase()}</span></div>
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
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={`card p-4 border-l-4 ${debug.backendStatus === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Backend Connection</div>
          <div className={`text-lg font-bold ${debug.backendStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.backendStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.anomalyServiceStatus === 'running' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Anomaly Service</div>
          <div className={`text-lg font-bold ${debug.anomalyServiceStatus === 'running' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.anomalyServiceStatus === 'running' ? '✓ Running' : '✗ Stopped'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.modelStatus === 'loaded' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Autoencoder Model</div>
          <div className={`text-lg font-bold ${debug.modelStatus === 'loaded' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.modelStatus === 'loaded' ? '✓ Loaded' : '✗ Not Loaded'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Anomaly Detection data...</p>
        </div>
      ) : anomalies.length > 0 ? (
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Anomalies ({anomalies.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Anomaly Score</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Type</th>
                  <th className="px-4 py-2 text-left text-xs font-bold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {anomalies.map(anomaly => (
                  <tr key={anomaly.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-600">{anomaly.id}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        anomaly.anomaly_score > 0.8 ? 'bg-red-100 text-red-700' :
                        anomaly.anomaly_score > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {(anomaly.anomaly_score * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{anomaly.anomaly_type}</td>
                    <td className="px-4 py-2 text-gray-600">{anomaly.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">⚡</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Anomaly Detection Module</h2>
          <p className="text-gray-600 mb-4">
            This module uses autoencoders and statistical methods to detect anomalous transaction patterns.
          </p>
          {debug.anomalyServiceStatus !== 'running' && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-left">
              <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Setup Required:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Ensure backend is running on http://localhost:8000</li>
                <li>2. Implement Anomaly Detection endpoint: <code className="bg-yellow-100 px-2 py-1 rounded">/anomaly/detection</code></li>
                <li>3. Load Autoencoder model</li>
                <li>4. Refresh this page</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

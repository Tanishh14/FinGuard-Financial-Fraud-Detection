import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'

export default function GNNFraudRingsPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to fetch GNN data when component mounts
    const checkService = async () => {
      try {
        setLoading(true)
        // Attempt to connect to GNN endpoint (will fail gracefully if not available)
        await fetch('http://localhost:8000/gnn/fraud-rings')
      } catch (err) {
        // Service not available yet - that's okay, show placeholder
        setError(null)
      } finally {
        setLoading(false)
      }
    }

    checkService()
  }, [])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🔗 GNN Fraud Rings Detection</h1>
        <p className="text-gray-600">Detect and visualize fraud networks using Graph Neural Networks</p>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2">
          <div className="card p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-6xl mb-4">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Fraud Ring Detection</h2>
            <p className="text-gray-600 mb-6">
              Graph Neural Networks analyze transaction networks to identify coordinated fraud patterns and suspicious actor relationships.
            </p>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
              ⏳ Module Ready for Integration
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="card p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Network Analysis</h3>
              <p className="text-sm text-gray-600">GNN models identify connected fraud rings and suspicious patterns</p>
            </div>
            <div className="card p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Real-Time Detection</h3>
              <p className="text-sm text-gray-600">Detects new fraud rings as they emerge in the transaction network</p>
            </div>
            <div className="card p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Actor Relationships</h3>
              <p className="text-sm text-gray-600">Maps connections between fraudsters and compromised accounts</p>
            </div>
            <div className="card p-6 border-l-4 border-l-blue-500">
              <h3 className="font-semibold text-gray-900 mb-2">Visualization</h3>
              <p className="text-sm text-gray-600">Interactive graph visualization of fraud networks and connections</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card p-6 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-4">Integration Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="text-sm text-gray-700">Awaiting Backend Endpoint</span>
              </div>
              <div className="text-xs text-gray-500 mt-4">
                <strong>Required endpoint:</strong>
                <code className="block mt-1 p-2 bg-gray-100 rounded font-mono text-xs">GET /gnn/fraud-rings</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

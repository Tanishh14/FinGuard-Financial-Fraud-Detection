import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'

interface DebugInfo {
  backendStatus: 'connected' | 'disconnected' | 'checking'
  explainabilityServiceStatus: 'running' | 'stopped' | 'checking'
  ollamaStatus: 'running' | 'stopped' | 'checking'
  ragStatus: 'working' | 'error' | 'checking'
  errors: string[]
  timestamp: string
}

interface Explanation {
  transaction_id: number
  risk_score: number
  decision: string
  explanation: string
}

export default function ExplainabilityPage() {
  const [loading, setLoading] = useState(true)
  const [explanations, setExplanations] = useState<Explanation[]>([])
  const [selectedTxId, setSelectedTxId] = useState<number | null>(null)
  const [generatingExplanation, setGeneratingExplanation] = useState(false)
  const [debug, setDebug] = useState<DebugInfo>({
    backendStatus: 'checking',
    explainabilityServiceStatus: 'checking',
    ollamaStatus: 'checking',
    ragStatus: 'checking',
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

        // Check Ollama connection
        try {
          const ollamaCheck = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: 'llama3',
              prompt: 'test',
              stream: false
            })
          })
          if (ollamaCheck.ok) {
            setDebug(prev => ({
              ...prev,
              ollamaStatus: 'running',
              ragStatus: 'working'
            }))
          } else {
            errors.push('Ollama responded with error: ' + ollamaCheck.status)
            setDebug(prev => ({
              ...prev,
              ollamaStatus: 'stopped',
              ragStatus: 'error'
            }))
          }
        } catch (err: any) {
          errors.push('Ollama not running on localhost:11434 - LLM explainability unavailable')
          setDebug(prev => ({
            ...prev,
            ollamaStatus: 'stopped',
            ragStatus: 'error'
          }))
        }

        // Test explainability endpoint
        try {
          const response = await fetch('http://localhost:8000/explainability/transaction/1', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
            }
          })

          if (response.status === 404) {
            errors.push('Explainability endpoint not found (/explainability/transaction/{id})')
            setDebug(prev => ({
              ...prev,
              explainabilityServiceStatus: 'stopped'
            }))
          } else if (response.ok) {
            const data = await response.json()
            setExplanations([data])
            setDebug(prev => ({
              ...prev,
              explainabilityServiceStatus: 'running'
            }))
          } else if (response.status === 401 || response.status === 403) {
            errors.push('Unauthorized access to explainability endpoint')
            setDebug(prev => ({
              ...prev,
              explainabilityServiceStatus: 'running'
            }))
          } else {
            errors.push(`Explainability endpoint error: ${response.status}`)
            setDebug(prev => ({
              ...prev,
              explainabilityServiceStatus: 'stopped'
            }))
          }
        } catch (err: any) {
          errors.push('Explainability service connection failed: ' + err.message)
          setDebug(prev => ({
            ...prev,
            explainabilityServiceStatus: 'stopped'
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

  const generateExplanation = async (txId: number) => {
    setGeneratingExplanation(true)
    try {
      const response = await fetch(`http://localhost:8000/explainability/transaction/${txId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setExplanations([data])
        setSelectedTxId(txId)
      }
    } catch (err: any) {
      console.error('Error generating explanation:', err)
    } finally {
      setGeneratingExplanation(false)
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 LLM + RAG Explainability</h1>
        <p className="text-gray-600">Get AI-powered explanations for fraud detection decisions</p>
      </div>

      {/* Debug Information */}
      <div className="mb-6 p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm overflow-auto">
        <div className="mb-2 text-blue-400">=== DEBUG INFO ===</div>
        <div>Backend Status: <span className={debug.backendStatus === 'connected' ? 'text-green-400' : 'text-red-400'}>{debug.backendStatus.toUpperCase()}</span></div>
        <div>Explainability Service: <span className={debug.explainabilityServiceStatus === 'running' ? 'text-green-400' : 'text-red-400'}>{debug.explainabilityServiceStatus.toUpperCase()}</span></div>
        <div>Ollama LLM: <span className={debug.ollamaStatus === 'running' ? 'text-green-400' : 'text-red-400'}>{debug.ollamaStatus.toUpperCase()}</span></div>
        <div>RAG Engine: <span className={debug.ragStatus === 'working' ? 'text-green-400' : 'text-red-400'}>{debug.ragStatus.toUpperCase()}</span></div>
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className={`card p-4 border-l-4 ${debug.backendStatus === 'connected' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Backend</div>
          <div className={`text-sm font-bold ${debug.backendStatus === 'connected' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.backendStatus === 'connected' ? '✓ Connected' : '✗ Down'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.explainabilityServiceStatus === 'running' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Service</div>
          <div className={`text-sm font-bold ${debug.explainabilityServiceStatus === 'running' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.explainabilityServiceStatus === 'running' ? '✓ Ready' : '✗ Error'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.ollamaStatus === 'running' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">Ollama LLM</div>
          <div className={`text-sm font-bold ${debug.ollamaStatus === 'running' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.ollamaStatus === 'running' ? '✓ Running' : '✗ Stopped'}
          </div>
        </div>
        <div className={`card p-4 border-l-4 ${debug.ragStatus === 'working' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
          <div className="text-sm font-semibold text-gray-900">RAG Engine</div>
          <div className={`text-sm font-bold ${debug.ragStatus === 'working' ? 'text-green-600' : 'text-red-600'}`}>
            {debug.ragStatus === 'working' ? '✓ Active' : '✗ Error'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="card p-8 text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading Explainability service...</p>
        </div>
      ) : explanations.length > 0 ? (
        <div className="card p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction Explanation</h2>
          {explanations.map((exp, idx) => (
            <div key={idx} className="mb-6 p-4 bg-blue-50 border border-blue-300 rounded-lg">
              <div className="mb-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600 font-semibold">Transaction ID</div>
                  <div className="text-lg text-gray-900">{exp.transaction_id}</div>
                </div>
                <div>
                  <div className="text-gray-600 font-semibold">Risk Score</div>
                  <div className="text-lg text-gray-900">{(exp.risk_score * 100).toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-gray-600 font-semibold">Decision</div>
                  <div className={`text-lg font-bold ${exp.decision === 'BLOCKED' ? 'text-red-600' : 'text-yellow-600'}`}>
                    {exp.decision}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <div className="text-sm font-semibold text-gray-700 mb-2">LLM Explanation:</div>
                <p className="text-gray-700 leading-relaxed">{exp.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Explainability Module</h2>
          <p className="text-gray-600 mb-4">
            This module uses Large Language Models with Retrieval-Augmented Generation to provide human-readable explanations for fraud detection decisions.
          </p>
          {(debug.explainabilityServiceStatus !== 'running' || debug.ollamaStatus !== 'running') && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg text-left">
              <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ Setup Required:</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>1. Ensure backend is running on http://localhost:8000</li>
                <li>2. Install and run Ollama: <code className="bg-yellow-100 px-2 py-1 rounded">ollama serve</code></li>
                <li>3. Pull llama3 model: <code className="bg-yellow-100 px-2 py-1 rounded">ollama pull llama3</code></li>
                <li>4. Implement explainability endpoint: <code className="bg-yellow-100 px-2 py-1 rounded">/explainability/transaction/{'{id}'}</code></li>
                <li>5. Refresh this page</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  )
}

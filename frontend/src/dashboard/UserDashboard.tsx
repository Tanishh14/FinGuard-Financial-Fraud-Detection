import { useState } from 'react'
import Navbar from '../components/Navbar'

interface TransactionResult {
  status: 'pending' | 'approved' | 'blocked'
  riskScore: number
  message: string
}

export default function UserDashboard() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TransactionResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recipient || !amount) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      // Simulate transaction submission (integrate with real API endpoint when ready)
      setResult({
        status: 'pending',
        riskScore: Math.random() * 100,
        message: 'Processing your secure transaction...'
      })

      // Simulate API delay
      await new Promise(r => setTimeout(r, 1500))

      // Reset form
      setRecipient('')
      setAmount('')
      setDescription('')
      
      setResult({
        status: 'approved',
        riskScore: Math.random() * 50,
        message: 'Transaction approved! Your payment has been sent securely.'
      })

      // Clear result after 5 seconds
      setTimeout(() => setResult(null), 5000)
    } catch (error) {
      setResult({
        status: 'blocked',
        riskScore: 85 + Math.random() * 15,
        message: 'Transaction blocked for security reasons. Please try again later.'
      })
    } finally {
      setLoading(false)
    }
  }

  const resultColors = {
    approved: { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', icon: '✓' },
    blocked: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', icon: '✕' },
    pending: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700', icon: '⏳' }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Payment</h1>
            <p className="text-gray-600">Secure, fraud-protected transactions with real-time verification</p>
          </div>

          {/* Result Alert */}
          {result && (
            <div className={`card p-6 mb-6 border-2 ${resultColors[result.status].border} ${resultColors[result.status].bg}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${resultColors[result.status].text}`}>
                  {resultColors[result.status].icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 ${resultColors[result.status].text}`}>
                    {result.status === 'approved' && 'Payment Approved'}
                    {result.status === 'blocked' && 'Payment Blocked'}
                    {result.status === 'pending' && 'Processing'}
                  </h3>
                  <p className={`text-sm ${resultColors[result.status].text}`}>{result.message}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs font-semibold">
                    <span>Risk Score:</span>
                    <span className="px-2 py-1 bg-white rounded border border-current">
                      {result.riskScore.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Card */}
          <form onSubmit={handleSubmit} className="card p-8 mb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient</label>
                <input
                  className="input"
                  placeholder="Enter recipient name or account number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (₹)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500 font-semibold">₹</span>
                  <input
                    className="input pl-8"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                <input
                  className="input"
                  placeholder="Payment for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                className="btn-primary w-full mt-8 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-transparent border-t-white rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : (
                  'Send Securely'
                )}
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="card p-6 bg-blue-50 border-l-4 border-l-blue-500">
            <div className="flex gap-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Fraud Protection Enabled</h3>
                <p className="text-gray-600 text-sm">Your transaction is protected by our advanced AI fraud detection system. Real-time verification ensures maximum security.</p>
                <ul className="mt-3 space-y-1 text-xs text-gray-600">
                  <li>✓ Real-time risk assessment</li>
                  <li>✓ Multi-factor verification</li>
                  <li>✓ Device fingerprinting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

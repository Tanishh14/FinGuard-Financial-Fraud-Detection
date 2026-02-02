import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function UserDashboard() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Payment</h1>
            <p className="text-gray-600">Secure, fraud-protected transactions with real-time verification</p>
          </div>

          {/* Payment Card */}
          <div className="card p-8 mb-6">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient</label>
                <input
                  className="input"
                  placeholder="Enter recipient name or account number"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
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
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <input
                  className="input"
                  placeholder="Payment for..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button className="btn-primary w-full mt-8">
                Send Securely
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="card p-6 bg-blue-50 border-l-4 border-l-blue-500">
            <div className="flex gap-4">
              <div className="text-2xl">🔒</div>
              <div>
                <h3 className="text-gray-900 font-semibold mb-1">Fraud Protection Enabled</h3>
                <p className="text-gray-600 text-sm">Your transaction is protected by our advanced AI fraud detection system. Real-time verification ensures maximum security.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

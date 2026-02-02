import { useState } from 'react'
import AdminLayout from '../layouts/AdminLayout'

export default function ExplainabilityPage() {
  const [loading] = useState(false)

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧠 LLM + RAG Explainability</h1>
        <p className="text-gray-600">Get AI-powered explanations for fraud detection decisions</p>
      </div>

      {/* Placeholder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2">
          <div className="card p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-6xl mb-4">🧠</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">LLM-Powered Explainability</h2>
            <p className="text-gray-600 mb-6">
              Retrieval-Augmented Generation (RAG) with Large Language Models provides human-readable, contextual explanations for every fraud detection decision in natural language.
            </p>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg">
              ⏳ Module Ready for Integration
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="card p-6 border-l-4 border-l-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">Natural Language Explanations</h3>
              <p className="text-sm text-gray-600">Understand exactly why a transaction was flagged or approved</p>
            </div>
            <div className="card p-6 border-l-4 border-l-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">Retrieval-Augmented Generation</h3>
              <p className="text-sm text-gray-600">RAG enhances LLM responses with relevant transaction context</p>
            </div>
            <div className="card p-6 border-l-4 border-l-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">Feature Importance</h3>
              <p className="text-sm text-gray-600">Learn which transaction features most influenced the decision</p>
            </div>
            <div className="card p-6 border-l-4 border-l-green-500">
              <h3 className="font-semibold text-gray-900 mb-2">Decision Audit Trail</h3>
              <p className="text-sm text-gray-600">Full explanation history for compliance and analyst review</p>
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
                <strong>Required endpoints:</strong>
                <code className="block mt-1 p-2 bg-gray-100 rounded font-mono text-xs">/explainability/transaction/id</code>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                <strong>Requires:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Ollama or LLM service</li>
                  <li>• Vector database for RAG</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

import { useState, useEffect } from 'react'
import AdminLayout from '../layouts/AdminLayout'
import StatCard from '../components/StatCard'
import TransactionsTable from '../components/TransactionsTable'

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([])

  return (
    <AdminLayout>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Transactions"
          value="42,857"
          icon="📊"
          trend="+12.5%"
          color="blue"
        />
        <StatCard
          title="Fraud Prevented"
          value="₹1.2 Cr"
          icon="🛡️"
          trend="+8.2%"
          color="orange"
        />
        <StatCard
          title="Detection Accuracy"
          value="94.7%"
          icon="🎯"
          trend="+0.3%"
          color="green"
        />
        <StatCard
          title="Avg. Latency"
          value="47ms"
          icon="⚡"
          trend="-5.1%"
          color="green"
        />
      </div>

      {/* Section Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Transactions</h2>
        <p className="text-gray-600 text-sm">Real-time fraud detection and analysis</p>
      </div>

      {/* Transactions Table */}
      <TransactionsTable transactions={transactions} />
    </AdminLayout>
  )
}

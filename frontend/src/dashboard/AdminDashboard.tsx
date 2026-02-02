import AdminLayout from '../layouts/AdminLayout'
import StatCard from '../components/StatCard'
import TransactionsTable from '../components/TransactionsTable'

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard title="TOTAL TX" value="42,857" />
        <StatCard title="FRAUD DETECTED" value="₹1.2 Cr" />
        <StatCard title="ACCURACY" value="94.7%" />
        <StatCard title="LATENCY" value="47ms" />
      </div>
      <TransactionsTable />
    </AdminLayout>
  )
}

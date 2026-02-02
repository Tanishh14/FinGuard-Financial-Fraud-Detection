interface Transaction {
  id?: number
  txId?: string
  user_id?: number
  user?: string
  merchant: string
  amount: number
  risk?: number
  risk_score?: number
  status?: 'APPROVED' | 'BLOCKED' | 'FLAGGED' | 'UNDER REVIEW'
  decision?: string
  device_id?: string
  ip_address?: string
  location?: string
  avg_user_spend?: number
  timestamp?: string
}

interface Props {
  transactions?: Transaction[]
}

export default function TransactionsTable({ transactions = [] }: Props) {
  const getStatusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
        return 'badge-success'
      case 'BLOCKED':
        return 'badge-danger'
      case 'FLAGGED':
        return 'badge-warning'
      case 'UNDER REVIEW':
        return 'badge-info'
      default:
        return 'badge-info'
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 80) return 'text-red-600'
    if (risk >= 50) return 'text-yellow-600'
    if (risk >= 20) return 'text-blue-600'
    return 'text-green-600'
  }

  const getRiskBarColor = (risk: number) => {
    if (risk >= 80) return 'bg-red-500'
    if (risk >= 50) return 'bg-yellow-500'
    if (risk >= 20) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getDisplayRisk = (tx: Transaction) => {
    return tx.risk_score ?? tx.risk ?? 0
  }

  const getDisplayStatus = (tx: Transaction) => {
    return tx.decision ?? tx.status ?? 'UNDER REVIEW'
  }

  const getDisplayTxId = (tx: Transaction) => {
    return tx.txId ?? `TXN-${tx.id ?? tx.user_id}`
  }

  const getDisplayUser = (tx: Transaction) => {
    return tx.user ?? `User #${tx.user_id}`
  }

  const getDisplayAmount = (tx: Transaction) => {
    return `₹${tx.amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transaction ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Merchant</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Risk Score</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {transactions.length > 0 ? (
              transactions.map((tx, idx) => {
                const risk = getDisplayRisk(tx)
                const status = getDisplayStatus(tx)
                const txId = getDisplayTxId(tx)
                const user = getDisplayUser(tx)

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-gray-600 font-mono text-xs">{txId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                          {user.split(' ')[0][0]}
                        </div>
                        <span className="text-gray-900 font-medium">{user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{tx.merchant}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{getDisplayAmount(tx)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={getRiskBarColor(risk)}
                            style={{ width: `${Math.min(risk, 100)}%` }}
                          ></div>
                        </div>
                        <span className={`${getRiskColor(risk)} font-bold text-xs`}>{risk.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusStyle(status)} text-xs font-semibold`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200">
                        Review
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No transactions to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

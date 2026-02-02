export default function TransactionsTable() {
  return (
    <div className="bg-white rounded shadow mt-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">User</th>
            <th>Merchant</th>
            <th>Amount</th>
            <th>Risk</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t">
            <td className="p-2">Rajesh Kumar</td>
            <td>Luxury Retail</td>
            <td>₹6,96,557</td>
            <td>
              <span className="text-red-600 font-semibold">96%</span>
            </td>
            <td>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                BLOCKED
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

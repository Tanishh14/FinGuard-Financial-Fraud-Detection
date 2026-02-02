export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-sm font-semibold text-gray-600 mb-4">
        Detection Modules
      </h2>

      <ul className="space-y-2 text-sm">
        <li className="p-2 rounded hover:bg-blue-50 cursor-pointer">
          GNN Fraud Rings
        </li>
        <li className="p-2 rounded hover:bg-blue-50 cursor-pointer">
          Anomaly Detection
        </li>
        <li className="p-2 rounded hover:bg-blue-50 cursor-pointer">
          Explainability (LLM)
        </li>
        <li className="p-2 rounded hover:bg-blue-50 cursor-pointer">
          Live Transactions
        </li>
      </ul>
    </aside>
  )
}

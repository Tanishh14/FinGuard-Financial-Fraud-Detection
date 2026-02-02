import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const modules = [
    { name: 'GNN Fraud Rings', icon: '🔗', path: '/gnn-fraud-rings' },
    { name: 'Anomaly Detection', icon: '⚡', path: '/anomaly-detection' },
    { name: 'LLM + RAG Explainability', icon: '🧠', path: '/explainability' },
    { name: 'Live Transactions', icon: '💰', path: '/live-transactions' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-72 bg-white border-r border-gray-200 p-6 shadow-sm">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-widest">
          Detection Modules
        </h2>
      </div>

      <ul className="space-y-3">
        {modules.map((module, idx) => (
          <li
            key={idx}
            onClick={() => navigate(module.path)}
            className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 border ${
              isActive(module.path)
                ? 'bg-blue-50 border-blue-300'
                : 'bg-gray-50 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
            }`}
          >
            <div className="relative flex items-center gap-3">
              <span className="text-lg">{module.icon}</span>
              <span className={`text-sm font-medium transition-colors ${
                isActive(module.path)
                  ? 'text-blue-600'
                  : 'text-gray-700 group-hover:text-blue-600'
              }`}>
                {module.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}


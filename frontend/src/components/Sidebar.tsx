export default function Sidebar() {
  const modules = [
    { name: 'GNN Fraud Rings', icon: '🔗', color: 'bg-blue-50' },
    { name: 'Anomaly Detection', icon: '⚡', color: 'bg-blue-50' },
    { name: 'LLM + RAG Explainability', icon: '🧠', color: 'bg-blue-50' },
    { name: 'Live Transactions', icon: '💰', color: 'bg-blue-50' },
  ];

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
            className="group relative p-3 rounded-lg cursor-pointer transition-all duration-300 hover:translate-x-1 bg-gray-50 border border-gray-200 hover:bg-blue-50 hover:border-blue-300"
          >
            <div className="relative flex items-center gap-3">
              <span className="text-lg">{module.icon}</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                {module.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  )
}

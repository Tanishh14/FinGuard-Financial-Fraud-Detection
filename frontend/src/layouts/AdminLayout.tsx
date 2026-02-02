import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function AdminLayout({ children }: any) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          <div className="max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

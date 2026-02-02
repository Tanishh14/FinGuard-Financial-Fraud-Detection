import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function AdminLayout({ children }: any) {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}

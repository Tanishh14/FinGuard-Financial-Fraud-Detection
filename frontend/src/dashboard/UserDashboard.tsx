export default function UserDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Send Payment</h1>
      <div className="bg-white p-6 rounded shadow max-w-md">
        <input className="input mb-3" placeholder="Recipient" />
        <input className="input mb-3" placeholder="Amount" />
        <button className="btn-primary w-full">Send</button>
      </div>
    </div>
  )
}

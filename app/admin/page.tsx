import AdminDashboard from "./admin-dashboard"

// This would normally check authentication and admin role
// For now, we'll assume the user is authenticated and is an admin
export default function AdminPage() {
  // In a real app, you'd check if user is authenticated and has admin role
  // if (!user || user.role !== 'admin') {
  //   redirect('/auth/login')
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage users, events, and system settings</p>
      </div>
      <AdminDashboard />
    </div>
  )
}

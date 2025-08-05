import type { Metadata } from "next"
import AdminDashboard from "./admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - SKConnect",
  description: "Administrative dashboard for managing users, events, and system settings",
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </div>
    </div>
  )
}

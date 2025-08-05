import type { Metadata } from "next"
import AdminDashboard from "./admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - SKConnect",
  description: "Administrative dashboard for managing SKConnect platform",
}

export default function AdminPage() {
  return <AdminDashboard />
}

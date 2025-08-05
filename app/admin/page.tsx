import type { Metadata } from "next"
import AdminDashboard from "./admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - SKConnect Portal",
  description: "Administrative dashboard for managing the SKConnect Portal",
}

export default function AdminPage() {
  return <AdminDashboard />
}

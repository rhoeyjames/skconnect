"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react"
import DynamicEvents from "@/components/dynamic-events"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "youth" | "sk_official" | "admin"
  barangay: string
  municipality: string
  province: string
}

export default function EventsClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    try {
      setUser(JSON.parse(userData))
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push("/auth/login")
      return
    }
    
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder-user.jpg" alt={user.firstName} />
                  <AvatarFallback className="text-lg">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user.firstName}!
                  </h1>
                  <p className="text-gray-600">
                    {user.barangay}, {user.municipality}, {user.province}
                  </p>
                  <div className="flex items-center mt-2">
                    {user.role === "admin" && (
                      <Badge className="bg-red-100 text-red-800">Admin</Badge>
                    )}
                    {user.role === "sk_official" && (
                      <Badge className="bg-blue-100 text-blue-800">SK Official</Badge>
                    )}
                    {user.role === "youth" && (
                      <Badge className="bg-green-100 text-green-800">Youth Member</Badge>
                    )}
                  </div>
                </div>
              </div>
              {(user.role === "admin" || user.role === "sk_official") && (
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Events Section */}
        <DynamicEvents userRole={user.role} />

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center h-16">
              <Users className="h-5 w-5 mr-2" />
              My Registrations
            </Button>
            <Button variant="outline" className="flex items-center justify-center h-16">
              <Calendar className="h-5 w-5 mr-2" />
              Event Calendar
            </Button>
            <Button variant="outline" className="flex items-center justify-center h-16">
              <MapPin className="h-5 w-5 mr-2" />
              Local Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

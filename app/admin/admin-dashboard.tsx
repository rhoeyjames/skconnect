"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Download,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
} from "lucide-react"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: "youth" | "sk_official" | "admin"
  isActive: boolean
  isVerified: boolean
  barangay: string
  municipality: string
  province: string
  createdAt: string
}

interface Event {
  _id: string
  title: string
  description: string
  date: string
  location: string
  status: "upcoming" | "ongoing" | "completed"
  registrations: number
}

interface Stats {
  totalUsers: number
  totalEvents: number
  totalFeedback: number
  activeUsers: number
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalFeedback: 0,
    activeUsers: 0,
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    // Check if user is admin
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // In a real app, you'd verify the token and check role
    // For now, we'll assume the user is authenticated
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Mock data for demonstration - replace with actual API calls
      const mockUsers: User[] = [
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          role: "youth",
          isActive: true,
          isVerified: true,
          barangay: "Barangay San Jose",
          municipality: "Quezon City",
          province: "Metro Manila",
          createdAt: "2024-01-15T10:00:00Z",
        },
        {
          _id: "2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane@example.com",
          role: "sk_official",
          isActive: true,
          isVerified: true,
          barangay: "Barangay Poblacion",
          municipality: "Makati City",
          province: "Metro Manila",
          createdAt: "2024-01-10T10:00:00Z",
        },
        {
          _id: "3",
          firstName: "Admin",
          lastName: "User",
          email: "admin@skconnect.com",
          role: "admin",
          isActive: true,
          isVerified: true,
          barangay: "Admin Barangay",
          municipality: "Admin Municipality",
          province: "Admin Province",
          createdAt: "2024-01-01T10:00:00Z",
        },
        {
          _id: "4",
          firstName: "Maria",
          lastName: "Garcia",
          email: "maria@example.com",
          role: "youth",
          isActive: false,
          isVerified: false,
          barangay: "Barangay Tondo",
          municipality: "Manila",
          province: "Metro Manila",
          createdAt: "2024-01-20T10:00:00Z",
        },
      ]

      const mockEvents: Event[] = [
        {
          _id: "1",
          title: "Youth Leadership Summit 2024",
          description: "Annual leadership development event for young leaders",
          date: "2024-02-15T10:00:00Z",
          location: "Quezon City Community Center",
          status: "upcoming",
          registrations: 45,
        },
        {
          _id: "2",
          title: "Community Clean-up Drive",
          description: "Environmental awareness and community service activity",
          date: "2024-01-20T08:00:00Z",
          location: "Barangay Plaza",
          status: "completed",
          registrations: 32,
        },
        {
          _id: "3",
          title: "Digital Literacy Workshop",
          description: "Teaching basic computer skills to youth",
          date: "2024-02-28T14:00:00Z",
          location: "SK Office",
          status: "upcoming",
          registrations: 28,
        },
      ]

      setUsers(mockUsers)
      setEvents(mockEvents)
      setStats({
        totalUsers: mockUsers.length,
        totalEvents: mockEvents.length,
        totalFeedback: 15,
        activeUsers: mockUsers.filter((u) => u.isActive).length,
      })
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "youth" | "sk_official" | "admin") => {
    try {
      // In a real app, you'd make an API call here
      setUsers(users.map((user) => (user._id === userId ? { ...user, role: newRole } : user)))
      console.log(`Updated user ${userId} role to ${newRole}`)

      // Show success message
      alert(`User role updated to ${newRole.replace("_", " ")} successfully!`)
    } catch (error) {
      console.error("Error updating user role:", error)
      alert("Failed to update user role")
    }
  }

  const handleUserStatusChange = async (userId: string, isActive: boolean) => {
    try {
      // In a real app, you'd make an API call here
      setUsers(users.map((user) => (user._id === userId ? { ...user, isActive } : user)))
      console.log(`Updated user ${userId} status to ${isActive ? "active" : "inactive"}`)

      // Show success message
      alert(`User ${isActive ? "activated" : "deactivated"} successfully!`)
    } catch (error) {
      console.error("Error updating user status:", error)
      alert("Failed to update user status")
    }
  }

  const exportData = (type: "users" | "events") => {
    const data = type === "users" ? users : events
    const csv = convertToCSV(data)
    downloadCSV(csv, `${type}-export-${new Date().toISOString().split("T")[0]}.csv`)
  }

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return ""

    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((item) =>
      Object.values(item)
        .map((value) => (typeof value === "string" ? `"${value}"` : value))
        .join(","),
    )

    return [headers, ...rows].join("\n")
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200"
      case "sk_official":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "youth":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-8 w-8 text-red-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Manage users, events, and system settings</p>
        </div>
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <Shield className="h-3 w-3 mr-1" />
          Administrator Access
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} active • {stats.totalUsers - stats.activeUsers} inactive
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter((e) => e.status === "upcoming").length} upcoming •{" "}
              {events.filter((e) => e.status === "completed").length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">User feedback received</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">From last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user roles, permissions, and account status</CardDescription>
                </div>
                <Button onClick={() => exportData("users")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="youth">Youth</SelectItem>
                    <SelectItem value="sk_official">SK Official</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role === "sk_official"
                              ? "SK Official"
                              : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.barangay}</div>
                            <div className="text-muted-foreground">
                              {user.municipality}, {user.province}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={user.isActive ? "default" : "secondary"}>
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {user.isVerified && (
                              <Badge variant="outline" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(value: "youth" | "sk_official" | "admin") =>
                                handleRoleChange(user._id, value)
                              }
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="youth">Youth</SelectItem>
                                <SelectItem value="sk_official">SK Official</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={
                                    user.isActive
                                      ? "text-red-600 hover:text-red-700"
                                      : "text-green-600 hover:text-green-700"
                                  }
                                >
                                  {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {user.isActive ? "Deactivate" : "Activate"} User Account
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to {user.isActive ? "deactivate" : "activate"} the account for{" "}
                                    <strong>
                                      {user.firstName} {user.lastName}
                                    </strong>
                                    ?{user.isActive && " This will prevent them from accessing the system."}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleUserStatusChange(user._id, !user.isActive)}
                                    className={
                                      user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
                                    }
                                  >
                                    {user.isActive ? "Deactivate" : "Activate"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Events Management</CardTitle>
                  <CardDescription>View and manage all events and registrations</CardDescription>
                </div>
                <Button onClick={() => exportData("events")} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Events
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registrations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">{event.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(event.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(event.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </TableCell>
                        <TableCell>{event.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.status === "completed"
                                ? "default"
                                : event.status === "upcoming"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              event.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : event.status === "upcoming"
                                  ? "bg-blue-100 text-blue-800"
                                  : ""
                            }
                          >
                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{event.registrations}</div>
                            <div className="text-xs text-muted-foreground">registered</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>View system usage and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed analytics and reporting features will be available here.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">85%</div>
                      <p className="text-xs text-muted-foreground text-center">User Engagement</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">92%</div>
                      <p className="text-xs text-muted-foreground text-center">Event Attendance</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">4.8</div>
                      <p className="text-xs text-muted-foreground text-center">Average Rating</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

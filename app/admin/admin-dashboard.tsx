"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Users, Calendar, TrendingUp, Search, Download, Shield, UserCheck, UserX } from "lucide-react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "youth" | "sk_official" | "admin"
  age: number
  barangay: string
  municipality: string
  province: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Load users from localStorage and add default users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")

    const defaultUsers: User[] = [
      {
        id: "admin-1",
        firstName: "Admin",
        lastName: "User",
        email: "admin@skconnect.com",
        role: "admin",
        age: 25,
        barangay: "Admin Barangay",
        municipality: "Admin City",
        province: "Admin Province",
        isActive: true,
        createdAt: "2024-01-01",
      },
      {
        id: "youth-1",
        firstName: "Test",
        lastName: "Youth",
        email: "youth@test.com",
        role: "youth",
        age: 20,
        barangay: "Test Barangay",
        municipality: "Test City",
        province: "Test Province",
        isActive: true,
        createdAt: "2024-01-15",
      },
    ]

    // Combine default users with registered users
    const allUsers = [
      ...defaultUsers,
      ...registeredUsers.map((user: any) => ({
        ...user,
        isActive: user.isActive !== undefined ? user.isActive : true,
      })),
    ]

    // Remove duplicates based on email
    const uniqueUsers = allUsers.filter((user, index, self) => index === self.findIndex((u) => u.email === user.email))

    setUsers(uniqueUsers)
    setLoading(false)
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.barangay.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleRoleChange = (userId: string, newRole: "youth" | "sk_official" | "admin") => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    setUsers(updatedUsers)

    // Update localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const updatedRegisteredUsers = registeredUsers.map((user: any) =>
      user.id === userId ? { ...user, role: newRole } : user,
    )
    localStorage.setItem("registeredUsers", JSON.stringify(updatedRegisteredUsers))

    toast({
      title: "Role Updated",
      description: "User role has been successfully updated.",
    })
  }

  const handleStatusToggle = (userId: string) => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, isActive: !user.isActive } : user))
    setUsers(updatedUsers)

    // Update localStorage for registered users
    const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]")
    const updatedRegisteredUsers = registeredUsers.map((user: any) =>
      user.id === userId ? { ...user, isActive: !user.isActive } : user,
    )
    localStorage.setItem("registeredUsers", JSON.stringify(updatedRegisteredUsers))

    toast({
      title: "Status Updated",
      description: "User status has been successfully updated.",
    })
  }

  const exportUsers = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Age", "Barangay", "Municipality", "Province", "Status", "Created"],
      ...filteredUsers.map((user) => [
        `${user.firstName} ${user.lastName}`,
        user.email,
        user.role,
        user.age.toString(),
        user.barangay,
        user.municipality,
        user.province,
        user.isActive ? "Active" : "Inactive",
        user.createdAt,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `skconnect-users-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Complete",
      description: "User data has been exported to CSV.",
    })
  }

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.isActive).length,
    youthUsers: users.filter((u) => u.role === "youth").length,
    skOfficials: users.filter((u) => u.role === "sk_official").length,
    admins: users.filter((u) => u.role === "admin").length,
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage users, events, and system settings</p>
          </div>
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <Shield className="h-3 w-3 mr-1" />
            Administrator Access
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">{stats.activeUsers} active users</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Youth Members</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.youthUsers}</div>
              <p className="text-xs text-muted-foreground">Registered youth</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">SK Officials</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.skOfficials}</div>
              <p className="text-xs text-muted-foreground">Active officials</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Administrators</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.admins}</div>
              <p className="text-xs text-muted-foreground">System admins</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                +{stats.totalUsers > 2 ? Math.round(((stats.totalUsers - 2) / 2) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                      <SelectItem value="sk_official">SK Official</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={exportUsers} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
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
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div>
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">Age: {user.age}</div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value: "youth" | "sk_official" | "admin") =>
                                handleRoleChange(user.id, value)
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
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{user.barangay}</div>
                              <div className="text-gray-500">
                                {user.municipality}, {user.province}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? "default" : "secondary"}
                              className={user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusToggle(user.id)}
                                className={
                                  user.isActive
                                    ? "text-red-600 hover:text-red-700"
                                    : "text-green-600 hover:text-green-700"
                                }
                              >
                                {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Events Management</CardTitle>
                <CardDescription>Manage community events and activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Events Management</h3>
                  <p className="text-gray-500 mb-4">Events management features will be available soon.</p>
                  <Button>Create Event</Button>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">
                        {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                      </div>
                      <p className="text-xs text-muted-foreground text-center">User Engagement</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">{stats.youthUsers}</div>
                      <p className="text-xs text-muted-foreground text-center">Youth Registered</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-center">4.8</div>
                      <p className="text-xs text-muted-foreground text-center">Average Rating</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Analytics</h3>
                  <p className="text-gray-500">
                    Detailed analytics and reporting features will be available in the next update.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

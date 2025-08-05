"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    setError("") // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check if using auth context (preferred) or fallback to mock for testing
      const authContext = typeof window !== 'undefined' && window.location.search.includes('mock=true')

      if (authContext) {
        // Mock authentication for testing when mock=true is in URL
        if (formData.email === "admin@skconnect.com" && formData.password === "admin123456") {
          const adminUser = {
            id: "admin-1",
            firstName: "Admin",
            lastName: "User",
            email: "admin@skconnect.com",
            role: "admin",
            age: 25,
            barangay: "Admin Barangay",
          }

          localStorage.setItem("token", "mock-admin-token")
          localStorage.setItem("user", JSON.stringify(adminUser))

          toast({
            title: "Welcome back, Admin!",
            description: "You have been successfully logged in (Mock Mode).",
          })

          window.location.href = "/admin"
          return
        }

        if (formData.email === "youth@test.com" && formData.password === "password123") {
          const youthUser = {
            id: "youth-1",
            firstName: "Test",
            lastName: "Youth",
            email: "youth@test.com",
            role: "youth",
            age: 20,
            barangay: "Test Barangay",
          }

          localStorage.setItem("token", "mock-youth-token")
          localStorage.setItem("user", JSON.stringify(youthUser))

          toast({
            title: "Welcome back!",
            description: "You have been successfully logged in (Mock Mode).",
          })

          window.location.href = "/"
          return
        }

        setError("Invalid email or password. Try admin@skconnect.com / admin123456 or youth@test.com / password123")
        return
      }

      // Use real authentication via API client
      const { default: apiClient } = await import("@/lib/api")

      const data = await apiClient.login(formData.email, formData.password)

      // Store auth data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: `Welcome back, ${data.user.firstName}!`,
        description: "Successfully connected to backend API.",
      })

      // Redirect based on role
      if (data.user.role === "admin") {
        window.location.href = "/admin"
      } else {
        window.location.href = "/"
      }

    } catch (error: any) {
      console.error('Login error:', error)

      // Check if it's a network error (backend not available)
      if (error.message?.includes('fetch') || error.message?.includes('Network') || error.name === 'TypeError') {
        setError("Backend server not available. Backend should be running on http://localhost:5000")
        toast({
          title: "Backend Connection Failed",
          description: "Make sure the backend server is running on port 5000",
          variant: "destructive"
        })
      } else {
        setError(error.message || "Login failed. Please check your credentials and try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">SK</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>

            {/* Test Credentials */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Development Mode:</h4>
              <div className="text-xs text-blue-700 space-y-1">
                <div>
                  Connect to backend API or use mock data by adding <code className="px-1 py-0.5 bg-blue-100 rounded">?mock=true</code> to URL
                </div>
                <div className="mt-2">
                  <strong>Mock credentials:</strong> admin@skconnect.com / admin123456
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

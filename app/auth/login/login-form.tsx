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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Mail, Lock, Loader2, AlertCircle, LogIn, Shield, Users, UserCheck } from "lucide-react"

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "youth", // Default role selection
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

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }))
    setError("") // Clear error when role changes
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      // Use real backend API
      const { default: apiClient } = await import("@/lib/api")

      const data = await apiClient.login(formData.email, formData.password)

      // Validate that the user's actual role matches the selected role
      if (data.user.role !== formData.role) {
        setError(`This account is registered as ${data.user.role === 'admin' ? 'Administrator' : data.user.role === 'sk_official' ? 'SK Official' : 'Youth Member'}. Please select the correct role.`)
        setIsLoading(false)
        return
      }

      // Store auth data
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))

      toast({
        title: "Login Successful!",
        description: `Welcome back, ${data.user.firstName}!`,
      })

      // Redirect based on user role
      if (data.user.role === "admin") {
        router.push("/admin")
      } else if (data.user.role === "sk_official") {
        router.push("/events") // SK Officials go to events page
      } else {
        router.push("/events") // Youth members go to events page
      }
    } catch (error: any) {
      console.error('Login error:', error)
      setError(error.message || "Login failed. Please check your credentials and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 rounded-lg flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Ffabc43030bfc4ff6a60efabdca8137fc%2F02fa3ab5bc2d4c8b911d079c09d94492?format=webp&width=800"
              alt="SKConnect Logo"
              className="h-12 w-12 rounded-lg object-contain"
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Sign in to SKConnect</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </div>

        {/* Role Information Banner */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Role Access Information:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-2 text-green-600" />
              <span><strong>Youth Member:</strong> Access events, register for activities</span>
            </div>
            <div className="flex items-center">
              <UserCheck className="h-3 w-3 mr-2 text-blue-600" />
              <span><strong>SK Official:</strong> Manage events, view registrations</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-3 w-3 mr-2 text-red-600" />
              <span><strong>Administrator:</strong> Full system access and management</span>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Enter your credentials and select your role to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-6" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="mt-1 relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your email"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="mt-1 relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your password"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Login As</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="youth">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="ml-2">Youth Member</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sk_official">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 text-blue-600" />
                          <span className="ml-2">SK Official</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 text-red-600" />
                          <span className="ml-2">Administrator</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Select the role you registered with</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

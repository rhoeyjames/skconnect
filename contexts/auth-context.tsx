"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  name: string
  email: string
  age: number
  barangay: string
  role: "user" | "admin"
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  age: number
  barangay: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get token from localStorage on client side
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)
  }, [])

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
          const response = await axios.get("/api/auth/me")
          setUser(response.data.user)
        } catch (error) {
          localStorage.removeItem("token")
          setToken(null)
          delete axios.defaults.headers.common["Authorization"]
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password })
      const { token: newToken, user: userData } = response.data

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(userData)
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      toast({
        title: "Success",
        description: "Login successful!",
      })
    } catch (error: any) {
      const message = error.response?.data?.message || "Login failed"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw new Error(message)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await axios.post("/api/auth/register", userData)
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(newUser)
      axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`

      toast({
        title: "Success",
        description: "Registration successful! Welcome to SKConnect!",
      })
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed"
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      })
      throw new Error(message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]

    toast({
      title: "Success",
      description: "Logged out successfully",
    })
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

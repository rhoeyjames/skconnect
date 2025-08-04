"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, User, LogOut, Settings, Calendar, Lightbulb } from "lucide-react"

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/")
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold">
            SKConnect
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/events" className="hover:text-blue-200 transition-colors flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              Events
            </Link>
            <Link href="/suggestions" className="hover:text-blue-200 transition-colors flex items-center">
              <Lightbulb className="mr-1 h-4 w-4" />
              Suggestions
            </Link>

            {user ? (
              <>
                <Link href="/my-events" className="hover:text-blue-200 transition-colors">
                  My Events
                </Link>
                {user.role === "admin" && (
                  <Link href="/admin" className="hover:text-blue-200 transition-colors">
                    <Settings className="mr-1 h-4 w-4 inline" />
                    Admin
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700">
                      <User className="mr-2 h-4 w-4" />
                      {user.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Button asChild variant="ghost" className="text-white hover:text-blue-200 hover:bg-blue-700">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <div className="flex flex-col space-y-4">
              <Link
                href="/events"
                className="hover:text-blue-200 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Events
              </Link>
              <Link
                href="/suggestions"
                className="hover:text-blue-200 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Suggestions
              </Link>

              {user ? (
                <>
                  <Link
                    href="/my-events"
                    className="hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Events
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="hover:text-blue-200 transition-colors flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <div className="pt-4 border-t border-blue-500">
                    <p className="text-sm mb-2 flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Welcome, {user.name}
                    </p>
                    <Button
                      onClick={handleLogout}
                      variant="ghost"
                      className="text-white hover:text-blue-200 hover:bg-blue-700 w-full justify-start"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t border-blue-500">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white hover:text-blue-200 hover:bg-blue-700 justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700 justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

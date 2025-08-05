"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Calendar, Users, Info, LogIn, UserPlus, Shield } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Mock user data - in a real app, this would come from your auth context
  const user = {
    isAuthenticated: true, // Change this based on actual auth state
    role: "admin", // This could be 'youth', 'sk_official', or 'admin'
    name: "Admin User",
  }

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Events", href: "/events", icon: Calendar },
    { name: "About", href: "/about", icon: Info },
  ]

  // Add admin navigation if user is admin
  if (user.isAuthenticated && user.role === "admin") {
    navigation.push({ name: "Admin Dashboard", href: "/admin", icon: Shield })
  }

  const authLinks = user.isAuthenticated
    ? [
        { name: "Profile", href: "/profile", icon: Users },
        { name: "Logout", href: "/auth/logout", icon: LogIn },
      ]
    : [
        { name: "Login", href: "/auth/login", icon: LogIn },
        { name: "Register", href: "/auth/register", icon: UserPlus },
      ]

  const isActive = (href: string) => pathname === href

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SK</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">SKConnect</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                  {item.name === "Admin Dashboard" && <Badge className="ml-2 bg-red-100 text-red-800">Admin</Badge>}
                </Link>
              )
            })}
          </div>

          {/* User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user.isAuthenticated && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                {user.role === "admin" && (
                  <Badge className="bg-red-100 text-red-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                )}
                {user.role === "sk_official" && <Badge className="bg-blue-100 text-blue-800">SK Official</Badge>}
              </div>
            )}

            {authLinks.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={item.name === "Register" ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* User info in mobile */}
                  {user.isAuthenticated && (
                    <div className="pb-4 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <div className="flex items-center mt-1">
                        {user.role === "admin" && (
                          <Badge className="bg-red-100 text-red-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {user.role === "sk_official" && (
                          <Badge className="bg-blue-100 text-blue-800">SK Official</Badge>
                        )}
                        {user.role === "youth" && <Badge className="bg-green-100 text-green-800">Youth</Badge>}
                      </div>
                    </div>
                  )}

                  {/* Navigation links */}
                  {navigation.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                        {item.name === "Admin Dashboard" && (
                          <Badge className="ml-2 bg-red-100 text-red-800">Admin</Badge>
                        )}
                      </Link>
                    )
                  })}

                  {/* Auth links */}
                  <div className="pt-4 border-t">
                    {authLinks.map((item) => {
                      const Icon = item.icon
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

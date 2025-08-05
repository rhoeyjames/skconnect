"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Plus } from "lucide-react"
import { format } from "date-fns"

interface Event {
  _id: string
  title: string
  description: string
  category: string
  startDate: string
  endDate: string
  location: string
  barangay: string
  municipality: string
  province: string
  maxParticipants?: number
  registrationCount?: number
  status: "draft" | "active" | "cancelled" | "completed"
  createdBy: {
    firstName: string
    lastName: string
  }
}

interface DynamicEventsProps {
  userRole?: string
}

export default function DynamicEvents({ userRole }: DynamicEventsProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async (retryCount = 0) => {
      try {
        setIsLoading(true)
        setError(null)

        // Use Promise.race for timeout instead of AbortController
        const fetchPromise = fetch('/api/events?limit=6&status=active')
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 8000)
        )

        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch events`)
        }
        const data = await response.json()
        setEvents(data.events || [])
      } catch (err: any) {
        console.error('Error fetching events:', err)

        // Only retry once for network errors, not for timeouts
        if (retryCount < 1 && err.message.includes('fetch') && !err.message.includes('timeout')) {
          console.log(`Retrying events fetch... (attempt ${retryCount + 1})`)
          setTimeout(() => fetchEvents(retryCount + 1), 3000)
          return
        }

        setError('Unable to load events from database')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Upcoming</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch {
      return dateString
    }
  }

  const formatTime = (startDate: string, endDate: string) => {
    try {
      const start = format(new Date(startDate), 'h:mm a')
      const end = format(new Date(endDate), 'h:mm a')
      return `${start} - ${end}`
    } catch {
      return 'Time TBD'
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>{error}</p>
        </div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-6">
          <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Events Available</h3>
          <p>There are currently no active events. Check back later or create a new event!</p>
        </div>
        {(userRole === "admin" || userRole === "sk_official") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create First Event
          </Button>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <p className="text-gray-600 mt-1">
            Showing {events.length} active events from your database
          </p>
        </div>
        {(userRole === "admin" || userRole === "sk_official") && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg truncate">{event.title}</CardTitle>
                {getStatusBadge(event.status)}
              </div>
              <CardDescription className="line-clamp-2">
                {event.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{formatTime(event.startDate, event.endDate)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {event.location || event.barangay}, {event.municipality}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>
                    {event.registrationCount || 0}
                    {event.maxParticipants && ` / ${event.maxParticipants}`} registered
                  </span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {events.length > 0 && (
        <div className="text-center mt-8">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
            <span className="mr-2">✅</span>
            Real-time events loaded from your MongoDB database!
          </div>
        </div>
      )}
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, MapPin, Search, Filter, Clock, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import apiClient from "@/lib/api"

export default function EventsClient() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock events as fallback
  const mockEvents = [
    {
      id: 1,
      title: "Youth Leadership Workshop",
      date: "2024-02-15",
      time: "9:00 AM",
      venue: "Barangay Hall",
      type: "workshop",
      status: "upcoming",
      participants: 45,
      maxParticipants: 50,
      description: "Develop essential leadership skills for community engagement and project management.",
      image: "/placeholder.svg?height=200&width=300&text=Leadership+Workshop",
    },
    {
      id: 2,
      title: "Community Clean-up Drive",
      date: "2024-02-20",
      time: "6:00 AM",
      venue: "Riverside Park",
      type: "community-service",
      status: "upcoming",
      participants: 32,
      maxParticipants: 100,
      description: "Join us in keeping our community clean and green. Bring your own gloves and water bottle.",
      image: "/placeholder.svg?height=200&width=300&text=Clean-up+Drive",
    },
    {
      id: 3,
      title: "Basketball Tournament",
      date: "2024-02-25",
      time: "2:00 PM",
      venue: "Municipal Court",
      type: "sports",
      status: "upcoming",
      participants: 28,
      maxParticipants: 40,
      description: "Annual inter-barangay basketball tournament. Form your teams and compete for the championship!",
      image: "/placeholder.svg?height=200&width=300&text=Basketball+Tournament",
    },
    {
      id: 4,
      title: "Digital Literacy Seminar",
      date: "2024-01-30",
      time: "1:00 PM",
      venue: "Community Center",
      type: "seminar",
      status: "completed",
      participants: 60,
      maxParticipants: 60,
      description:
        "Learn essential digital skills for the modern world including social media safety and online tools.",
      image: "/placeholder.svg?height=200&width=300&text=Digital+Literacy",
    },
    {
      id: 5,
      title: "Cultural Festival Planning",
      date: "2024-03-05",
      time: "3:00 PM",
      venue: "SK Office",
      type: "meeting",
      status: "upcoming",
      participants: 15,
      maxParticipants: 25,
      description: "Planning meeting for the upcoming cultural festival. All creative minds welcome!",
      image: "/placeholder.svg?height=200&width=300&text=Cultural+Festival",
    },
    {
      id: 6,
      title: "Environmental Awareness Campaign",
      date: "2024-03-10",
      time: "8:00 AM",
      venue: "Town Plaza",
      type: "community-service",
      status: "upcoming",
      participants: 22,
      maxParticipants: 80,
      description: "Raise awareness about environmental issues and promote sustainable living practices.",
      image: "/placeholder.svg?height=200&width=300&text=Environmental+Campaign",
    },
  ]

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError("")

      const params = {
        page: currentPage,
        limit: 10,
        ...(filterType !== "all" && { category: filterType }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(searchTerm && { search: searchTerm }),
        sortBy: "date",
        sortOrder: "asc",
      }

      const data = await apiClient.getEvents(params)
      setEvents(data.events || [])
      setTotalPages(data.totalPages || 1)
    } catch (error: any) {
      console.error("Failed to fetch events:", error)
      setError("Failed to load events. Using sample data.")
      // Use mock data as fallback
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  // Fetch events on component mount and when filters change
  useEffect(() => {
    fetchEvents()
  }, [currentPage, filterType, filterStatus, searchTerm])

  const getEventTypeColor = (type: string) => {
    const colors = {
      workshop: "bg-blue-100 text-blue-800",
      "community-service": "bg-green-100 text-green-800",
      sports: "bg-orange-100 text-orange-800",
      seminar: "bg-purple-100 text-purple-800",
      cultural: "bg-pink-100 text-pink-800",
      meeting: "bg-gray-100 text-gray-800",
    }
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getStatusColor = (status: string) => {
    return status === "completed" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-800"
  }

  // Since we're using backend filtering, we don't need client-side filtering
  const displayEvents = events

  if (loading) {
    return (
      <>
        {/* Search and Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-full md:w-48" />
          <Skeleton className="h-10 w-full md:w-48" />
        </div>

        {/* Events Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-2 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="workshop">Workshop</SelectItem>
            <SelectItem value="community-service">Community Service</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="seminar">Seminar</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="cultural">Cultural</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayEvents.map((event) => (
          <Card key={event._id || event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48">
              <Image
                src={event.image ? `http://localhost:5000${event.image}` : "/placeholder.svg"}
                alt={event.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={getEventTypeColor(event.category || event.type)}>
                  {(event.category || event.type || "event").replace("-", " ")}
                </Badge>
                <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{event.title}</CardTitle>
              <CardDescription className="line-clamp-2">{event.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(event.date || event.startDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {event.time || new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {event.venue || event.location || `${event.barangay}, ${event.municipality}`}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {event.currentParticipants || event.participants || 0}/{event.maxParticipants} registered
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${Math.min(((event.currentParticipants || event.participants || 0) / event.maxParticipants) * 100, 100)}%`
                  }}
                ></div>
              </div>

              <Button asChild className="w-full" disabled={event.status === "completed" || event.status === "cancelled"}>
                <Link href={`/events/${event._id || event.id}`}>
                  {event.status === "completed" ? "View Details" : "View & Register"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayEvents.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg mb-2">No events found matching your criteria.</p>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your filters or search terms.
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => {
              setSearchTerm("")
              setFilterType("all")
              setFilterStatus("all")
            }}>
              Clear Filters
            </Button>
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </>
  )
}

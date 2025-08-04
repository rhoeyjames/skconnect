"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, Users, Lightbulb, MessageSquare } from "lucide-react"

interface Event {
  _id: string
  title: string
  description: string
  date: string
  time: string
  type: string
  venue: string
  image?: string
  registrationCount?: number
}

export default function Home() {
  const { user } = useAuth()
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalSuggestions: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, statsResponse] = await Promise.all([
          axios.get("/api/events?upcoming=true&limit=3"),
          axios.get("/api/admin/stats").catch(() => ({ data: { totalEvents: 0, totalUsers: 0, totalSuggestions: 0 } })),
        ])

        setUpcomingEvents(eventsResponse.data.slice(0, 3))
        setStats(statsResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-8 md:p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to SKConnect</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your gateway to youth development and community engagement
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/events">
                <Calendar className="mr-2 h-5 w-5" />
                Browse Events
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/suggestions/create">
                <Lightbulb className="mr-2 h-5 w-5" />
                Suggest a Project
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
              <p className="text-gray-600">Total Events</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-gray-600">Registered Youth</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalSuggestions}</p>
              <p className="text-gray-600">Project Ideas</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Event Management</h3>
            <p className="text-gray-600">Discover and register for youth development events in your community</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project Suggestions</h3>
            <p className="text-gray-600">Share your ideas for community projects and vote on others' suggestions</p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Feedback System</h3>
            <p className="text-gray-600">Rate events and provide feedback to help improve future activities</p>
          </CardContent>
        </Card>
      </section>

      {/* Upcoming Events */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
          <Button asChild variant="outline">
            <Link href="/events">View All Events →</Link>
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : upcomingEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event._id} className="hover:shadow-lg transition-shadow">
                {event.image && (
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img src={`/api/uploads/${event.image}`} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{event.type.replace("-", " ").toUpperCase()}</Badge>
                    <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.venue}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event._id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No upcoming events at the moment.</p>
              {user?.role === "admin" && (
                <Button asChild>
                  <Link href="/admin">Create Event</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </section>

      {/* Call to Action */}
      {!user && (
        <section className="bg-gray-100 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the SKConnect Community</h2>
          <p className="text-gray-600 mb-6">
            Register now to participate in events, share project ideas, and connect with fellow youth in your community.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Get Started Today</Link>
          </Button>
        </section>
      )}
    </div>
  )
}

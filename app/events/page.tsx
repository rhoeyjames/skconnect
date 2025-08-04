'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, MapPin, Search, Filter, Clock } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const events = [
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
      description: "Learn essential digital skills for the modern world including social media safety and online tools.",
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
    return status === 'completed' 
      ? "bg-gray-100 text-gray-600" 
      : "bg-green-100 text-green-800"
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || event.type === filterType
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Events</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover and participate in exciting community activities and programs
          </p>
          
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
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48">
                <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge className={getEventTypeColor(event.type)}>
                    {event.type.replace("-", " ")}
                  </Badge>
                  <Badge className={getStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {event.participants}/{event.maxParticipants} registered
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
                
                <Button asChild className="w-full" disabled={event.status === 'completed'}>
                  <Link href={`/events/${event.id}`}>
                    {event.status === 'completed' ? 'View Details' : 'View & Register'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
            <Button asChild className="mt-4">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

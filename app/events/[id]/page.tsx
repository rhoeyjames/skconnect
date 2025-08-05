"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Users, MapPin, ArrowLeft, UserPlus, Share2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"

export default function EventDetailPage() {
  const params = useParams()
  const eventId = params.id
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()

  // Mock event data - in real app, fetch based on eventId
  const event = {
    id: eventId,
    title: "Youth Leadership Workshop",
    date: "2024-02-15",
    time: "9:00 AM - 5:00 PM",
    venue: "Barangay Hall, Main Conference Room",
    type: "workshop",
    status: "upcoming",
    participants: 45,
    maxParticipants: 50,
    description:
      "Develop essential leadership skills for community engagement and project management. This comprehensive workshop will cover communication skills, team building, project planning, and community organizing techniques.",
    image: "/placeholder.svg?height=400&width=600&text=Leadership+Workshop",
    organizer: "SK Barangay San Antonio",
    requirements: [
      "Age 15-30 years old",
      "Resident of the barangay",
      "Commitment to attend full day session",
      "Bring notebook and pen",
    ],
    agenda: [
      { time: "9:00 AM - 9:30 AM", activity: "Registration and Welcome" },
      { time: "9:30 AM - 11:00 AM", activity: "Leadership Fundamentals" },
      { time: "11:00 AM - 11:15 AM", activity: "Break" },
      { time: "11:15 AM - 12:30 PM", activity: "Communication Skills Workshop" },
      { time: "12:30 PM - 1:30 PM", activity: "Lunch Break" },
      { time: "1:30 PM - 3:00 PM", activity: "Team Building Activities" },
      { time: "3:00 PM - 3:15 PM", activity: "Break" },
      { time: "3:15 PM - 4:30 PM", activity: "Project Planning Session" },
      { time: "4:30 PM - 5:00 PM", activity: "Closing and Certificates" },
    ],
  }

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

  const handleRegister = async () => {
    setIsRegistering(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event. Check your email for confirmation.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied!",
        description: "Event link has been copied to your clipboard.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        {/* Event Header */}
        <Card className="mb-6">
          <div className="relative h-64 md:h-80">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover rounded-t-lg"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={getEventTypeColor(event.type)}>{event.type.replace("-", " ")}</Badge>
              <Badge className="bg-green-100 text-green-800">{event.status}</Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Button variant="secondary" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">{event.title}</CardTitle>
            <CardDescription className="text-lg">Organized by {event.organizer}</CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Agenda */}
            <Card>
              <CardHeader>
                <CardTitle>Event Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-600 min-w-fit">{item.time}</div>
                      <div className="text-sm text-gray-700">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">{new Date(event.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-600">{event.time}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Venue</div>
                    <div className="text-sm text-gray-600">{event.venue}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium">
                      {event.participants}/{event.maxParticipants} registered
                    </div>
                    <div className="text-sm text-gray-600">
                      {event.maxParticipants - event.participants} spots remaining
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Registration */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {Math.round((event.participants / event.maxParticipants) * 100)}% full
                </p>
                <Button
                  className="w-full"
                  onClick={handleRegister}
                  disabled={isRegistering || event.participants >= event.maxParticipants}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isRegistering
                    ? "Registering..."
                    : event.participants >= event.maxParticipants
                      ? "Event Full"
                      : "Register Now"}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">Registration is free for all youth members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

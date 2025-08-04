import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Vote, MessageSquare, TrendingUp, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Youth Leadership Workshop",
      date: "2024-02-15",
      time: "9:00 AM",
      venue: "Barangay Hall",
      type: "workshop",
      participants: 45,
      maxParticipants: 50,
      image: "/placeholder.svg?height=200&width=300&text=Leadership+Workshop",
    },
    {
      id: 2,
      title: "Community Clean-up Drive",
      date: "2024-02-20",
      time: "6:00 AM",
      venue: "Riverside Park",
      type: "community-service",
      participants: 32,
      maxParticipants: 100,
      image: "/placeholder.svg?height=200&width=300&text=Clean-up+Drive",
    },
    {
      id: 3,
      title: "Basketball Tournament",
      date: "2024-02-25",
      time: "2:00 PM",
      venue: "Municipal Court",
      type: "sports",
      participants: 28,
      maxParticipants: 40,
      image: "/placeholder.svg?height=200&width=300&text=Basketball+Tournament",
    },
  ]

  const stats = [
    { label: "Active Youth", value: "1,234", icon: Users, color: "text-blue-600" },
    { label: "Events This Month", value: "12", icon: Calendar, color: "text-green-600" },
    { label: "Project Ideas", value: "89", icon: Vote, color: "text-purple-600" },
    { label: "Feedback Received", value: "456", icon: MessageSquare, color: "text-orange-600" },
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Image src="/placeholder-logo.svg" alt="SKConnect Logo" width={120} height={120} className="mx-auto mb-6" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">SKConnect</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empowering Filipino youth through community engagement, leadership development, and collaborative project
            initiatives. Join your local Sangguniang Kabataan today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/auth/register">Join as Youth Member</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Community Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Upcoming Events</h2>
            <Button asChild variant="outline">
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <Badge className={`absolute top-3 left-3 ${getEventTypeColor(event.type)}`}>
                    {event.type.replace("-", " ")}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {event.participants}/{event.maxParticipants} registered
                    </div>
                    <div className="text-sm text-gray-500">
                      {Math.round((event.participants / event.maxParticipants) * 100)}% full
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                    ></div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/events/${event.id}`}>View Details & Register</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <CardTitle>Event Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Discover and register for community events, workshops, and activities organized by your local SK.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Vote className="w-12 h-12 mx-auto mb-4 text-green-600" />
                <CardTitle>Project Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Submit your ideas for community projects and vote on proposals from fellow youth members.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>Feedback System</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share your thoughts and rate events to help improve future community activities and programs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />
                <CardTitle>Youth Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Connect with other youth in your barangay and collaborate on community development initiatives.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-red-600" />
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor your participation, track event attendance, and see the impact of your community involvement.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                <CardTitle>Local Focus</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Stay connected with your barangay's activities and contribute to local development and governance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of Filipino youth who are actively participating in their communities through SKConnect. Your
            voice matters, your ideas count.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/register">Get Started Today</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

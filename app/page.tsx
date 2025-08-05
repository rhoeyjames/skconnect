import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MessageSquare, TrendingUp, ArrowRight, Heart } from "lucide-react"
import DynamicStats from "@/components/dynamic-stats"

export default function HomePage() {
  const features = [
    {
      icon: Users,
      title: "Youth Engagement",
      description: "Connect with fellow youth in your barangay and participate in community initiatives.",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      title: "Events & Activities",
      description: "Stay updated with SK events, workshops, and community programs in your area.",
      color: "text-green-600",
    },
    {
      icon: MessageSquare,
      title: "Voice Your Ideas",
      description: "Submit suggestions and feedback to help improve your community.",
      color: "text-purple-600",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor the impact of community projects and initiatives.",
      color: "text-orange-600",
    },
  ]



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">Empowering Filipino Youth</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Connect. Engage.
            <span className="text-blue-600"> Transform.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            SKConnect bridges the gap between Filipino youth and their Sangguniang Kabataan, fostering meaningful
            community engagement and positive change.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="w-full sm:w-auto">
                Join the Movement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section */}
      <DynamicStats />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose SKConnect?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover how our platform empowers youth to make a real difference in their communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4`}>
                      <Icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of Filipino youth who are already creating positive change in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <Heart className="mr-2 h-5 w-5" />
                Get Started Today
              </Button>
            </Link>
            <Link href="/events">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Explore Events
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { UserPlus, Share2 } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  venue: string
  type: string
  status: string
  participants: number
  maxParticipants: number
  description: string
  image: string
  organizer: string
  requirements: string[]
  agenda: { time: string; activity: string }[]
}

interface EventDetailClientProps {
  event: Event
  showRegistration?: boolean
}

export default function EventDetailClient({ event, showRegistration = false }: EventDetailClientProps) {
  const [isRegistering, setIsRegistering] = useState(false)
  const { toast } = useToast()

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

  if (showRegistration) {
    return (
      <Button
        className="w-full"
        onClick={handleRegister}
        disabled={isRegistering || event.participants >= event.maxParticipants}
      >
        <UserPlus className="w-4 h-4 mr-2" />
        {isRegistering ? "Registering..." : event.participants >= event.maxParticipants ? "Event Full" : "Register Now"}
      </Button>
    )
  }

  return (
    <div className="absolute top-4 right-4">
      <Button variant="secondary" size="sm" onClick={handleShare}>
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  )
}

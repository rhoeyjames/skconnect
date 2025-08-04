"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Lightbulb, ThumbsUp, Plus, User } from "lucide-react"

interface Suggestion {
  _id: string
  title: string
  description: string
  status: "pending" | "under-review" | "approved" | "rejected"
  votes: number
  hasVoted: boolean
  createdBy: {
    name: string
    barangay: string
  }
  createdAt: string
}

export default function Suggestions() {
  const { user } = useAuth()
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get("/api/suggestions")
        setSuggestions(response.data)
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  const handleVote = async (suggestionId: string) => {
    if (!user) return

    try {
      await axios.post(`/api/suggestions/${suggestionId}/vote`)
      setSuggestions((prev) =>
        prev.map((suggestion) =>
          suggestion._id === suggestionId
            ? {
                ...suggestion,
                votes: suggestion.hasVoted ? suggestion.votes - 1 : suggestion.votes + 1,
                hasVoted: !suggestion.hasVoted,
              }
            : suggestion,
        ),
      )
    } catch (error) {
      console.error("Error voting:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "under-review":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Project Suggestions</h1>
          <p className="text-gray-600 text-lg">Share your ideas and vote on community projects</p>
        </div>
        {user && (
          <Button asChild>
            <Link href="/suggestions/create">
              <Plus className="mr-2 h-4 w-4" />
              Suggest Project
            </Link>
          </Button>
        )}
      </div>

      {suggestions.length > 0 ? (
        <div className="grid gap-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{suggestion.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>{suggestion.createdBy.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{suggestion.createdBy.name}</span>
                      </div>
                      <span>•</span>
                      <span>{suggestion.createdBy.barangay}</span>
                      <span>•</span>
                      <span>{new Date(suggestion.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(suggestion.status)}>
                    {suggestion.status.replace("-", " ").toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={suggestion.hasVoted ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleVote(suggestion._id)}
                      disabled={!user}
                    >
                      <ThumbsUp className={`h-4 w-4 mr-1 ${suggestion.hasVoted ? "fill-current" : ""}`} />
                      {suggestion.votes}
                    </Button>
                    {!user && (
                      <span className="text-sm text-gray-500">
                        <Link href="/login" className="text-blue-600 hover:underline">
                          Login to vote
                        </Link>
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No suggestions yet</h3>
            <p className="text-gray-500 mb-4">Be the first to share your project idea!</p>
            {user ? (
              <Button asChild>
                <Link href="/suggestions/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Suggestion
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <User className="mr-2 h-4 w-4" />
                  Login to Suggest
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, Globe, Target } from "lucide-react"

interface DashboardStats {
  totalUsers: number
  totalEvents: number
  totalCommunities: number
  completedEvents: number
  eventsThisMonth: number
  usersByRole: {
    youth?: number
    sk_official?: number
    admin?: number
  }
}

export default function DynamicStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async (retryCount = 0) => {
      try {
        setIsLoading(true)
        setError(null)

        // Use Promise.race for timeout instead of AbortController
        const fetchPromise = fetch('/api/dashboard/stats')
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 8000)
        )

        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch statistics`)
        }
        const data = await response.json()
        setStats(data.stats)
      } catch (err: any) {
        console.error('Error fetching stats:', err)

        // Only retry once for network errors, not for timeouts
        if (retryCount < 1 && err.message.includes('fetch') && !err.message.includes('timeout')) {
          console.log(`Retrying stats fetch... (attempt ${retryCount + 1})`)
          setTimeout(() => fetchStats(retryCount + 1), 3000)
          return
        }

        setError('Showing fallback data - API temporarily unavailable')
        // Fallback to sample data to show something useful
        setStats({
          totalUsers: 0,
          totalEvents: 0,
          totalCommunities: 0,
          completedEvents: 0,
          eventsThisMonth: 0,
          usersByRole: { youth: 0, sk_official: 0, admin: 0 }
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatNumber = (num: number) => {
    if (num === 0) return '0'
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k+`
    }
    return `${num}+`
  }

  const statsData = [
    { 
      label: "Active Youth", 
      value: stats ? formatNumber(stats.totalUsers) : "...", 
      icon: Users,
      realValue: stats?.totalUsers || 0
    },
    { 
      label: "Communities", 
      value: stats ? formatNumber(stats.totalCommunities) : "...", 
      icon: Globe,
      realValue: stats?.totalCommunities || 0
    },
    { 
      label: "Events Hosted", 
      value: stats ? formatNumber(stats.totalEvents) : "...", 
      icon: Calendar,
      realValue: stats?.totalEvents || 0
    },
    { 
      label: "Projects Completed", 
      value: stats ? formatNumber(stats.completedEvents) : "...", 
      icon: Target,
      realValue: stats?.completedEvents || 0
    },
  ]

  if (error && stats === null) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-gray-500">
            <p>Unable to load live statistics. Showing placeholder data.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {stats && stats.totalUsers === 0 && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              <span className="mr-2">📊</span>
              Real-time data from your MongoDB database - showing live statistics!
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-8 w-16 mx-auto rounded"></div>
                  ) : (
                    <span title={`Exact count: ${stat.realValue}`}>
                      {stat.value}
                    </span>
                  )}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>
        {stats && (
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Live data updated from your MongoDB Atlas database</p>
            {stats.eventsThisMonth > 0 && (
              <p className="mt-1">📅 {stats.eventsThisMonth} events created this month</p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

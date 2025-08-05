"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Clock } from "lucide-react"

export default function ConnectivityStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')

  useEffect(() => {
    // Check browser online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    setIsOnline(navigator.onLine)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Check API connectivity
    const checkApiStatus = async () => {
      try {
        // Use Promise.race for better browser compatibility
        const fetchPromise = fetch('/api/health', { method: 'GET' })
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('timeout')), 5000)
        )

        const response = await Promise.race([fetchPromise, timeoutPromise]) as Response
        setApiStatus(response.ok ? 'online' : 'offline')
      } catch {
        setApiStatus('offline')
      }
    }

    checkApiStatus()
    const interval = setInterval(checkApiStatus, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  if (!isOnline) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant="destructive" className="flex items-center gap-2">
          <WifiOff className="h-3 w-3" />
          No Internet Connection
        </Badge>
      </div>
    )
  }

  if (apiStatus === 'offline') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant="secondary" className="flex items-center gap-2 bg-yellow-100 text-yellow-800">
          <Clock className="h-3 w-3" />
          API Reconnecting...
        </Badge>
      </div>
    )
  }

  if (apiStatus === 'online') {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Badge variant="default" className="flex items-center gap-2 bg-green-100 text-green-800">
          <Wifi className="h-3 w-3" />
          Connected
        </Badge>
      </div>
    )
  }

  return null
}

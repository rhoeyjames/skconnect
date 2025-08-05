import EventsClient from "./events-client"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Community Events</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover and participate in exciting community activities and programs
          </p>
        </div>

        <EventsClient />
      </div>
    </div>
  )
}

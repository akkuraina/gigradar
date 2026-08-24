'use client'

import { useEffect, useState } from 'react'

const CITY = 'Mumbai'

interface Event {
  id: string
  artist: string
  venue: string
  datetime: string
  url: string
  image: string
}

export default function GigsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/external?type=bandsintown-events&location=${CITY}`)
        if (!res.ok) throw new Error('Failed to fetch events')
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        
        if (data.success && data.data) {
          // Map to our Event type
          const mapped: Event[] = data.data.map((ev: Record<string, any>) => ({
            id: (ev.id || ev.uri) as string,
            artist: (ev.performance?.[0]?.artist?.displayName || ev.performance?.[0]?.artist?.name || 'Unknown Artist') as string,
            venue: (ev.venue?.displayName || ev.venue?.name || 'Unknown Venue') as string,
            datetime: (ev.start?.date || ev.start?.datetime || ev.datetime) as string,
            url: (ev.uri || ev.url || '#') as string,
            image: (ev.performance?.[0]?.artist?.image_url || '/globe.svg') as string,
          }))
          setEvents(mapped)
        } else {
          setError('No events found')
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-transparent premium-space">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-3">Live Gigs in {CITY}</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">Real-time events powered by Bandsintown</p>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-lg text-gray-500">Loading events...</div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="glass rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-lg text-red-400 mb-4">{error}</div>
              <button 
                onClick={() => window.location.reload()}
                className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-3xl mb-4">🎵</div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No gigs found</h3>
              <p className="text-gray-500 dark:text-gray-300">No events found for {CITY} at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.map(event => (
              <a
                key={event.id}
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glass rounded-2xl overflow-hidden hover-lift group transition-all flex flex-col h-full"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.artist}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-2xl"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      🎤 Live Event
                    </span>
                    <span className="text-sm text-gray-400 dark:text-gray-500">📍 {CITY}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-primary transition-colors">{event.artist}</h3>
                  <p className="text-sm mb-3 text-gray-500 dark:text-gray-300">{event.venue}</p>
                  <p className="text-sm mb-4 text-gray-400 dark:text-gray-500">{new Date(event.datetime).toLocaleString()}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-primary font-medium">View Event</span>
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
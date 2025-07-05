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
          const mapped: Event[] = data.data.map((ev: any) => ({
            id: ev.id || ev.uri,
            artist: ev.performance?.[0]?.artist?.displayName || ev.performance?.[0]?.artist?.name || 'Unknown Artist',
            venue: ev.venue?.displayName || ev.venue?.name || 'Unknown Venue',
            datetime: ev.start?.date || ev.start?.datetime || ev.datetime,
            url: ev.uri || ev.url || '#',
            image: ev.performance?.[0]?.artist?.image_url || '/globe.svg',
          }))
          setEvents(mapped)
        } else {
          setError('No events found')
        }
      } catch (e: any) {
        setError(e.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradient"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/20 rounded-full blur-md animate-pulse delay-500"></div>
      
      <div className="relative z-10">
        <div className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-4">🎤 Live Gigs in Mumbai</h1>
              <p className="mt-3 max-w-md mx-auto text-lg md:text-2xl text-white/90 mb-8">
                Real-time events powered by Bandsintown
              </p>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="text-lg text-white">Loading events...</div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-lg text-red-400 mb-4">{error}</div>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-3xl mb-4">🎵</div>
                <h3 className="text-lg font-medium text-white mb-2">No gigs found</h3>
                <p className="text-white/80">No events found for {CITY} at the moment.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map(event => (
                <a
                  key={event.id}
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-2xl overflow-hidden hover-lift group"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.artist}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        🎤 Live Event
                      </span>
                      <span className="text-sm text-white/80">📍 {CITY}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">{event.artist}</h3>
                    <p className="text-sm mb-3 text-white/80">{event.venue}</p>
                    <p className="text-sm mb-4 text-white/70">{new Date(event.datetime).toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">View Event</span>
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
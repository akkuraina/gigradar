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
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">
          Live Gigs in <span className="gradient-text">{CITY}</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Real-time concert listings and upcoming venue schedules.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl glass">
            <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Loading events...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="glass rounded-2xl p-6">
            <p className="text-red-500 dark:text-red-400 font-medium mb-4 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="glass rounded-2xl p-8">
            <span className="text-3xl mb-3 block">🎵</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No gigs found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">No upcoming events listed for {CITY} at the moment.</p>
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
              className="glass rounded-2xl overflow-hidden hover-lift flex flex-col h-full group"
            >
              <div className="relative h-44 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.artist}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium">
                  📍 {CITY}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">
                    {event.artist}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-3">
                    🏢 {event.venue}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between mt-auto">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    📅 {new Date(event.datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                    Get Tickets &rarr;
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
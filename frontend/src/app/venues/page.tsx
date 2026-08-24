'use client'

import { useState, useEffect } from 'react'

interface Venue {
  id: string
  name: string
  type?: string
  location?: string
  lat?: number
  lng?: number
  capacity?: number
  image?: string
  amenities?: string[]
  uri?: string
  metroArea?: {
    displayName: string
  }
  upcomingEvents?: any[]
}

export default function VenuesPage() {
  const [search, setSearch] = useState('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  useEffect(() => {
    loadPopularVenues()
  }, [])

  const loadPopularVenues = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/external?type=bandsintown-venues&query=Mumbai&page=1&perPage=20')
      const data = await response.json()
      
      if (data.success && data.data) {
        const formattedVenues: Venue[] = data.data.map((venue: any) => ({
          id: venue.id,
          name: venue.displayName,
          type: 'Venue',
          location: venue.metroArea?.displayName || 'Mumbai',
          lat: venue.lat,
          lng: venue.lng,
          uri: venue.uri,
          image: '/globe.svg',
        }))
        setVenues(formattedVenues)
      } else {
        setError(data.error || 'Failed to load venues')
      }
    } catch (err) {
      setError('Failed to load venues')
    } finally {
      setLoading(false)
    }
  }

  const searchVenues = async (query: string) => {
    if (!query.trim()) {
      loadPopularVenues()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/external?type=bandsintown-venues&query=${encodeURIComponent(query)}&page=1&perPage=20`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const formattedVenues: Venue[] = data.data.map((venue: any) => ({
          id: venue.id,
          name: venue.displayName,
          type: 'Venue',
          location: venue.metroArea?.displayName || 'Mumbai',
          lat: venue.lat,
          lng: venue.lng,
          uri: venue.uri,
          image: '/globe.svg',
        }))
        setVenues(formattedVenues)
      } else {
        setError(data.error || 'No venues found')
      }
    } catch (err) {
      setError('Failed to search venues')
    } finally {
      setLoading(false)
    }
  }

  const loadVenueEvents = async (venueId: string) => {
    try {
      const response = await fetch(`/api/external?type=bandsintown-venue-events&venueId=${venueId}&page=1&perPage=10`)
      const data = await response.json()
      if (data.success && data.data) return data.data
      return []
    } catch (err) {
      console.error('Failed to load venue events:', err)
      return []
    }
  }

  const handleVenueClick = async (venue: Venue) => {
    setSelectedVenue(venue)
    if (venue.id) {
      const events = await loadVenueEvents(venue.id)
      setSelectedVenue({ ...venue, upcomingEvents: events })
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">
          Venue <span className="gradient-text">Guide</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Explore local gig locations and concert spots in your city.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search venue name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-sm"
        />
        <button
          onClick={() => searchVenues(search)}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl glass">
            <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Searching venues...</span>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="glass rounded-2xl p-6">
            <p className="text-red-500 dark:text-red-400 font-medium mb-4 text-sm">{error}</p>
            <button 
              onClick={() => loadPopularVenues()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : venues.length === 0 ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="glass rounded-2xl p-8">
            <span className="text-3xl mb-3 block">📍</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No venues found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Try searching for a venue in Mumbai.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {venues.map(venue => (
            <div
              key={venue.id}
              className="glass rounded-2xl p-6 flex flex-col items-center hover-lift cursor-pointer transition-all text-center group"
              onClick={() => handleVenueClick(venue)}
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-3xl mb-4 group-hover:scale-105 transition-transform">
                🏛️
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">{venue.name}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">📍 {venue.location}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for venue details/events */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedVenue(null)}>
          <div className="glass rounded-2xl max-w-lg w-full p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-purple-500/10 dark:bg-purple-400/10 flex items-center justify-center text-4xl mb-3">
                🏛️
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{selectedVenue.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">📍 {selectedVenue.location}</p>
              {selectedVenue.uri && (
                <a
                  href={selectedVenue.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm"
                >
                  View on Bandsintown
                </a>
              )}
            </div>
            
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Upcoming Venue Events</h3>
            {selectedVenue.upcomingEvents && selectedVenue.upcomingEvents.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {selectedVenue.upcomingEvents.map((event: any, index: number) => (
                  <div key={index} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                        {event.performance?.[0]?.artist?.displayName || 'Unknown Artist'}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(event.start?.date || event.start?.datetime).toLocaleDateString()}
                      </p>
                    </div>
                    {event.uri && (
                      <a
                        href={event.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Details
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">No upcoming events listed for this venue.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
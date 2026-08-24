'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

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

// Dynamically import the map to avoid SSR issues
const VenueMap = dynamic(() => import('./VenueMap'), { ssr: false })

export default function VenuesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [showEvents, setShowEvents] = useState(false)

  // Load popular venues by default
  useEffect(() => {
    loadPopularVenues()
  }, [])

  const loadPopularVenues = async () => {
    setLoading(true)
    setError(null)
    try {
      // Search for popular venues in Mumbai
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
          image: '/globe.svg', // Default image
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
      
      if (data.success && data.data) {
        return data.data
      }
      return []
    } catch (err) {
      console.error('Failed to load venue events:', err)
      return []
    }
  }

  const handleVenueClick = async (venue: Venue) => {
    setSelectedVenue(venue)
    setShowEvents(true)
    
    // Load upcoming events for this venue
    if (venue.id) {
      const events = await loadVenueEvents(venue.id)
      setSelectedVenue({ ...venue, upcomingEvents: events })
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        searchVenues(search)
      } else {
        loadPopularVenues()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const types = ['all', ...Array.from(new Set(venues.map(v => v.type || 'Venue')))]

  const filteredVenues = venues.filter(venue => {
    const matchesType = type === 'all' || venue.type === type
    const matchesSearch = venue.name.toLowerCase().includes(search.toLowerCase()) ||
      (venue.location && venue.location.toLowerCase().includes(search.toLowerCase()))
    return matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-transparent premium-space">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-3">Discover Venues</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">Explore local venues, see amenities, and find your next gig spot.</p>
        </div>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <input
            type="text"
            placeholder="Search venues (e.g., Khar Social)..."
            className="w-full sm:w-80 px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="sm:w-48 px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary text-gray-800 dark:text-white"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            {types.map(t => (
              <option key={t} value={t} className="bg-gray-800">{t === 'all' ? 'All Types' : t}</option>
            ))}
          </select>
        </div>
        {/* Venue Map Section */}
        <div className="mb-12">
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-primary/10">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">📍 Venue Map</h2>
              <p className="text-gray-500 dark:text-gray-300">Explore venues on the map and discover your next gig spot</p>
            </div>
            <VenueMap venues={filteredVenues} />
          </div>
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-lg text-gray-500">Loading venues...</div>
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
        ) : venues.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No venues found</h3>
              <p className="text-gray-500 dark:text-gray-300">Try a different search or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {venues.map(venue => (
              <div
                key={venue.id}
                className="glass rounded-2xl p-6 flex flex-col items-center hover-lift cursor-pointer transition-all"
                onClick={() => handleVenueClick(venue)}
              >
                <img
                  src={venue.image || '/globe.svg'}
                  alt={venue.name}
                  className="w-24 h-24 object-cover rounded-full mb-4 border border-primary/10 shadow-none"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 text-center">{venue.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 text-center">{venue.location}</p>
                {/* Add more venue details as needed */}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal for venue details/events */}
      {selectedVenue && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 relative">
            <button
              onClick={() => setSelectedVenue(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
              <img
                src={selectedVenue.image || '/globe.svg'}
                alt={selectedVenue.name}
                className="w-32 h-32 object-cover rounded-xl border border-primary/10 shadow-none"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{selectedVenue.name}</h2>
                <p className="text-gray-500 dark:text-gray-300 mb-2">{selectedVenue.location}</p>
                {selectedVenue.capacity && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Capacity: {selectedVenue.capacity}</p>
                )}
                {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selectedVenue.amenities.map(a => (
                      <span key={a} className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
                {selectedVenue.uri && (
                  <a
                    href={selectedVenue.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-primary underline hover:opacity-80 text-sm"
                  >
                    View on Bandsintown
                  </a>
                )}
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Upcoming Events</h3>
            {selectedVenue.upcomingEvents && selectedVenue.upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {selectedVenue.upcomingEvents.map((event: any, index: number) => (
                  <div key={index} className="glass rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                      {event.performance?.[0]?.artist?.displayName || 'Unknown Artist'}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {new Date(event.start?.date || event.start?.datetime).toLocaleDateString()}
                    </p>
                    {event.uri && (
                      <a
                        href={event.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm underline hover:opacity-80"
                      >
                        View Event Details
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-300">No upcoming events found for {selectedVenue.name}.</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Check back later for new events!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 
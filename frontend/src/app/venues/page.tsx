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
              <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-4">📍 Discover Venues</h1>
              <p className="mt-3 max-w-md mx-auto text-lg md:text-2xl text-white/90 mb-8">
                Explore local venues, see amenities, and find your next gig spot.
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search venues (e.g., Khar Social)..."
                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                value={type}
                onChange={e => setType(e.target.value)}
              >
                {types.map(t => (
                  <option key={t} value={t} className="bg-gray-800">{t === 'all' ? 'All Types' : t}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Modal */}
        {showEvents && selectedVenue && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      📍
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedVenue.name}</h2>
                      <p className="text-white/80">{selectedVenue.location}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEvents(false)}
                    className="text-white hover:opacity-70 glass rounded-xl p-2"
                  >
                    ✕
                  </button>
                </div>
                
                {selectedVenue.upcomingEvents && selectedVenue.upcomingEvents.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-white">Upcoming Events</h3>
                    <div className="space-y-4">
                      {selectedVenue.upcomingEvents.map((event: any, index: number) => (
                        <div key={index} className="glass rounded-xl p-4">
                          <h4 className="font-semibold text-white">
                            {event.performance?.[0]?.artist?.displayName || 'Unknown Artist'}
                          </h4>
                          <p className="text-sm text-white/80">
                            {new Date(event.start?.date || event.start?.datetime).toLocaleDateString()}
                          </p>
                          {event.uri && (
                            <a 
                              href={event.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 text-sm hover:underline"
                            >
                              View Event Details
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/80">No upcoming events found for {selectedVenue.name}.</p>
                    <p className="text-sm text-white/60 mt-2">Check back later for new events!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Map Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="glass rounded-2xl overflow-hidden shadow-lg hover-lift">
            <div className="p-6 border-b border-white/20">
              <h2 className="text-2xl font-bold text-white mb-2">📍 Venue Map</h2>
              <p className="text-white/80">Explore venues on the map and discover your next gig spot</p>
            </div>
            <VenueMap venues={filteredVenues} />
          </div>
        </div>

        {/* Venues Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <div className="text-lg text-white">Loading venues...</div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-lg text-red-400 mb-4">{error}</div>
                <button 
                  onClick={loadPopularVenues}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filteredVenues.length === 0 ? (
            <div className="text-center py-12">
              <div className="glass rounded-2xl p-8 max-w-md mx-auto">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-medium text-white mb-2">No venues found</h3>
                <p className="text-white/80">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVenues.map(venue => (
                <div key={venue.id} className="glass rounded-2xl overflow-hidden hover-lift cursor-pointer" onClick={() => handleVenueClick(venue)}>
                  <div className="relative">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                        📍 Venue
                      </span>
                      <span className="text-sm text-white/80">📍 {venue.location}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{venue.name}</h3>
                    <p className="text-sm mb-3 text-white/80">{venue.type}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">View Events</span>
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
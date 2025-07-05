'use client'

import { useState, useEffect } from 'react'

interface Artist {
  id: string
  name: string
  genres: string[]
  bio?: string
  image?: string
  followers?: number
  popularity?: number
  external_urls?: {
    spotify?: string
  }
  upcomingEvents?: any[]
}

export default function ArtistsPage() {
  const [search, setSearch] = useState('')
  const [genre, setGenre] = useState('all')
  const [artists, setArtists] = useState<Artist[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [showEvents, setShowEvents] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)

  // Load popular artists by default
  useEffect(() => {
    loadPopularArtists()
  }, [])

  const loadPopularArtists = async () => {
    setLoading(true)
    setError(null)
    console.log('Loading popular artists...')
    
    try {
      // Use a simple search for popular artists instead of the new endpoint
      const popularArtistNames = [
        'Drake', 'Taylor Swift', 'Ed Sheeran', 'Beyoncé', 'The Weeknd',
        'Post Malone', 'Ariana Grande', 'Bad Bunny', 'Dua Lipa', 'Justin Bieber'
      ]
      const allArtists: Artist[] = []
      
      for (const artistName of popularArtistNames) {
        try {
          console.log(`Searching for ${artistName}...`)
          const response = await fetch(`/api/external?type=spotify-artists&query=${encodeURIComponent(artistName)}&limit=1`)
          const data = await response.json()
          console.log(`Response for ${artistName}:`, data)
          
          if (data.success && data.data && data.data.length > 0) {
            const artist = data.data[0]
            allArtists.push({
              id: artist.id,
              name: artist.name,
              genres: artist.genres || [],
              bio: `Popularity: ${artist.popularity}/100`,
              image: artist.images?.[0]?.url || '/globe.svg',
              followers: artist.followers?.total,
              popularity: artist.popularity,
              external_urls: artist.external_urls,
            })
            console.log(`Added ${artist.name} to list`)
          }
        } catch (err) {
          console.log(`Failed to load ${artistName}:`, err)
        }
      }
      
      console.log('Final artists list:', allArtists)
      if (allArtists.length > 0) {
        setArtists(allArtists)
      } else {
        // Fallback to mock data if API fails
        console.log('Using fallback mock data')
        const fallbackArtists: Artist[] = [
          {
            id: '1',
            name: 'Drake',
            genres: ['Hip-Hop', 'Rap'],
            bio: 'Popularity: 95/100',
            image: '/globe.svg',
            followers: 50000000,
            popularity: 95,
            external_urls: { spotify: 'https://open.spotify.com/artist/3TVXtAsR1Inumwj472S9r4' }
          },
          {
            id: '2',
            name: 'Taylor Swift',
            genres: ['Pop', 'Country'],
            bio: 'Popularity: 98/100',
            image: '/globe.svg',
            followers: 55000000,
            popularity: 98,
            external_urls: { spotify: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02' }
          },
          {
            id: '3',
            name: 'Ed Sheeran',
            genres: ['Pop', 'Folk'],
            bio: 'Popularity: 92/100',
            image: '/globe.svg',
            followers: 45000000,
            popularity: 92,
            external_urls: { spotify: 'https://open.spotify.com/artist/6eUKZXaKkcviH0Ku9w2n3V' }
          },
          {
            id: '4',
            name: 'Beyoncé',
            genres: ['R&B', 'Pop'],
            bio: 'Popularity: 96/100',
            image: '/globe.svg',
            followers: 48000000,
            popularity: 96,
            external_urls: { spotify: 'https://open.spotify.com/artist/6vWDO969PvNqNYHIOW5v0m' }
          },
          {
            id: '5',
            name: 'The Weeknd',
            genres: ['R&B', 'Pop'],
            bio: 'Popularity: 94/100',
            image: '/globe.svg',
            followers: 42000000,
            popularity: 94,
            external_urls: { spotify: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ' }
          },
          {
            id: '6',
            name: 'Post Malone',
            genres: ['Hip-Hop', 'Pop'],
            bio: 'Popularity: 93/100',
            image: '/globe.svg',
            followers: 38000000,
            popularity: 93,
            external_urls: { spotify: 'https://open.spotify.com/artist/246dkjvS1zLTtiykXe5h60' }
          },
          {
            id: '7',
            name: 'Ariana Grande',
            genres: ['Pop', 'R&B'],
            bio: 'Popularity: 97/100',
            image: '/globe.svg',
            followers: 52000000,
            popularity: 97,
            external_urls: { spotify: 'https://open.spotify.com/artist/66CXWjxzNUsdJxJ2JdwvnR' }
          },
          {
            id: '8',
            name: 'Bad Bunny',
            genres: ['Reggaeton', 'Latin'],
            bio: 'Popularity: 99/100',
            image: '/globe.svg',
            followers: 58000000,
            popularity: 99,
            external_urls: { spotify: 'https://open.spotify.com/artist/4q3ewBCX7sLwd24euuV69X' }
          },
          {
            id: '9',
            name: 'Dua Lipa',
            genres: ['Pop', 'Dance'],
            bio: 'Popularity: 91/100',
            image: '/globe.svg',
            followers: 35000000,
            popularity: 91,
            external_urls: { spotify: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we' }
          },
          {
            id: '10',
            name: 'Justin Bieber',
            genres: ['Pop', 'R&B'],
            bio: 'Popularity: 90/100',
            image: '/globe.svg',
            followers: 40000000,
            popularity: 90,
            external_urls: { spotify: 'https://open.spotify.com/artist/1uNFoZAHBGtllmzznpCI3s' }
          }
        ]
        setArtists(fallbackArtists)
      }
    } catch (err) {
      console.error('Error loading popular artists:', err)
      setError('Failed to load popular artists')
    } finally {
      setLoading(false)
    }
  }

  const loadArtistEvents = async (artistName: string) => {
    setLoadingEvents(true)
    try {
      // Use Bandsintown API to get artist events
      const response = await fetch(`/api/external?type=bandsintown-artists&query=${encodeURIComponent(artistName)}&limit=5`)
      const data = await response.json()
      
      if (data.success && data.data) {
        return data.data
      }
      return []
    } catch (err) {
      console.error('Failed to load artist events:', err)
      return []
    } finally {
      setLoadingEvents(false)
    }
  }

  const handleArtistEvents = async (artist: Artist) => {
    setSelectedArtist(artist)
    setShowEvents(true)
    
    // Load upcoming events for this artist
    const events = await loadArtistEvents(artist.name)
    setSelectedArtist({ ...artist, upcomingEvents: events })
  }

  const searchArtists = async (query: string) => {
    if (!query.trim()) {
      loadPopularArtists()
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/external?type=spotify-artists&query=${encodeURIComponent(query)}&limit=20`)
      const data = await response.json()
      
      if (data.success && data.data) {
        const formattedArtists: Artist[] = data.data.map((artist: any) => ({
          id: artist.id,
          name: artist.name,
          genres: artist.genres || [],
          bio: `Popularity: ${artist.popularity}/100`,
          image: artist.images?.[0]?.url || '/globe.svg',
          followers: artist.followers?.total,
          popularity: artist.popularity,
          external_urls: artist.external_urls,
        }))
        setArtists(formattedArtists)
      } else {
        setError(data.error || 'Failed to search artists')
      }
    } catch (err) {
      setError('Failed to search artists')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.trim()) {
        searchArtists(search)
      } else {
        loadPopularArtists()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  const genres = ['all', ...Array.from(new Set(artists.flatMap(a => a.genres)))]

  const filteredArtists = artists.filter(artist => {
    const matchesGenre = genre === 'all' || artist.genres.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    const matchesSearch = artist.name.toLowerCase().includes(search.toLowerCase()) ||
      (artist.bio && artist.bio.toLowerCase().includes(search.toLowerCase()))
    return matchesGenre && matchesSearch
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 animate-gradient"></div>
      
      <div className="relative z-10">
        <div className="w-full py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-4">Discover Artists</h1>
              <p className="mt-3 max-w-md mx-auto text-lg md:text-2xl text-white/90 mb-8">
                Discover popular artists, explore genres, and find your next favorite musician.
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
                placeholder="Search artists..."
                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 text-white placeholder-white/60"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="sm:w-48">
              <select
                className="w-full px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-purple-500 text-white"
                value={genre}
                onChange={e => setGenre(e.target.value)}
              >
                {genres.map(g => (
                  <option key={g} value={g} className="bg-gray-800">{g === 'all' ? 'All Genres' : g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Events Modal */}
        {showEvents && selectedArtist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-[#112240] rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-4">
                    <img 
                      src={selectedArtist.image || '/globe.svg'} 
                      alt={selectedArtist.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-bold text-[#18181b] dark:text-white">{selectedArtist.name}</h2>
                      <p className="text-[#18181b] dark:text-white/80">{selectedArtist.genres.join(', ')}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowEvents(false)}
                    className="text-[#18181b] dark:text-white hover:opacity-70"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Personalized Preview Message */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedArtist.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#18181b] dark:text-white font-medium">
                        Hi, I'm {selectedArtist.name}! 👋
                      </p>
                      <p className="text-sm text-[#18181b] dark:text-white/80">
                        Check out my upcoming live events below!
                      </p>
                    </div>
                  </div>
                </div>
                
                {loadingEvents ? (
                  <div className="text-center py-8">
                    <div className="text-lg text-[#18181b] dark:text-white">Loading events...</div>
                  </div>
                ) : selectedArtist.upcomingEvents && selectedArtist.upcomingEvents.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#18181b] dark:text-white">Upcoming Events</h3>
                    <div className="space-y-4">
                      {selectedArtist.upcomingEvents.map((event: any, index: number) => (
                        <div key={index} className="border border-[#18181b] dark:border-white rounded-lg p-4">
                          <h4 className="font-semibold text-[#18181b] dark:text-white">
                            {event.venue?.name || 'Unknown Venue'}
                          </h4>
                          <p className="text-sm text-[#18181b] dark:text-white/80">
                            {event.venue?.city && `${event.venue.city}, ${event.venue.country}`}
                          </p>
                          <p className="text-sm text-[#18181b] dark:text-white/80">
                            {new Date(event.datetime).toLocaleDateString()}
                          </p>
                          {event.url && (
                            <a 
                              href={event.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
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
                    <p className="text-[#18181b] dark:text-white/80">No upcoming events found for {selectedArtist.name}.</p>
                    <p className="text-sm text-[#18181b] dark:text-white/60 mt-2">Check back later for new tour dates!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Artists Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-lg text-white">Loading artists...</div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-lg text-red-500 mb-4">{error}</div>
              <button 
                onClick={loadPopularArtists}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredArtists.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-white">No artists found</h3>
              <p className="mt-2 text-white/80">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map(artist => (
                <div key={artist.id} className="glass rounded-2xl overflow-hidden hover-lift">
                  <img
                    src={artist.image}
                    alt={artist.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                        {artist.genres.join(', ')}
                      </span>
                      {artist.popularity && (
                        <span className="text-sm text-white/80">🔥 {artist.popularity}/100</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{artist.name}</h3>
                    <p className="text-sm mb-3 text-white/80">{artist.bio}</p>
                    <div className="flex flex-col gap-3">
                      <span className="text-sm text-white/70">
                        {artist.followers ? `${artist.followers.toLocaleString()} followers` : 'Spotify Artist'}
                      </span>
                      <div className="flex gap-2">
                        {artist.external_urls?.spotify ? (
                          <a 
                            href={artist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all duration-200 text-xs font-medium"
                          >
                            🎵 Spotify
                          </a>
                        ) : null}
                        <button 
                          onClick={() => handleArtistEvents(artist)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:scale-105 transition-all duration-200 text-xs font-medium"
                        >
                          🎤 Events
                        </button>
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
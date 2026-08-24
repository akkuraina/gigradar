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
    <div className="min-h-screen bg-transparent premium-space">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold gradient-text mb-3">Artists</h1>
          <p className="text-lg text-gray-500 dark:text-gray-300">Find and explore trending and underground artists</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-center items-center">
          <input
            type="text"
            placeholder="Search artists..."
            className="w-full md:w-80 px-4 py-3 glass rounded-xl focus:ring-2 focus:ring-primary text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {/* Genre filter can be added here if needed */}
        </div>
        {loading ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="text-lg text-gray-500">Loading artists...</div>
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
        ) : artists.length === 0 ? (
          <div className="text-center py-12">
            <div className="glass rounded-2xl p-8 max-w-md mx-auto">
              <div className="text-3xl mb-4">🎤</div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">No artists found</h3>
              <p className="text-gray-500 dark:text-gray-300">Try a different search or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artists.map(artist => (
              <div
                key={artist.id}
                className="glass rounded-2xl p-6 flex flex-col items-center hover-lift cursor-pointer transition-all"
                onClick={() => setSelectedArtist(artist)}
              >
                <img
                  src={artist.image || '/globe.svg'}
                  alt={artist.name}
                  className="w-24 h-24 object-cover rounded-full mb-4 border border-primary/10 shadow-none"
                />
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1 text-center">{artist.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-300 mb-2 text-center">{artist.genres?.join(', ')}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{artist.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Modal for artist details */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedArtist(null)}>
          <div className="glass rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedArtist(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col md:flex-row gap-8 items-center mb-6">
              <div className="flex flex-col items-center gap-2">
                {/* Show all images if available */}
                {Array.isArray((selectedArtist as any).images) && (selectedArtist as any).images.length > 0 ? (
                  <div className="flex flex-row gap-2 mb-2">
                    {(selectedArtist as any).images.map((img: any, idx: number) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={selectedArtist.name}
                        className="w-24 h-24 object-cover rounded-full border border-primary/10 shadow-none"
                      />
                    ))}
                  </div>
                ) : (
                  <img
                    src={selectedArtist.image || '/globe.svg'}
                    alt={selectedArtist.name}
                    className="w-24 h-24 object-cover rounded-full border border-primary/10 shadow-none mb-2"
                  />
                )}
                <a
                  href={selectedArtist.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-primary underline hover:opacity-80 text-sm"
                >
                  Open in Spotify
                </a>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{selectedArtist.name}</h2>
                <p className="text-gray-500 dark:text-gray-300 mb-2">{selectedArtist.genres?.join(', ')}</p>
                {selectedArtist.followers && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Followers: {selectedArtist.followers.toLocaleString()}</p>
                )}
                {selectedArtist.popularity && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Popularity: {selectedArtist.popularity}/100</p>
                )}
                {/* Spotify About/Bio if available */}
                {selectedArtist.bio && (
                  <p className="mt-4 text-gray-600 dark:text-gray-300 text-base whitespace-pre-line">{selectedArtist.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
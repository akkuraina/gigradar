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
    <div className="min-h-screen py-10 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2">
          Discover <span className="gradient-text">Artists</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
          Find trending independent musicians and spotify profiles.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-10 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Search artist name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm shadow-sm"
        />
        <button
          onClick={() => searchArtists(search)}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all shadow-sm"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-xl glass">
            <div className="w-5 h-5 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">Searching artists...</span>
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
      ) : artists.length === 0 ? (
        <div className="text-center py-12 max-w-md mx-auto">
          <div className="glass rounded-2xl p-8">
            <span className="text-3xl mb-3 block">🎤</span>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">No artists found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Try searching for an artist name.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map(artist => (
            <div
              key={artist.id}
              className="glass rounded-2xl p-6 flex flex-col items-center hover-lift cursor-pointer transition-all text-center group"
              onClick={() => setSelectedArtist(artist)}
            >
              <img
                src={artist.image || '/globe.svg'}
                alt={artist.name}
                className="w-24 h-24 object-cover rounded-full mb-4 border-2 border-purple-500/20 shadow-md group-hover:scale-105 transition-transform"
              />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-1">{artist.name}</h3>
              <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mb-2">{artist.genres?.slice(0, 2).join(', ')}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{artist.bio}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for artist details */}
      {selectedArtist && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedArtist(null)}>
          <div className="glass rounded-2xl max-w-lg w-full p-6 relative border border-slate-200 dark:border-slate-800 shadow-2xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedArtist(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <div className="flex flex-col items-center text-center">
              <img
                src={selectedArtist.image || '/globe.svg'}
                alt={selectedArtist.name}
                className="w-28 h-28 object-cover rounded-full border-4 border-purple-500/20 mb-4 shadow-lg"
              />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">{selectedArtist.name}</h2>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">{selectedArtist.genres?.join(', ')}</p>
              
              {selectedArtist.followers && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Followers: {selectedArtist.followers.toLocaleString()}</p>
              )}
              {selectedArtist.popularity && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Popularity: {selectedArtist.popularity}/100</p>
              )}
              
              {selectedArtist.external_urls?.spotify && (
                <a
                  href={selectedArtist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-sm inline-flex items-center space-x-2"
                >
                  <span>🎧 Open in Spotify</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
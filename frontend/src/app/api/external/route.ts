import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const query = searchParams.get('query')
  const limit = searchParams.get('limit') || '20'
  const offset = searchParams.get('offset') || '0'
  const page = searchParams.get('page') || '1'
  const perPage = searchParams.get('perPage') || '20'

  if (!type) {
    return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 })
  }

  try {
    let url = `${BACKEND_URL}/api/external`

    switch (type) {
      case 'spotify-artists':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for artist search' }, { status: 400 })
        }
        url += `/spotify/artists?query=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
        break

      case 'spotify-indian-hip-hop':
        url += `/spotify/indian-hip-hop?limit=${limit}&offset=${offset}`
        break

      case 'spotify-new-releases':
        url += `/spotify/new-releases?country=IN&limit=${limit}&offset=${offset}`
        break

      case 'spotify-popular-artists':
        url += `/spotify/popular-artists?limit=${limit}`
        break

      case 'enrich-artist':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for artist enrichment' }, { status: 400 })
        }
        url += `/enrich/artist/profile?artistName=${encodeURIComponent(query)}`
        break

      case 'bandsintown-events':
        const location = searchParams.get('location') || query
        if (!location) {
          return NextResponse.json({ error: 'Location parameter is required for event search' }, { status: 400 })
        }
        url += `/bandsintown/events?location=${encodeURIComponent(location)}&page=${page}&perPage=${perPage}`
        break

      case 'songkick-events':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for events search' }, { status: 400 })
        }
        url += `/songkick/events?location=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
        break

      case 'songkick-artists':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for artist search' }, { status: 400 })
        }
        url += `/songkick/artists?artistName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
        break

      case 'bandsintown-venues':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for venue search' }, { status: 400 })
        }
        url += `/bandsintown/venues?venueName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
        break

      case 'bandsintown-venue-events':
        const venueId = searchParams.get('venueId')
        if (!venueId) {
          return NextResponse.json({ error: 'Venue ID parameter is required' }, { status: 400 })
        }
        url += `/bandsintown/venues/${venueId}/events?page=${page}&perPage=${perPage}`
        break

      case 'bandsintown-artists':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for artist search' }, { status: 400 })
        }
        url += `/bandsintown/artists?artistName=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
        break

      case 'genius-artists':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter is required for artist search' }, { status: 400 })
        }
        url += `/genius/artists?query=${encodeURIComponent(query)}&page=${page}&perPage=${perPage}`
        break

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('External API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data from external API' },
      { status: 500 }
    )
  }
} 
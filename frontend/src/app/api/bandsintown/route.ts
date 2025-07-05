import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get('city') || 'Mumbai'
  const appId = process.env.BANDSINTOWN_API_KEY
  console.log('BANDSINTOWN_API_KEY:', appId) // DEBUG
  const url = `https://rest.bandsintown.com/v4/events?location=${encodeURIComponent(city)}&radius=50&app_id=${appId}`

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Bandsintown' }, { status: 500 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
} 
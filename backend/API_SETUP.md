# External API Integration Setup

This guide explains how to set up and use the external API integrations (Songkick, Spotify, and Genius) in the GigRadar backend.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Songkick API
SONGKICK_API_KEY=your_songkick_api_key_here

# Spotify API
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Genius API
GENIUS_ACCESS_TOKEN=your_genius_access_token_here
```

## API Setup Instructions

### 1. Songkick API Setup

1. Go to [Songkick Developer Portal](https://www.songkick.com/developer)
2. Sign up for a developer account
3. Create a new application
4. Copy your API key to `SONGKICK_API_KEY`

**Free Tier Limits:**

- ~50 requests/day
- Good for testing and small applications

### 2. Spotify API Setup

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Create a new application
4. Copy the Client ID and Client Secret to your environment variables

**Features Available:**

- Artist search and details
- Top tracks
- Albums and discography
- Related artists
- Playlist search
- New releases
- Featured playlists

### 3. Genius API Setup

1. Go to [Genius API Documentation](https://docs.genius.com/)
2. Create a Genius account
3. Go to your account settings
4. Generate an access token
5. Copy the token to `GENIUS_ACCESS_TOKEN`

**Features Available:**

- Artist search and details
- Song lyrics and information
- Album information
- Artist biographies

## API Endpoints

### Songkick Endpoints

#### Search Events by Location

```
GET /api/external/songkick/events?location=Mumbai&page=1&perPage=50
```

#### Search Events by Artist

```
GET /api/external/songkick/events/artist?artistName=ArtistName&page=1&perPage=50
```

#### Search Artists

```
GET /api/external/songkick/artists?artistName=ArtistName&page=1&perPage=50
```

#### Get Artist Details

```
GET /api/external/songkick/artists/:artistId
```

#### Get Artist Events

```
GET /api/external/songkick/artists/:artistId/events?page=1&perPage=50
```

#### Search Venues

```
GET /api/external/songkick/venues?venueName=VenueName&location=Mumbai&page=1&perPage=50
```

#### Get Venue Details

```
GET /api/external/songkick/venues/:venueId
```

#### Get Venue Events

```
GET /api/external/songkick/venues/:venueId/events?page=1&perPage=50
```

### Spotify Endpoints

#### Search Artists

```
GET /api/external/spotify/artists?query=ArtistName&limit=20&offset=0
```

#### Get Artist Details

```
GET /api/external/spotify/artists/:artistId
```

#### Get Artist's Top Tracks

```
GET /api/external/spotify/artists/:artistId/top-tracks?market=IN
```

#### Get Artist's Albums

```
GET /api/external/spotify/artists/:artistId/albums?limit=20&offset=0
```

#### Get Related Artists

```
GET /api/external/spotify/artists/:artistId/related
```

#### Search Playlists

```
GET /api/external/spotify/playlists?query=desi hip hop&limit=20&offset=0
```

#### Get Playlist Tracks

```
GET /api/external/spotify/playlists/:playlistId/tracks?limit=20&offset=0
```

#### Search Indian Hip-Hop Artists

```
GET /api/external/spotify/indian-hip-hop?limit=20&offset=0
```

#### Get New Releases

```
GET /api/external/spotify/new-releases?country=IN&limit=20&offset=0
```

#### Get Featured Playlists

```
GET /api/external/spotify/featured-playlists?country=IN&limit=20&offset=0
```

### Genius Endpoints

#### Search Artists

```
GET /api/external/genius/artists?query=ArtistName&page=1&perPage=20
```

#### Get Artist Details

```
GET /api/external/genius/artists/:artistId
```

#### Get Artist's Songs

```
GET /api/external/genius/artists/:artistId/songs?page=1&perPage=20&sort=title
```

#### Search Songs

```
GET /api/external/genius/songs?query=SongName&page=1&perPage=20
```

#### Get Song Details

```
GET /api/external/genius/songs/:songId
```

#### Search Indian Hip-Hop Artists

```
GET /api/external/genius/indian-hip-hop?page=1&perPage=20
```

#### Get Artist's Albums

```
GET /api/external/genius/artists/:artistId/albums?page=1&perPage=50
```

### Enrichment Endpoints

#### Enrich Artist Data

```
GET /api/external/enrich/artist?artistName=ArtistName
```

#### Get Comprehensive Artist Profile

```
GET /api/external/enrich/artist/profile?artistName=ArtistName
```

#### Search Indian Hip-Hop Artists Across Platforms

```
GET /api/external/enrich/indian-hip-hop?limit=20
```

#### Search Artist Events Across Platforms

```
GET /api/external/enrich/artist/events?artistName=ArtistName
```

## Usage Examples

### Example 1: Find Events in Mumbai

```javascript
const response = await fetch(
  "/api/external/songkick/events?location=Mumbai&page=1&perPage=20"
);
const events = await response.json();
console.log(events.data); // Array of events
```

### Example 2: Search for Indian Hip-Hop Artists

```javascript
const response = await fetch("/api/external/enrich/indian-hip-hop?limit=10");
const artists = await response.json();
console.log(artists.data); // Array of artists from multiple platforms
```

### Example 3: Get Comprehensive Artist Profile

```javascript
const response = await fetch(
  "/api/external/enrich/artist/profile?artistName=Divine"
);
const profile = await response.json();
console.log(profile.data); // Complete artist profile with data from all platforms
```

### Example 4: Search for Artist Events

```javascript
const response = await fetch(
  "/api/external/enrich/artist/events?artistName=Seedhe Maut"
);
const events = await response.json();
console.log(events.data.events); // Array of upcoming events
```

## Error Handling

All endpoints return a consistent response format:

**Success Response:**

```json
{
  "success": true,
  "data": [...],
  "totalResults": 100,
  "page": 1
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message"
}
```

## Rate Limiting

- **Songkick**: ~50 requests/day (free tier)
- **Spotify**: 25 requests/second
- **Genius**: No documented limits, but use responsibly

## Best Practices

1. **Cache Results**: Implement caching for frequently requested data
2. **Error Handling**: Always handle API errors gracefully
3. **Rate Limiting**: Respect API rate limits
4. **Fallback Strategy**: Use multiple APIs for redundancy
5. **Data Validation**: Validate API responses before using

## Testing the APIs

You can test the APIs using curl or Postman:

```bash
# Test Songkick API
curl "http://localhost:5000/api/external/songkick/events?location=Mumbai"

# Test Spotify API
curl "http://localhost:5000/api/external/spotify/artists?query=Divine"

# Test Genius API
curl "http://localhost:5000/api/external/genius/artists?query=Seedhe Maut"

# Test Enrichment API
curl "http://localhost:5000/api/external/enrich/artist/profile?artistName=Divine"
```

## Troubleshooting

### Common Issues:

1. **API Key Errors**: Ensure all environment variables are set correctly
2. **Rate Limit Errors**: Implement exponential backoff for retries
3. **Network Errors**: Add timeout handling for API requests
4. **Data Format Issues**: Validate API responses match expected format

### Debug Mode:

Enable debug logging by setting:

```env
DEBUG=external-apis:*
```

This will log all API requests and responses for debugging purposes.

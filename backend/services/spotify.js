const axios = require('axios');
const cheerio = require('cheerio');

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.baseURL = 'https://api.spotify.com/v1';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get access token
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials',
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);

      return this.accessToken;
    } catch (error) {
      console.error('Spotify API Token Error:', error.message);
      throw new Error('Failed to get Spotify access token');
    }
  }

  // Make authenticated request
  async makeRequest(endpoint, params = {}) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error('Spotify API Error:', error.message);
      throw error;
    }
  }

  // Search for artists
  async searchArtists(query, limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest('/search', {
        q: query,
        type: 'artist',
        limit,
        offset
      });

      return {
        success: true,
        data: data.artists.items,
        total: data.artists.total,
        limit: data.artists.limit,
        offset: data.artists.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist details by ID
  async getArtistDetails(artistId) {
    try {
      const data = await this.makeRequest(`/artists/${artistId}`);
      let biography = null;
      try {
        // Scrape the Spotify about page for the artist
        const aboutUrl = `https://open.spotify.com/artist/${artistId}/about`;
        const html = await axios.get(aboutUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9',
          },
        }).then(res => res.data);
        const $ = cheerio.load(html);
        // Try to find the about/biography text (Spotify's structure may change)
        // Look for <meta property="og:description" content="..."> as fallback
        biography = $('meta[property="og:description"]').attr('content') || null;
        // Try to find a more specific about section if available
        const aboutSection = $('[data-testid="about-section"]').text();
        if (aboutSection && aboutSection.length > 50) {
          biography = aboutSection;
        }
      } catch (err) {
        // If scraping fails, just skip biography
        biography = null;
      }
      return {
        success: true,
        data: { ...data, biography },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist's top tracks
  async getArtistTopTracks(artistId, market = 'IN') {
    try {
      const data = await this.makeRequest(`/artists/${artistId}/top-tracks`, {
        market
      });

      return {
        success: true,
        data: data.tracks
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist's albums
  async getArtistAlbums(artistId, limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest(`/artists/${artistId}/albums`, {
        limit,
        offset,
        include_groups: 'album,single'
      });

      return {
        success: true,
        data: data.items,
        total: data.total,
        limit: data.limit,
        offset: data.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist's related artists
  async getRelatedArtists(artistId) {
    try {
      const data = await this.makeRequest(`/artists/${artistId}/related-artists`);

      return {
        success: true,
        data: data.artists
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for playlists
  async searchPlaylists(query, limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest('/search', {
        q: query,
        type: 'playlist',
        limit,
        offset
      });

      return {
        success: true,
        data: data.playlists.items,
        total: data.playlists.total,
        limit: data.playlists.limit,
        offset: data.playlists.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get playlist tracks
  async getPlaylistTracks(playlistId, limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest(`/playlists/${playlistId}/tracks`, {
        limit,
        offset
      });

      return {
        success: true,
        data: data.items,
        total: data.total,
        limit: data.limit,
        offset: data.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for Indian hip-hop artists specifically
  async searchIndianHipHopArtists(limit = 20, offset = 0) {
    try {
      // Search for playlists with Indian hip-hop
      const playlistData = await this.searchPlaylists('desi hip hop indian rap', limit, offset);
      
      if (!playlistData.success) {
        return playlistData;
      }

      // Get tracks from the first playlist to extract artists
      const artists = new Set();
      
      for (const playlist of playlistData.data.slice(0, 3)) { // Check first 3 playlists
        if (playlist && playlist.id) {
          const tracksData = await this.getPlaylistTracks(playlist.id, 50, 0);
          
          if (tracksData.success) {
            tracksData.data.forEach(item => {
              if (item.track && item.track.artists) {
                item.track.artists.forEach(artist => {
                  artists.add(artist.name);
                });
              }
            });
          }
        }
      }

      return {
        success: true,
        data: Array.from(artists).slice(0, limit),
        total: artists.size
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get new releases
  async getNewReleases(country = 'IN', limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest('/browse/new-releases', {
        country,
        limit,
        offset
      });

      return {
        success: true,
        data: data.albums.items,
        total: data.albums.total,
        limit: data.albums.limit,
        offset: data.albums.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get featured playlists
  async getFeaturedPlaylists(country = 'IN', limit = 20, offset = 0) {
    try {
      const data = await this.makeRequest('/browse/featured-playlists', {
        country,
        limit,
        offset
      });

      return {
        success: true,
        data: data.playlists.items,
        total: data.playlists.total,
        limit: data.playlists.limit,
        offset: data.playlists.offset
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get popular artists by searching for top artists
  async getPopularArtists(limit = 20) {
    try {
      // Search for popular artists to get their full data
      const popularArtistNames = [
        'Drake', 'Taylor Swift', 'Ed Sheeran', 'Beyoncé', 'The Weeknd',
        'Post Malone', 'Ariana Grande', 'Bad Bunny', 'Dua Lipa', 'Justin Bieber',
        'Billie Eilish', 'Kendrick Lamar', 'Travis Scott', 'Lana Del Rey', 'The Beatles',
        'Drake', 'Taylor Swift', 'Ed Sheeran', 'Beyoncé', 'The Weeknd'
      ]
      
      const allArtists = []
      
      for (const artistName of popularArtistNames.slice(0, limit)) {
        try {
          const searchResult = await this.searchArtists(artistName, 1, 0)
          if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
            allArtists.push(searchResult.data[0])
          }
        } catch (err) {
          console.log(`Failed to load ${artistName}`)
        }
      }
      
      return {
        success: true,
        data: allArtists,
        total: allArtists.length
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SpotifyService(); 
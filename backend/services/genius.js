const axios = require('axios');

class GeniusService {
  constructor() {
    this.baseURL = 'https://api.genius.com';
    this.accessToken = process.env.GENIUS_ACCESS_TOKEN;
  }

  // Make authenticated request
  async makeRequest(endpoint, params = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        params
      });
      return response.data;
    } catch (error) {
      console.error('Genius API Error:', error.message);
      throw error;
    }
  }

  // Search for artists
  async searchArtists(query, page = 1, perPage = 20) {
    try {
      const data = await this.makeRequest('/search', {
        q: query,
        page,
        per_page: perPage
      });

      // Filter results to only include artists
      const artists = data.response.hits.filter(hit => hit.type === 'song' && hit.result.primary_artist);

      return {
        success: true,
        data: artists.map(hit => ({
          id: hit.result.primary_artist.id,
          name: hit.result.primary_artist.name,
          url: hit.result.primary_artist.url,
          image_url: hit.result.primary_artist.image_url,
          song_title: hit.result.title,
          song_url: hit.result.url
        })),
        totalResults: data.response.hits.length,
        page
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

      return {
        success: true,
        data: {
          id: data.response.artist.id,
          name: data.response.artist.name,
          url: data.response.artist.url,
          image_url: data.response.artist.image_url,
          header_image_url: data.response.artist.header_image_url,
          description: data.response.artist.description?.plain,
          facebook_name: data.response.artist.facebook_name,
          instagram_name: data.response.artist.instagram_name,
          twitter_name: data.response.artist.twitter_name,
          followers_count: data.response.artist.followers_count,
          is_verified: data.response.artist.is_verified
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist's songs
  async getArtistSongs(artistId, page = 1, perPage = 20, sort = 'title') {
    try {
      const data = await this.makeRequest(`/artists/${artistId}/songs`, {
        page,
        per_page: perPage,
        sort
      });

      return {
        success: true,
        data: data.response.songs,
        totalResults: data.response.songs.length,
        page
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for songs
  async searchSongs(query, page = 1, perPage = 20) {
    try {
      const data = await this.makeRequest('/search', {
        q: query,
        page,
        per_page: perPage
      });

      // Filter results to only include songs
      const songs = data.response.hits.filter(hit => hit.type === 'song');

      return {
        success: true,
        data: songs.map(hit => ({
          id: hit.result.id,
          title: hit.result.title,
          url: hit.result.url,
          primary_artist: {
            id: hit.result.primary_artist.id,
            name: hit.result.primary_artist.name,
            url: hit.result.primary_artist.url
          },
          featured_artists: hit.result.featured_artists,
          release_date: hit.result.release_date,
          header_image_url: hit.result.header_image_url
        })),
        totalResults: data.response.hits.length,
        page
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get song details by ID
  async getSongDetails(songId) {
    try {
      const data = await this.makeRequest(`/songs/${songId}`);

      return {
        success: true,
        data: {
          id: data.response.song.id,
          title: data.response.song.title,
          url: data.response.song.url,
          header_image_url: data.response.song.header_image_url,
          primary_artist: {
            id: data.response.song.primary_artist.id,
            name: data.response.song.primary_artist.name,
            url: data.response.song.primary_artist.url
          },
          featured_artists: data.response.song.featured_artists,
          release_date: data.response.song.release_date,
          description: data.response.song.description?.plain,
          lyrics_state: data.response.song.lyrics_state,
          pyongs_count: data.response.song.pyongs_count,
          stats: data.response.song.stats
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for Indian hip-hop artists specifically
  async searchIndianHipHopArtists(page = 1, perPage = 20) {
    try {
      const queries = [
        'desi hip hop',
        'indian rap',
        'hindi hip hop',
        'punjabi rap',
        'bhangra hip hop'
      ];

      const allArtists = new Map();

      for (const query of queries) {
        const result = await this.searchArtists(query, page, perPage);
        
        if (result.success) {
          result.data.forEach(artist => {
            if (!allArtists.has(artist.id)) {
              allArtists.set(artist.id, artist);
            }
          });
        }
      }

      return {
        success: true,
        data: Array.from(allArtists.values()),
        totalResults: allArtists.size,
        page
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist's albums (through songs)
  async getArtistAlbums(artistId, page = 1, perPage = 50) {
    try {
      const songsData = await this.getArtistSongs(artistId, page, perPage);
      
      if (!songsData.success) {
        return songsData;
      }

      // Group songs by album
      const albums = new Map();
      
      songsData.data.forEach(song => {
        if (song.album) {
          const albumId = song.album.id;
          if (!albums.has(albumId)) {
            albums.set(albumId, {
              id: song.album.id,
              name: song.album.name,
              url: song.album.url,
              cover_art_url: song.album.cover_art_url,
              songs: []
            });
          }
          albums.get(albumId).songs.push({
            id: song.id,
            title: song.title,
            url: song.url
          });
        }
      });

      return {
        success: true,
        data: Array.from(albums.values()),
        totalResults: albums.size,
        page
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new GeniusService(); 
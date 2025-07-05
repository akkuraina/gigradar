const spotifyService = require('./spotify');
const geniusService = require('./genius');
const songkickService = require('./songkick');

class ArtistEnrichmentService {
  constructor() {
    this.spotifyService = spotifyService;
    this.geniusService = geniusService;
    this.songkickService = songkickService;
  }

  // Enrich artist with data from all APIs
  async enrichArtist(artistName) {
    try {
      const results = await Promise.allSettled([
        this.spotifyService.searchArtists(artistName, 1, 1),
        this.geniusService.searchArtists(artistName, 1, 1),
        this.songkickService.searchArtists(artistName, 1, 1)
      ]);

      const enrichedData = {
        name: artistName,
        spotify: null,
        genius: null,
        songkick: null,
        events: [],
        topTracks: [],
        albums: [],
        relatedArtists: []
      };

      // Process Spotify data
      if (results[0].status === 'fulfilled' && results[0].value.success && results[0].value.data.length > 0) {
        const spotifyArtist = results[0].value.data[0];
        enrichedData.spotify = {
          id: spotifyArtist.id,
          name: spotifyArtist.name,
          popularity: spotifyArtist.popularity,
          genres: spotifyArtist.genres,
          images: spotifyArtist.images,
          external_urls: spotifyArtist.external_urls
        };

        // Get additional Spotify data
        try {
          const [topTracks, albums, relatedArtists] = await Promise.allSettled([
            this.spotifyService.getArtistTopTracks(spotifyArtist.id),
            this.spotifyService.getArtistAlbums(spotifyArtist.id, 5, 0),
            this.spotifyService.getRelatedArtists(spotifyArtist.id)
          ]);

          if (topTracks.status === 'fulfilled' && topTracks.value.success) {
            enrichedData.topTracks = topTracks.value.data;
          }

          if (albums.status === 'fulfilled' && albums.value.success) {
            enrichedData.albums = albums.value.data;
          }

          if (relatedArtists.status === 'fulfilled' && relatedArtists.value.success) {
            enrichedData.relatedArtists = relatedArtists.value.data;
          }
        } catch (error) {
          console.error('Error fetching additional Spotify data:', error);
        }
      }

      // Process Genius data
      if (results[1].status === 'fulfilled' && results[1].value.success && results[1].value.data.length > 0) {
        const geniusArtist = results[1].value.data[0];
        enrichedData.genius = {
          id: geniusArtist.id,
          name: geniusArtist.name,
          url: geniusArtist.url,
          image_url: geniusArtist.image_url,
          song_title: geniusArtist.song_title
        };

        // Get additional Genius data
        try {
          const songs = await this.geniusService.getArtistSongs(geniusArtist.id, 1, 10);
          if (songs.success) {
            enrichedData.genius.songs = songs.data;
          }
        } catch (error) {
          console.error('Error fetching additional Genius data:', error);
        }
      }

      // Process Songkick data
      if (results[2].status === 'fulfilled' && results[2].value.success && results[2].value.data.length > 0) {
        const songkickArtist = results[2].value.data[0];
        enrichedData.songkick = {
          id: songkickArtist.id,
          name: songkickArtist.displayName,
          uri: songkickArtist.uri
        };

        // Get upcoming events
        try {
          const events = await this.songkickService.getArtistEvents(songkickArtist.id, 1, 10);
          if (events.success) {
            enrichedData.events = events.data;
          }
        } catch (error) {
          console.error('Error fetching Songkick events:', error);
        }
      }

      return {
        success: true,
        data: enrichedData
      };
    } catch (error) {
      console.error('Artist enrichment error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for Indian hip-hop artists across all platforms
  async searchIndianHipHopArtists(limit = 20) {
    try {
      const results = await Promise.allSettled([
        this.spotifyService.searchIndianHipHopArtists(limit, 0),
        this.geniusService.searchIndianHipHopArtists(1, limit)
      ]);

      const allArtists = new Map();

      // Process Spotify results
      if (results[0].status === 'fulfilled' && results[0].value.success) {
        results[0].value.data.forEach(artistName => {
          allArtists.set(artistName, {
            name: artistName,
            source: 'spotify',
            platforms: ['spotify']
          });
        });
      }

      // Process Genius results
      if (results[1].status === 'fulfilled' && results[1].value.success) {
        results[1].value.data.forEach(artist => {
          if (allArtists.has(artist.name)) {
            allArtists.get(artist.name).platforms.push('genius');
            allArtists.get(artist.name).genius = artist;
          } else {
            allArtists.set(artist.name, {
              name: artist.name,
              source: 'genius',
              platforms: ['genius'],
              genius: artist
            });
          }
        });
      }

      return {
        success: true,
        data: Array.from(allArtists.values()).slice(0, limit),
        total: allArtists.size
      };
    } catch (error) {
      console.error('Indian hip-hop search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get comprehensive artist profile
  async getArtistProfile(artistName) {
    try {
      const enrichedData = await this.enrichArtist(artistName);
      
      if (!enrichedData.success) {
        return enrichedData;
      }

      const profile = {
        name: artistName,
        platforms: {
          spotify: enrichedData.data.spotify ? true : false,
          genius: enrichedData.data.genius ? true : false,
          songkick: enrichedData.data.songkick ? true : false
        },
        data: enrichedData.data,
        summary: this.generateArtistSummary(enrichedData.data)
      };

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      console.error('Artist profile error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Generate artist summary
  generateArtistSummary(data) {
    const summary = {
      hasEvents: data.events.length > 0,
      hasTopTracks: data.topTracks.length > 0,
      hasAlbums: data.albums.length > 0,
      hasRelatedArtists: data.relatedArtists.length > 0,
      upcomingEvents: data.events.length,
      totalTracks: data.topTracks.length,
      totalAlbums: data.albums.length,
      totalRelatedArtists: data.relatedArtists.length
    };

    if (data.spotify) {
      summary.popularity = data.spotify.popularity;
      summary.genres = data.spotify.genres;
    }

    return summary;
  }

  // Search for events by artist across platforms
  async searchArtistEvents(artistName) {
    try {
      const results = await Promise.allSettled([
        this.songkickService.searchEventsByArtist(artistName, 1, 20),
        this.spotifyService.searchArtists(artistName, 1, 1)
      ]);

      const events = [];

      // Process Songkick events
      if (results[0].status === 'fulfilled' && results[0].value.success) {
        events.push(...results[0].value.data.map(event => ({
          ...event,
          source: 'songkick'
        })));
      }

      // Process Spotify artist (for additional context)
      let spotifyArtist = null;
      if (results[1].status === 'fulfilled' && results[1].value.success && results[1].value.data.length > 0) {
        spotifyArtist = results[1].value.data[0];
      }

      return {
        success: true,
        data: {
          events,
          spotifyArtist,
          totalEvents: events.length
        }
      };
    } catch (error) {
      console.error('Artist events search error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new ArtistEnrichmentService(); 
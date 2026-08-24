const express = require('express');
const router = express.Router();
const bandsintownService = require('../services/bandsintown');
const spotifyService = require('../services/spotify');
const geniusService = require('../services/genius');
const artistEnrichmentService = require('../services/artist-enrichment');

// Bandsintown API Routes

// Search for events in a location
router.get('/bandsintown/events', async (req, res) => {
  try {
    const { location, page = 1, perPage = 50 } = req.query;
    
    if (!location) {
      return res.status(400).json({ 
        success: false, 
        message: 'Location parameter is required' 
      });
    }

    const result = await bandsintownService.searchEvents(location, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Bandsintown events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events' 
    });
  }
});

// Search for artists
router.get('/bandsintown/artists', async (req, res) => {
  try {
    const { artistName, page = 1, perPage = 50 } = req.query;
    
    if (!artistName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artist name parameter is required' 
      });
    }

    const result = await bandsintownService.searchArtists(artistName, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Bandsintown artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artists' 
    });
  }
});

// Search for venues
router.get('/bandsintown/venues', async (req, res) => {
  try {
    const { venueName, location, page = 1, perPage = 50 } = req.query;
    
    if (!venueName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Venue name parameter is required' 
      });
    }

    const result = await bandsintownService.searchVenues(venueName, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Bandsintown venues error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch venues' 
    });
  }
});

// Get venue events
router.get('/bandsintown/venues/:venueId/events', async (req, res) => {
  try {
    const { venueId } = req.params;
    const { page = 1, perPage = 50 } = req.query;
    
    const result = await bandsintownService.getVenueEvents(venueId, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Bandsintown venue events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch venue events' 
    });
  }
});

// Search for artists
router.get('/bandsintown/artists', async (req, res) => {
  try {
    const { artistName, page = 1, perPage = 50 } = req.query;
    
    if (!artistName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artist name parameter is required' 
      });
    }

    const result = await bandsintownService.searchArtists(artistName, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Bandsintown artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artists' 
    });
  }
});

// Spotify API Routes

// Search for artists
router.get('/spotify/artists', async (req, res) => {
  try {
    const { query, limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    const result = await spotifyService.searchArtists(query, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artists' 
    });
  }
});

// Get artist details (now includes biography/about if available)
router.get('/spotify/artists/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const result = await spotifyService.getArtistDetails(artistId);
    res.json(result);
  } catch (error) {
    console.error('Spotify artist details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist details' 
    });
  }
});

// Get popular artists
router.get('/spotify/popular-artists', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const result = await spotifyService.getPopularArtists(parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Spotify popular artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch popular artists' 
    });
  }
});

// Get artist's top tracks
router.get('/spotify/artists/:artistId/top-tracks', async (req, res) => {
  try {
    const { artistId } = req.params;
    const { market = 'IN' } = req.query;
    
    const result = await spotifyService.getArtistTopTracks(artistId, market);
    res.json(result);
  } catch (error) {
    console.error('Spotify artist top tracks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist top tracks' 
    });
  }
});

// Get artist's albums
router.get('/spotify/artists/:artistId/albums', async (req, res) => {
  try {
    const { artistId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await spotifyService.getArtistAlbums(artistId, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify artist albums error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist albums' 
    });
  }
});

// Get artist's related artists
router.get('/spotify/artists/:artistId/related', async (req, res) => {
  try {
    const { artistId } = req.params;
    const result = await spotifyService.getRelatedArtists(artistId);
    res.json(result);
  } catch (error) {
    console.error('Spotify related artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch related artists' 
    });
  }
});

// Search for playlists
router.get('/spotify/playlists', async (req, res) => {
  try {
    const { query, limit = 20, offset = 0 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    const result = await spotifyService.searchPlaylists(query, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify playlists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch playlists' 
    });
  }
});

// Get playlist tracks
router.get('/spotify/playlists/:playlistId/tracks', async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await spotifyService.getPlaylistTracks(playlistId, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify playlist tracks error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch playlist tracks' 
    });
  }
});

// Search for Indian hip-hop artists
router.get('/spotify/indian-hip-hop', async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const result = await spotifyService.searchIndianHipHopArtists(parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify Indian hip-hop error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch Indian hip-hop artists' 
    });
  }
});

// Get new releases
router.get('/spotify/new-releases', async (req, res) => {
  try {
    const { country = 'IN', limit = 20, offset = 0 } = req.query;
    
    const result = await spotifyService.getNewReleases(country, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify new releases error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch new releases' 
    });
  }
});

// Get featured playlists
router.get('/spotify/featured-playlists', async (req, res) => {
  try {
    const { country = 'IN', limit = 20, offset = 0 } = req.query;
    
    const result = await spotifyService.getFeaturedPlaylists(country, parseInt(limit), parseInt(offset));
    res.json(result);
  } catch (error) {
    console.error('Spotify featured playlists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch featured playlists' 
    });
  }
});

// Genius API Routes

// Search for artists
router.get('/genius/artists', async (req, res) => {
  try {
    const { query, page = 1, perPage = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    const result = await geniusService.searchArtists(query, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Genius artists error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artists' 
    });
  }
});

// Get artist details
router.get('/genius/artists/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;
    const result = await geniusService.getArtistDetails(artistId);
    res.json(result);
  } catch (error) {
    console.error('Genius artist details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist details' 
    });
  }
});

// Get artist's songs
router.get('/genius/artists/:artistId/songs', async (req, res) => {
  try {
    const { artistId } = req.params;
    const { page = 1, perPage = 20, sort = 'title' } = req.query;
    
    const result = await geniusService.getArtistSongs(artistId, parseInt(page), parseInt(perPage), sort);
    res.json(result);
  } catch (error) {
    console.error('Genius artist songs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist songs' 
    });
  }
});

// Search for songs
router.get('/genius/songs', async (req, res) => {
  try {
    const { query, page = 1, perPage = 20 } = req.query;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        message: 'Query parameter is required' 
      });
    }

    const result = await geniusService.searchSongs(query, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Genius songs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch songs' 
    });
  }
});

// Get song details
router.get('/genius/songs/:songId', async (req, res) => {
  try {
    const { songId } = req.params;
    const result = await geniusService.getSongDetails(songId);
    res.json(result);
  } catch (error) {
    console.error('Genius song details error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch song details' 
    });
  }
});

// Search for Indian hip-hop artists
router.get('/genius/indian-hip-hop', async (req, res) => {
  try {
    const { page = 1, perPage = 20 } = req.query;
    
    const result = await geniusService.searchIndianHipHopArtists(parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Genius Indian hip-hop error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch Indian hip-hop artists' 
    });
  }
});

// Get artist's albums
router.get('/genius/artists/:artistId/albums', async (req, res) => {
  try {
    const { artistId } = req.params;
    const { page = 1, perPage = 50 } = req.query;
    
    const result = await geniusService.getArtistAlbums(artistId, parseInt(page), parseInt(perPage));
    res.json(result);
  } catch (error) {
    console.error('Genius artist albums error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch artist albums' 
    });
  }
});

// Artist Enrichment Routes

// Enrich artist with data from all platforms
router.get('/enrich/artist', async (req, res) => {
  try {
    const { artistName } = req.query;
    
    if (!artistName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artist name parameter is required' 
      });
    }

    const result = await artistEnrichmentService.enrichArtist(artistName);
    res.json(result);
  } catch (error) {
    console.error('Artist enrichment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to enrich artist data' 
    });
  }
});

// Get comprehensive artist profile
router.get('/enrich/artist/profile', async (req, res) => {
  try {
    const { artistName } = req.query;
    
    if (!artistName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artist name parameter is required' 
      });
    }

    const result = await artistEnrichmentService.getArtistProfile(artistName);
    res.json(result);
  } catch (error) {
    console.error('Artist profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get artist profile' 
    });
  }
});

// Search for Indian hip-hop artists across all platforms
router.get('/enrich/indian-hip-hop', async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const result = await artistEnrichmentService.searchIndianHipHopArtists(parseInt(limit));
    res.json(result);
  } catch (error) {
    console.error('Indian hip-hop search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search Indian hip-hop artists' 
    });
  }
});

// Search for artist events across platforms
router.get('/enrich/artist/events', async (req, res) => {
  try {
    const { artistName } = req.query;
    
    if (!artistName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Artist name parameter is required' 
      });
    }

    const result = await artistEnrichmentService.searchArtistEvents(artistName);
    res.json(result);
  } catch (error) {
    console.error('Artist events search error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to search artist events' 
    });
  }
});

module.exports = router; 
const axios = require('axios');

class SongkickService {
  constructor() {
    this.baseURL = 'https://api.songkick.com/api/3.0';
    this.apiKey = process.env.SONGKICK_API_KEY;
  }

  // Search for events in a specific location
  async searchEvents(location, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/events.json`, {
        params: {
          apikey: this.apiKey,
          location: location,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.event || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for events by artist
  async searchEventsByArtist(artistName, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/search/events.json`, {
        params: {
          apikey: this.apiKey,
          artist_name: artistName,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.event || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for artists
  async searchArtists(artistName, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/search/artists.json`, {
        params: {
          apikey: this.apiKey,
          query: artistName,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.artist || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get artist details by ID
  async getArtistDetails(artistId) {
    try {
      const response = await axios.get(`${this.baseURL}/artists/${artistId}.json`, {
        params: {
          apikey: this.apiKey
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.artist
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get upcoming events for an artist
  async getArtistEvents(artistId, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/artists/${artistId}/calendar.json`, {
        params: {
          apikey: this.apiKey,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.event || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for venues
  async searchVenues(venueName, location, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/search/venues.json`, {
        params: {
          apikey: this.apiKey,
          query: venueName,
          location: location,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.venue || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get venue details by ID
  async getVenueDetails(venueId) {
    try {
      const response = await axios.get(`${this.baseURL}/venues/${venueId}.json`, {
        params: {
          apikey: this.apiKey
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.venue
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get upcoming events for a venue
  async getVenueEvents(venueId, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/venues/${venueId}/calendar.json`, {
        params: {
          apikey: this.apiKey,
          page: page,
          per_page: perPage
        }
      });

      return {
        success: true,
        data: response.data.resultsPage.results.event || [],
        totalResults: response.data.resultsPage.totalResults,
        page: response.data.resultsPage.page
      };
    } catch (error) {
      console.error('Songkick API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new SongkickService(); 
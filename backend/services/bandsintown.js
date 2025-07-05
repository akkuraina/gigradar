const axios = require('axios');

class BandsintownService {
  constructor() {
    this.baseURL = 'https://rest.bandsintown.com';
    this.appId = 'gigradar-app'; // Free app identifier
  }

  // Search for venues
  async searchVenues(query, page = 1, perPage = 20) {
    try {
      // Bandsintown doesn't have a direct venue search API
      // We'll use event search and extract venue information
      const response = await axios.get(`${this.baseURL}/artists/${encodeURIComponent(query)}/events`, {
        params: {
          app_id: this.appId,
          date: 'upcoming'
        }
      });

      // Extract unique venues from events
      const venues = new Map();
      
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach(event => {
          if (event.venue) {
            const venueKey = `${event.venue.name}-${event.venue.city}-${event.venue.country}`;
            if (!venues.has(venueKey)) {
              venues.set(venueKey, {
                id: venueKey,
                displayName: event.venue.name,
                location: `${event.venue.city}, ${event.venue.country}`,
                lat: event.venue.latitude,
                lng: event.venue.longitude,
                uri: event.url,
                metroArea: {
                  displayName: event.venue.city
                }
              });
            }
          }
        });
      }

      return {
        success: true,
        data: Array.from(venues.values()),
        totalResults: venues.size,
        page: page
      };
    } catch (error) {
      console.error('Bandsintown API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for events in a location
  async searchEvents(location, page = 1, perPage = 50) {
    try {
      // Search for popular artists and get their events in the location
      const popularArtists = ['Drake', 'Taylor Swift', 'Ed Sheeran', 'Beyoncé', 'The Weeknd'];
      const allEvents = [];

      for (const artist of popularArtists) {
        try {
          const response = await axios.get(`${this.baseURL}/artists/${encodeURIComponent(artist)}/events`, {
            params: {
              app_id: this.appId,
              date: 'upcoming'
            }
          });

          if (response.data && Array.isArray(response.data)) {
            const locationEvents = response.data.filter(event => 
              event.venue && 
              (event.venue.city?.toLowerCase().includes(location.toLowerCase()) ||
               event.venue.country?.toLowerCase().includes(location.toLowerCase()))
            );
            allEvents.push(...locationEvents);
          }
        } catch (err) {
          console.log(`No events found for ${artist}`);
        }
      }

      return {
        success: true,
        data: allEvents.slice(0, perPage),
        totalResults: allEvents.length,
        page: page
      };
    } catch (error) {
      console.error('Bandsintown API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get venue events (search by venue name)
  async getVenueEvents(venueName, page = 1, perPage = 20) {
    try {
      // Search for events and filter by venue name
      const popularArtists = ['Drake', 'Taylor Swift', 'Ed Sheeran', 'Beyoncé', 'The Weeknd', 'Post Malone', 'Ariana Grande'];
      const venueEvents = [];

      for (const artist of popularArtists) {
        try {
          const response = await axios.get(`${this.baseURL}/artists/${encodeURIComponent(artist)}/events`, {
            params: {
              app_id: this.appId,
              date: 'upcoming'
            }
          });

          if (response.data && Array.isArray(response.data)) {
            const matchingEvents = response.data.filter(event => 
              event.venue && 
              event.venue.name?.toLowerCase().includes(venueName.toLowerCase())
            );
            venueEvents.push(...matchingEvents);
          }
        } catch (err) {
          console.log(`No events found for ${artist}`);
        }
      }

      return {
        success: true,
        data: venueEvents.slice(0, perPage),
        totalResults: venueEvents.length,
        page: page
      };
    } catch (error) {
      console.error('Bandsintown API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search for artists
  async searchArtists(artistName, page = 1, perPage = 50) {
    try {
      const response = await axios.get(`${this.baseURL}/artists/${encodeURIComponent(artistName)}/events`, {
        params: {
          app_id: this.appId,
          date: 'upcoming'
        }
      });

      // Create artist object from the response
      const artist = {
        id: artistName.toLowerCase().replace(/\s+/g, '-'),
        displayName: artistName,
        uri: `https://www.bandsintown.com/a/${encodeURIComponent(artistName)}`
      };

      return {
        success: true,
        data: [artist],
        totalResults: 1,
        page: page
      };
    } catch (error) {
      console.error('Bandsintown API Error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new BandsintownService(); 
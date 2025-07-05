const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000
  },
  artists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  }],
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venue',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 120
  },
  genres: [{
    type: String,
    required: true
  }],
  ticketInfo: {
    price: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    availableTickets: {
      type: Number,
      min: 0
    },
    totalTickets: {
      type: Number,
      min: 0
    },
    ticketTypes: [{
      name: String,
      price: Number,
      description: String,
      available: Number
    }],
    bookingUrl: String,
    isFree: {
      type: Boolean,
      default: false
    }
  },
  music: {
    spotifyPlaylist: String,
    youtubePlaylist: String,
    previewTracks: [{
      platform: {
        type: String,
        enum: ['spotify', 'youtube', 'soundcloud', 'bandcamp']
      },
      url: String,
      title: String,
      artist: String
    }]
  },
  images: {
    poster: String,
    banner: String,
    gallery: [String]
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    checkins: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    vibeMeter: {
      type: Number,
      default: 0
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialRequirements: [String],
  ageRestriction: {
    type: String,
    enum: ['all_ages', '18+', '21+', 'other'],
    default: 'all_ages'
  },
  covidPolicy: {
    type: String,
    enum: ['none', 'masks_required', 'vaccination_required', 'testing_required'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Indexes
gigSchema.index({ 'location': '2dsphere' });
gigSchema.index({ date: 1 });
gigSchema.index({ genres: 1 });
gigSchema.index({ status: 1 });
gigSchema.index({ title: 'text', description: 'text' });
gigSchema.index({ tags: 1 });

// Virtual for time until gig
gigSchema.virtual('timeUntil').get(function() {
  return this.date - new Date();
});

// Virtual for is upcoming
gigSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date() && this.status === 'published';
});

// Virtual for is today
gigSchema.virtual('isToday').get(function() {
  const today = new Date();
  const gigDate = new Date(this.date);
  return gigDate.toDateString() === today.toDateString();
});

// Method to update stats
gigSchema.methods.updateStats = async function() {
  const Checkin = mongoose.model('Checkin');
  const Review = mongoose.model('Review');
  
  const checkins = await Checkin.countDocuments({ gig: this._id });
  const reviews = await Review.find({ gig: this._id });
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  const vibeMeter = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.vibeMeter || 0), 0) / reviews.length 
    : 0;
  
  this.stats.checkins = checkins;
  this.stats.averageRating = Math.round(averageRating * 10) / 10;
  this.stats.totalReviews = reviews.length;
  this.stats.vibeMeter = Math.round(vibeMeter * 10) / 10;
  
  return this.save();
};

// Pre-save middleware to set location from venue
gigSchema.pre('save', async function(next) {
  if (this.isModified('venue') && this.venue) {
    const Venue = mongoose.model('Venue');
    const venue = await Venue.findById(this.venue);
    if (venue) {
      this.location = venue.location;
    }
  }
  next();
});

module.exports = mongoose.model('Gig', gigSchema); 
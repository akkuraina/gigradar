const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  artistName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  genres: [{
    type: String,
    required: true
  }],
  socialMedia: {
    spotify: String,
    youtube: String,
    instagram: String,
    twitter: String,
    facebook: String,
    website: String
  },
  music: {
    spotifyId: String,
    youtubeChannel: String,
    soundcloud: String,
    bandcamp: String
  },
  images: {
    profile: String,
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
      default: [0, 0]
    },
    city: String,
    state: String,
    country: String
  },
  stats: {
    followers: {
      type: Number,
      default: 0
    },
    totalGigs: {
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
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [String], // For search and discovery
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
artistSchema.index({ 'location': '2dsphere' });
artistSchema.index({ genres: 1 });
artistSchema.index({ artistName: 'text', bio: 'text' });
artistSchema.index({ tags: 1 });

// Virtual for upcoming gigs
artistSchema.virtual('upcomingGigs', {
  ref: 'Gig',
  localField: '_id',
  foreignField: 'artists',
  match: { date: { $gte: new Date() } }
});

// Method to update stats
artistSchema.methods.updateStats = async function() {
  const Gig = mongoose.model('Gig');
  const Review = mongoose.model('Review');
  
  const totalGigs = await Gig.countDocuments({ artists: this._id });
  const reviews = await Review.find({ gig: { $in: await Gig.find({ artists: this._id }).distinct('_id') } });
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  this.stats.totalGigs = totalGigs;
  this.stats.averageRating = Math.round(averageRating * 10) / 10;
  this.stats.totalReviews = reviews.length;
  
  return this.save();
};

module.exports = mongoose.model('Artist', artistSchema); 
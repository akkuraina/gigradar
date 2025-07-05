const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  venueName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  venueType: {
    type: String,
    enum: ['cafe', 'bar', 'club', 'theater', 'concert_hall', 'outdoor', 'college', 'other'],
    required: true
  },
  capacity: {
    type: Number,
    min: 1
  },
  amenities: [{
    type: String,
    enum: ['parking', 'wheelchair_accessible', 'food', 'drinks', 'sound_system', 'lighting', 'stage', 'backstage', 'dressing_room', 'wifi', 'air_conditioning']
  }],
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  socialMedia: {
    instagram: String,
    facebook: String,
    twitter: String
  },
  images: {
    profile: String,
    banner: String,
    gallery: [String]
  },
  operatingHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  stats: {
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
    },
    followers: {
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
  },
  bookingInfo: {
    bookingEmail: String,
    bookingPhone: String,
    bookingNotes: String,
    minAdvanceBooking: Number, // days
    maxAdvanceBooking: Number // days
  }
}, {
  timestamps: true
});

// Indexes
venueSchema.index({ 'location': '2dsphere' });
venueSchema.index({ venueType: 1 });
venueSchema.index({ venueName: 'text', description: 'text' });
venueSchema.index({ tags: 1 });

// Virtual for upcoming gigs
venueSchema.virtual('upcomingGigs', {
  ref: 'Gig',
  localField: '_id',
  foreignField: 'venue',
  match: { date: { $gte: new Date() } }
});

// Method to update stats
venueSchema.methods.updateStats = async function() {
  const Gig = mongoose.model('Gig');
  const Review = mongoose.model('Review');
  
  const totalGigs = await Gig.countDocuments({ venue: this._id });
  const reviews = await Review.find({ gig: { $in: await Gig.find({ venue: this._id }).distinct('_id') } });
  
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  this.stats.totalGigs = totalGigs;
  this.stats.averageRating = Math.round(averageRating * 10) / 10;
  this.stats.totalReviews = reviews.length;
  
  return this.save();
};

module.exports = mongoose.model('Venue', venueSchema); 
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  checkinTime: {
    type: Date,
    default: Date.now
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
    enum: ['checked_in', 'left', 'cancelled'],
    default: 'checked_in'
  },
  photos: [String],
  comment: {
    type: String,
    maxlength: 500
  },
  mood: {
    type: String,
    enum: ['excited', 'happy', 'neutral', 'disappointed', 'amazed'],
    default: 'excited'
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String] // e.g., ["front_row", "meet_artist", "great_view"]
}, {
  timestamps: true
});

// Indexes
checkinSchema.index({ gig: 1, checkinTime: -1 });
checkinSchema.index({ user: 1, checkinTime: -1 });
checkinSchema.index({ 'location': '2dsphere' });
checkinSchema.index({ status: 1 });

// Ensure one active checkin per user per gig
checkinSchema.index({ user: 1, gig: 1, status: 1 }, { 
  unique: true, 
  partialFilterExpression: { status: 'checked_in' }
});

// Virtual for duration at gig
checkinSchema.virtual('duration').get(function() {
  if (this.status === 'checked_in') {
    return Date.now() - this.checkinTime;
  }
  return null;
});

// Method to leave gig
checkinSchema.methods.leaveGig = async function() {
  this.status = 'left';
  return this.save();
};

// Pre-save middleware to update gig stats
checkinSchema.post('save', async function() {
  const Gig = mongoose.model('Gig');
  const gig = await Gig.findById(this.gig);
  if (gig) {
    await gig.updateStats();
  }
});

// Pre-remove middleware to update gig stats
checkinSchema.post('remove', async function() {
  const Gig = mongoose.model('Gig');
  const gig = await Gig.findById(this.gig);
  if (gig) {
    await gig.updateStats();
  }
});

module.exports = mongoose.model('Checkin', checkinSchema); 
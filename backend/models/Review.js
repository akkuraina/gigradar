const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  vibeMeter: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  title: {
    type: String,
    maxlength: 100,
    trim: true
  },
  content: {
    type: String,
    maxlength: 1000,
    required: true
  },
  photos: [String],
  tags: [String], // e.g., ["great_sound", "amazing_crowd", "good_venue"]
  isAnonymous: {
    type: Boolean,
    default: false
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    helpful: {
      type: Boolean,
      required: true
    }
  }],
  reported: {
    type: Boolean,
    default: false
  },
  reportReason: String
}, {
  timestamps: true
});

// Indexes
reviewSchema.index({ gig: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ vibeMeter: 1 });

// Ensure one review per user per gig
reviewSchema.index({ user: 1, gig: 1 }, { unique: true });

// Virtual for helpful count
reviewSchema.virtual('helpfulCount').get(function() {
  return this.helpful.filter(h => h.helpful).length;
});

// Virtual for unhelpful count
reviewSchema.virtual('unhelpfulCount').get(function() {
  return this.helpful.filter(h => !h.helpful).length;
});

// Method to mark as helpful/unhelpful
reviewSchema.methods.markHelpful = async function(userId, isHelpful) {
  const existingIndex = this.helpful.findIndex(h => h.user.toString() === userId.toString());
  
  if (existingIndex !== -1) {
    this.helpful[existingIndex].helpful = isHelpful;
  } else {
    this.helpful.push({ user: userId, helpful: isHelpful });
  }
  
  return this.save();
};

// Pre-save middleware to update gig stats
reviewSchema.post('save', async function() {
  const Gig = mongoose.model('Gig');
  const gig = await Gig.findById(this.gig);
  if (gig) {
    await gig.updateStats();
  }
});

// Pre-remove middleware to update gig stats
reviewSchema.post('remove', async function() {
  const Gig = mongoose.model('Gig');
  const gig = await Gig.findById(this.gig);
  if (gig) {
    await gig.updateStats();
  }
});

module.exports = mongoose.model('Review', reviewSchema); 
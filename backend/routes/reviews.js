const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Review = require('../models/Review');
const Gig = require('../models/Gig');
const router = express.Router();

// @route   GET /api/reviews
// @desc    Get reviews with filters
// @access  Public
router.get('/', [
  query('gig').optional().isMongoId(),
  query('user').optional().isMongoId(),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric()
], async (req, res) => {
  try {
    const {
      gig,
      user,
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (gig) {
      filter.gig = gig;
    }
    
    if (user) {
      filter.user = user;
    }

    // Build query
    const query = Review.find(filter)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate('gig', 'title date venue')
      .sort({ createdAt: -1 });

    // Add pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(parseInt(limit));

    const reviews = await query.exec();
    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + reviews.length < total
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/reviews/:id
// @desc    Get review by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate('gig', 'title date venue artists');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ review });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private
router.post('/', [
  body('gig')
    .isMongoId()
    .withMessage('Valid gig ID is required'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('vibeMeter')
    .isInt({ min: 1, max: 10 })
    .withMessage('Vibe meter must be between 1 and 10'),
  body('content')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Review content is required and must be less than 1000 characters'),
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if gig exists and is completed
    const gig = await Gig.findById(req.body.gig);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    if (gig.date > new Date()) {
      return res.status(400).json({ message: 'Cannot review a gig that has not happened yet' });
    }

    // Check if user already reviewed this gig
    const existingReview = await Review.findOne({
      user: req.user.id,
      gig: req.body.gig
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this gig' });
    }

    const reviewData = {
      ...req.body,
      user: req.user.id
    };

    const review = new Review(reviewData);
    await review.save();

    await review.populate([
      { path: 'user', select: 'username profile.firstName profile.lastName profile.avatar' },
      { path: 'gig', select: 'title date venue' }
    ]);

    res.status(201).json({
      message: 'Review created successfully',
      review
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private
router.put('/:id', [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('vibeMeter')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Vibe meter must be between 1 and 10'),
  body('content')
    .optional()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Review content must be less than 1000 characters'),
  body('title')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update review
    Object.assign(review, req.body);
    await review.save();

    await review.populate([
      { path: 'user', select: 'username profile.firstName profile.lastName profile.avatar' },
      { path: 'gig', select: 'title date venue' }
    ]);

    res.json({
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await review.deleteOne();

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful/unhelpful
// @access  Private
router.post('/:id/helpful', [
  body('helpful')
    .isBoolean()
    .withMessage('Helpful must be a boolean value')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.markHelpful(req.user.id, req.body.helpful);

    res.json({
      message: 'Review marked successfully',
      helpfulCount: review.helpfulCount,
      unhelpfulCount: review.unhelpfulCount
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
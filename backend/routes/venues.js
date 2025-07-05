const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Venue = require('../models/Venue');
const router = express.Router();

// @route   GET /api/venues
// @desc    Get all venues with filters
// @access  Public
router.get('/', [
  query('venueType').optional().isString(),
  query('location').optional().isString(),
  query('radius').optional().isNumeric(),
  query('featured').optional().isBoolean(),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric()
], async (req, res) => {
  try {
    const {
      venueType,
      location,
      radius = 50,
      featured,
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (venueType) {
      filter.venueType = venueType;
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }

    // Build query
    let query = Venue.find(filter)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ 'stats.totalGigs': -1, createdAt: -1 });

    // Add geospatial search if location provided
    if (location) {
      const [lng, lat] = location.split(',').map(Number);
      if (!isNaN(lng) && !isNaN(lat)) {
        query = query.find({
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              $maxDistance: radius * 1000 // Convert km to meters
            }
          }
        });
      }
    }

    // Add pagination
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(parseInt(limit));

    const venues = await query.exec();
    const total = await Venue.countDocuments(filter);

    res.json({
      venues,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + venues.length < total
      }
    });

  } catch (error) {
    console.error('Get venues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/venues/:id
// @desc    Get venue by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const venue = await Venue.findById(req.params.id)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate({
        path: 'upcomingGigs',
        populate: [
          { path: 'artists', select: 'artistName' },
          { path: 'organizer', select: 'username' }
        ]
      });

    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    res.json({ venue });

  } catch (error) {
    console.error('Get venue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/venues
// @desc    Create new venue profile
// @access  Private
router.post('/', [
  body('venueName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Venue name is required and must be less than 100 characters'),
  body('venueType')
    .isIn(['cafe', 'bar', 'club', 'theater', 'concert_hall', 'outdoor', 'college', 'other'])
    .withMessage('Valid venue type is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates are required'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a venue profile
    const existingVenue = await Venue.findOne({ user: req.user.id });
    if (existingVenue) {
      return res.status(400).json({ message: 'User already has a venue profile' });
    }

    const venueData = {
      ...req.body,
      user: req.user.id
    };

    const venue = new Venue(venueData);
    await venue.save();

    await venue.populate('user', 'username profile.firstName profile.lastName profile.avatar');

    res.status(201).json({
      message: 'Venue profile created successfully',
      venue
    });

  } catch (error) {
    console.error('Create venue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/venues/:id
// @desc    Update venue profile
// @access  Private
router.put('/:id', [
  body('venueName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Venue name must be less than 100 characters'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const venue = await Venue.findById(req.params.id);
    
    if (!venue) {
      return res.status(404).json({ message: 'Venue not found' });
    }

    // Check if user owns this venue profile
    if (venue.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update venue
    Object.assign(venue, req.body);
    await venue.save();

    await venue.populate('user', 'username profile.firstName profile.lastName profile.avatar');

    res.json({
      message: 'Venue profile updated successfully',
      venue
    });

  } catch (error) {
    console.error('Update venue error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/venues/search
// @desc    Search venues
// @access  Public
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('limit').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, limit = 10 } = req.query;

    const venues = await Venue.find({
      $text: { $search: q },
      isActive: true
    })
    .populate('user', 'username profile.firstName profile.lastName profile.avatar')
    .limit(parseInt(limit))
    .sort({ score: { $meta: 'textScore' } });

    res.json({ venues });

  } catch (error) {
    console.error('Search venues error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
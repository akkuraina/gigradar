const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Gig = require('../models/Gig');
const Artist = require('../models/Artist');
const Venue = require('../models/Venue');
const router = express.Router();

// @route   GET /api/gigs
// @desc    Get all gigs with filters
// @access  Public
router.get('/', [
  query('genre').optional().isString(),
  query('location').optional().isString(),
  query('radius').optional().isNumeric(),
  query('date').optional().isISO8601(),
  query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric()
], async (req, res) => {
  try {
    const {
      genre,
      location,
      radius = 50,
      date,
      status = 'published',
      featured,
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { status };
    
    if (genre) {
      filter.genres = { $in: [genre] };
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }

    // Date filtering
    if (date) {
      const targetDate = new Date(date);
      const nextDay = new Date(targetDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: targetDate,
        $lt: nextDay
      };
    } else {
      // Default to upcoming gigs
      filter.date = { $gte: new Date() };
    }

    // Build query
    let query = Gig.find(filter)
      .populate('artists', 'artistName images.profile')
      .populate('venue', 'venueName location address')
      .populate('organizer', 'username profile.firstName profile.lastName')
      .sort({ date: 1, featured: -1 });

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

    const gigs = await query.exec();
    const total = await Gig.countDocuments(filter);

    res.json({
      gigs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + gigs.length < total
      }
    });

  } catch (error) {
    console.error('Get gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gigs/:id
// @desc    Get gig by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('artists', 'artistName bio genres socialMedia music images')
      .populate('venue', 'venueName description location address contact amenities')
      .populate('organizer', 'username profile.firstName profile.lastName profile.avatar');

    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Increment views
    gig.stats.views = (gig.stats.views || 0) + 1;
    await gig.save();

    res.json({ gig });

  } catch (error) {
    console.error('Get gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/gigs
// @desc    Create new gig
// @access  Private
router.post('/', [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('artists')
    .isArray({ min: 1 })
    .withMessage('At least one artist is required'),
  body('venue')
    .isMongoId()
    .withMessage('Valid venue ID is required'),
  body('date')
    .isISO8601()
    .withMessage('Valid date is required'),
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Verify artists exist
    const artists = await Artist.find({ _id: { $in: req.body.artists } });
    if (artists.length !== req.body.artists.length) {
      return res.status(400).json({ message: 'One or more artists not found' });
    }

    // Verify venue exists
    const venue = await Venue.findById(req.body.venue);
    if (!venue) {
      return res.status(400).json({ message: 'Venue not found' });
    }

    const gigData = {
      ...req.body,
      organizer: req.user.id,
      location: venue.location // Set location from venue
    };

    const gig = new Gig(gigData);
    await gig.save();

    await gig.populate([
      { path: 'artists', select: 'artistName images.profile' },
      { path: 'venue', select: 'venueName location address' },
      { path: 'organizer', select: 'username profile.firstName profile.lastName' }
    ]);

    res.status(201).json({
      message: 'Gig created successfully',
      gig
    });

  } catch (error) {
    console.error('Create gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/gigs/:id
// @desc    Update gig
// @access  Private
router.put('/:id', [
  body('title')
    .optional()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const gig = await Gig.findById(req.params.id);
    
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Check if user is the organizer
    if (gig.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update gig
    Object.assign(gig, req.body);
    await gig.save();

    await gig.populate([
      { path: 'artists', select: 'artistName images.profile' },
      { path: 'venue', select: 'venueName location address' },
      { path: 'organizer', select: 'username profile.firstName profile.lastName' }
    ]);

    res.json({
      message: 'Gig updated successfully',
      gig
    });

  } catch (error) {
    console.error('Update gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/gigs/search
// @desc    Search gigs
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

    const gigs = await Gig.find({
      $text: { $search: q },
      status: 'published',
      date: { $gte: new Date() }
    })
    .populate('artists', 'artistName images.profile')
    .populate('venue', 'venueName location address')
    .populate('organizer', 'username profile.firstName profile.lastName')
    .limit(parseInt(limit))
    .sort({ score: { $meta: 'textScore' }, date: 1 });

    res.json({ gigs });

  } catch (error) {
    console.error('Search gigs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
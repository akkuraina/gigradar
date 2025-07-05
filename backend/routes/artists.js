const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Artist = require('../models/Artist');
const router = express.Router();

// @route   GET /api/artists
// @desc    Get all artists with filters
// @access  Public
router.get('/', [
  query('genre').optional().isString(),
  query('location').optional().isString(),
  query('radius').optional().isNumeric(),
  query('featured').optional().isBoolean(),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric()
], async (req, res) => {
  try {
    const {
      genre,
      location,
      radius = 50,
      featured,
      limit = 20,
      page = 1
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (genre) {
      filter.genres = { $in: [genre] };
    }
    
    if (featured) {
      filter.featured = featured === 'true';
    }

    // Build query
    let query = Artist.find(filter)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ 'stats.followers': -1, createdAt: -1 });

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

    const artists = await query.exec();
    const total = await Artist.countDocuments(filter);

    res.json({
      artists,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + artists.length < total
      }
    });

  } catch (error) {
    console.error('Get artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artists/:id
// @desc    Get artist by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate({
        path: 'upcomingGigs',
        populate: [
          { path: 'venue', select: 'venueName location' },
          { path: 'artists', select: 'artistName' }
        ]
      });

    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Increment views
    artist.stats.views = (artist.stats.views || 0) + 1;
    await artist.save();

    res.json({ artist });

  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/artists
// @desc    Create new artist profile
// @access  Private
router.post('/', [
  body('artistName')
    .isLength({ min: 1, max: 100 })
    .withMessage('Artist name is required and must be less than 100 characters'),
  body('genres')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has an artist profile
    const existingArtist = await Artist.findOne({ user: req.user.id });
    if (existingArtist) {
      return res.status(400).json({ message: 'User already has an artist profile' });
    }

    const artistData = {
      ...req.body,
      user: req.user.id
    };

    const artist = new Artist(artistData);
    await artist.save();

    await artist.populate('user', 'username profile.firstName profile.lastName profile.avatar');

    res.status(201).json({
      message: 'Artist profile created successfully',
      artist
    });

  } catch (error) {
    console.error('Create artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artists/:id
// @desc    Update artist profile
// @access  Private
router.put('/:id', [
  body('artistName')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Artist name must be less than 100 characters'),
  body('bio')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Bio must be less than 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artist = await Artist.findById(req.params.id);
    
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Check if user owns this artist profile
    if (artist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update artist
    Object.assign(artist, req.body);
    await artist.save();

    await artist.populate('user', 'username profile.firstName profile.lastName profile.avatar');

    res.json({
      message: 'Artist profile updated successfully',
      artist
    });

  } catch (error) {
    console.error('Update artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artists/search
// @desc    Search artists
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

    const artists = await Artist.find({
      $text: { $search: q },
      isActive: true
    })
    .populate('user', 'username profile.firstName profile.lastName profile.avatar')
    .limit(parseInt(limit))
    .sort({ score: { $meta: 'textScore' } });

    res.json({ artists });

  } catch (error) {
    console.error('Search artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
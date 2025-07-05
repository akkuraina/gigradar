const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Checkin = require('../models/Checkin');
const Gig = require('../models/Gig');
const router = express.Router();

// @route   GET /api/checkins
// @desc    Get checkins with filters
// @access  Public
router.get('/', [
  query('gig').optional().isMongoId(),
  query('user').optional().isMongoId(),
  query('status').optional().isIn(['checked_in', 'left', 'cancelled']),
  query('limit').optional().isNumeric(),
  query('page').optional().isNumeric()
], async (req, res) => {
  try {
    const {
      gig,
      user,
      status,
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

    if (status) {
      filter.status = status;
    }

    // Build query
    const query = Checkin.find(filter)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate('gig', 'title date venue')
      .populate('friends', 'username profile.firstName profile.lastName profile.avatar')
      .sort({ checkinTime: -1 });

    // Add pagination
    const skip = (page - 1) * limit;
    query.skip(skip).limit(parseInt(limit));

    const checkins = await query.exec();
    const total = await Checkin.countDocuments(filter);

    res.json({
      checkins,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasMore: skip + checkins.length < total
      }
    });

  } catch (error) {
    console.error('Get checkins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/checkins/:id
// @desc    Get checkin by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id)
      .populate('user', 'username profile.firstName profile.lastName profile.avatar')
      .populate('gig', 'title date venue artists')
      .populate('friends', 'username profile.firstName profile.lastName profile.avatar');

    if (!checkin) {
      return res.status(404).json({ message: 'Checkin not found' });
    }

    res.json({ checkin });

  } catch (error) {
    console.error('Get checkin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/checkins
// @desc    Check in at a gig
// @access  Private
router.post('/', [
  body('gig')
    .isMongoId()
    .withMessage('Valid gig ID is required'),
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Location coordinates are required'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters'),
  body('mood')
    .optional()
    .isIn(['excited', 'happy', 'neutral', 'disappointed', 'amazed'])
    .withMessage('Invalid mood value'),
  body('friends')
    .optional()
    .isArray()
    .withMessage('Friends must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if gig exists and is happening today
    const gig = await Gig.findById(req.body.gig);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    const today = new Date();
    const gigDate = new Date(gig.date);
    if (gigDate.toDateString() !== today.toDateString()) {
      return res.status(400).json({ message: 'Can only check in on the day of the gig' });
    }

    // Check if user already checked in at this gig
    const existingCheckin = await Checkin.findOne({
      user: req.user.id,
      gig: req.body.gig,
      status: 'checked_in'
    });

    if (existingCheckin) {
      return res.status(400).json({ message: 'You are already checked in at this gig' });
    }

    const checkinData = {
      ...req.body,
      user: req.user.id
    };

    const checkin = new Checkin(checkinData);
    await checkin.save();

    await checkin.populate([
      { path: 'user', select: 'username profile.firstName profile.lastName profile.avatar' },
      { path: 'gig', select: 'title date venue' },
      { path: 'friends', select: 'username profile.firstName profile.lastName profile.avatar' }
    ]);

    res.status(201).json({
      message: 'Successfully checked in!',
      checkin
    });

  } catch (error) {
    console.error('Create checkin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/checkins/:id
// @desc    Update checkin
// @access  Private
router.put('/:id', [
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters'),
  body('mood')
    .optional()
    .isIn(['excited', 'happy', 'neutral', 'disappointed', 'amazed'])
    .withMessage('Invalid mood value'),
  body('photos')
    .optional()
    .isArray()
    .withMessage('Photos must be an array'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkin = await Checkin.findById(req.params.id);
    
    if (!checkin) {
      return res.status(404).json({ message: 'Checkin not found' });
    }

    // Check if user owns this checkin
    if (checkin.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update checkin
    Object.assign(checkin, req.body);
    await checkin.save();

    await checkin.populate([
      { path: 'user', select: 'username profile.firstName profile.lastName profile.avatar' },
      { path: 'gig', select: 'title date venue' },
      { path: 'friends', select: 'username profile.firstName profile.lastName profile.avatar' }
    ]);

    res.json({
      message: 'Checkin updated successfully',
      checkin
    });

  } catch (error) {
    console.error('Update checkin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/checkins/:id/leave
// @desc    Leave gig (update checkin status)
// @access  Private
router.post('/:id/leave', async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id);
    
    if (!checkin) {
      return res.status(404).json({ message: 'Checkin not found' });
    }

    // Check if user owns this checkin
    if (checkin.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if already checked in
    if (checkin.status !== 'checked_in') {
      return res.status(400).json({ message: 'You are not currently checked in' });
    }

    await checkin.leaveGig();

    await checkin.populate([
      { path: 'user', select: 'username profile.firstName profile.lastName profile.avatar' },
      { path: 'gig', select: 'title date venue' },
      { path: 'friends', select: 'username profile.firstName profile.lastName profile.avatar' }
    ]);

    res.json({
      message: 'Successfully left the gig',
      checkin
    });

  } catch (error) {
    console.error('Leave gig error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/checkins/:id
// @desc    Cancel checkin
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const checkin = await Checkin.findById(req.params.id);
    
    if (!checkin) {
      return res.status(404).json({ message: 'Checkin not found' });
    }

    // Check if user owns this checkin
    if (checkin.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    checkin.status = 'cancelled';
    await checkin.save();

    res.json({ message: 'Checkin cancelled successfully' });

  } catch (error) {
    console.error('Cancel checkin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/checkins/gig/:gigId
// @desc    Get all checkins for a specific gig
// @access  Public
router.get('/gig/:gigId', async (req, res) => {
  try {
    const checkins = await Checkin.find({
      gig: req.params.gigId,
      status: 'checked_in'
    })
    .populate('user', 'username profile.firstName profile.lastName profile.avatar')
    .populate('friends', 'username profile.firstName profile.lastName profile.avatar')
    .sort({ checkinTime: -1 });

    res.json({ checkins });

  } catch (error) {
    console.error('Get gig checkins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
const express = require('express');
const { body, validationResult } = require('express-validator');
const Track = require('../models/Track');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadMixed } = require('../middleware/upload');
const { uploadAudio, uploadImage, generateWaveform } = require('../utils/cloudinary');

const router = express.Router();

// @desc    Upload new track
// @route   POST /api/tracks
// @access  Private
router.post('/', protect, uploadMixed.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'artwork', maxCount: 1 }
]), [
  body('title').isLength({ min: 1 }).withMessage('Title is required'),
  body('genre').isIn([
    'Electronic', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 
    'Country', 'R&B', 'Reggae', 'Folk', 'Blues', 'Punk', 
    'Metal', 'Alternative', 'Indie', 'House', 'Techno', 'Dubstep',
    'Ambient', 'Other'
  ]).withMessage('Invalid genre')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { title, description, genre, tags, isPrivate, isDownloadable, bpm, key } = req.body;

    if (!req.files || !req.files.audio) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    const audioFile = req.files.audio[0];
    const artworkFile = req.files.artwork ? req.files.artwork[0] : null;

    try {
      // Upload audio to Cloudinary
      const audioResult = await uploadAudio(audioFile.buffer, {
        public_id: `${req.user.id}_${Date.now()}_${title.replace(/[^a-zA-Z0-9]/g, '_')}`
      });

      // Upload artwork if provided
      let artworkUrl = 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg';
      if (artworkFile) {
        const artworkResult = await uploadImage(artworkFile.buffer);
        artworkUrl = artworkResult.secure_url;
      }

      // Generate waveform data (placeholder implementation)
      const waveformData = generateWaveform(audioFile.buffer);

      // Create track
      const track = await Track.create({
        title,
        description: description || '',
        user: req.user.id,
        audioUrl: audioResult.secure_url,
        waveformData,
        artwork: artworkUrl,
        duration: audioResult.duration || 180, // Default 3 minutes if not detected
        genre,
        tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
        isPrivate: isPrivate === 'true',
        isDownloadable: isDownloadable === 'true',
        bpm: bpm ? parseInt(bpm) : undefined,
        key: key || undefined,
        fileSize: audioFile.size,
        format: audioFile.mimetype.split('/')[1],
        bitrate: 320 // Default bitrate
      });

      await track.populate('user', 'username displayName avatar');

      res.status(201).json({
        success: true,
        track
      });
    } catch (uploadError) {
      return res.status(400).json({
        success: false,
        message: 'Error uploading files',
        error: uploadError.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all tracks with pagination
// @route   GET /api/tracks
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const genre = req.query.genre;
    const sort = req.query.sort || '-createdAt';
    const search = req.query.search;

    let query = { isPrivate: false };

    // Add genre filter
    if (genre && genre !== 'all') {
      query.genre = genre;
    }

    // Add search filter
    if (search) {
      query.$text = { $search: search };
    }

    const tracks = await Track.find(query)
      .populate('user', 'username displayName avatar isVerified')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Track.countDocuments(query);

    res.json({
      success: true,
      tracks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single track
// @route   GET /api/tracks/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id)
      .populate('user', 'username displayName avatar isVerified followerCount')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username displayName avatar'
        },
        options: { sort: { timestamp: 1 } }
      });

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Check if track is private and user is not the owner
    if (track.isPrivate && (!req.user || track.user._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'This track is private'
      });
    }

    // Increment play count if user is different from owner
    if (!req.user || track.user._id.toString() !== req.user.id) {
      track.plays += 1;
      await track.save();
    }

    res.json({
      success: true,
      track
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Like/Unlike track
// @route   POST /api/tracks/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    const isLiked = track.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      track.likes = track.likes.filter(like => like.toString() !== req.user.id);
      req.user.likedTracks = req.user.likedTracks.filter(
        trackId => trackId.toString() !== track._id.toString()
      );
    } else {
      // Like
      track.likes.push(req.user.id);
      req.user.likedTracks.push(track._id);
    }

    await track.save();
    await req.user.save();

    res.json({
      success: true,
      liked: !isLiked,
      likeCount: track.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Repost track
// @route   POST /api/tracks/:id/repost
// @access  Private
router.post('/:id/repost', protect, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    const existingRepost = track.reposts.find(
      repost => repost.user.toString() === req.user.id
    );

    if (existingRepost) {
      // Remove repost
      track.reposts = track.reposts.filter(
        repost => repost.user.toString() !== req.user.id
      );
    } else {
      // Add repost
      track.reposts.push({ user: req.user.id });
    }

    await track.save();

    res.json({
      success: true,
      reposted: !existingRepost,
      repostCount: track.reposts.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Add comment to track
// @route   POST /api/tracks/:id/comments
// @access  Private
router.post('/:id/comments', protect, [
  body('text').isLength({ min: 1 }).withMessage('Comment text is required'),
  body('timestamp').isNumeric().withMessage('Timestamp must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { text, timestamp } = req.body;

    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    const comment = await Comment.create({
      text,
      user: req.user.id,
      track: track._id,
      timestamp: timestamp || 0
    });

    await comment.populate('user', 'username displayName avatar');

    track.comments.push(comment._id);
    await track.save();

    res.status(201).json({
      success: true,
      comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update track
// @route   PUT /api/tracks/:id
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Check ownership
    if (track.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this track'
      });
    }

    const { title, description, genre, tags, isPrivate, isDownloadable, bpm, key } = req.body;

    if (title) track.title = title;
    if (description !== undefined) track.description = description;
    if (genre) track.genre = genre;
    if (tags) track.tags = tags.split(',').map(tag => tag.trim());
    if (isPrivate !== undefined) track.isPrivate = isPrivate;
    if (isDownloadable !== undefined) track.isDownloadable = isDownloadable;
    if (bpm) track.bpm = parseInt(bpm);
    if (key) track.key = key;

    await track.save();
    await track.populate('user', 'username displayName avatar');

    res.json({
      success: true,
      track
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete track
// @route   DELETE /api/tracks/:id
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Check ownership
    if (track.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this track'
      });
    }

    // Delete associated comments
    await Comment.deleteMany({ track: track._id });

    // Remove from user's liked tracks
    await User.updateMany(
      { likedTracks: track._id },
      { $pull: { likedTracks: track._id } }
    );

    await track.deleteOne();

    res.json({
      success: true,
      message: 'Track deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
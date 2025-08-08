const express = require('express');
const { body, validationResult } = require('express-validator');
const Playlist = require('../models/Playlist');
const Track = require('../models/Track');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadImage } = require('../middleware/upload');
const { uploadImage: uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// @desc    Create playlist
// @route   POST /api/playlists
// @access  Private
router.post('/', protect, uploadImage.single('artwork'), [
  body('title').isLength({ min: 1 }).withMessage('Title is required')
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

    const { title, description, isPrivate, tags } = req.body;

    let artworkUrl = '';
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        artworkUrl = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Error uploading artwork',
          error: uploadError.message
        });
      }
    }

    const playlist = await Playlist.create({
      title,
      description: description || '',
      user: req.user.id,
      artwork: artworkUrl,
      isPrivate: isPrivate === 'true',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await playlist.populate('user', 'username displayName avatar');

    // Add to user's playlists
    req.user.playlists.push(playlist._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get all playlists
// @route   GET /api/playlists
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const sort = req.query.sort || '-createdAt';

    const playlists = await Playlist.find({ isPrivate: false })
      .populate('user', 'username displayName avatar isVerified')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Playlist.countDocuments({ isPrivate: false });

    res.json({
      success: true,
      playlists,
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

// @desc    Get single playlist
// @route   GET /api/playlists/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('user', 'username displayName avatar isVerified followerCount')
      .populate({
        path: 'tracks.track',
        populate: {
          path: 'user',
          select: 'username displayName avatar'
        }
      });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check if playlist is private and user is not the owner
    if (playlist.isPrivate && (!req.user || playlist.user._id.toString() !== req.user.id)) {
      return res.status(403).json({
        success: false,
        message: 'This playlist is private'
      });
    }

    res.json({
      success: true,
      playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Add track to playlist
// @route   POST /api/playlists/:id/tracks
// @access  Private
router.post('/:id/tracks', protect, [
  body('trackId').isMongoId().withMessage('Valid track ID is required')
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

    const { trackId } = req.body;

    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }

    const track = await Track.findById(trackId);

    if (!track) {
      return res.status(404).json({
        success: false,
        message: 'Track not found'
      });
    }

    // Check if track is already in playlist
    const existingTrack = playlist.tracks.find(
      item => item.track.toString() === trackId
    );

    if (existingTrack) {
      return res.status(400).json({
        success: false,
        message: 'Track already in playlist'
      });
    }

    playlist.tracks.push({ track: trackId });
    await playlist.save();

    await playlist.populate({
      path: 'tracks.track',
      populate: {
        path: 'user',
        select: 'username displayName avatar'
      }
    });

    res.json({
      success: true,
      playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Remove track from playlist
// @route   DELETE /api/playlists/:id/tracks/:trackId
// @access  Private
router.delete('/:id/tracks/:trackId', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this playlist'
      });
    }

    playlist.tracks = playlist.tracks.filter(
      item => item.track.toString() !== req.params.trackId
    );

    await playlist.save();

    res.json({
      success: true,
      message: 'Track removed from playlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Like/Unlike playlist
// @route   POST /api/playlists/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    const isLiked = playlist.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike
      playlist.likes = playlist.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      playlist.likes.push(req.user.id);
    }

    await playlist.save();

    res.json({
      success: true,
      liked: !isLiked,
      likeCount: playlist.likes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Update playlist
// @route   PUT /api/playlists/:id
// @access  Private (owner only)
router.put('/:id', protect, uploadImage.single('artwork'), async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this playlist'
      });
    }

    const { title, description, isPrivate, tags } = req.body;

    if (title) playlist.title = title;
    if (description !== undefined) playlist.description = description;
    if (isPrivate !== undefined) playlist.isPrivate = isPrivate;
    if (tags) playlist.tags = tags.split(',').map(tag => tag.trim());

    // Upload new artwork if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        playlist.artwork = result.secure_url;
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: 'Error uploading artwork',
          error: uploadError.message
        });
      }
    }

    await playlist.save();
    await playlist.populate('user', 'username displayName avatar');

    res.json({
      success: true,
      playlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Delete playlist
// @route   DELETE /api/playlists/:id
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found'
      });
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this playlist'
      });
    }

    // Remove from user's playlists
    req.user.playlists = req.user.playlists.filter(
      playlistId => playlistId.toString() !== playlist._id.toString()
    );
    await req.user.save();

    await playlist.deleteOne();

    res.json({
      success: true,
      message: 'Playlist deleted successfully'
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
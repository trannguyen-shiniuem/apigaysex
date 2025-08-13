const express = require('express');
const User = require('../models/User');
const Track = require('../models/Track');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
router.get('/:username', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username displayName avatar')
      .populate('following', 'username displayName avatar');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's tracks
    const tracks = await Track.find({ 
      user: user._id, 
      isPrivate: req.user && req.user.id === user._id.toString() ? undefined : false 
    })
      .populate('user', 'username displayName avatar')
      .sort('-createdAt')
      .limit(10);

    // Check if current user follows this user
    const isFollowing = req.user ? user.followers.some(
      follower => follower._id.toString() === req.user.id
    ) : false;

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        coverImage: user.coverImage,
        location: user.location,
        website: user.website,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        isVerified: user.isVerified,
        isPremium: user.isPremium,
        totalPlays: user.totalPlays,
        totalLikes: user.totalLikes,
        isFollowing,
        tracks
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

// @desc    Follow/Unfollow user
// @route   POST /api/users/:username/follow
// @access  Private
router.post('/:username/follow', protect, async (req, res) => {
  try {
    const userToFollow = await User.findOne({ username: req.params.username });

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (userToFollow._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    const isFollowing = userToFollow.followers.includes(req.user.id);

    if (isFollowing) {
      // Unfollow
      userToFollow.followers = userToFollow.followers.filter(
        follower => follower.toString() !== req.user.id
      );
      req.user.following = req.user.following.filter(
        following => following.toString() !== userToFollow._id.toString()
      );
    } else {
      // Follow
      userToFollow.followers.push(req.user.id);
      req.user.following.push(userToFollow._id);
    }

    await userToFollow.save();
    await req.user.save();

    res.json({
      success: true,
      following: !isFollowing,
      followerCount: userToFollow.followers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user's tracks
// @route   GET /api/users/:username/tracks
// @access  Public
router.get('/:username/tracks', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Show private tracks only to the owner
    const query = {
      user: user._id,
      ...(req.user && req.user.id === user._id.toString() ? {} : { isPrivate: false })
    };

    const tracks = await Track.find(query)
      .populate('user', 'username displayName avatar isVerified')
      .sort('-createdAt')
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

// @desc    Get user's liked tracks
// @route   GET /api/users/:username/likes
// @access  Public
router.get('/:username/likes', optionalAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    await user.populate({
      path: 'likedTracks',
      populate: {
        path: 'user',
        select: 'username displayName avatar isVerified'
      },
      options: {
        sort: { createdAt: -1 },
        skip: skip,
        limit: limit
      },
      match: { isPrivate: false }
    });

    res.json({
      success: true,
      tracks: user.likedTracks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user's followers
// @route   GET /api/users/:username/followers
// @access  Public
router.get('/:username/followers', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username displayName avatar followerCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      followers: user.followers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get user's following
// @route   GET /api/users/:username/following
// @access  Public
router.get('/:username/following', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('following', 'username displayName avatar followerCount');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      following: user.following
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { displayName: { $regex: q, $options: 'i' } }
      ]
    })
      .select('username displayName avatar followerCount isVerified')
      .limit(20)
      .sort('-followerCount');

    res.json({
      success: true,
      users
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
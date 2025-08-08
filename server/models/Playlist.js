const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide playlist title'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tracks: [{
    track: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Track'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  artwork: {
    type: String,
    default: ''
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalDuration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for track count
playlistSchema.virtual('trackCount').get(function() {
  return this.tracks.length;
});

// Virtual for like count
playlistSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for follower count
playlistSchema.virtual('followerCount').get(function() {
  return this.followers.length;
});

// Update total duration when tracks are modified
playlistSchema.pre('save', async function(next) {
  if (this.isModified('tracks')) {
    await this.populate('tracks.track');
    this.totalDuration = this.tracks.reduce((total, item) => {
      return total + (item.track ? item.track.duration : 0);
    }, 0);
  }
  next();
});

module.exports = mongoose.model('Playlist', playlistSchema);
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide track title'],
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
  audioUrl: {
    type: String,
    required: [true, 'Audio file is required']
  },
  waveformData: {
    type: [Number],
    default: []
  },
  artwork: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  genre: {
    type: String,
    required: true,
    enum: [
      'Electronic', 'Hip Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 
      'Country', 'R&B', 'Reggae', 'Folk', 'Blues', 'Punk', 
      'Metal', 'Alternative', 'Indie', 'House', 'Techno', 'Dubstep',
      'Ambient', 'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  isDownloadable: {
    type: Boolean,
    default: false
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reposts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  bpm: {
    type: Number,
    min: 60,
    max: 200
  },
  key: {
    type: String,
    enum: [
      'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B',
      'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm'
    ]
  },
  fileSize: {
    type: Number // in bytes
  },
  format: {
    type: String,
    enum: ['mp3', 'wav', 'flac', 'aac', 'm4a'],
    default: 'mp3'
  },
  bitrate: {
    type: Number // in kbps
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
trackSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for repost count
trackSchema.virtual('repostCount').get(function() {
  return this.reposts.length;
});

// Virtual for comment count
trackSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Index for search optimization
trackSchema.index({ title: 'text', description: 'text', tags: 'text' });
trackSchema.index({ user: 1, createdAt: -1 });
trackSchema.index({ genre: 1, createdAt: -1 });
trackSchema.index({ plays: -1 });
trackSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Track', trackSchema);
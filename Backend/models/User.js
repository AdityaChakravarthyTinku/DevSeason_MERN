const mongoose = require('mongoose');
const ProgressTrackerSchema = require('./ProgressTracker');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  },
  admin_SecurityKey: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  profile: {
    bio: {
      type: String,
      default: 'I am a Coder',
    },
    stats: {
      problemsSolved: {
        type: Number,
        default: 0,
      },
      totalAttempts: {
        type: Number,
        default: 0,
      },
    },
    progressTracker: {
      type: [ProgressTrackerSchema], // Embedding ProgressTrackerSchema
      default: [],
    },
  },
});

module.exports = mongoose.model('User', UserSchema);

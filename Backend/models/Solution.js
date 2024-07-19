const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const solutionSchema = new Schema({
  userId: {
    type: String,
    ref: 'User',
    required: true,
  },
  problemId: {
    type: String,
    ref: 'Problem',
    required: true
  },
  language:{
    type: String,
    required: true,
    enum: ['c', 'cpp', 'java', 'py']

  },
  verdict: {
    type: String,
    enum: ['AC', 'WA', 'TLE', 'MLE', 'OLE', 'RE', 'CE'],
    required: true
  },
  runtime: {
    type: Number,
    required: true
  },
  submittedTime: {
    type: Date,
    required: true,
    default: Date.now
  },

  penaltyScore: {
    type: Number,
    required: true
  }
}, { timestamps: true });

// Ensure compound index for userId and problemId
solutionSchema.index({ userId: 1, problemId: 1 }, { compound: true });

module.exports = mongoose.model('Solution', solutionSchema);

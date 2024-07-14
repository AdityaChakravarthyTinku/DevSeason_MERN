const mongoose = require('mongoose');

const codeInputSchema = new mongoose.Schema([
  {
    language: {
      type: String,
      required: true
    },
    template: {
      type: String,
      required: true
    }
  }
]);

const problemSchema = new mongoose.Schema({
  ojid: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard' ],
    default: 'medium',
  },
  topic: {
    type: String,
    required: true
  },
  statement: {
    type: String,
    required: true
  },
  tutorialLink: {
    type: String,
  },
  codeInput: [codeInputSchema]  // Now codeInput can contain multiple language-template pairs
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testCaseSchema = new Schema({
  problemId: {
    type: String,
    ref: 'Problem',
    required: true,
    unique: true,
  },
  testCases: [
    {
      input: {
        type: String,
        required: true
      },
      output: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('TestCase', testCaseSchema);

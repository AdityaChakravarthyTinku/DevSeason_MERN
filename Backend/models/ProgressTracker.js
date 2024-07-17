const mongoose = require('mongoose');

const ProgressTrackerSchema = new mongoose.Schema({
  topics: [
    {
      topicName: {
        type: String,
        required: true,
      },
      problemsSolved: [
        {
          problemTitle: {
            type: String,
            required: true,
          },
          solution: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Solution', // Assuming Solution schema exists
          },
        },
      ],
    },
  ],
});

module.exports = ProgressTrackerSchema;

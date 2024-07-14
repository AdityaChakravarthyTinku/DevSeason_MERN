const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  security_name: {
    type: String,
    required: true,
  },
    security_key: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Admin', AdminSchema);

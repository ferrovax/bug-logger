const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  text: {
    type: String,
    trim: true,
    required: [true, 'Log text is required']
  },
  priority: {
    type: String,
    default: 'minor',
    enum: ['minor', 'moderate', 'major']
  },
  user: {
    type: String,
    trim: true,
    required: [true, 'User is required']
  },
  category: {
    type: String,
    default: 'BACKLOG',
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', LogSchema);

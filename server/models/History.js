const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  url: {
    type: String,
    required: true
  },
  scanResults: {
    type: Object,
    required: true
  },
  scanDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('History', historySchema);
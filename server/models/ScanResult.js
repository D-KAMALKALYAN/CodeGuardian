const mongoose = require('mongoose');

const ScanResultSchema = new mongoose.Schema({
  url: String,
  vulnerabilities: Array,
  results: Array,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScanResult', ScanResultSchema);

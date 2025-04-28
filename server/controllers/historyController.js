const History = require('../models/History');

// Get all scan history for a user
exports.getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.id }).sort({ scanDate: -1 });
    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific scan by ID
exports.getScanById = async (req, res) => {
  try {
    const scan = await History.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    // Check if scan belongs to current user
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(scan);
  } catch (error) {
    console.error('Error fetching scan:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add new scan to history
exports.addScan = async (req, res) => {
  const { url, scanResults } = req.body;

  try {
    const newScan = new History({
      user: req.user.id,
      url,
      scanResults
    });

    const savedScan = await newScan.save();
    res.json(savedScan);
  } catch (error) {
    console.error('Error saving scan:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a scan from history
exports.deleteScan = async (req, res) => {
  try {
    const scan = await History.findById(req.params.id);
    
    if (!scan) {
      return res.status(404).json({ message: 'Scan not found' });
    }

    // Check if scan belongs to current user
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await History.findByIdAndRemove(req.params.id);
    res.json({ message: 'Scan removed from history' });
  } catch (error) {
    console.error('Error deleting scan:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
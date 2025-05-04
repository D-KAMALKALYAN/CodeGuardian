const History = require('../models/History');

// Get all scan history for a user
exports.getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ user: req.user.userId }).sort({ scanDate: -1 });
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
    
    // Compare the scan's user ID with the authenticated user's ID
    if (scan.user.toString() !== req.user) {
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
  console.log('addScan method called with request:', {
    body: req.body,
    user: req.user
  });

  const { url, scanResults } = req.body;
  console.log('Extracted data:', { 
    url, 
    scanResultsLength: scanResults ? Object.keys(scanResults).length : 0 
  });

  try {
    console.log('Creating new History document with data:', {
      userId: req.user.userId,
      url,
      scanResultsCount: scanResults ? (scanResults.detectedVulnerabilities ? scanResults.detectedVulnerabilities.length : 0) : 0
    });
    
    const newScan = new History({
      user: req.user.userId, // This should now be just the userId string from the decoded JWT
      url,
      scanResults
    });
    console.log('New scan object created:', newScan);
    
    console.log('Attempting to save scan to database...');
    const savedScan = await newScan.save();
    console.log('Scan saved successfully with ID:', savedScan._id);
    
    console.log('Responding with saved scan');
    res.json(savedScan);
  } catch (error) {
    console.error('Error saving scan:', {
      message: error.message,
      stack: error.stack,
      url: url,
      userId: req.user.userId
    });
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
    
    // Compare the scan's user ID with the authenticated user's ID
    if (scan.user.toString() !== req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await History.findByIdAndDelete(req.params.id);
    res.json({ message: 'Scan removed from history' });
  } catch (error) {
    console.error('Error deleting scan:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Change to protect
const historyController = require('../controllers/historyController');

// Get all scan history for current user
router.get('/', protect, historyController.getUserHistory);
// Get specific scan by ID
router.get('/:id', protect, historyController.getScanById);
// Add new scan to history
router.post('/', protect, historyController.addScan);
// Delete a scan from history
router.delete('/:id', protect, historyController.deleteScan);

module.exports = router;
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const historyController = require('../controllers/historyController');

// Get all scan history for current user
router.get('/', auth, historyController.getUserHistory);

// Get specific scan by ID
router.get('/:id', auth, historyController.getScanById);

// Add new scan to history
router.post('/', auth, historyController.addScan);

// Delete a scan from history
router.delete('/:id', auth, historyController.deleteScan);

module.exports = router;
const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this is the correct path to your authMiddleware

router.post('/', scanController.performScan);

module.exports = router;


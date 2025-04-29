const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');

/**
 * @route   GET /api/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/', protect, profileController.getProfile);

/**
 * @route   PUT /api/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/', protect, profileController.updateProfile);

/**
 * @route   PUT /api/profile/avatar
 * @desc    Update user avatar
 * @access  Private
 */
router.put('/avatar', protect, profileController.updateAvatar);

/**
 * @route   PUT /api/profile/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', protect, profileController.updatePassword);

module.exports = router;
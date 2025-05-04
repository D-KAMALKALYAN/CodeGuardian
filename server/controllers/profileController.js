const User = require('../models/User');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler');

/**
 * @desc    Get user profile
 * @route   GET /api/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res) => {
  console.log('Fetching profile for user', req.user);
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @desc    Update user profile
 * @route   PUT /api/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, bio, location, website, phoneNumber } = req.body;
    
    // Check if email is already in use by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }
    
    // Build update object with only provided fields
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (bio !== undefined) updateFields.bio = bio;
    if (location !== undefined) updateFields.location = location;
    if (website !== undefined) updateFields.website = website;
    if (phoneNumber !== undefined) updateFields.phoneNumber = phoneNumber;
    
    // Add updatedAt timestamp
    updateFields.updatedAt = Date.now();
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @desc    Update user avatar
 * @route   PUT /api/profile/avatar
 * @access  Private
 */
exports.updateAvatar = asyncHandler(async (req, res) => {
  try {
    const { avatar } = req.body;
    
    if (!avatar) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          avatar, 
          updatedAt: Date.now() 
        } 
      },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating avatar:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @desc    Update password
 * @route   PUT /api/profile/password
 * @access  Private
 */
exports.updatePassword = asyncHandler(async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Check for current password and new password
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }
    
    // Validate password strength
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long' 
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.updatedAt = Date.now();
    
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
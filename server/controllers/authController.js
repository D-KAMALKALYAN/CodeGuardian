const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// exports.signup = async (req, res) => {
//   const { fullName, email, password } = req.body;
//   try {
//       const existingUser = await User.findOne({ email });
//       if (existingUser) {
//           return res.status(400).json({ message: 'User with this email already exists' });
//       }
//       // Create new user
//       const newUser = new User({
//           fullName,
//           email,
//           password
//       });
//       await newUser.save();
//       res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server error, please try again' });
//   }
// };

exports.signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).json({ message: 'User with this email already exists' });
      }
      // Create new user
      const newUser = new User({
          fullName,
          email,
          password
      });
      await newUser.save();
      
      // Generate token for the new user
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      
      // Return token with success response
      res.status(201).json({ 
        message: 'User registered successfully',
        token
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error, please try again' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add the new getCurrentUser function
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user should be set by the protect middleware
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
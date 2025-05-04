const express = require('express');
const { signup, login, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // You'll need to create this
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/user', protect, getCurrentUser); // Add the missing endpoint

module.exports = router;
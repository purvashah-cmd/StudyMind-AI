const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/me').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);

module.exports = router;

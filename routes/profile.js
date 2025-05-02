const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyProfile,
  createOrUpdateProfile,
} = require('../controllers/ProfileController.jsx');

const router = express.Router();

// ✅ GET my profile
router.get('/me', authMiddleware, getMyProfile);

// ✅ Create or update profile
router.post('/', authMiddleware, createOrUpdateProfile);

module.exports = router;

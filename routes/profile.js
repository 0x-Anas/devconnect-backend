const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getMyProfile,
  createOrUpdateProfile,
  UsersProfile,
  uploadProfilePicture
} = require('../controllers/ProfileController.js');

const router = express.Router();

// ✅ GET my profile
router.get('/me', authMiddleware, getMyProfile);

// ✅ Create or update profile
router.post('/', authMiddleware, createOrUpdateProfile);

router.get('/:username',UsersProfile);

// PUT upload profile picture
router.put('/upload/profile-picture', verifyToken, upload.single('profilePicture'), uploadProfilePicture)

module.exports = router;

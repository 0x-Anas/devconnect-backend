const express = require('express');
const { createPost,getAllPost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

// Protect the route with auth middleware
// Protect route with auth + upload
router.post('/create', authMiddleware, upload.single('image'), createPost);

router.get('/all',getAllPost)

module.exports = router;

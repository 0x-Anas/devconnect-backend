const express = require('express');
const { createPost, getAllPost } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Use the multer configuration from postController

const router = express.Router();

// Protect the route with auth middleware
router.post('/create', authMiddleware, upload.single('image'), createPost);

router.get('/all', getAllPost);

module.exports = router;


                    

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/postRoutes');
const profileRoutes = require('./routes/profile');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

app.use(cors()); // Handle cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Routes
app.use("/api/auth", authRoutes); // Public (register/login)
app.use('/api/posts', authMiddleware, postRoutes); // Protected
app.use('/api/profile', authMiddleware, profileRoutes); // Protected

// Serve static files from 'public/uploads' directory
const uploadsPath = path.join(__dirname, 'public', 'uploads');
console.log('Uploads folder is located at:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(error => console.error("❌ MongoDB connection error:", error));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));


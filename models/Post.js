const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // link to User
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required:true
    
  },
  profilePic: {
    type: String, // just storing URL or path to profile pic
    default: "https://via.placeholder.com/40"
  },
  title: {
    type: String,
    required: true
  },
  image: {
   type: String, 
    required:true// URL or base64 string
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  comments: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);

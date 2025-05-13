// you just come from logger.js file now create the Schema
const mongoose = require('mongoose')
const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,

  },
  mediaIds: [
    {
      type: String,
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {timestamps: true})

// because we will have a different service for search
postSchema.index({content: 'text'});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;

// after this go to the controllers-> and create post-controller.js file 
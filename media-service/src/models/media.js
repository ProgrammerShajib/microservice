//  you  just come from the authMiddleware.js now work on media Schema
const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,

  },
  originalName: {
    type: String,
    required: true,

  },
  mimeType: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
},{timestamps: true})


const Media = mongoose.model("Media", mediaSchema);

module.exports = Media;

// now go to the utils-> cloudinary.js file  
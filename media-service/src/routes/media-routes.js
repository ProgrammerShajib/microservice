// Now you just come from the media-controller.js file
// Import necessary modules
const express = require('express');
const multer = require('multer');
const { uploadMedia, getallMedia } = require('../controllers/media-controller');
const { authenticateRequest } = require('../middleware/authMiddleware');
const logger = require('../utils/logger');

// Create a new router instance
const router = express.Router();

// Set up multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory buffer
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  }
}).single('file'); // Accept only a single file with the field name 'file'

// Define the POST route for file uploads
router.post('/upload', authenticateRequest, (req, res, next) => {
  
  // Handle file upload
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors (e.g., file too large)
      logger.error(`Multer error while uploading: `, err);

      return res.status(400).json({
        message: 'Multer error occurred while uploading.',
        error: err.message,
        stack: err.stack
      });
    } else if (err) {
      // Handle unknown errors during upload
      logger.error(`Unknown error occurred while uploading: `, err);

      return res.status(500).json({
        message: 'Unknown error occurred during file upload.',
        error: err.message,
        stack: err.stack
      });
    }

    // Check if file was not found in request.
    if (!req.file) {
      logger.error(`No file found in the request.`);
      return res.status(400).json({
        message: 'No file found in the request.'
      });
    }

       // If everything is okay, pass control to the next handler (uploadMedia)
    next();
  });

}, uploadMedia);

// Now you come from the media-controller.js file just create the route and test it in postman
router.get('/get', authenticateRequest, getallMedia) // now go to the post-service=> rabbitmq.js file and work on publishEvent

// Export the router to use in other parts of the application
module.exports = router;

// Now go to the server.js file before that write the MONGO_URL and NODE_ENV and PORT in .env file 
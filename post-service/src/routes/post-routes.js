const express = require('express');
// now import the createPost
const { createPost, getAllPost, getPost, deletePost } = require('../controllers/post-controller');
// now go to the middleware and create authMiddleware.js
// middleware -> this will tell if the user is auth user or not
const { authenticateRequest } = require('../middleware/authMiddleware');

const router = express.Router(); // ✅ This is the fix!

router.use(authenticateRequest);

router.post("/create-post", createPost);
router.get("/all-post", getAllPost);
router.get("/:id", getPost);
router.delete("/:id", deletePost);

module.exports = router;

// now create a dotenv file
  
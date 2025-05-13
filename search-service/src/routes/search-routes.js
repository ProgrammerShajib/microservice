
// you just come from the searchPostcontroller.js file now implement the routes here

const express = require('express');
const { authenticateRequest } = require('../middleware/authMiddleware');
const { searchPostController } = require('../controllers/searchPostController');


const router = express.Router();
router.use(authenticateRequest)

router.get("/posts", searchPostController)

module.exports = router; 

// now go to the server.js file and use the searchroutes
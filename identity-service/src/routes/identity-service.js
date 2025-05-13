//  You come form identity-contorller.js file . now create the router 
const express = require('express')
const {registerUser, loginUser, LoggedoutUser, refreshTokenUser} = require('../controller/identity-controller')

const router = express.Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshTokenUser);
router.post('/logout', LoggedoutUser);  // Now test the api and then create the another three microservice folder 1. media-service 2. post-service 3. search-service and work on post-service  and create the src-> all required folder then create utils-> logger.js file copy logger.js file from the identity-service and use it here 

module.exports = router;

// after export the router go to the server.js file and work on that
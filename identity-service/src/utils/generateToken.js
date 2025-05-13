//  Now import jwt and crypto to use them here 
const jwt = require('jsonwebtoken'); // jsonwebtoken is used to create signed access tokens
const crypto = require('crypto') // crypto is a built-in Node.js module used for generating secure random tokens
const RefreshToken = require('../models/RefreshToken') // import the RefreshToken model to store refresh tokens in the database

// Define an async function to generate both access and refresh tokens
const generateToken = async (user) => {

  // Create an access token using jwt. It includes userId and username in the payload
  const accessToken = jwt.sign({
    userId: user._id,
    username: user.username
  }, process.env.JWT_SECRET, { expiresIn: '60m' }) // token is valid for 60 minutes

  // Generate a secure random string for refresh token using crypto
  const refreshToken = crypto.randomBytes(40).toString('hex');

  // Set an expiration date for the refresh token (7 days from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7)  // refresh token expires in 7 days

  // Now import the RefeshToken and use it here 
  // Save the generated refresh token to the database with associated user ID and expiration
  await RefreshToken.create({
    token: refreshToken,
    user: user._id,
    expiresAt,
  })

  // Return both access and refresh tokens to the caller
  return { accessToken, refreshToken }
}

// Export the function so it can be used in other parts of the application
module.exports = generateToken;

//  Now go to the identity-controller.js file  

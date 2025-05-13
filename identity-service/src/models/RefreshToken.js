
const mongoose = require('mongoose') // Import mongoose to interact with MongoDB

// Define the schema for the refresh token
const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,      // The token must be provided
      unique: true,        // No two documents can have the same token
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, // Store the user's ID as a reference
      ref: "User",                          // This creates a reference to the User collection
      required: true,                        // The token must be provided
    },
    expiresAt: {
      type: Date,
      required: true,      // Expiry date for the token is mandatory
    },
  },
  {timestamps: true}       // Automatically adds createdAt and updatedAt fields to the schema
); 

// Create an index on the `expiresAt` field and automatically delete the document when it expires
refreshTokenSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

// Create a model called 'RefreshToken' using the schema above
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

// Export the RefreshToken model to use it in other files
module.exports = RefreshToken;

// after exporting RefreshToken go to the identity-controller and work on user Register

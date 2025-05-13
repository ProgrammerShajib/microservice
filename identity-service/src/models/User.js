// first import mogoose and argon2 then create the userSchema
const mongoose = require('mongoose')
// argon2 is a secure password hashing algorithm used to hash and verify passwords
const argon2 = require('argon2') 


// Define a new Mongoose schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,        // username is required
    unique: true,          // must be unique in DB
    trim: true             // remove any white space around it
  },
  email: {
    type: String,
    required: true,        // email is required
    unique: true,          // must be unique in DB
    trim: true,            // trim whitespace
    lowercase: true,       // automatically convert email to lowercase
  },
  password: {
    type: String,
    required: true,        // password is required
    unique: true,          // (⚠️ usually we don't make password unique, can remove this later)
    trim: true             // trim whitespace
  },
  createdAt: {
    type: Date,
    default: Date.now      // set default creation time to now
  }
}, {
  timestamps: true         // also add updatedAt and createdAt fields automatically
});


// create another function 
// This function is called *before saving* a user to the database
// It's a Mongoose middleware called `pre('save')`
userSchema.pre('save', async function (next) {
  // `this.isModified('password')` checks:
  // → true if the password is new or has been changed
  // → false if nothing happened to password
  if (this.isModified('password')) {
    try {
      // if password is modified, hash it with argon2
      this.password = await argon2.hash(this.password);
      next(); // proceed to save
    } catch (error) {
      return next(error); // handle any error and stop save
    }
  } else {
    next(); // if password wasn't modified, skip hashing
  }
});


//  after that create a function to compare the password
// This method is used during login to compare:
// entered password vs. hashed password in DB
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // argon2.verify() checks whether the given password matches the hash
    return await argon2.verify(this.password, candidatePassword)
  } catch (error) {
    throw error; // forward error to controller
  }
}


// Add text index on username for text search capabilities
userSchema.index({username : 'text'});

// Compile the schema into a model called "User"
const User = mongoose.model("User", userSchema);

// Export the model to use it in other files
module.exports = User

// after this go to the Utils folder and create the logger.js file  

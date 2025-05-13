// step by step process for backend 

// # first create server.js file then go to src folder and create controller, models, rotues, utils,  then start with models -> in the models create User.js file

// in the User.js file 
// in this file crate a userSchema then hash the password with argon2 use pre method then compare the password and make an index in the last export the module.

// after this go to the Utils folder and create the logger.js file  

// in the logger.js file import the winston and create a logger instance using winston after that export the logger 

// then go to the middleware file and create errorHandler.js file  

// in this file use the logger.js and create the errorHandler instance and export it 

// after exporting errorHandler go to the controller file and create identity-controller.js file 

//  Here we work on this topic step by step 1. user Registration 2. User Login 3. Refresh token 4. logout  


// now go to the utils folder and create the validation.js file 
// and validate userschema . 

// create the RefreshToken.js file and also create the generateToken.js file user the RefreshToken.js in the generateToken.js 

// now create the registerUser instance and export it.

// after exports the registerUser go to the routes folder and  create identity-server.js file 

// after export the router go to the server.js file and work on that

//  step you will work on -> 1. create express app() 2. Connect to MogoDB 3. Use the Middleware 

// 4. create sensitiveEndpointsLimiter 
// 4. Ddose protection 5. IP base ratelimiting

// 6. apply the errorHandler in globally 
//  Here we work on this topic step by step 1. user Registration 2. User Login 3. Refresh token 4. logout  

//  Before write anything in this file go to the models folder and create RefreshToken.js file
const User = require("../models/User");
const logger = require("../utils/logger"); // first import the logger file from utils.js and use it 
const { validataionRegistration, validateLogin } = require("../utils/validation");
const generateToken = require("../utils/generateToken");
const RefreshToken = require("../models/RefreshToken");

// user registrataion
const registerUser = async (req, res) => {
  logger.info("Registration end point hit....");

  try {
    // validate the schema
    // go to the utils folder create the validation.js file and import it 
    const { error } = validataionRegistration(req.body); // now you successfully import the validataionRegistration and use it 
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password, username } = req.body;
    let user = await User.findOne({ $or: [{ email }, { username }] });
 
    if (user) {
      logger.warn("User already exist");
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    user = new User({ username, email, password });
    await user.save();
    logger.warn("User saved successfully", user._id);


    // Now go to utils folder and create generateToken.js file and comebacke here for use that file 
    const {accessToken, refreshToken} = await generateToken(user) // now you import the generateToken successfully

    res.status(201).json({
      success: true,
      message: "User registerd successfully!",
      accessToken,
      refreshToken

    })
    
  } catch (e) {
    logger.error('Registration error occured!', e)
     res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}; // Now export the registerUser 
// after exports the registerUser go to the routes folder and  create identity-server.js file 


// user login
// Now you are comming from api-gateway -> service.js

const loginUser = async(req, res)=>{
  logger.info("LoginUser end point hit....");

  try {
    // Now first go to the Utils -> validation.js and create the validationLogin
    const {error} = validateLogin(req.body)
    if(error){
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }


    const { email, password } = req.body;
    // let user = await User.findOne({ $or: [{ email }, { username }] });
    let user = await User.findOne({email})

    if(!user){
      logger.warn("Invalid User!");
      return res.status(400).json({
        success: false,
        message: "Invalid credentials!",
      });
    }

    // user valid password or not 
    const isValidPassword = await user.comparePassword(password)

    if(!isValidPassword){
      logger.warn("Invalid Password!");
      return res.status(400).json({
        success: false,
        message: "Invalid Password!",
      });
    }

    //  Generate AccessToken 

    const {accessToken, refreshToken} = await generateToken(user)

    res.json({
      accessToken,
      refreshToken,
      userId: user._id,
    })

  } catch (error) {
    logger.error('Login error occured!', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }

} // Now go to the postman and test this 

// refresh token
const refreshTokenUser = async(req, res)=>{
  logger.warn("RefreshToken endPoint hit...");
  
  try {
    
    const {refreshToken} = req.body;
    if(!refreshToken){
      logger.warn('RefreshToken is missing!');
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const storedToken = await RefreshToken.findOne({token: refreshToken});

    if(!storedToken || storedToken.expiresAt < new Date()){
      logger.warn("Invalid or Expaired refreshToken!");

      return res.status(401).json({
        success: false,
        message: "Invalid or Expaired refreshToken!"
      })
    }

    const user = await User.findById(storedToken.user)

    if(!user){
      logger.warn('User not found!')

      return res.status(400).json({
        success: false,
        message: 'User not found!'
      })
    }

    const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await generateToken(user);

    await RefreshToken.deleteOne({id: storedToken._id})

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,

    })
  } catch (error) {
 
   logger.error('Login error occured!', error)

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  
  }
}// Now work on logout 

// logout
const LoggedoutUser = async(req, res)=>{
  logger.warn('Logout endpoint hit...')
  try {
    const {refreshToken} = req.body;

    if(!refreshToken){
      logger.warn('RefreshToken is missing!');
      return res.status(400).json({
        success: false,
        message: "RefreshToken is missing!",
      });
    }

    await RefreshToken.deleteOne({token: refreshToken});
    logger.info('Refresh token deleted for logout!')

    res.json({
      success: true,
      message:'Logged out successfully!'
    })
 
  } catch (error) {
    logger.error('Logout error occured!', error)

    res.status(500).json({
      success: false,
      message: 'Logout error occured!'
    })
  }
}

// Now we will work on the other microservice for that create 1. post-service 2. search-service 3. media-service

module.exports = {registerUser, loginUser,refreshTokenUser,LoggedoutUser}
 

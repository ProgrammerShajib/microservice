// now you have to check the user has same secrete key or not so go to the .env file and create JWT_TOKEN

 
const logger = require("../utils/logger");
const jwt = require('jsonwebtoken')

// now you just create the JWT_SECRET = JWT_SECRET key in the .env file 

const  authenticateRequest = (req, res, next)=>{

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(!token){
    logger.warn('Access attempt without valid token!')
    return res.status(401).json({
      success: false,
      message: `Authentication required.`
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{

    if(err){
      logger.warn('Invalid token!');
      return res.status(429).json({
        success: false,
        message: 'Invalid token!'
      })
    }
    req.user = user;
    // logger.info(`✅ Token verified! User: ${JSON.stringify(user)}`); 
    next();
  })

}

module.exports = {authenticateRequest};
// now work on models->media.js file and create the mediaSchema
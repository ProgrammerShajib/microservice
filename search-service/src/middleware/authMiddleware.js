// you just come from the post-routes.js file
const Search = require('../models/Search');
const logger = require('../utils/logger')

// Now create authenticateRequest and export it
const authenticateRequest = (req, res, next)=>{

  const userId = req.headers['x-user-id'];
  
  

  if(!userId){
    logger.warn(`Access attempted without user ID.`);

    return res.status(401).json({
      success: false,
      message: `Authentication required! Please login to continue`
    })
  }

  req.user = {userId};
  next();
}



module.exports = {authenticateRequest};

//  now work on Search.js file in the models 
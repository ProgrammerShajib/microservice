//  Now import the logger file and use it 
const logger  = require('../utils/logger');

const errorHandler = (err, req, res, next)=>{
  logger.error(err.stack)

  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  })
}

module.exports = errorHandler; 
// Now create a .env file in the api-gateway folder.


// after exporting errorHandler go to the controller file and create identity-controller.js file 
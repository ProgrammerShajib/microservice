// You just come from the post-service-> post-controller.js file 
// Now copy the logger.js file and paste it here 
const winston = require('winston')

const logger = winston.createLogger({

  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({stack: true}),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: "Search-gateway"}, // change the name with search-gateway
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}), 
  ]
})

module.exports = logger; 

// after this go to the middleware file authMiddleware.js and errorHandler.js file and paste it 
// import the winston and use it use the winston document as a refernce
const winston = require('winston') // Winston is a flexible logging library for Node.js used for logging errors, info, or debug data

// Custom Winston Logger Setup for Logging in Node.js
const logger = winston.createLogger({

  // Set the minimum level of messages that will be logged
  // If in production, only log 'info' and above (like warnings, errors); otherwise log everything including 'debug'
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  // Define the log message format using winston.format.combine to merge multiple formatting options
  format: winston.format.combine(
    winston.format.timestamp(), // Adds a timestamp to each log entry
    winston.format.errors({ stack: true }), // Formats errors and includes the stack trace
    winston.format.splat(), // Allows string interpolation (like console.log('%s', value))
    winston.format.json() // Logs everything in JSON format (structured logs)
  ),

  // Add default metadata to every log entry
  defaultMeta: { service: "identity-server" },

  // Define where the logs will be output (transports)
  transports: [

    // Console transport to log colored and simple messages during development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Adds color to logs for readability in terminal
        winston.format.simple() // Simple format without JSON structure (for easy reading)
      ),
    }),

    // File transport to store only 'error' level logs in error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),

    // File transport to store all logs (info, warn, error, etc.) in combined.log
    new winston.transports.File({ filename: 'combined.log' }), 
  ]
})

module.exports = logger; // Export the logger so it can be used throughout the application

// after this go to the middleware file and create errorHandler.js file  

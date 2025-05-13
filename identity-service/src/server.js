//  step you will work on -> 1. create express app() 2. Connect to MogoDB 3. Use the Middleware
require("dotenv").config();
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const express = require("express");

const helmet = require("helmet");
const cors = require("cors");
const { RateLimiterRedis } = require("rate-limiter-flexible"); // after this line goto .env file and create the REDIS_URL then import the ioredis
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const routes = require("./routes/identity-service");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;


// connct to mongoDb

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

//after importing ioredis create the redisClient
const redisClient = new Redis(process.env.REDIS_URL); // after this line go to create the DDose protection and rate limiting


// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
  //  after this install the ->  rate-limiter-flexible
});

// DDose protection and rate limiting 
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient, // Redis client used to store request counts
  keyPrefix: "middleware", // Prefix for Redis keys to avoid collision
  points: 10, // Max 10 requests
  duration: 1, // Within 1 second
});

app.use((req, res, next) => {
  rateLimiter.consume(req.ip) // Check if current IP is under rate limit
    .then(() => {
      next(); // Allow request to proceed
    })
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`); // Log IP that exceeded limit
      res.status(429).json({ success: false, message: 'Too many requests' }); // Respond with 429 Too Many Requests
    });
});// after this create the ip based rate limiting  for that first import the express rate limit

//  IP based Rate limiting for sensitive endpints
//import the reateLimit and use it here
const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 50, // Limit each IP to 50 requests per window
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`); // Log when sensitive limit exceeded
    res.status(429).json({ success: false, message: `Too many requests` }); // Respond with rate limit message
  },
  //import the RedisStore and use it here
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args), // Redis command proxy using redisClient
  }),
});// after this apply the sensitiveEndpointsLimiter to route

//  apply the sensitiveEndpointsLimiter to our routes

app.use("/api/auth/register", sensitiveEndpointsLimiter); // after this import the routes and use it

// Routes
app.use("/api/auth", routes); // after this import the errorHandler and use that

//  error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Identity service running on port ${PORT}`);
}); // after this use the unHandled promise rejection

// unhandled Promise Rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason: ", reason);
}); 


//  Now you successfully finish the first part run the project and see the error🤣😂

// Don't acepect me to fix it . It's your bug so you fix it

// Now test the Routes in Postman api. if you succeded congratulation . 

// Remember now we need to create a proxy server so we can connect api-gateway with identity-service and others for that 

// Now go to the api-getway and create middleware, utils folder 

// Under Utils -> create logger.js
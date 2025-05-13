require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const Redis = require('ioredis');
const postRoutes = require('./routes/post-routes');
const errorHandler = require('./middleware/errorHandler') // now create the errorHandler.js file in middleware file or just copy it from the identity-service
const {rateLimit} = require('express-rate-limit');
const {RedisStore} = require('rate-limit-redis');
const {RateLimiterRedis} = require('rate-limiter-flexible')

const logger = require('./utils/logger');
const { connectToRabbitMQ } = require('./utils/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3002

// connect to mongdb 

mongoose.connect(process.env.MONGO_URL).then(()=> logger.info("Connected to mongodb")).catch((e)=> logger.error("Mongo connection error", e));

const redisClient = new Redis(process.env.REDIS_URL);


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


//  IP based Rate limiting for sensitive endpints
const sensitiveEndpointsLimiter = rateLimit({
  windowMs: 15* 60 * 1000,
  max : 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res)=>{
    logger.warn(`Sensitive endpoint rate limit exceded for IP : ${req.ip}`);
    res.status(429).json({success:false, message: `Too many requests`})
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});

// routes -> we need to pass the redisClient to routes
app.use('/api/posts', (req,res, next)=>{
  req.redisClient = redisClient; 
  next();
}, postRoutes);

app.use(errorHandler)

// now call here connectToRabbitMQ before app.listen under async function
async function startServer() {
  try {
    await connectToRabbitMQ();
    app.listen(PORT, ()=>{
      logger.info(`POST service running on port ${PORT}`);
    })
  } catch (error) {
    logger.error(`Failed to connect to server`, error)
    process.exit(1)
  }
}

startServer()
// now run the post-service and check it connect or not time 7:31 
// then go to the media-service=> cloudinary.js file and build the deleteMediafromCloudinary 

 

// unhandled Promise Rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason: ", reason);
}); 


// Now run it 

// after that go to the api-gateway-> server.js file and create ta comment line for settting up proxy for post service

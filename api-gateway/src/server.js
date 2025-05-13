// so first import the basic express app

require("dotenv").config();
const express = require("express");
const Redis = require("ioredis");
const helmet = require("helmet");
const cors = require("cors");

const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

const logger = require("./utils/logger");
const proxy = require("express-http-proxy");

const errorHandler = require("./middleware/errorHandler");
const { validateToken } = require("./middleware/authMiddleware");
const app = express();
const PORT = process.env.PORT || 3000;

// now import the redis and create the redisClient
const redisClient = new Redis(process.env.REDIS_URL);

// now import the helmet and cors middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Now install the express-rate-limit, rate-limit-redis and express-http-proxy if you don't have

// rate limiting
const mylimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    // now import the logger.js file and use it here
    
    logger.warn(`Sensitive endpoint rate limit exceeded for IP : ${req.ip}`);
    res.status(429).json({ success: false, message: `Too many requests` });
  },
  // import the RedisStore and use it here
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  }),
});
// now use the mylimit
app.use(mylimit);

app.use((req, res, next) => {
  logger.info(`Recieved ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

// So here is the overview what we are going to do next

// Suppose our api-gatway and identity-service are running on this port now we are gonna redirect it or controlle it

// api-getway -> /v1/auth/register -> 3000
// identity-server-> /api/auth/register -> 3001

// it's going to look like this
//  localhost:3000/v1/auth/register -> localhost:3001/api/auth/register

// Now import the express-http-proxy
const proxyOptions = {
  proxyReqPathResolver: (req) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err, res, next) => {
    logger.error(`Proxy error: ${err?.message || 'Unknown error'}`);
    // console.error(err); // <- TEMPORARY: to get full stack trace
    res.status(500).json({
      message: "Internal server error",
      error: err?.message || "Unknown error",
    });
  }
  ,
};

// setting up proxy for our identity service

app.use(
  "/v1/auth",
  proxy(process.env.IDENTITY_SERVICE_URL, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response recieved from identity service: ${proxyRes.statusCode}`
      );
      return proxyResData;
    },
  })
);

// Now you just come from post-service->server.js file before create anything here go to middleware and create authmiddleware.js file and import validateToken and use it 

// setting up proxy for our post-service  

app.use('/v1/posts',validateToken, proxy(process.env.POST_SERVICE_URL, {
  ...proxyOptions, 
  proxyReqOptDecorator: (proxyReqOpts,srcReq)=>{
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
  

    return proxyReqOpts;

  },

  userResDecorator: (proxyRes, proxyResData, userReq, userRes)=>{
    logger.info(`Response recieved from post service: ${proxyRes.statusCode}`)

    return proxyResData;
  }

 
})) // now taste it in post man and go to the post-service-> post-controller.js file and work on getallpost , getsinglePost , DeletePost


// Now you just come from media-service->server.js file 

// setting up proxy for our media-service  

app.use('/v1/media', validateToken, proxy(process.env.MEDIA_SERVICE_URL,{
  ...proxyOptions, 
  proxyReqOptDecorator: (proxyReqOpts, srcReq)=>{
    proxyReqOpts.headers['x-user-id'] =  srcReq.user.userId;

    if(!srcReq.headers[`content-type`].startsWith('multipart/form-data')){
      proxyReqOpts.headers["Content-Type"] = "application/json";
    }

    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    logger.info(
      `Response recieved from media service: ${proxyRes.statusCode}`
    );
    return proxyResData;
  },
  parseReqBody: false 
})) // now go to the post-service ->utils->validation.js and add the mediaIds: then go to the post man and test it . after this we will work on  RabbitMQ 

// RabitMQ step => go to post-service-> install amqplib -> .env-> initialize the RABBITMQ_URL= 5672


// now setting up proxy for our search-service  

app.use('/v1/search',validateToken, proxy(process.env.SEARCH_SERVICE_URL, {
  ...proxyOptions, 
  proxyReqOptDecorator: (proxyReqOpts,srcReq)=>{
    proxyReqOpts.headers['Content-Type'] = 'application/json';
    proxyReqOpts.headers['x-user-id'] = srcReq.user.userId;
  

    return proxyReqOpts;

  },

  userResDecorator: (proxyRes, proxyResData, userReq, userRes)=>{
    logger.info(`Response recieved from search service: ${proxyRes.statusCode}`)

    return proxyResData;
  }

 
})) // now run the all service and check it  if it is ok then work on Docker 

// step for Docker => first create a .gitignore file in the root folder and initialize it after that go to the api-gateway=> create Dockerfile and work on that then create it in other microservices


// now import the errorHandler and use it

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on port ${PORT}`);
  logger.info(
    `Identity service is running on port ${process.env.IDENTITY_SERVICE_URL}`
  );
  logger.info(
    `Post service is running on port ${process.env.POST_SERVICE_URL}`
  );
  logger.info(
    `Media service is running on port ${process.env.MEDIA_SERVICE_URL}`
  );
  logger.info(
    `Search service is running on port ${process.env.SEARCH_SERVICE_URL}`
  );
  logger.info(`Redis Url ${process.env.REDIS_URL}`);
}); 


// now test the api in postman and check all the staff going well
// after that go to the identity service -> controller.js work on userlogging function 
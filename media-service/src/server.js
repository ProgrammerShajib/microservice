require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const mediaRoutes = require("./routes/media-routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const { connectToRabbitMQ, consumeEvent } = require("./utils/rabbitmq");
const { handlePostDeleted } = require("./eventHandler/media-event-handler");

const app = express();
const PORT = process.env.PORT;

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info(`Connected to mongodb.`))
  .catch((e) => logger.error("Mongo connection error", e));


// middleware
app.use(helmet())
app.use(cors())
app.use(express.json())


app.use((req, res, next)=>{

  logger.info(`Recieved ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`)
  next();
  
})

// *** Homework -> implement Ip based rate limiting for sensitive endpoints


app.use("/api/media",mediaRoutes);
app.use(errorHandler);

// now you just come from the rabbitmq.js file now work on startServer
async function startServer() {
  try {
    await connectToRabbitMQ();

    await consumeEvent('post.deleted',handlePostDeleted) // now call the consumeEvent here after that go to the src and create eventHandler=> media-event-handler.js file and call the handlePostDeleted and test it in postman then go to the media-event-handler.js file again and work on implement others 
    app.listen(PORT, ()=>{
      logger.info(`Media service running on port ${PORT}`);
    }) 
  } catch (error) {
    logger.error(`Failed to connect to server`, error)
    process.exit(1)
  }
}

startServer()
 

process.on("unhandledRejection", (reason, promise)=>{
  logger.error("Unhandled Rejection at", promise, "reason: ", reason);
})


//  now go to the api-gateway-> server.js file and create the proxy for media-uploading





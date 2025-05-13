// you just come from the rabbitmq.js file and now work on here
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
const { connectToRabbitMQ, consumeEvent } = require("./utils/rabbitmq");
const searchRoutes = require("./routes/search-routes");

const {handlePostCreated, handlePostDeleted} = require('./eventHandler/search-event-handler')
 

const app = express();

const PORT = process.env.PORT || 3004;

// connect to mongdb

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => logger.info("Connected to mongodb"))
  .catch((e) => logger.error("Mongo connection error", e));

// middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// pass redis client as part of your req and then implement redis caching also invalid the cach when we delete a post

// now go to controllers and create the search-controller.js file and work on that
app.use("/api/search", searchRoutes); //time : 8:20

// now we are ready to  do the search but the question is we don't have anything in our  Search Schema right?
// so we need data in our Schema so that we can search them . for that we need to upload the data information in the search schema during create the data . for that we need to go to the post-service => post-controller.js file and publish an event with the created data so we can catch it in the search .now go and work on publishevent in post-controller.js file

app.use(errorHandler);

// you just come from the post-controller.js file .
// now consume the event you pass there

async function startServer() {
  try {
    await connectToRabbitMQ();

    // consume the event / subscribe to the events
    await consumeEvent("post.created", handlePostCreated); // now create a search-event-handler.js and call it here

    await consumeEvent("post.deleted",handlePostDeleted)
     app.listen(PORT, ()=>{
      logger.info(`POST service running on port ${PORT}`);
    })
  } catch (error) {
    logger.error(error, "Failed to start the search server.");
    process.exit(1);
  }
} // now go to the api gateway and make a proxy for search-service  

// if everything is ok then think . now if we delete a post then we need to delete the data from the search also for that we need to implement that. now consume the delete event from the post-service=> controller=> deletePost in the startServer() then create an event handler for that.

 startServer();


 
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason: ", reason);
}); 
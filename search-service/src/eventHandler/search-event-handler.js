const Search = require("../models/Search");
const logger = require("../utils/logger");

async function handlePostCreated(event) {
  try {
    const newSearchPost = new Search({
      postId: event.postId,
      userId: event.userId,
      content: event.content,
      createdAt: event.createdAt,
    });

    await newSearchPost.save();
    logger.info(
      `Search post created: ${event.postId} , ${newSearchPost._id.toString()}`
    )
  } catch (error) {
    logger.error(error, "Error Handling post creation event.")
  }
} // now go and call it in the server.js file . time: 8:29


async function handlePostDeleted(event) {
  
  try {
    await Search.findOneAndDelete({postId: event.postId});
       logger.info(
      `Search post deleted: ${event.postId}}`
    )  
  } catch (error) {
    logger.error(error, "Error handling post deletion event")
  }
}

module.exports = {handlePostCreated, handlePostDeleted};


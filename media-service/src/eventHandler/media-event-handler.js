const Media = require("../models/media");
const { deleteMediaFromCloudinary } = require("../utils/cloudinary");
const logger = require("../utils/logger");

// you just come from the server.js file now implement handlePostDeleted and export it
const handlePostDeleted = async (event)=>{
  console.log(event, 'EventEventEvent event.')
  // i just come from the postman test now get the event data here 

  const {postId,userId,mediaIds} = event;

  try {
    const mediaToDelete = await Media.find({_id : {$in: mediaIds}})

    for(const media of mediaToDelete){
      await deleteMediaFromCloudinary(media.publicId)
      await Media.findByIdAndDelete(media._id)

      logger.info(`Deleted media ${media._id} associated with this post ${postId}`)
    }

    logger.info(`Processed Deletion of media for post id : ${postId}`)
    // now go to the post man and test it . if it work then congratulation

    // now go to the search-service import the logger.js , authmiddleware.js and errorHandler.js file after that go to the models and create Search.js file and work on that
  } catch (e) {
    logger.error(e, `Error occured while media deletion.`)
    
  }

}

module.exports = {handlePostDeleted} // now call this in the server.js file in the startServer() 
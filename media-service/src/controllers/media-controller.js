// you just come from the cloudinary.js file
const Media = require('../models/media');
const {uploadMediaToCloudinary} = require('../utils/cloudinary');
const logger = require('../utils/logger');

const uploadMedia = async (req, res) => {
  logger.info('Starting media upload.')
  console.log(req.file);
  
  try {
    
    if(!req.file){

      logger.error('NO file found. Please add a file and try again.')
      return res.status(400).json({
        success: true,
        message: 'No file found . Please add a file and try again'
      })
    }

    const {originalname,mimetype,buffer} = req.file;
    const userId = req.user.userId;

    logger.info(`File details : name=${originalname}, type=${mimetype}`);


    logger.info(`Uploading to cloudinary is starting!`);

    const cloudinaryUploadResult = await uploadMediaToCloudinary(req.file);
    logger.info(`Cloudinary upload succcessfully. Public Id: ${cloudinaryUploadResult.public_id}`);
    

    const newlyCreateMedia = new Media({

      publicId: cloudinaryUploadResult.public_id,
      originalName : originalname,
      mimeType : mimetype,
      url: cloudinaryUploadResult.secure_url,
      userId,
    });

    await newlyCreateMedia.save();

    res.status(201).json({
      success: true,
      mediaIds: newlyCreateMedia._id,
      url: newlyCreateMedia.url,
      message: "Media uploaded successfully!"
    })
  } catch (error) {
    logger.error("Error creating Media-post.");
    res.status(500).json({
      success: false,
      message: "Error creating Meda-post.",
    });
  }
} // now go to the routes-> media-routes.js file and work on that

// you come form the cloudinary.js file for testing purpus create the getallMedia controller

const getallMedia = async (req, res) => {
  try {
    const result = await Media.find({});
    res.json({result});
  } catch (error) {
    logger.error("Error fetching media", error)
    res.status(500).json({
      success: false,
      message: "Error creating Meda-post.",
    });
  }
} // Now go to the media-routes.js file and create a route to get the all media 

module.exports = {uploadMedia, getallMedia}
//  you just come from the media.js file now work on it 


const cloudinary = require('cloudinary').v2;
const logger = require('./logger');

cloudinary.config({
  cloud_name : process.env.cloud_name ,
  api_key : process.env.api_key ,
  api_secret :process.env.api_secret ,
})

const uploadMediaToCloudinary = (file)=>{

  return new Promise((resolve, reject)=>{
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto"
      },
      (error, result)=>{
        if(error){
          logger.error('Error while uploading media to cloudinary', error)
          reject(error)
        }else{
          resolve(result)
        }
      }
    );

    uploadStream.end(file.buffer);
  });
} // now go to the media-controller.js file and and create the condition for uploadMedia

const deleteMediaFromCloudinary = async(publicId)=>{
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info("Media deleted successfully from cloud storage", publicId)
    return result;
  } catch (error) {
    logger.error("Error deleting media from the cloudinary!", error)
  }
}// after this go to the media-controller.js file and create the condition for get the all media 

module.exports = {uploadMediaToCloudinary ,deleteMediaFromCloudinary}; 

// Now go to the controller folder and work on media-controller.js file;
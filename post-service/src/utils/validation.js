 
const Joi = require('joi');  

// Define a function to validate registration data
const validateCreatePost = (data) => {
  // Create a validation schema using Joi
  const schema = Joi.object({
    content: Joi.string().min(3).max(5000).required(),  
    mediaIds: Joi.array(),
  
  });

  // Validate the incoming data against the schema
  return schema.validate(data);
};
 
 

// Export the validation function to use it in other files
module.exports = { validateCreatePost};

// after exporting validataionRegistration go to the post-controller.js file and use it

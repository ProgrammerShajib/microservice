//  you just come from the identity-controller now create the validataionRegistration
const Joi = require("joi"); // Joi is a powerful schema description and data validation library for JavaScript

// Define a function to validate registration data
const validataionRegistration = (data) => {
  // Create a validation schema using Joi
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(), // username must be a string between 3 to 50 characters
    email: Joi.string().email().required(), // email must be in valid format and is required
    password: Joi.string().min(6).required(), // password must be at least 6 characters long and is required
  });

  // Validate the incoming data against the schema
  return schema.validate(data);
};
// Define a function to validate login data
const validateLogin = (data) => {
  // Create a validation schema using Joi
  const schema = Joi.object({
    email: Joi.string().email().required(), // email must be in valid format and is required
    password: Joi.string().min(6).required(), // password must be at least 6 characters long and is required
  });

  // Validate the incoming data against the schema
  return schema.validate(data);
};
//  after exporting validateLogin go to the identity-controller.js

// Export the validation function to use it in other files
module.exports = { validataionRegistration, validateLogin };

// after exporting validataionRegistration go to the identity-controller.js file and use it

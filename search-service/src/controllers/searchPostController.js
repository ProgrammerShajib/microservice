
const Search = require('../models/Search')
const logger = require('../utils/logger')


const searchPostController = async(req, res)=>{

  logger.info('Search endpoint hit...')

  try {
    const {query} = req.query;
    const result = await Search.find(
      {
        $text: {$search: query},
      },
      {
        score: {$meta: 'textScore'},
      }
    ).sort({score: {$meta: 'textScore'}}).limit(10)

    res.json(result)
    
  } catch (error) {
    logger.error("Error searching Post.", error);
    res.status(500).json({
      success: false,
      message: "Error searching post.",
    });
  }
} // now go to the routes and work on search-routes.js 


module.exports  = {searchPostController};
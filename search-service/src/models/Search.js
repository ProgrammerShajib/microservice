
//  you just come from media-event-handler.js file now work on searchpostSchema

const mongoose =  require('mongoose')

const searchPostSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
   
  },
  createdAt: {
    type: String,
    required: true,
 
  },
},{timestamps: true})


searchPostSchema.index({content: 'text'})
searchPostSchema.index({createdAt: -1})

const Search = mongoose.model('Search', searchPostSchema)
module.exports = Search;
// now create the .env file after that go to the media-service and copy the rabbitmq.js file and paste it in the utils
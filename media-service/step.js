
/**
in post service => server.js file first i am connecting to messge Q await connectToRabbitMQ();

=> then in the post controoler when i am deleting the post i am publishing the event  with this code 
here 'post.deleted' = routing key or event key and also passing the other staff like postId , userId, mediaIds
  await publishEvent('post.deleted', {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    }) 

=> all of this consume by media-service = server.js 
 await consumeEvent('post.deleted',handlePostDeleted) 

 when i am consuming 'post.deleted' event am calling the handlePostDeleted methode 

 => and in this methode const handlePostDeleted = async (event)=>{
  console.log(event, 'This is the testing handle event.')
} 

this event is consume the all of things we are passing in the post-service = post-controller.js file   await publishEvent('post.deleted', {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    })
Now we can do what we want to do with the post and document that we uploaded
    */ 
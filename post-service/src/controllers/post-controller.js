// now you just come from Post.js file
const { cache } = require("joi");
const Post = require("../models/Post");
const logger = require("../utils/logger");
const { validateCreatePost } = require("../utils/validation");
const { publishEvent } = require("../utils/rabbitmq");

async function invalidatePostCache(req, input) {
  const cachedKey = `post:${input}`;
  await req.redisClient.del(cachedKey);

  const keys = await req.redisClient.keys("posts:*");
  if (keys.length > 0) {
    await req.redisClient.del(keys);
  }
}

// first create the create post and export it

const createPost = async (req, res) => {
  logger.info("Create post endpoint hit...");
  try {
    // validate the schema

    const { error } = validateCreatePost(req.body); // now you successfully import the validataionRegistration and use it
    if (error) {
      logger.warn("Validation error", error.details[0].message);
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    // now validate the user post

    const { content, mediaIds } = req.body;

    const newlyCreatedPost = new Post({
      user: req.user.userId,
      content,
      mediaIds: mediaIds || [],
    });
    await newlyCreatedPost.save();

    //  you just come form the search-service => server.js file now call the publish event here for search
    await publishEvent("post.created", {
      postId: newlyCreatedPost._id.toString(),
      userId: newlyCreatedPost.user.toString(),
      content: newlyCreatedPost.content,
      createdAt: newlyCreatedPost.createdAt,
    }) //  now go to the search-service=> server.js file and consume this event

    // now call the invalidatePostCache here and work on get single Post or getPost
    await invalidatePostCache(req, newlyCreatedPost._id.toString());
    logger.info("Post created successfully!", newlyCreatedPost);
    res.status(201).json({
      success: true,
      message: "Post created successfully!",
    });
  } catch (error) {
    logger.error("Error creating Post.", error);
    res.status(500).json({
      success: false,
      message: "Error creating post.",
    });
  }
}; // after exporting createPost go to the rotues and create post-routes.js file

const getAllPost = async (req, res) => {
  logger.info("GetAll post endpoint hit...");
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient.get(cacheKey);
    if (cachedPosts) {
      return res.json(JSON.parse(cachedPosts));
    }

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const totalNoOfPosts = await Post.countDocuments();
    const result = {
      posts,
      currentpage: page,
      totalPages: Math.ceil(totalNoOfPosts / limit),
      totalPosts: totalNoOfPosts,
    };

    // save your posts in redis cache
    await req.redisClient.setex(cacheKey, 300, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    logger.error("Error Getting  all Post.", error);
    res.status(500).json({
      success: false,
      message: "Error Getting all post.",
    });
  }
}; // now test it in the postman and comehere and create another function called invalidatePostCache in the above

const getPost = async (req, res) => {
  logger.info("Get single post endpoint hit...");
  try {
    const postId = req.params.id;
    const cacheKey = `post:${postId}`;
    const cachedPost = await req.redisClient.get(cacheKey);

    if (cachedPost) {
      return res.json(JSON.parse(cachedPost));
    }

    const singlePostDetailsbyId = await Post.findById(postId);

    if (!singlePostDetailsbyId) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    await req.redisClient.setex(
      cacheKey,
      3600,
      JSON.stringify(singlePostDetailsbyId)
    );
    res.json(singlePostDetailsbyId);
  } catch (error) {
    logger.error("Error fething post by ID.", error);
    res.status(500).json({
      success: false,
      message: "Error fething post by ID.",
    });
  }
};
const deletePost = async (req, res) => {
  logger.info("Delte single post endpoint hit...");
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // now here call the publishEvent
    await publishEvent('post.deleted', {
      postId: post._id.toString(),
      userId: req.user.userId,
      mediaIds: post.mediaIds,
    }) // now copy the rabbitmq.js file and paste it in the media-service => utils also copy the RABBITMQ_URL from the .env and paste it in the media-service .env




    //  simple  delete from redis cache
    await invalidatePostCache(req, req.params.id);

    //  An advanced delete of caching
    // const keys = await req.redisClient.keys("posts:*:*");

    // for (const key of keys) {
    //   const value = await req.redisClient.get(key);

    //   if (value) {
    //     const parsed = JSON.parse(value);
    //     const postExists = parsed.posts?.some((p) => p._id === postId);

    //     if (postExists) {
    //       await req.redisClient.del(key);
    //     }
    //   }
    // }

    res.json({
      success: true,
      message: "Post deleted and cache cleaned!",
    });
  } catch (error) {
    logger.error("Error deleting post by ID.", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post by ID.",
    });
  }
}; // Now you just finished the post-controller . let's go to the media-service and install the packages that we need to work. 

module.exports = { createPost, getAllPost, getPost, deletePost };

// 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/uploadOnCloudinary.js";
import { Post } from "../models/post.model.js";

const createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  // Prevent empty post
  if (!content?.trim() && (!req.files || req.files.length === 0)) {
    throw new ApiError(400, "Post must contain text or media");
  }

  const media = [];

  if (req.files?.length) {
    for (const file of req.files) {
      const uploaded = await uploadOnCloudinary(file.path, "auto");

      if (!uploaded) {
        throw new ApiError(500, "Media upload failed");
      }

      media.push({
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        type: uploaded.resource_type,
      });
    }
  }

  const post = await Post.create({
    owner: req.user._id,
    content,
    media,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, post, "Post created successfully"));
});

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("owner", "username fullName")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "Posts fetched successfully"));
});

const likePost = asyncHandler(async (req, res) => {

    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const alreadyLiked = post.likes.includes(userId);
    const alreadyDisliked = post.dislikes.includes(userId);

    // Remove dislike if present
    if (alreadyDisliked) {
        post.dislikes.pull(userId);
    }

    if (alreadyLiked) {
        // Unlike
        post.likes.pull(userId);
    } else {
        // Like
        post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Like updated successfully")
    );
});

const dislikePost = asyncHandler(async (req, res) => {

    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const alreadyLiked = post.likes.includes(userId);
    const alreadyDisliked = post.dislikes.includes(userId);

    // Remove like if present
    if (alreadyLiked) {
        post.likes.pull(userId);
    }

    if (alreadyDisliked) {
        // Remove dislike
        post.dislikes.pull(userId);
    } else {
        // Add dislike
        post.dislikes.push(userId);
    }

    await post.save();

    return res.status(200).json(
        new ApiResponse(200, post, "Dislike updated successfully")
    );
});

export { createPost, getAllPosts ,likePost,dislikePost};

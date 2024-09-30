import { HttpStatusCode } from "axios";
import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId } from "../../util/index.js";
import Post from "../models/post.model.js";
import SurveyOption from "../models/surveyOption.model.js";
import User from "../models/user.model.js";
import {
  getPostDetail,
  getPostsIdByFilter,
  handleReplyForParentPost,
} from "../services/post.js";
import { uploadFile } from "../utils/index.js";

//create post
export const createPost = async (req, res) => {
  try {
    const payload = req.body;
    const action = req.query.action;
    const { authorId, content, media, parentPost, survey, quote, type } =
      payload;
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "User not found" });
    }
    if (
      !content.trim() &&
      !media?.[0]?.url &&
      survey.length === 0 &&
      !parentPost &&
      !quote?._id
    ) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "Cannot create post without payload" });
    }
    const maxLength = 500;
    if (content.length > maxLength) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: `Text must be less than ${maxLength} characters` });
    }
    let newMedia = [];
    if (media.length) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      for (let fileInfo of media) {
        const isUrl = fileInfo.url.match(urlRegex)
          ? fileInfo.url.match(urlRegex)?.length > 0
          : false;
        if (!isUrl) {
          const mediaUrl = await uploadFile({
            base64: fileInfo.url,
          });
          fileInfo.url = mediaUrl;
        }
        newMedia.push(fileInfo);
      }
    }
    let newSurvey = [];
    if (survey.length) {
      newSurvey = survey.map((option) => {
        const newOption = new SurveyOption({
          ...option,
          _id: ObjectId(),
          usersId: [],
        });
        return newOption;
      });
      for (let option of newSurvey) {
        await option.save();
      }
    }
    const optionsId = newSurvey.map((option) => option?._id);
    const newPostPayload = {
      authorId,
      content,
      media: newMedia,
      survey: optionsId,
      quote,
      type: type,
    };
    if (action === "repost") {
      newPostPayload.parentPost = parentPost;
    }
    const newPost = new Post(newPostPayload);
    await newPost.save();
    if (parentPost && action === "reply") {
      await handleReplyForParentPost({
        parentId: parentPost,
        replyId: newPost._id,
        addNew: true,
      });
    }
    res
      .status(HTTPStatus.CREATED)
      .json({ message: "Post created successfully!", newPost });
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

//get post
export const getPost = async (req, res) => {
  try {
    const postId = ObjectId(req.params.id);
    const post = await getPostDetail({ postId, getFullInfo: true });
    if (!post) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ error: "Post not found!" });
    }
    res.status(HTTPStatus.OK).json(post);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};
//delete Post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.query.userId;
    if (!postId | !userId) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "Post not found" });
    }
    if (post.authorId.toString() !== userId.toString()) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized to delete post" });
    }

    await Post.findByIdAndDelete(postId);

    res.status(HTTPStatus.OK).json({ message: "Post deleted successfully!" });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};
//updatePost
export const updatePost = async (req, res) => {
  const payload = req.body;
  const postId = payload._id;
  const { media, content, survey } = payload;
  // if(!req.user){
  //   return res.status(HTTPStatus.UNAUTHORIZED).json({error: "Unauthorized"})
  // }
  try {
    let post = await Post.findById(postId);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json("Post not found");
    }

    if (post.authorId.toString() !== payload.userId.toString()) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized to update this post" });
    }

    post.content = content;
    post.media = media;
    post.survey = survey;
    post = await post.save();
    res.status(HTTPStatus.OK).json(post);
  } catch (error) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: error.message });
  }
};

//like and unlike post
export const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      //unlike post
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      res.status(HTTPStatus.OK).json({ message: "Post unliked successfully" });
    } else {
      //like post
      post.likes.push(userId);
      await post.save();
      res.status(HTTPStatus.OK).json({ message: "Post liked successfully!" });
    }
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};

//reply post

export const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePicture = req.user.profilePicture;
    const username = req.user.username;

    if (!text) {
      return res
        .status(HTTPStatus.BAD_REQUEST)
        .json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "Post not found" });
    }

    const reply = { userId, text, userProfilePicture, username };
    post.replies.push(reply);
    await post.save();

    res.status(HTTPStatus.OK).json({ message: "Reply add successfully", post });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};

//get feed post
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }
    const following = user.following;

    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });

    res.status(HTTPStatus.OK).json({ feedPosts });
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

//Temp
export const getPosts = async (req, res) => {
  try {
    const payload = req.query;
    const data = await getPostsIdByFilter(payload);
    let result = [];
    if (data?.length) {
      for (let id of data) {
        const postDetail = await getPostDetail({ postId: id });
        result.push(postDetail);
      }
    }
    res.status(HTTPStatus.OK).json(result);
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const payload = req.query;
    const userId = payload?.userId;
    if (!userId) {
      return res.status(HTTPStatus.BAD_REQUEST).json("No userId");
    }
    const userInfo = await User.findOne({ _id: ObjectId(userId) });
    if (!userInfo) {
      return res.status(HTTPStatus.FORBIDDEN).json("Invalid user");
    }
    let result = [];
    const postsId = await getPostsIdByFilter(payload);
    for (let id of postsId) {
      const postDetail = await getPostDetail({ postId: id });
      result.push(postDetail);
    }
    res.status(HTTPStatus.OK).json(result);
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

export const tickPostSurvey = async (req, res) => {
  try {
    const { optionId, userId, isAdd } = req.body;
    if (!optionId || !userId) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
    }
    if (isAdd) {
      await SurveyOption.updateOne(
        { _id: ObjectId(optionId) },
        {
          $push: { usersId: userId },
        }
      );
    } else {
      await SurveyOption.updateOne(
        { _id: ObjectId(optionId) },
        {
          $pull: { usersId: userId },
        }
      );
    }
    res.status(HTTPStatus.OK).json("OK");
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

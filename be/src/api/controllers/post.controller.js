import { HttpStatusCode } from "axios";
import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId } from "../../util/index.js";
import Post from "../models/post.model.js";
import SurveyOption from "../models/surveyOption.model.js";
import User from "../models/user.model.js";
import { getPostDetail } from "../services/post.js";
import { uploadFile } from "../utils/index.js";

//create post
const createPost = async (req, res) => {
  try {
    const payload = req.body;
    const { authorId, content, media, parentPost, survey } = payload;
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "User not found" });
    }
    if (
      !content.trim() &&
      !media?.[0]?.url &&
      survey.length === 0 &&
      !parentPost
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
    const newPost = new Post({
      authorId,
      content,
      media: newMedia,
      parentPost,
      survey: optionsId,
    });
    await newPost.save();
    res
      .status(HTTPStatus.CREATED)
      .json({ message: "Post created successfully!", newPost });
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

//get post
const getPost = async (req, res) => {
  try {
    const postId = ObjectId(req.params.id);
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ error: "Post not found!" });
    }
    res.status(HTTPStatus.OK).json({ post });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};
//delete Post
const deletePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(HTTPStatus.NOT_FOUND).json({ error: "Post not found" });
    }
    console.log("authorId:", post.authorId);
    console.log("userId:", userId);
    if (post.authorId.toString() !== userId.toString()) {
      return res
        .status(HTTPStatus.UNAUTHORIZED)
        .json({ error: "Unauthorized to delete post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(HTTPStatus.OK).json({ message: "Post deleted successfully!" });
  } catch (err) {
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
    console.log(err);
  }
};
//updatePost
const updatePost = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  console.log(req.user)
  if(!req.user){
    return res.status(HTTPStatus.UNAUTHORIZED).json({error: "Unauthorized"})
  }
  try {
    let post = await Post.findById(postId);
    if(!post) {
      return res.status(HTTPStatus.NOT_FOUND).json("Post not found")
    }

    if(post.authorId.toString() !== req.user._id.toString()){
      return res.status(HTTPStatus.UNAUTHORIZED).json({error: "Unauthorized to update this post"})
    }

    post.content = content || post.content 
    post = await post.save();
  } catch (error) {
    res.status(HTTPStatus.SERVER_ERR).json({error: error.message})
  }
};

//like and unlike post
const likeUnlikePost = async (req, res) => {
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

const replyToPost = async (req, res) => {
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
const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(HTTPStatus.NOT_FOUND)
        .json({ message: "User not found!" });
    }
    const following = user.followings;

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
const getPosts = async (req, res) => {
  try {
    const data = await Post.find();
    let result = [];
    for (let post of data) {
      const postDetail = await getPostDetail(post._id);
      result.push(postDetail);
    }
    res.status(HTTPStatus.OK).json(result);
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json({ error: err.message });
  }
};

const tickPostSurvey = async (req, res) => {
  try {
    const { optionId, userId, isAdd } = req.body;
    if (!optionId || !userId) {
      res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
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

export {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  getPosts,
  updatePost,
  likeUnlikePost,
  replyToPost,
  tickPostSurvey,
};

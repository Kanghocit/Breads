import express from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  likeUnlikePost,
  replyToPost,
  getPosts,
  tickPostSurvey,
  updatePost,
  getUserPosts,
} from "../controllers/post.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/get-all", getPosts);
router.get("/get-user-posts", getUserPosts);
router.get("/:id", getPost);
router.post("/create", createPost);
router.delete("/:id", deletePost);
router.put("/update", updatePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost);
router.put("/tick-post-survey", tickPostSurvey);

export default router;

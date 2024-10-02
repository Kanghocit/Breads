import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  getUserPosts,
  likeUnlikePost,
  tickPostSurvey,
  updatePost,
} from "../controllers/post.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/all", getPosts);
router.get("/user-posts", getUserPosts);
router.get("/:id", getPost);
router.post("/create", createPost);
router.delete("/:id", deletePost);
router.put("/update", updatePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.put("/tick-post-survey", tickPostSurvey);

export default router;

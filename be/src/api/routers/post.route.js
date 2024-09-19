import express from "express";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  likeUnlikePost,
  replyToPost,
  getPosts,
} from "../controllers/post.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/get-all", getPosts);
router.get("/:id", getPost);
router.post("/create", createPost);
router.delete("/:id", protectRoute, deletePost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/reply/:id", protectRoute, replyToPost);

export default router;

import express from "express";
import { POST_PATH } from "../../../../share/APIConfig.js";
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
import { crawlPosts } from "../crawl.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
const { GET_ALL, USER, CREATE, UPDATE, sLIKE, TICK_SURVEY, CRAWL_POST } =
  POST_PATH;

router.get(GET_ALL, getPosts);
router.get(USER, getUserPosts);
router.get("/:id", getPost);
router.post(CREATE, createPost);
router.delete("/:id", deletePost);
router.put(UPDATE, updatePost);
router.post(LIKE + ":id", protectRoute, likeUnlikePost);
router.put(TICK_SURVEY, tickPostSurvey);
router.post(CRAWL_POST, crawlPosts);

export default router;

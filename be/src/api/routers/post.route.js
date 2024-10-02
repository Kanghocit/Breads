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
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();
const { GET_ALL, USER, CREATE, UPDATE, LIKE, TICK_SURVEY } = POST_PATH;

router.get(GET_ALL, getPosts);
router.get(USER, getUserPosts);
router.get("/:id", getPost);
router.post(CREATE, createPost);
router.delete("/:id", deletePost);
router.put(UPDATE, updatePost);
router.post(LIKE + ":id", protectRoute, likeUnlikePost);
router.put(TICK_SURVEY, tickPostSurvey);

export default router;

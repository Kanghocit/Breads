import express from "express";
import {
  changePassword,
  followUser,
  getAdminAccount,
  getUserProfile,
  getUserToFollows,
  handleCrawlFakeUsers,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
} from "../controllers/user.controller.js";
// import protectRoute from "../middlewares/protectRoute.js";
import { USER_PATH } from "../../Breads-Shared/APIConfig.js";

const router = express.Router();
const {
  ADMIN,
  PROFILE,
  USERS_FOLLOW,
  SIGN_UP,
  LOGIN,
  LOGOUT,
  FOLLOW,
  UPDATE,
  CHANGE_PW,
  CRAWL_USER,
} = USER_PATH;

router.get(ADMIN, getAdminAccount);
router.get(PROFILE + ":userId", getUserProfile);
router.get(USERS_FOLLOW, getUserToFollows);
router.post(SIGN_UP, signupUser);
router.post(LOGIN, loginUser);
router.post(LOGOUT, logoutUser);
router.put(FOLLOW, followUser);
router.put(UPDATE + ":id", updateUser);
router.put(CHANGE_PW + ":id", changePassword);
router.post(CRAWL_USER, handleCrawlFakeUsers);

export default router;

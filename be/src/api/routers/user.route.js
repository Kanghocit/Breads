import express from "express";
import {
  followUnFollowUser,
  getAdminAccount,
  getUserProfile,
  loginUser,
  logoutUser,
  signupUser,
  updateUser,
  changePassword,
  getUserToFollows,
  handleCrawlFakeUsers,
} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/admin", getAdminAccount);
router.get("/profile/:userId", getUserProfile);
router.get("/users-follow", getUserToFollows);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", updateUser);
router.put("/change-pw/:id", changePassword);
router.post("/crawl-user", handleCrawlFakeUsers);

export default router;

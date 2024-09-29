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
} from "../controllers/user.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/get-admin", getAdminAccount);
router.get("/profile/:userId", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/update/:id", updateUser);
router.put("/change-pw/:id", changePassword);

export default router;

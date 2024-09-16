import express from "express";
import {
  addPostToCollection,
  getUserCollection,
  initUserCollection,
  removePostFromCollection,
} from "../controllers/collection.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:userId", protectRoute, getUserCollection);
router.post("/create", protectRoute, initUserCollection);
router.patch("/add/:userId", protectRoute, addPostToCollection);
router.patch("/remove/:userId", protectRoute, removePostFromCollection);

export default router;

import express from "express";
import {
  addPostToCollection,
  getUserCollection,
  removePostFromCollection,
} from "../controllers/collection.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/:userId", getUserCollection);
router.patch("/add", addPostToCollection);
router.patch("/remove", removePostFromCollection);

export default router;

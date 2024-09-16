import express from "express";
import postRouter from "./post.route.js";
import userRouter from "./user.route.js";
import collectionRouter from "./collection.route.js";
import { Route } from "../../../../share/APIConfig.js";

const router = express.Router();

router.use(Route.USER, userRouter);
router.use(Route.POST, postRouter);
router.use(Route.COLLECTION, collectionRouter);

export default router;

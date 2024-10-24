import express from "express";
import { Route } from "../../Breads-Shared/APIConfig.js";
import collectionRouter from "./collection.route.js";
import postRouter from "./post.route.js";
import userRouter from "./user.route.js";
import utilRouter from "./util.route.js";

const router = express.Router();

router.use(Route.USER, userRouter);
router.use(Route.POST, postRouter);
router.use(Route.COLLECTION, collectionRouter);
router.use(Route.UTIL, utilRouter);

export default router;

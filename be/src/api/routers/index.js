import express from "express";
import postRouter from "./post.route.js";
import userRouter from "./user.route.js";
import messageRouter from "./message.route.js";
import collectionRouter from "./collection.route.js";
import utilRouter from "./util.route.js";
import { Route } from "../../Breads-Shared/APIConfig.js";

const router = express.Router();

router.use(Route.USER, userRouter);
router.use(Route.POST, postRouter);
router.use(Route.COLLECTION, collectionRouter);
router.use("/util", utilRouter);
router.use(Route.MESSAGE, messageRouter);

export default router;

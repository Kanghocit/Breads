import express from "express";
import postRouter from "./post.route.js";
import userRouter from "./user.route.js";

const router = express.Router();

router.use("/users", userRouter);
router.use("/posts", postRouter);

export default router;

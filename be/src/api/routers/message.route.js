import express, { Router } from "express";
import protectRoute from "../middlewares/protectRoute";
import { deleteMessage, getMessage, sendMessage } from "../../socket/controllers/message.controller";

const router = express.Router();

router.post("/", protectRoute, sendMessage)
router.get("/:otherUserId", protectRoute, getMessage)
router.delete("/:id",deleteMessage);


export default Router;

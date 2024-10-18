import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import MessageController from "../../socket/controllers/message.controller.js";

const router = express.Router();

router.post("/", protectRoute, MessageController.sendMessage);

router.get("/:otherUserId", protectRoute, MessageController.getMessage);

router.delete(
  "/:messageId",
  protectRoute,
  MessageController.deleteMessage
);

router.get("/", protectRoute, MessageController.getConversations);

export default router;

import express from "express";
import { MESSAGE_PATH } from "../../Breads-Shared/APIConfig.js";
import {
  getConversationById,
  getConversationByUsersId,
} from "../controllers/message.controller.js";

const router = express.Router();
const { GET_CONVERSATION_BY_USERS_ID, GET_CONVERSATION_BY_ID } = MESSAGE_PATH;

router.post(GET_CONVERSATION_BY_USERS_ID, getConversationByUsersId);
router.get(GET_CONVERSATION_BY_ID, getConversationById);

export default router;

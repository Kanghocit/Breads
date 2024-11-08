import MessageController from "../controllers/message.controller.js";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig.js";

const MessageListener = (socket, io) => {
  socket.on(Route.MESSAGE + MESSAGE_PATH.CREATE, (payload, cb) => {
    MessageController.sendMessage(payload, cb, socket, io);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.GET_CONVERSATIONS, (payload, cb) => {
    MessageController.getConversations(payload, cb);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.GET_MESSAGES, (payload, cb) => {
    MessageController.getMessages(payload, cb);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.GET_MSGS_BY_SEARCH, (payload, cb) => {
    MessageController.getMsgsToSearchMsg(payload, cb);
  });
};

export default MessageListener;

import MessageController from "../controllers/message.controller.js";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig.js";

const MessageListener = (socket, io) => {
  socket.on(Route.MESSAGE + MESSAGE_PATH.CREATE, (payload) => {
    MessageController.sendMessage(payload, socket, io);
  });
};

export default MessageListener;

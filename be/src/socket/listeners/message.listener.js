import MessageController from "../controllers/message.controller.js";
import { MESSAGE_PATH, Route } from "../../Breads-Shared/APIConfig.js";

const MessageListener = (socket, io) => {
  socket.on(Route.MESSAGE + MESSAGE_PATH.CREATE, (payload, cb) => {
    MessageController.sendMessage(payload, cb, io);
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
  socket.on(Route.MESSAGE + MESSAGE_PATH.REACT, (payload, cb) => {
    MessageController.reactMsg(payload, cb, io);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.CONFIG_CONVERSATION, (payload, cb) => {
    MessageController.changeSettingConversation(payload, cb, io);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.RETRIEVE, (payload, cb) => {
    MessageController.retrieveMsg(payload, cb, io);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.SEEN_MSGS, (payload, cb) => {
    MessageController.updateLastSeen(payload, cb, io);
  });
  socket.on(Route.MESSAGE + MESSAGE_PATH.SEND_NEXT, (payload, cb) => {
    MessageController.sendNext(payload, cb, io);
  });
};

export default MessageListener;

import { sendMessage } from "../controllers/message.controller.js";

const MessageListener = (socket, io) => {
  socket.on("", (payload) => {
    sendMessage(payload, socket, io);
  });
};

export default MessageListener;

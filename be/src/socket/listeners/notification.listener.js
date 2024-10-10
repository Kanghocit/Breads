import { NOTIFICATION_PATH } from "../../Breads-Shared/APIConfig.js";
import NotificationController from "../controllers/notification.controller.js";

const NotificationListener = (socket, io) => {
  socket.on(NOTIFICATION_PATH.CREATE, (payload) => {
    NotificationController.create(socket, io, payload);
  });
};

export default NotificationListener;

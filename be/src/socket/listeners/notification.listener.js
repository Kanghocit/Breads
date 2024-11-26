import { NOTIFICATION_PATH, Route } from "../../Breads-Shared/APIConfig.js";
import NotificationController from "../controllers/notification.controller.js";

const NotificationListener = (socket, io) => {
  socket.on(Route.NOTIFICATION + NOTIFICATION_PATH.CREATE, (payload) => {
    NotificationController.create(payload, socket, io);
  });
  
};

export default NotificationListener;

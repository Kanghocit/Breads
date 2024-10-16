import { getCollection } from "../../util/index.js";
import Notification from "../../api/models/notification.model.js";

export default class NotificationController {
  static create = async (payload, socket, io) => {
    const { fromUser, toUser, action, target } = payload;
    const newNotification = new Notification({
      fromUser: fromUser,
      toUser: toUser,
      action: action,
      target: target,
    });
  };
}

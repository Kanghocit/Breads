import Notification from "../../api/models/notification.model.js";
import User from "../../api/models/user.model.js";
import { NOTIFICATION_PATH, Route } from "../../Breads-Shared/APIConfig.js";
import { Constants } from "../../Breads-Shared/Constants/index.js";
import { ObjectId } from "../../util/index.js";
import { getUserSocketByUserId } from "../services/user.js";

const { FOLLOW } = Constants.NOTIFICATION_ACTION;
const handleFollow = async (fromUser, toUsers) => {
  try {
    const userToFollow = await User.findOne({ _id: ObjectId(fromUser) });
    if (!userToFollow) {
      console.log("User not found");
      return;
    }
    const isAlreadyFollowing = userToFollow.following.includes(
      ObjectId(toUsers)
    );
    if (isAlreadyFollowing) {
      const existingNotification = await Notification.findOne({
        fromUser: ObjectId(fromUser),
        "toUsers.0": toUsers,
      });
      if (existingNotification) {
        await Notification.deleteOne({ _id: existingNotification._id });
        console.log("Existing follow notification deleted.");
      }
      return;
    }
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export default class NotificationController {
  static create = async (payload, socket, io) => {
    const { fromUser, toUsers, action, target } = payload;
    const sendTo = toUsers?.filter((userId) => userId !== fromUser);
    if (!sendTo?.length) {
      return;
    }
    switch (action) {
      case FOLLOW:
        await handleFollow(fromUser, toUsers);
        break;
      default:
        break;
    }
    let notificationInfo = {
      fromUser: fromUser,
      toUsers: sendTo,
      action,
    };
    if (target) {
      notificationInfo.target = target;
    }
    notificationInfo = new Notification(notificationInfo);
    const newNotification = await notificationInfo.save();
    const targetUserSocketId = await getUserSocketByUserId(toUsers, io);
    if (targetUserSocketId) {
      io.to(targetUserSocketId).emit(
        Route.NOTIFICATION + NOTIFICATION_PATH.GET_NEW,
        newNotification
      );
    }

    await User.updateOne({ _id: ObjectId(toUsers) }, { hasNewNotify: true });
  };
}

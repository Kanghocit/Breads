import HTTPStatus from "../../util/httpStatus.js";
import { ObjectId } from "../../util/index.js";
import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const { userId, page, limit } = req.body;
    if (!userId) {
      return res.status(HTTPStatus.BAD_REQUEST).json("Empty userId");
    }
    const skip = (page - 1) * limit;
    const data = await Notification.find({
      toUsers: ObjectId(userId),
    })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);
    res.status(HTTPStatus.OK).json(data);
  } catch (err) {
    console.log("getNotifications: ", err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

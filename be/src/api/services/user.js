import { ObjectId } from "../../util.js";
import User from "../models/user.model.js";

export const getUserInfo = async (userId) => {
  try {
    if (!userId) {
      return null;
    }
    const user = await User.findOne(
      {
        _id: ObjectId(userId),
      },
      {
        _id: 1,
        email: 1,
        name: 1,
        username: 1,
        bio: 1,
        avatar: 1,
      }
    );
    return user;
  } catch (err) {
    console.log(err);
  }
};

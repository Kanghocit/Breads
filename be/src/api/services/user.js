import { ObjectId } from "../../util/index.js";
import Collection from "../models/collection.model.js";
import User from "../models/user.model.js";

export const getUserInfo = async (userId) => {
  try {
    if (!userId) {
      return null;
    }
    let user = await User.findOne(
      {
        _id: ObjectId(userId),
      },
      {
        password: 0,
        updatedAt: 0,
      }
    );
    const userCollection = await Collection.findOne(
      { userId: ObjectId(userId) },
      { postsId: 1 }
    );
    const cloneUser = JSON.parse(JSON.stringify(user));
    cloneUser.collection = userCollection?.postsId ?? [];
    return cloneUser;
  } catch (err) {
    console.log(err);
  }
};

export const updateFollow = async (userId, userFlId, isAdd, isFollowing) => {
  try {
    let updateSyntax;
    const updateField = isFollowing
      ? { following: userFlId }
      : { followed: userFlId };
    if (isAdd) {
      updateSyntax = {
        $push: updateField,
      };
    } else {
      updateSyntax = {
        $pull: updateField,
      };
    }
    await User.updateOne(
      {
        _id: ObjectId(userId),
      },
      updateSyntax
    );
  } catch (err) {
    console.log(err);
  }
};

export const getUsersByPage = async ({ page, limit, matchQuery }) => {
  try {
    const skip = (page - 1) * limit;
    const data = await User.find(matchQuery, {
      _id: 1,
      avatar: 1,
      username: 1,
      name: 1,
      bio: 1,
      followed: 1,
    })
      .skip(skip)
      .limit(limit);
    return data;
  } catch (err) {
    console.log("getUsersByPage: ", err);
    return [];
  }
};

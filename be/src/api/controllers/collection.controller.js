import { ObjectId } from "../../util/index.js";
import HTTPStatus from "../../util/httpStatus.js";
import Collection from "../models/collection.model.js";

export const getUserCollection = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Collection.findOne({ userId: ObjectId(userId) });
    return data;
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

export const addPostToCollection = async (req, res) => {
  try {
    const { userId, postId } = req.body;
    if (!userId || !postId) {
      res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
    }
    const isValidCollection = await Collection.findOne({
      userId: ObjectId(userId),
    });
    if (isValidCollection) {
      await Collection.findOneAndUpdate(
        {
          userId: ObjectId(userId),
        },
        {
          $push: { postsId: postId },
        }
      );
      res.status(HTTPStatus.OK).json("Success");
    } else {
      const newCollection = new Collection({
        userId: ObjectId(userId),
        postsId: [postId],
      });
      await newCollection.save();
      res.status(HTTPStatus.CREATED).json("Created");
    }
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};

export const removePostFromCollection = async (req, res) => {
  try {
    const { postId, userId } = req.body;
    if (!userId || !postId) {
      res.status(HTTPStatus.BAD_REQUEST).json("Empty payload");
    }
    await Collection.findOneAndUpdate(
      {
        userId: ObjectId(userId),
      },
      {
        $pull: { postsId: postId },
      }
    );
    res.status(HTTPStatus.OK).json("Success");
  } catch (err) {
    console.log(err);
    res.status(HTTPStatus.SERVER_ERR).json(err);
  }
};
